import CSV from 'csv-string';

exports.command = 'fulcrum query',
exports.desc = 'run a query in the local database',
exports.builder = {
  sql: {
    type: 'string',
    desc: 'sql query',
    required: true
  },
  format: {
    type: 'string',
    desc: 'format (csv, json)',
    default: 'csv'
  }
},
exports.handler = async () => {
  let headers = false;
  const isJSON = fulcrum.args.format === 'json';
  const isCSV = fulcrum.args.format === 'csv';

  if (isJSON) {
    process.stdout.write('[');
  }

  let lastJSONObject = null;

  await fulcrum.db.each(fulcrum.args.sql, {}, ({columns, values, index}) => {
    if (!headers && isCSV && columns.length) {
      headers = true;
      process.stdout.write(CSV.stringify(columns.map(c => c.name)));
    }

    if (values) {
      if (isJSON) {
        if (lastJSONObject) {
          process.stdout.write(JSON.stringify(lastJSONObject) + ',');
        }

        lastJSONObject = values;
      } else {
        process.stdout.write(CSV.stringify(values));
      }
    }
  });

  if (isJSON) {
    if (lastJSONObject) {
      process.stdout.write(JSON.stringify(lastJSONObject));
    }

    process.stdout.write(']');
  }
}