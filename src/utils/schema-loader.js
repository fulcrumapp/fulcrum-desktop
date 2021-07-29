import { FormSchema } from 'fulcrum-query-sql';
import pgformat from 'pg-format';

export default class SchemaLoader {
  static async loadFormSchema(form) {
    const cols = await this.loadColumns(form);

    return new FormSchema(form, cols.rawFormColumns, cols.rawRepeatableColumns, {fullSchema: true});
  }

  static async loadColumns(form) {
    const tableNames = [
      `form_${form.rowID}_view`
    ];

    const repeatables = form.elementsOfType('Repeatable');

    for (const repeatable of repeatables) {
      tableNames.push(`form_${form.rowID}_${repeatable.key}_view`);
    }

    const sql = pgformat(`
SELECT
  tables.field AS table_field,
  columns.name,
  columns.ordinal,
  columns.field,
  columns.type,
  columns.part
FROM columns
INNER JOIN tables ON columns.table_name = tables.name
WHERE
  columns.table_name IN (%L)
ORDER BY columns.table_name, columns.ordinal
    `, tableNames);

    const rows = await form.db.all(sql);

    const rawFormColumns = [];
    const rawRepeatableColumns = {};

    for (const row of rows) {
      if (row.table_field) {
        if (!rawRepeatableColumns[row.table_field]) {
          rawRepeatableColumns[row.table_field] = [];
        }

        rawRepeatableColumns[row.table_field].push(row);
      } else {
        rawFormColumns.push(row);
      }
    }

    return {rawFormColumns, rawRepeatableColumns};
  }
}
