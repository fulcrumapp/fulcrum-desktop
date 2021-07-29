import Client from '../../api/client';
import Form from '../../models/form';
import Schema from 'fulcrum-schema/dist/schema';
import Metadata from 'fulcrum-schema/dist/metadata';
import V2 from 'fulcrum-schema/dist/schemas/postgres-query-v2';
import sqldiff from 'sqldiff';
import DownloadResource from './download-resource';

const {SchemaDiffer, Sqlite} = sqldiff;

export default class DownloadForms extends DownloadResource {
  get resourceName() {
    return 'forms';
  }

  get typeName() {
    return 'form';
  }

  fetchObjects(lastSync, sequence) {
    return Client.getForms(this.account);
  }

  fetchLocalObjects() {
    return this.account.findForms();
  }

  findOrCreate(database, attributes) {
    return Form.findOrCreate(database, {resource_id: attributes.id, account_id: this.account.rowID});
  }

  async process(object, attributes) {
    const isChanged = !object.isPersisted || attributes.version !== object.version;

    let oldForm = null;

    if (object.isPersisted) {
      oldForm = {
        id: object._id,
        row_id: object.rowID,
        name: object._name,
        elements: object._elementsJSON
      };
    }

    object.updateFromAPIAttributes(attributes);
    object._deletedAt = null;

    await this.db.transaction(async (db) => {
      await object.save({db});

      const newForm = {
        id: object.id,
        row_id: object.rowID,
        name: object._name,
        elements: object._elementsJSON
      };

      const statements = await this.updateFormTables(db, oldForm, newForm);

      if (isChanged) {
        await this.triggerEvent('save', {form: object, account: this.account, statements, oldForm, newForm});
      }
    });
  }

  async updateFormTables(db, oldForm, newForm) {
    let oldSchema = null;
    let newSchema = null;

    if (oldForm) {
      oldSchema = new Schema(oldForm, V2, null);
    }

    if (newForm) {
      newSchema = new Schema(newForm, V2, null);
    }

    const tablePrefix = 'account_' + this.account.rowID + '_';

    const differ = new SchemaDiffer(oldSchema, newSchema);

    const meta = new Metadata(differ, {tablePrefix, quote: '`', includeColumns: true});

    const generator = new Sqlite(differ, {afterTransform: meta.build.bind(meta)});

    generator.tablePrefix = tablePrefix;

    const statements = generator.generate();

    for (const statement of statements) {
      await db.execute(statement);
    }

    return statements;
  }
}
