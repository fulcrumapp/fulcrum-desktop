import pg from 'pg';
import { format } from 'util';
import PostgresSchema from './schema';
import { PostgresRecordValues, Postgres } from '../../api';
import { snakeCase } from 'snake-case';
import templateDrop from './template.drop.sql';
import SchemaMap from './schema-map';
import * as api from '../../api';
import { compact, difference, padStart } from 'lodash';

import version001 from './version-001.sql';
import version002 from './version-002.sql';
import version003 from './version-003.sql';
import version004 from './version-004.sql';
import version005 from './version-005.sql';
import version006 from './version-006.sql';
import version007 from './version-007.sql';

const MAX_IDENTIFIER_LENGTH = 63;


let log, warn, error, tableNames, viewNames, pgdb, pool, viewSchema, dataSchema, disableArrays, useAccountPrefix, useUniqueViews, disableComplexTypes, pgCustomModule, recordValueOptions, migrations, account, persistentTableNames;

const POSTGRES_CONFIG = {
  database: 'fulcrumapp',
  host: 'localhost',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
};

const MIGRATIONS = {
  '002': version002,
  '003': version003,
  '004': version004,
  '005': version005,
  '006': version006,
  '007': version007
};

const CURRENT_VERSION = 7;

const DEFAULT_SCHEMA = 'public';

function trimIdentifier(identifier) {
  return identifier.substring(0, MAX_IDENTIFIER_LENGTH);
}

function escapeIdentifier (identifier) {
  return identifier && pgdb.ident(trimIdentifier(identifier));
}

function useSyncEvents() {
  return fulcrum.args.pgSyncEvents != null ? fulcrum.args.pgSyncEvents : true;
}

async function activate() {
  const logger = fulcrum.logger.withContext('postgres');

  log = logger.log;
  warn = logger.warn;
  error = logger.error;

  account = await fulcrum.fetchAccount(fulcrum.args.org);

  const options = {
    ...POSTGRES_CONFIG,
    host: fulcrum.args.pgHost || POSTGRES_CONFIG.host,
    port: fulcrum.args.pgPort || POSTGRES_CONFIG.port,
    database: fulcrum.args.pgDatabase || POSTGRES_CONFIG.database,
    user: fulcrum.args.pgUser || POSTGRES_CONFIG.user,
    password: fulcrum.args.pgPassword || POSTGRES_CONFIG.user
  };

  if (fulcrum.args.pgUser) {
    options.user = fulcrum.args.pgUser;
  }

  if (fulcrum.args.pgPassword) {
    options.password = fulcrum.args.pgPassword;
  }

  if (fulcrum.args.pgCustomModule) {
    const pgCustomModule = require(fulcrum.args.pgCustomModule);
    pgCustomModule.api = api;
    pgCustomModule.app = fulcrum;
  }

  if (fulcrum.args.pgArrays === false) {
    const disableArrays = true;
  }

  if (fulcrum.args.pgSimpleTypes === true) {
    const disableComplexTypes = true;
  }

  // if (fulcrum.args.pgPersistentTableNames === true) {
    // this.persistentTableNames = true;
  // }

  useAccountPrefix = (fulcrum.args.pgPrefix !== false);
  useUniqueViews = (fulcrum.args.pgUniqueViews !== false);

  pool = new pg.Pool(options);

  if (useSyncEvents) {
    fulcrum.on('sync:start', onSyncStart);
    fulcrum.on('sync:finish', onSyncFinish);
    fulcrum.on('photo:save', onPhotoSave);
    fulcrum.on('video:save', onVideoSave);
    fulcrum.on('audio:save', onAudioSave);
    fulcrum.on('signature:save', onSignatureSave);
    fulcrum.on('changeset:save', onChangesetSave);
    fulcrum.on('record:save', onRecordSave);
    fulcrum.on('record:delete', onRecordDelete);

    fulcrum.on('choice-list:save', onChoiceListSave);
    fulcrum.on('choice-list:delete', onChoiceListSave);

    fulcrum.on('form:save', onFormSave);
    fulcrum.on('form:delete', onFormSave);

    fulcrum.on('classification-set:save', onClassificationSetSave);
    fulcrum.on('classification-set:delete', onClassificationSetSave);

    fulcrum.on('role:save', onRoleSave);
    fulcrum.on('role:delete', onRoleSave);

    fulcrum.on('project:save', onProjectSave);
    fulcrum.on('project:delete', onProjectSave);

    fulcrum.on('membership:save', onMembershipSave);
    fulcrum.on('membership:delete', onMembershipSave);
  }

  viewSchema = fulcrum.args.pgSchemaViews || DEFAULT_SCHEMA;
  dataSchema = fulcrum.args.pgSchema || DEFAULT_SCHEMA;

  // Fetch all the existing tables on startup. This allows us to special case the
  // creation of new tables even when the form isn't version 1. If the table doesn't
  // exist, we can pretend the form is version 1 so it creates all new tables instead
  // of applying a schema diff.
  const rows = await run(`SELECT table_name AS name FROM information_schema.tables WHERE table_schema='${ dataSchema }'`);

  tableNames = rows.map(o => o.name);

  // make a client so we can use it to build SQL statements
  pgdb = new Postgres({});

  setupOptions();

  await maybeInitialize();
}

async function deactivate() {
  if (pool) {
    await pool.end();
  }
}

function run (sql) {
  sql = sql.replace(/\0/g, '');

  if (fulcrum.args.debug) {
    log(sql);
  }
  return new Promise((resolve, reject) => {
    pool.query(sql, [], (err, res) => {
      if (err) {
        return reject(err);
      }

      return resolve(res.rows);
    });
  });
}

log = (...args) => {
  // console.log(...args);
}

const tableName = (account, name) => {
  if (useAccountPrefix) {
    return 'account_' + account.rowID + '_' + name;
  }

  return name;
}

const onSyncStart = async ({account, tasks}) => {
  await invokeBeforeFunction();
}

const onSyncFinish = async ({account}) => {
  await cleanupFriendlyViews(account);
  await invokeAfterFunction();
}

const onFormSave = async ({form, account, oldForm, newForm}) => {
  await updateForm(form, account, oldForm, newForm);
}

const onFormDelete = async ({form, account}) => {
  const oldForm = {
    id: form._id,
    row_id: form.rowID,
    name: form._name,
    elements: form._elementsJSON
  };

  await updateForm(form, account, oldForm, null);
}

const onRecordSave = async ({record, account}) => {
  await updateRecord(record, account);
}

const onRecordDelete = async ({record}) => {
  const statements = PostgresRecordValues.deleteForRecordStatements(pgdb, record, record.form, recordValueOptions);

  await run(statements.map(o => o.sql).join('\n'));
}

const onPhotoSave = async ({photo, account}) => {
  await updatePhoto(photo, account);
}

const onVideoSave = async ({video, account}) => {
  await updateVideo(video, account);
}

const onAudioSave = async ({audio, account}) => {
  await updateAudio(audio, account);
}

const onSignatureSave = async ({signature, account}) => {
  await updateSignature(signature, account);
}

const onChangesetSave = async ({changeset, account}) => {
  await updateChangeset(changeset, account);
}

const onChoiceListSave = async ({choiceList, account}) => {
  await updateChoiceList(choiceList, account);
}

const onClassificationSetSave = async ({classificationSet, account}) => {
  await updateClassificationSet(classificationSet, account);
}

const onProjectSave = async ({project, account}) => {
  await updateProject(project, account);
}

const onRoleSave = async ({role, account}) => {
  await updateRole(role, account);
}

const onMembershipSave = async ({membership, account}) => {
  await updateMembership(membership, account);
}

async function updatePhoto(object, account) {
  const values = SchemaMap.photo(object);

  values.file = formatPhotoURL(values.access_key);

  await updateObject(values, 'photos');
}

async function updateVideo(object, account) {
  const values = SchemaMap.video(object);

  values.file = formatVideoURL(values.access_key);

  await updateObject(values, 'videos');
}

async function updateAudio(object, account) {
  const values = SchemaMap.audio(object);

  values.file = formatAudioURL(values.access_key);

  await updateObject(values, 'audio');
}

async function updateSignature(object, account) {
  const values = SchemaMap.signature(object);

  values.file = formatSignatureURL(values.access_key);

  await updateObject(values, 'signatures');
}

async function updateChangeset(object, account) {
  await updateObject(SchemaMap.changeset(object), 'changesets');
}

async function updateProject(object, account) {
  await updateObject(SchemaMap.project(object), 'projects');
}

async function updateMembership(object, account) {
  await updateObject(SchemaMap.membership(object), 'memberships');
}

async function updateRole(object, account) {
  await updateObject(SchemaMap.role(object), 'roles');
}

async function updateFormObject(object, account) {
  await updateObject(SchemaMap.form(object), 'forms');
}

async function updateChoiceList(object, account) {
  await updateObject(SchemaMap.choiceList(object), 'choice_lists');
}

async function updateClassificationSet(object, account) {
  await updateObject(SchemaMap.classificationSet(object), 'classification_sets');
}


async function updateObject(values, table) {
  const deleteStatement = pgdb.deleteStatement(`${ dataSchema }.system_${table}`, {row_resource_id: values.row_resource_id});
  const insertStatement = pgdb.insertStatement(`${ dataSchema }.system_${table}`, values, {pk: 'id'});

  const sql = [ deleteStatement.sql, insertStatement.sql ].join('\n');

  try {
    await run(sql);
  } catch (ex) {
    integrityWarning(ex);
    throw ex;
  }
}

const reloadTableList = async () => {
  const rows = await run(`SELECT table_name AS name FROM information_schema.tables WHERE table_schema='${ dataSchema }'`);

  tableNames = rows.map(o => o.name);
}

const reloadViewList = async () => {
  const rows = await run(`SELECT table_name AS name FROM information_schema.tables WHERE table_schema='${ viewSchema }'`);
  viewNames = rows.map(o => o.name);
}

const baseMediaURL = () => {
}

const formatPhotoURL = (id) => {
  return `${ baseMediaURL }/photos/${ id }.jpg`;
}

const formatVideoURL = (id) => {
  return `${ baseMediaURL }/videos/${ id }.mp4`;
}

const formatAudioURL = (id) => {
  return `${ baseMediaURL }/audio/${ id }.m4a`;
}

const formatSignatureURL = (id) => {
  return `${ baseMediaURL }/signatures/${ id }.png`;
}

function integrityWarning(ex) {
  warn(`
-------------
!! WARNING !!
-------------

PostgreSQL database integrity issue encountered. Common sources of postgres database issues are:

* Reinstalling Fulcrum Desktop and using an old postgres database without recreating
the postgres database.
* Deleting the internal application database and using an existing postgres database
* Manually modifying the postgres database
* Form name and repeatable data name combinations that exceeed the postgres limit of 63
characters. It's best to keep your form names within the limit. The "friendly view"
feature of the plugin derives the object names from the form and repeatable names.
* Creating multiple apps in Fulcrum with the same name. This is generally OK, except
you will not be able to use the "friendly view" feature of the postgres plugin since
the view names are derived from the form names.

Note: When reinstalling Fulcrum Desktop or "starting over" you need to drop and re-create
the postgres database. The names of database objects are tied directly to the database
objects in the internal application database.

---------------------------------------------------------------------
Report issues at https://github.com/fulcrumapp/fulcrum-desktop/issues
---------------------------------------------------------------------
Message:
${ ex.message }

Stack:
${ ex.stack }
---------------------------------------------------------------------
`.red
  );
}

function setupOptions() {
  baseMediaURL = fulcrum.args.pgMediaBaseUrl ? fulcrum.args.pgMediaBaseUrl : 'https://api.fulcrumapp.com/api/v2';

  recordValueOptions = {
    schema: dataSchema,

    disableArrays: disableArrays,

    escapeIdentifier: escapeIdentifier,

    // persistentTableNames: this.persistentTableNames,

    accountPrefix: useAccountPrefix ? 'account_' + account.rowID : null,

    calculatedFieldDateFormat: 'date',

    disableComplexTypes: disableComplexTypes,

    valuesTransformer: pgCustomModule && pgCustomModule.valuesTransformer,

    mediaURLFormatter: (mediaValue) => {

      return mediaValue.items.map((item) => {
        if (mediaValue.element.isPhotoElement) {
          return formatPhotoURL(item.mediaID);
        } else if (mediaValue.element.isVideoElement) {
          return formatVideoURL(item.mediaID);
        } else if (mediaValue.element.isAudioElement) {
          return formatAudioURL(item.mediaID);
        }

        return null;
      });
    },

    mediaViewURLFormatter: (mediaValue) => {
      const ids = mediaValue.items.map(o => o.mediaID);

      if (mediaValue.element.isPhotoElement) {
        return `${ baseMediaURL }/photos/view?photos=${ ids }`;
      } else if (mediaValue.element.isVideoElement) {
        return `${ baseMediaURL }/videos/view?videos=${ ids }`;
      } else if (mediaValue.element.isAudioElement) {
        return `${ baseMediaURL }/audio/view?audio=${ ids }`;
      }

      return null;
    }
  };

  if (fulcrum.args.pgReportBaseUrl) {
    recordValueOptions.reportURLFormatter = (feature) => {
      return `${ fulcrum.args.pgReportBaseUrl }/reports/${ feature.id }.pdf`;
    };
  }
}

const updateRecord = async (record, account, skipTableCheck) => {
  if (!skipTableCheck && !rootTableExists(record.form)) {
    await rebuildForm(record.form, account, () => {});
  }

  if (pgCustomModule && pgCustomModule.shouldUpdateRecord && !pgCustomModule.shouldUpdateRecord({record, account})) {
    return;
  }

  const statements = PostgresRecordValues.updateForRecordStatements(pgdb, record, recordValueOptions);

  await run(statements.map(o => o.sql).join('\n'));

  const systemValues = PostgresRecordValues.systemColumnValuesForFeature(record, null, record, {...recordValueOptions,
                                                                                                disableComplexTypes: false});

  await updateObject(SchemaMap.record(record, systemValues), 'records');
}

const rootTableExists = (form) => {
  return tableNames.indexOf(PostgresRecordValues.tableNameWithForm(form, null, recordValueOptions)) !== -1;
}

const recreateFormTables = async (form, account) => {
  try {
    await updateForm(form, account, formVersion(form), null);
  } catch (ex) {
    if (fulcrum.args.debug) {
      error(ex);
    }
  }

  await updateForm(form, account, null, formVersion(form));
}

const updateForm = async (form, account, oldForm, newForm) => {
  if (pgCustomModule && pgCustomModule.shouldUpdateForm && !pgCustomModule.shouldUpdateForm({form, account})) {
    return;
  }

  try {
    await updateFormObject(form, account);

    if (!rootTableExists(form) && newForm != null) {
      oldForm = null;
    }

    const options = {
      disableArrays: disableArrays,
      disableComplexTypes: disableComplexTypes,
      userModule: pgCustomModule,
      tableSchema: dataSchema,
      calculatedFieldDateFormat: 'date',
      metadata: true,
      useResourceID: false,
      accountPrefix: useAccountPrefix ? 'account_' + account.rowID : null
    };

    const {statements} = await PostgresSchema.generateSchemaStatements(account, oldForm, newForm, options);

    await dropFriendlyView(form, null);

    for (const repeatable of form.elementsOfType('Repeatable')) {
      await dropFriendlyView(form, repeatable);
    }

    await run(['BEGIN TRANSACTION;',
                    ...statements,
                    'COMMIT TRANSACTION;'].join('\n'));

    if (newForm) {
      await createFriendlyView(form, null);

      for (const repeatable of form.elementsOfType('Repeatable')) {
        await createFriendlyView(form, repeatable);
      }
    }
  } catch (ex) {
      integrityWarning(ex);
    throw ex;
  }
}

async function dropFriendlyView(form, repeatable) {
  const viewName = getFriendlyTableName(form, repeatable);

  try {
    await run(format('DROP VIEW IF EXISTS %s.%s CASCADE;', escapeIdentifier(viewSchema), escapeIdentifier(viewName)));
  } catch (ex) {
    integrityWarning(ex);
  }
}

async function createFriendlyView(form, repeatable) {
  const viewName = getFriendlyTableName(form, repeatable);

  try {
    await run(format('CREATE VIEW %s.%s AS SELECT * FROM %s;',
                          escapeIdentifier(viewSchema),
                          escapeIdentifier(viewName),
                          PostgresRecordValues.tableNameWithFormAndSchema(form, repeatable, recordValueOptions, '_view_full')));
  } catch (ex) {
    // sometimes it doesn't exist
    integrityWarning(ex);
  }
}

function getFriendlyTableName(form, repeatable) {
  let name = compact([form.name, repeatable && repeatable.dataName]).join(' - ')

  if (useUniqueViews) {
    const formID = persistentTableNames ? form.id : form.rowID;

    const prefix = compact(['view', formID, repeatable && repeatable.key]).join(' - ');

    name = [prefix, name].join(' - ');
  }

  return trimIdentifier(fulcrum.args.pgUnderscoreNames !== false ? snakeCase(name) : name);
}

async function invokeBeforeFunction() {
  if (fulcrum.args.pgBeforeFunction) {
    await run(format('SELECT %s();', fulcrum.args.pgBeforeFunction));
  }
  if (pgCustomModule && pgCustomModule.beforeSync) {
    await pgCustomModule.beforeSync();
  }
}

async function invokeAfterFunction() {
  if (fulcrum.args.pgAfterFunction) {
    await run(format('SELECT %s();', fulcrum.args.pgAfterFunction));
  }
  if (pgCustomModule && pgCustomModule.afterSync) {
    await pgCustomModule.afterSync();
  }
}

async function rebuildForm(form, account, progress) {
  await recreateFormTables(form, account);
  await reloadTableList();

  let index = 0;

  await form.findEachRecord({}, async (record) => {
    record.form = form;

    if (++index % 10 === 0) {
      progress(index);
    }

    await updateRecord(record, account, true);
  });

  progress(index);
}

async function cleanupFriendlyViews(account) {
  await reloadViewList();

  const activeViewNames = [];

  const forms = await account.findActiveForms({});

  for (const form of forms) {
    activeViewNames.push(getFriendlyTableName(form, null));

    for (const repeatable of form.elementsOfType('Repeatable')) {
      activeViewNames.push(getFriendlyTableName(form, repeatable));
    }
  }

  const remove = difference(viewNames, activeViewNames);

  for (const viewName of remove) {
    if (viewName.indexOf('view_') === 0 || viewName.indexOf('view - ') === 0) {
      try {
        await run(format('DROP VIEW IF EXISTS %s.%s;', escapeIdentifier(viewSchema), escapeIdentifier(viewName)));
      } catch (ex) {
        integrityWarning(ex);
      }
    }
  }
}

async function rebuildFriendlyViews(form, account) {
  await dropFriendlyView(form, null);

  for (const repeatable of form.elementsOfType('Repeatable')) {
    await dropFriendlyView(form, repeatable);
  }

  await createFriendlyView(form, null);

  for (const repeatable of form.elementsOfType('Repeatable')) {
    await createFriendlyView(form, repeatable);
  }
}

const formVersion = (form) => {
  if (form == null) {
    return null;
  }

  return {
    id: form._id,
    row_id: form.rowID,
    name: form._name,
    elements: form._elementsJSON
  };
}

const updateStatus = (message) => {
  if (process.stdout.isTTY) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(message);
  }
}

async function dropSystemTables() {
  await run(prepareMigrationScript(templateDrop));
}

async function setupDatabase() {
  await run(prepareMigrationScript(version001));
}

function prepareMigrationScript(sql) {
  return sql.replace(/__SCHEMA__/g, dataSchema)
            .replace(/__VIEW_SCHEMA__/g, viewSchema);
}

async function setupSystemTables(account) {
  const progress = (name, index) => {
    updateStatus(name.green + ' : ' + index.toString().red);
  };

  await account.findEachPhoto({}, async (photo, {index}) => {
    if (++index % 10 === 0) {
      progress('Photos', index);
    }

    await updatePhoto(photo, account);
  });

  await account.findEachVideo({}, async (video, {index}) => {
    if (++index % 10 === 0) {
      progress('Videos', index);
    }

    await updateVideo(video, account);
  });

  await account.findEachAudio({}, async (audio, {index}) => {
    if (++index % 10 === 0) {
      progress('Audio', index);
    }

    await updateAudio(audio, account);
  });

  await account.findEachSignature({}, async (signature, {index}) => {
    if (++index % 10 === 0) {
      progress('Signatures', index);
    }

    await updateSignature(signature, account);
  });

  await account.findEachChangeset({}, async (changeset, {index}) => {
    if (++index % 10 === 0) {
      progress('Changesets', index);
    }

    await updateChangeset(changeset, account);
  });

  await account.findEachRole({}, async (object, {index}) => {
    if (++index % 10 === 0) {
      progress('Roles', index);
    }

    await updateRole(object, account);
  });

  await account.findEachProject({}, async (object, {index}) => {
    if (++index % 10 === 0) {
      progress('Projects', index);
    }

    await updateProject(object, account);
  });

  await account.findEachForm({}, async (object, {index}) => {
    if (++index % 10 === 0) {
      progress('Forms', index);
    }

    await updateFormObject(object, account);
  });

  await account.findEachMembership({}, async (object, {index}) => {
    if (++index % 10 === 0) {
      progress('Memberships', index);
    }

    await updateMembership(object, account);
  });

  await account.findEachChoiceList({}, async (object, {index}) => {
    if (++index % 10 === 0) {
      progress('Choice Lists', index);
    }

    await updateChoiceList(object, account);
  });

  await account.findEachClassificationSet({}, async (object, {index}) => {
    if (++index % 10 === 0) {
      progress('Classification Sets', index);
    }

    await updateClassificationSet(object, account);
  });
}

async function maybeInitialize() {
  account = await fulcrum.fetchAccount(fulcrum.args.org);

  if (tableNames.indexOf('migrations') === -1) {
    log('Inititalizing database...');

    await setupDatabase();
  }

  await maybeRunMigrations(account);
}

async function maybeRunMigrations(account) {
  migrations = (await run(`SELECT name FROM ${ dataSchema }.migrations`)).map(o => o.name);

  let populateRecords = false;

  for (let count = 2; count <= CURRENT_VERSION; ++count) {
    const version = padStart(count, 3, '0');

    const needsMigration = migrations.indexOf(version) === -1 && MIGRATIONS[version];

    if (needsMigration) {
      await run(prepareMigrationScript(MIGRATIONS[version]));

      if (version === '002') {
        log('Populating system tables...');
        await setupSystemTables(account);
        populateRecords = true;
      }
      else if (version === '005') {
        log('Migrating date calculation fields...');
        await migrateCalculatedFieldsDateFormat(account);
      }
    }
  }

  if (populateRecords) {
    await populateRecords(account);
  }
}

async function populateRecords(account) {
  const forms = await account.findActiveForms({});

  let index = 0;

  for (const form of forms) {
    index = 0;

    await form.findEachRecord({}, async (record) => {
      record.form = form;

      if (++index % 10 === 0) {
        progress(form.name, index);
      }

      await updateRecord(record, account, false);
    });
  }
}

async function migrateCalculatedFieldsDateFormat(account) {
  const forms = await account.findActiveForms({});

  for (const form of forms) {
    const fields = form.elementsOfType('CalculatedField').filter(element => element.display.isDate);

    if (fields.length) {
      log('Migrating date calculation fields in form...', form.name);

      await rebuildForm(form, account, () => {});
    }
  }
}

const progress = (name, index) => {
  updateStatus(name.green + ' : ' + index.toString().red);
}

exports.command = 'postgres',
exports.desc = 'run the postgres sync for a specific organization',
exports.builder = {
  pgDatabase: {
    desc: 'postgresql database name',
    type: 'string',
    default: POSTGRES_CONFIG.database
  },
  pgHost: {
    desc: 'postgresql server host',
    type: 'string',
    default: POSTGRES_CONFIG.host
  },
  pgPort: {
    desc: 'postgresql server port',
    type: 'integer',
    default: POSTGRES_CONFIG.port
  },
  pgUser: {
    desc: 'postgresql user',
    type: 'string'
  },
  pgPassword: {
    desc: 'postgresql password',
    type: 'string'
  },
  pgSchema: {
    desc: 'postgresql schema',
    type: 'string'
  },
  pgSchemaViews: {
    desc: 'postgresql schema for the friendly views',
    type: 'string'
  },
  pgSyncEvents: {
    desc: 'add sync event hooks',
    type: 'boolean',
    default: true
  },
  pgBeforeFunction: {
    desc: 'call this function before the sync',
    type: 'string'
  },
  pgAfterFunction: {
    desc: 'call this function after the sync',
    type: 'string'
  },
  org: {
    desc: 'organization name',
    required: true,
    type: 'string'
  },
  pgForm: {
    desc: 'the form ID to rebuild',
    type: 'string'
  },
  pgReportBaseUrl: {
    desc: 'report URL base',
    type: 'string'
  },
  pgMediaBaseUrl: {
    desc: 'media URL base',
    type: 'string'
  },
  pgUnderscoreNames: {
    desc: 'use underscore names (e.g. "Park Inspections" becomes "park_inspections")',
    required: false,
    type: 'boolean',
    default: true
  },
  pgRebuildViewsOnly: {
    desc: 'only rebuild the views',
    required: false,
    type: 'boolean',
    default: false
  },
  pgCustomModule: {
    desc: 'a custom module to load with sync extensions',
    required: false,
    type: 'string'
  },
  pgSetup: {
    desc: 'setup the database',
    required: false,
    type: 'boolean'
  },
  pgDrop: {
    desc: 'drop the system tables',
    required: false,
    type: 'boolean',
    default: false
  },
  pgArrays: {
    desc: 'use array types for multi-value fields like choice fields, classification fields and media fields',
    required: false,
    type: 'boolean',
    default: true
  },
  // pgPersistentTableNames: {
  //   desc: 'use the server id in the form table names',
  //   required: false,
  //   type: 'boolean',
  //   default: false
  // },
  pgPrefix: {
    desc: 'use the organization as a prefix in the object names',
    required: false,
    type: 'boolean',
    default: true
  },
  pgUniqueViews: {
    desc: 'make sure the views are uniquely identifiable. Disabling this makes the views easier to use, but has limitations when forms are renamed. ONLY use this is you know you will not rename or swap out forms or drastically alter form schemas.',
    required: false,
    type: 'boolean',
    default: true
  },
  pgSimpleTypes: {
    desc: 'use simple types in the database that are more compatible with other applications (no tsvector, geometry, arrays)',
    required: false,
    type: 'boolean',
    default: false
  },
  pgSystemTablesOnly: {
    desc: 'only create the system records',
    required: false,
    type: 'boolean',
    default: false
  }
},
exports.handler = async () => {
  await activate();

  if (fulcrum.args.pgDrop) {
    await dropSystemTables();
    return;
  }

  if (fulcrum.args.pgSetup) {
    await setupDatabase();
    return;
  }

  account = await fulcrum.fetchAccount(fulcrum.args.org);

  if (account) {
    if (fulcrum.args.pgSystemTablesOnly) {
      await setupSystemTables(account);
      return;
    }

    await invokeBeforeFunction();

    const forms = await account.findActiveForms({});

    for (const form of forms) {
      if (fulcrum.args.pgForm && form.id !== fulcrum.args.pgForm) {
        continue;
      }

      if (fulcrum.args.pgRebuildViewsOnly) {
        await rebuildFriendlyViews(form, account);
      } else {
        await rebuildForm(form, account, (index) => {
          updateStatus(form.name.green + ' : ' + index.toString().red + ' records');
        });
      }

      log('');
    }

    await invokeAfterFunction();
  } else {
    error('Unable to find account', fulcrum.args.org);
  }
}
