import path from 'path';
import { SQLite } from '../../api';
import snake from 'snake-case';

let db;

const activate = async () => {
  const defaultDatabaseOptions = {
    wal: true,
    autoVacuum: true,
    synchronous: 'off'
  };

  fulcrum.mkdirp('geopackage');

  const databaseName = fulcrum.args.gpkgName || fulcrum.args.org;
  const databaseDirectory = fulcrum.args.gpkgPath || fulcrum.dir('geopackage');

  const options = {
    file: path.join(databaseDirectory, databaseName + '.gpkg')
  };

  db = await SQLite.open({...defaultDatabaseOptions, ...options});

  await enableSpatiaLite(db);

  // fulcrum.on('form:save', this.onFormSave);
  // fulcrum.on('records:finish', this.onRecordsFinished);
}

exports.activate = activate;

exports.deactivate = async () => {
  if (db) {
    await db.close();
  }
}

const run = (sql) => {
  sql = sql.replace(/\0/g, '');

  if (fulcrum.args.debug) {
    console.log(sql);
  }

  return db.execute(sql);
}

const onFormSave = async ({form, account, oldForm, newForm}) => {
  await updateForm(form, account);
}

const onRecordsFinished = async ({form, account}) => {
  await updateForm(form, account);
}

const updateRecord = async (record) => {
  await updateForm(record.form, account);
}

const updateForm = async (form, account) => {
  const rawPath = fulcrum.databaseFilePath;

  await run(`ATTACH DATABASE '${rawPath}' as 'app'`);

  await updateTable(getFriendlyTableName(form), `account_${account.rowID}_form_${form.rowID}_view_full`, null);

  for (const repeatable of form.elementsOfType('Repeatable')) {
    const tableName = getFriendlyTableName(form, repeatable);

    await updateTable(tableName, `account_${account.rowID}_form_${form.rowID}_${repeatable.key}_view_full`, repeatable);
  }

  await run(`DETACH DATABASE 'app'`);

  const drop = fulcrum.args.gpkgDrop != null ? fulcrum.args.gpkgDrop : true;

  if (drop) {
    await cleanupTables(form, account);
  }
}

const updateTable = async (tableName, sourceTableName, repeatable) => {
  const tempTableName = sourceTableName + '_tmp';

  const includeFormattedDates = fulcrum.args.includeFormattedDates != null ? fulcrum.args.includeFormattedDates : true;

  const includeUserInfo = fulcrum.args.gpkgUserInfo != null ? fulcrum.args.gpkgUserInfo : true;

  let drop = fulcrum.args.gpkgDrop != null ? fulcrum.args.gpkgDrop : true;

  const dropTemplate = `DROP TABLE IF EXISTS main.${db.ident(tempTableName)};`;

  await run(dropTemplate);

  const createTemplateTable = `CREATE TABLE ${db.ident(tempTableName)} AS SELECT * FROM app.${sourceTableName} WHERE 1=0;`;

  await run(createTemplateTable);

  const result = await db.get(`SELECT sql FROM sqlite_master WHERE tbl_name = "${tempTableName}"`);
  const {columns} = await db.execute(`SELECT * FROM app.${sourceTableName} WHERE 1=0;`);

  await run(dropTemplate);

  const create = result.sql.replace(tempTableName, db.ident(tableName))
                           .replace('(\n', ' (_id INTEGER PRIMARY KEY AUTOINCREMENT, ');

  const columnNames = columns.map(o => db.ident(o.name));

  let orderBy = 'ORDER BY _record_id';

  if (repeatable != null) {
    orderBy = 'ORDER BY _child_record_id';
  }

  const existingTable = await db.get(`SELECT sql FROM sqlite_master WHERE tbl_name = "${tableName}"`);

  let sql = [];

  if (drop || !existingTable) {
    let userInfo = '';

    sql.push(`DROP TABLE IF EXISTS main.${db.ident(tableName)};`);

    sql.push(create + ';');

    if (includeUserInfo) {
      sql.push(`ALTER TABLE ${db.ident(tableName)} ADD _created_by_email TEXT;`);
      sql.push(`ALTER TABLE ${db.ident(tableName)} ADD _updated_by_email TEXT;`);
    }
  }

  if (includeUserInfo) {
    sql.push(`
      INSERT INTO ${db.ident(tableName)} (${columnNames.join(', ')}, _created_by_email, _updated_by_email)
      SELECT ${columnNames.map(o => 't.' + o).join(', ')}, mc.email AS _created_by_email, mu.email AS _updated_by_email
      FROM app.${sourceTableName} t
      LEFT JOIN memberships mc ON t._created_by_id = mc.user_resource_id
      LEFT JOIN memberships mu ON t._updated_by_id = mu.user_resource_id
      ${orderBy};
    `);
  } else {
    sql.push(`
      INSERT INTO ${db.ident(tableName)} (${columnNames.join(', ')})
      SELECT ${columnNames.map(o => 't.' + o).join(', ')}
      FROM app.${sourceTableName} t
      ${orderBy};
    `);
  }

  if (includeFormattedDates) {
    sql.push(`
      UPDATE ${db.ident(tableName)} SET _created_at = strftime('%Y-%m-%d %H:%M:%S', _created_at / 1000, 'unixepoch');
      UPDATE ${db.ident(tableName)} SET _updated_at = strftime('%Y-%m-%d %H:%M:%S', _updated_at / 1000, 'unixepoch');
      UPDATE ${db.ident(tableName)} SET _server_created_at = strftime('%Y-%m-%d %H:%M:%S', _server_created_at / 1000, 'unixepoch');
      UPDATE ${db.ident(tableName)} SET _server_updated_at = strftime('%Y-%m-%d %H:%M:%S', _server_updated_at / 1000, 'unixepoch');
    `);
  }

  await run(sql.join('\n'));

  sql = [];

  const includeJoinedNames = fulcrum.args.gpkgJoinedNames != null ? fulcrum.args.gpkgJoinedNames : true;

  if (repeatable == null && includeJoinedNames) {
    if (drop || !existingTable) {
      sql.push(`ALTER TABLE ${db.ident(tableName)} ADD _assigned_to_email TEXT;`);
      sql.push(`ALTER TABLE ${db.ident(tableName)} ADD _project_name TEXT;`);
    }


    sql.push(`
      UPDATE ${db.ident(tableName)}
      SET _assigned_to_email = (SELECT email FROM app.memberships m WHERE m.user_resource_id = ${db.ident(tableName)}._assigned_to_id),
      _project_name = (SELECT name FROM app.projects p WHERE p.resource_id = ${db.ident(tableName)}._project_id);
    `);

    await run(sql.join('\n'));
  }

  if (drop || !existingTable) {
    const tableNameLiteral = db.literal(tableName);

    const geomSQL = `
      DELETE FROM gpkg_geometry_columns WHERE table_name=${tableNameLiteral};

      INSERT INTO gpkg_geometry_columns
      (table_name, column_name, geometry_type_name, srs_id, z, m)
      VALUES (${tableNameLiteral}, '_geom', 'POINT', 4326, 0, 0);

      ALTER TABLE ${db.ident(tableName)} ADD _geom BLOB;

      INSERT INTO gpkg_contents (table_name, data_type, identifier, srs_id)
      SELECT ${tableNameLiteral}, 'features', ${tableNameLiteral}, 4326
      WHERE NOT EXISTS (SELECT 1 FROM gpkg_contents WHERE table_name = ${tableNameLiteral});
    `;

    await run(geomSQL);
  }

  await run(`
    UPDATE ${db.ident(tableName)}
    SET _geom = gpkgMakePoint(_longitude, _latitude, 4326);
  `);
}

async function enableSpatiaLite(db) {
  await new Promise((resolve, reject) => {
    let spatialitePath = null;

    // the different platforms and configurations require various different load paths for the shared library
    if (process.env.MOD_SPATIALITE) {
      spatialitePath = process.env.MOD_SPATIALITE;
    } else if (process.env.DEVELOPMENT) {
      let platform = 'linux';

      if (process.platform === 'win32') {
        platform = 'win';
      } else if (process.platform === 'darwin') {
        platform = 'mac';
      }

      spatialitePath = path.join('.', 'resources', 'spatialite', platform, process.arch, 'mod_spatialite');
    } else if (process.platform === 'darwin') {
      spatialitePath = path.join(path.dirname(process.execPath), '..', 'Resources', 'mod_spatialite');
    } else if (process.platform === 'win32') {
      spatialitePath = 'mod_spatialite';
    } else {
      spatialitePath = path.join(path.dirname(process.execPath), 'mod_spatialite');
    }

    db.database.loadExtension(spatialitePath, (err) => err ? reject(err) : resolve());
  });

  const check = await db.all(`SELECT CheckGeoPackageMetaData() AS result`);

  if (check[0].result !== 1) {
    const rows = await db.all(`SELECT gpkgCreateBaseTables()`);
  }

  const mode = await db.all(`SELECT EnableGpkgMode() AS enabled, GetGpkgMode() AS mode`);

  if (mode[0].mode !== 1) {
    throw new Error('Unexpected error verifying the GPKG mode');
  }
}

async function runSQL(sql) {
  let result = null;

  try {
    result = await db.all(sql);
  } catch (ex) {
    result = {error: ex.message};
  }

  console.log(JSON.stringify(result));
}

async function cleanupTables(form, account) {
  await reloadTableList();

  const tableNames = [];

  const forms = await account.findActiveForms({});

  for (const form of forms) {
    tableNames.push(getFriendlyTableName(form));

    for (const repeatable of form.elementsOfType('Repeatable')) {
      const tableName = getFriendlyTableName(form, repeatable);

      tableNames.push(tableName);
    }
  }

  // find any tables that should be dropped because they got renamed
  for (const existingTableName of tableNames) {
    if (tableNames.indexOf(existingTableName) === -1 && !isSpecialTable(existingTableName)) {
      await run(`DROP TABLE IF EXISTS main.${db.ident(existingTableName)};`);
    }
  }
}

const isSpecialTable = (tableName) => {
  if (tableName.indexOf('gpkg_') === 0 ||
        tableName.indexOf('sqlite_') === 0 ||
        tableName.indexOf('custom_') === 0) {
    return true;
  }

  return false;
}

async function reloadTableList() {
  const rows = await db.all(`SELECT tbl_name AS name FROM sqlite_master WHERE type = 'table';`);

  const tableNames = rows.map(o => o.name);
}

const getFriendlyTableName = (form, repeatable) => {
  const name = repeatable ? `${form.name} - ${repeatable.dataName}` : form.name;

  return fulcrum.args.gpkgUnderscoreNames ? snakeCase(name) : name;
}

exports.command = 'geopackage',
exports.desc = 'create a geopackage database for an organization',
exports.builder = {
  org: {
    desc: 'organization name',
    required: true,
    type: 'string'
  },
  gpkgName: {
    desc: 'database name',
    required: false,
    type: 'string'
  },
  gpkgPath: {
    desc: 'database directory',
    required: false,
    type: 'string'
  },
  gpkgDrop: {
    desc: 'drop tables first',
    required: false,
    type: 'boolean',
    default: true
  },
  gpkgUnderscoreNames: {
    desc: 'use underscore names (e.g. "Park Inspections" becomes "park_inspections")',
    required: false,
    type: 'boolean',
    default: false
  },
  gpkgUserInfo: {
    desc: 'include user info',
    required: false,
    type: 'boolean',
    default: true
  },
  gpkgJoinedNames: {
    desc: 'include project name and assignment email on record tables',
    required: false,
    type: 'boolean',
    default: true
  },
  includeFormattedDates: {
    desc: 'format dates from unixepoch to YYYY-MM-DD HH:MM:SS',
    required: false,
    type: 'boolean',
    default: true
  }
},
exports.handler = async () => {

  await activate();

  if (fulcrum.args.sql) {
    await runSQL(fulcrum.args.sql);
    return;
  }

  const account = await fulcrum.fetchAccount(fulcrum.args.org);

  if (account) {
    const forms = await account.findActiveForms({});

    for (const form of forms) {
      await updateForm(form, account);
    }
  } else {
    console.error('Unable to find account', fulcrum.args.org);
  }

  await run('VACUUM');
}
