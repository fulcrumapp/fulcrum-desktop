import Schema from 'fulcrum-schema/dist/schema';
import Metadata from 'fulcrum-schema/dist/metadata';
import sqldiff from 'sqldiff';
import MSSchema from './mssql-schema';

const {SchemaDiffer, MSSQL} = sqldiff;

export default class MSSQLSchema {
  static async generateSchemaStatements(account, oldForm, newForm, {disableArrays, disableComplexTypes, userModule, tableSchema, calculatedFieldDateFormat, metadata, useResourceID, accountPrefix}) {
    let oldSchema = null;
    let newSchema = null;

    MSSchema.disableArrays = disableArrays;
    MSSchema.disableComplexTypes = disableComplexTypes;
    MSSchema.calculatedFieldDateFormat = calculatedFieldDateFormat;

    if (userModule && userModule.updateSchema && !MSSchema._modified) {
      userModule.updateSchema(MSSchema);

      MSSchema._modified = true;
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
      oldSchema = new Schema(oldForm, MSSchema, userModule && userModule.schemaOptions);
    }

    if (newForm) {
      newSchema = new Schema(newForm, MSSchema, userModule && userModule.schemaOptions);
    }

    const differ = new SchemaDiffer(oldSchema, newSchema);

    const meta = new Metadata(differ, {quote: '"', schema: tableSchema, prefix: 'system_', useAliases: false});
    const generator = new MSSQL(differ, {afterTransform: metadata && meta.build.bind(meta)});

    generator.tablePrefix = accountPrefix != null ? accountPrefix + '_' : '';

    if (tableSchema) {
      generator.tableSchema = tableSchema;
    }

    const statements = generator.generate();

    return {statements, oldSchema, newSchema};
  }
}
