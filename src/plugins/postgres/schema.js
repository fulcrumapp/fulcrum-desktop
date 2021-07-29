import Schema from 'fulcrum-schema/dist/schema';
import Metadata from 'fulcrum-schema/dist/metadata';
import sqldiff from 'sqldiff';
import PGSchema from './postgres-schema';

const {SchemaDiffer, Postgres} = sqldiff;

export default class PostgresSchema {
  static async generateSchemaStatements(account, oldForm, newForm, {disableArrays, disableComplexTypes, userModule, tableSchema, calculatedFieldDateFormat, metadata, useResourceID, accountPrefix}) {
    let oldSchema = null;
    let newSchema = null;

    PGSchema.disableArrays = disableArrays;
    PGSchema.disableComplexTypes = disableComplexTypes;
    PGSchema.calculatedFieldDateFormat = calculatedFieldDateFormat;

    if (userModule && userModule.updateSchema && !PGSchema._modified) {
      userModule.updateSchema(PGSchema);

      PGSchema._modified = true;
    }

    if (useResourceID) {
      if (oldForm) {
        oldForm = {...oldForm, row_id: oldForm.id};
      }
      if (newForm) {
        newForm = {...newForm, row_id: newForm.id};
      }
    }

    if (oldForm) {
      oldSchema = new Schema(oldForm, PGSchema, userModule && userModule.schemaOptions);
    }

    if (newForm) {
      newSchema = new Schema(newForm, PGSchema, userModule && userModule.schemaOptions);
    }

    const differ = new SchemaDiffer(oldSchema, newSchema);

    const meta = new Metadata(differ, {quote: '"', schema: tableSchema, prefix: 'system_', useAliases: false});
    const generator = new Postgres(differ, {afterTransform: metadata && meta.build.bind(meta)});

    generator.tablePrefix = accountPrefix != null ? accountPrefix + '_' : '';

    if (tableSchema) {
      generator.tableSchema = tableSchema;
    }

    const statements = generator.generate();

    return {statements, oldSchema, newSchema};
  }
}
