import sqldiff from 'sqldiff';
import Schema from 'fulcrum-schema/dist/schema';
import Metadata from 'fulcrum-schema/dist/metadata';
import FormSchemaV2 from 'fulcrum-schema/dist/schemas/v2';

import Client from '../../api/client';
import Form from '../../models/form';
import DownloadResource from './download-resource';

const { Postgres, SQLite, SchemaDiffer } = sqldiff;

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
      oldSchema = new Schema(oldForm, FormSchemaV2, null);
    }

    if (newForm) {
      newSchema = new Schema(newForm, FormSchemaV2, null);
    }

    const differ = new SchemaDiffer(oldSchema, newSchema);

    const tablePrefix = 'account_' + this.account.rowID + '_';

    const statements = this.generateSQL(differ, {
      tablePrefix,
      dialect: 'sqlite',
      version: 'v2',
      includeMetadata: true
    });

    for (const statement of statements) {
      await db.execute(statement);
    }

    return statements;
  }

  generateSQL(differ, { includeMetadata, dialect, tablePrefix, tableSchema }) {
    const Generator = {
      postgres: Postgres,
      sqlite: SQLite
    }[dialect];

    const quote = {
      postgres: '"',
      sqlite: '`'
    }[dialect];

    const meta = new Metadata(differ, { quote, schema: tableSchema, includeColumns: true });

    const generator = new Generator(differ, { afterTransform: includeMetadata ? meta.build.bind(meta) : null });

    generator.tableSchema = tableSchema || '';
    generator.tablePrefix = tablePrefix || '';

    return generator.generate();
  }
}
