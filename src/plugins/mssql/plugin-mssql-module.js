import mssql from 'mssql';
import { format } from 'util';
import MSSQLSchema from './schema';
import { MSSQL } from '../../api';
import MSSQLRecordValues from '../../api'
import snake from 'snake-case';
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

let log, warn, error, info, dataSchema, viewSchema, sql, pool, mssqlCustomModule, disableArrays, disableComplexTypes, useAccountPrefix, progress, account, tableNames, oldForm, migrations;

const MAX_IDENTIFIER_LENGTH = 100;

const MSSQL_CONFIG = {
  database: 'fulcrumapp',
  server: 'localhost',
  port: 1433,
  max: 10,
  idleTimeoutMillis: 30000,
  requestTimeout: 120000
};

const MIGRATIONS = {
  '002': version002,
  '003': version003,
  '004': version004,
  '005': version005,
  '006': version006
};

const CURRENT_VERSION = 6;

const DEFAULT_SCHEMA = 'dbo';

function trimIdentifier(identifier) {
    return identifier.substring(0, MAX_IDENTIFIER_LENGTH);
}

function escapeIdentifier (identifier) {
    return identifier && mssql.ident(trimIdentifier(identifier));
}

function useSyncEvents() {
    return fulcrum.args.mssqlSyncEvents != null ? fulcrum.args.mssqlSyncEvents : true;
}

exports.activate = async function activate() {
  const logger = fulcrum.logger.withContext('postgres');

  log = logger.log;
  warn = logger.warn;
  error = logger.error;

  account = await fulcrum.fetchAccount(fulcrum.args.org);

  const options = {
    ...MSSQL_CONFIG,
    server: fulcrum.args.mssqlHost || MSSQL_CONFIG.server,
    port: fulcrum.args.mssqlPort || MSSQL_CONFIG.port,
    database: fulcrum.args.mssqlDatabase || MSSQL_CONFIG.database,
    user: fulcrum.args.mssqlUser || MSSQL_CONFIG.user,
    password: fulcrum.args.mssqlPassword || MSSQL_CONFIG.user
  };

  if (fulcrum.args.mssqlUser) {
    options.user = fulcrum.args.mssqlUser;
  }

  if (fulcrum.args.mssqlPassword) {
    options.password = fulcrum.args.mssqlPassword;
  }

  if (fulcrum.args.mssqlCustomModule) {
    mssqlCustomModule = require(fulcrum.args.mssqlCustomModule);
    mssqlCustomModule.api = api;
    mssqlCustomModule.app = fulcrum;
  }

  disableArrays = false;
  disableComplexTypes = true;

  if (fulcrum.args.mssqlPersistentTableNames === true) {
    persistentTableNames = true;
  }

  useAccountPrefix = (fulcrum.args.mssqlPrefix !== false);

  pool = await mssql.connect(fulcrum.args.mssqlConnectionString || options);

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

  viewSchema = fulcrum.args.mssqlSchemaViews || DEFAULT_SCHEMA;
  dataSchema = fulcrum.args.mssqlSchema || DEFAULT_SCHEMA;

  // Fetch all the existing tables on startup. This allows us to special case the
  // creation of new tables even when the form isn't version 1. If the table doesn't
  // exist, we can pretend the form is version 1 so it creates all new tables instead
  // of applying a schema diff.
  const rows = await run(`SELECT table_name AS name FROM information_schema.tables WHERE table_schema='${ dataSchema }'`);

  tableNames = rows.map(o => o.name);

  // make a client so we can use it to build SQL statements
  mssql = new MSSQL({});

  setupOptions();

  await maybeInitialize();
}

exports.deactivate = async function deactivate() {
  if (pool) {
    await pool.close();
  }
}

const run = async (sql) => {
  sql = sql.replace(/\0/g, '');

  if (fulcrum.args.debug) {
    log(sql);
  }

  const result = await pool.request().batch(sql);

  return result.recordset;
}

const runAll = async (statements) => {
    const results = [];

    for (const sql of statements) {
        results.push(await run(sql));
    }

    return results;
}

const runAllTransaction = async (statements) => {
    const transaction = new mssql.Transaction(pool);

    await transaction.begin();

    const results = [];

    for (const sql of statements) {
      const request = new mssql.Request(transaction);

      if (fulcrum.args.debug) {
        log(sql);
      }

      const result = await request.batch(sql);

      results.push(result);
    }

    await transaction.commit();

    return results;
}

const log = (...args) => {
    // console.log(...args);
}

const tableName = (account, name) => {
    return 'account_' + account.rowID + '_' + name;

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
    const statements = MSSQLRecordValues.deleteForRecordStatements(mssql, record, record.form, recordValueOptions);

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
    const deleteStatement = mssql.deleteStatement(`${ dataSchema }.system_${table}`, {row_resource_id: values.row_resource_id});
    const insertStatement = mssql.insertStatement(`${ dataSchema }.system_${table}`, values, {pk: 'id'});

    const sql = [ deleteStatement.sql, insertStatement.sql ].join('\n');

    try {
      await run(sql);
    } catch (ex) {
      warn(`updateObject ${table} failed`);
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

MSSQL database integrity issue encountered. Common sources of database issues are:

* Reinstalling Fulcrum Desktop and using an old MSSQL database without recreating
  the MSSQL database.
* Deleting the internal application database and using an existing MSSQL database
* Manually modifying the MSSQL database
* Creating multiple apps in Fulcrum with the same name. This is generally OK, except
  you will not be able to use the "friendly view" feature of the MSSQL plugin since
  the view names are derived from the form names.

Note: When reinstalling Fulcrum Desktop or "starting over" you need to drop and re-create
the MSSQL database. The names of database objects are tied directly to the database
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
    baseMediaURL = fulcrum.args.mssqlMediaBaseUrl ? fulcrum.args.mssqlMediaBaseUrl : 'https://api.fulcrumapp.com/api/v2';

    recordValueOptions = {
      schema: dataSchema,

      escapeIdentifier: escapeIdentifier,

      disableArrays: disableArrays,

      persistentTableNames: persistentTableNames,

      accountPrefix: useAccountPrefix ? 'account_' + account.rowID : null,

      calculatedFieldDateFormat: 'date',

      disableComplexTypes: disableComplexTypes,

      valuesTransformer: mssqlCustomModule && mssqlCustomModule.valuesTransformer,

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

    if (fulcrum.args.mssqlReportBaseUrl) {
      recordValueOptions.reportURLFormatter = (feature) => {
        return `${ fulcrum.args.mssqlReportBaseUrl }/reports/${ feature.id }.pdf`;
      };
    }
}

const updateRecord = async (record, account, skipTableCheck) => {
    if (!skipTableCheck && !rootTableExists(record.form)) {
      await rebuildForm(record.form, account, () => {});
    }

    if (mssqlCustomModule && mssqlCustomModule.shouldUpdateRecord && !mssqlCustomModule.shouldUpdateRecord({record, account})) {
      return;
    }

    const statements = MSSQLRecordValues.updateForRecordStatements(mssql, record, recordValueOptions);

    await runSkippingFailures(
      `Skipping record ${record.id} in form ${record.form.id}.`,
      () => run(statements.map(o => o.sql).join('\n'))
    );

    const systemValues = MSSQLRecordValues.systemColumnValuesForFeature(record, null, record, recordValueOptions);

    await updateObject(SchemaMap.record(record, systemValues), 'records');
}

const rootTableExists = (form) => {
    return tableNames.indexOf(MSSQLRecordValues.tableNameWithForm(form, null, recordValueOptions)) !== -1;
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
    if (mssqlCustomModule && mssqlCustomModule.shouldUpdateForm && !mssqlCustomModule.shouldUpdateForm({form, account})) {
      return;
    }

    try {
      info('Updating form', form.id);

      await updateFormObject(form, account);

      if (!rootTableExists(form) && newForm != null) {
        oldForm = null;
      }

      const options = {
        disableArrays: disableArrays,
        disableComplexTypes: false,
        userModule: mssqlCustomModule,
        tableSchema: dataSchema,
        calculatedFieldDateFormat: 'date',
        metadata: true,
        useResourceID: persistentTableNames,
        accountPrefix: useAccountPrefix ? 'account_' + account.rowID : null
      };

      const {statements} = await MSSQLSchema.generateSchemaStatements(account, oldForm, newForm, options);

      info('Dropping views', form.id);

      await dropFriendlyView(form, null);

      for (const repeatable of form.elementsOfType('Repeatable')) {
        await dropFriendlyView(form, repeatable);
      }

      info('Running schema statements', form.id, statements.length);

      info('Schema statements', '\n', statements.join('\n'));

      await runSkippingFailures(
        `Skipping form ${form.id}.`,
        async () => {
          await runAllTransaction(statements);

          info('Creating views', form.id);
    
          if (newForm) {
            await createFriendlyView(form, null);
    
            for (const repeatable of form.elementsOfType('Repeatable')) {
              await createFriendlyView(form, repeatable);
            }
          }
    
          info('Completed form update', form.id);
        }
      );
    } catch (ex) {
      info('updateForm failed');
      integrityWarning(ex);
      throw ex;
    }
}

async function dropFriendlyView(form, repeatable) {
    const viewName = getFriendlyTableName(form, repeatable);

    try {
      await run(format("IF OBJECT_ID('%s.%s', 'V') IS NOT NULL DROP VIEW %s.%s;",
                            escapeIdentifier(viewSchema), escapeIdentifier(viewName),
                            escapeIdentifier(viewSchema), escapeIdentifier(viewName)));
    } catch (ex) {
      warn('dropFriendlyView failed');
      integrityWarning(ex);
    }
}

async function createFriendlyView(form, repeatable) {
    const viewName = getFriendlyTableName(form, repeatable);

    try {
      await run(format('CREATE VIEW %s.%s AS SELECT * FROM %s;',
                            escapeIdentifier(viewSchema),
                            escapeIdentifier(viewName),
                            MSSQLRecordValues.tableNameWithFormAndSchema(form, repeatable, recordValueOptions, '_view_full')));
    } catch (ex) {
      // sometimes it doesn't exist
      warn('createFriendlyView failed');
      integrityWarning(ex);
    }
}

function getFriendlyTableName(form, repeatable) {
    const name = compact([form.name, repeatable && repeatable.dataName]).join(' - ')

    const formID = persistentTableNames ? form.id : form.rowID;

    const prefix = compact(['view', formID, repeatable && repeatable.key]).join(' - ');

    const objectName = [prefix, name].join(' - ');

    return trimIdentifier(fulcrum.args.mssqlUnderscoreNames !== false ? snake(objectName) : objectName);
}

async function invokeBeforeFunction() {
    if (fulcrum.args.mssqlBeforeFunction) {
      await run(format('EXECUTE %s;', fulcrum.args.mssqlBeforeFunction));
    }
    if (mssqlCustomModule && mssqlCustomModule.beforeSync) {
      await mssqlCustomModule.beforeSync();
    }
}

async function invokeAfterFunction() {
    if (fulcrum.args.mssqlAfterFunction) {
      await run(format('EXECUTE %s;', fulcrum.args.mssqlAfterFunction));
    }
    if (mssqlCustomModule && mssqlCustomModule.afterSync) {
      await mssqlCustomModule.afterSync();
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
          await run(format("IF OBJECT_ID('%s.%s', 'V') IS NOT NULL DROP VIEW %s.%s;",
                                escapeIdentifier(viewSchema), escapeIdentifier(viewName),
                                escapeIdentifier(viewSchema), escapeIdentifier(viewName)));
        } catch (ex) {
          warn('cleanupFriendlyViews failed');
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
    await runAll(prepareMigrationScript(templateDrop));
}

function createDatabase(databaseName) {
    log('Creating database', databaseName);
    return run(`CREATE DATABASE ${databaseName};`);
}

function dropDatabase(databaseName) {
    log('Dropping database', databaseName);
    return run(`DROP DATABASE ${databaseName};`);
}

async function setupDatabase() {
    await runAll(prepareMigrationScript(version001));
}

function prepareMigrationScript(sql) {
    return sql.replace(/__SCHEMA__/g, dataSchema)
              .replace(/__VIEW_SCHEMA__/g, viewSchema).split(';');
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

function isAutomaticInitializationDisabled() {
    return fulcrum.args.mssqlCreateDatabase ||
      fulcrum.args.mssqlDropDatabase ||
      fulcrum.args.mssqlDrop ||
      fulcrum.args.mssqlSetup;
  }

async function maybeInitialize() {
    if (isAutomaticInitializationDisabled) {
      return;
    }

    const account = await fulcrum.fetchAccount(fulcrum.args.org);

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
        await runAll(prepareMigrationScript(MIGRATIONS[version]));

        if (version === '002') {
          log('Populating system tables...');
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

  progress = (name, index) => {
    updateStatus(name.green + ' : ' + index.toString().red);
}

const runSkippingFailures = async (context, block) => {
    if (!fulcrum.args.mssqlSkipFailures) {
      return block();
    }

    try {
      await block();
    } catch (ex) {
      if (ex.message.indexOf('maximum row size of 8060') !== -1) {
        log('Row too large.', context, ex.message);
      } else if (ex.message.indexOf('maximum of 1024 columns') !== -1) {
        log('Table too large.', context, ex.message);
      } else if (ex.message.indexOf('Invalid object name') !== -1) {
        log('Invalid object name.', context, ex.message);
      } else {
        throw ex;
      }
    }
}

exports.command = 'mssql',
exports.desc = 'run the mssql sync for a specific organization',
exports.builder = {
  mssqlConnectionString: {
      desc: 'mssql connection string (overrides all individual database connection parameters)',
      type: 'string'
  },
  mssqlDatabase: {
      desc: 'mssql database name',
      type: 'string',
      default: MSSQL_CONFIG.database
  },
  mssqlHost: {
      desc: 'mssql server host',
      type: 'string',
      default: MSSQL_CONFIG.host
  },
  mssqlPort: {
      desc: 'mssql server port',
      type: 'integer',
      default: MSSQL_CONFIG.port
  },
  mssqlUser: {
      desc: 'mssql user',
      type: 'string'
  },
  mssqlPassword: {
      desc: 'mssql password',
      type: 'string'
  },
  mssqlSchema: {
      desc: 'mssql schema',
      type: 'string'
  },
  mssqlSchemaViews: {
      desc: 'mssql schema for the friendly views',
      type: 'string'
  },
  mssqlSyncEvents: {
      desc: 'add sync event hooks',
      type: 'boolean',
      default: true
  },
  mssqlBeforeFunction: {
      desc: 'call this function before the sync',
      type: 'string'
  },
  mssqlAfterFunction: {
      desc: 'call this function after the sync',
      type: 'string'
  },
  org: {
      desc: 'organization name',
      required: true,
      type: 'string'
  },
  mssqlForm: {
      desc: 'the form ID to rebuild',
      type: 'string'
  },
  mssqlReportBaseUrl: {
      desc: 'report URL base',
      type: 'string'
  },
  mssqlMediaBaseUrl: {
      desc: 'media URL base',
      type: 'string'
  },
  mssqlUnderscoreNames: {
      desc: 'use underscore names (e.g. "Park Inspections" becomes "park_inspections")',
      required: false,
      type: 'boolean',
      default: true
  },
  mssqlPersistentTableNames: {
      desc: 'use the server id in the form table names',
      required: false,
      type: 'boolean',
      default: false
  },
  mssqlPrefix: {
      desc: 'use the organization ID as a prefix in the object names',
      required: false,
      type: 'boolean',
      default: true
  },
  mssqlRebuildViewsOnly: {
      desc: 'only rebuild the views',
      required: false,
      type: 'boolean',
      default: false
  },
  mssqlCustomModule: {
      desc: 'a custom module to load with sync extensions (experimental)',
      required: false,
      type: 'string'
  },
  mssqlSetup: {
      desc: 'setup the database',
      required: false,
      type: 'boolean'
  },
  mssqlDrop: {
      desc: 'drop the system tables',
      required: false,
      type: 'boolean',
      default: false
  },
  mssqlSystemTablesOnly: {
      desc: 'only create the system records',
      required: false,
      type: 'boolean',
      default: false
  },
  mssqlSkipFailures: {
      desc: 'skip failures in rows and tables that are too large',
      required: false,
      type: 'boolean',
      default: false
  },
},
exports.handler = async () => {
  await activate();

  if (fulcrum.args.mssqlCreateDatabase) {
    await createDatabase(fulcrum.args.mssqlCreateDatabase);
    return;
  }

  if (fulcrum.args.mssqlDropDatabase) {
    await dropDatabase(fulcrum.args.mssqlDropDatabase);
    return;
  }

  if (fulcrum.args.mssqlDrop) {
    await dropSystemTables();
    return;
  }

  if (fulcrum.args.mssqlSetup) {
    await setupDatabase();
    return;
  }

  const account = await fulcrum.fetchAccount(fulcrum.args.org);

  if (account) {
    if (fulcrum.args.mssqlSystemTablesOnly) {
      await setupSystemTables(account);
      return;
    }

    await invokeBeforeFunction();

    const forms = await account.findActiveForms({});

    for (const form of forms) {
      if (fulcrum.args.mssqlForm && form.id !== fulcrum.args.mssqlForm) {
        continue;
      }

      if (fulcrum.args.mssqlRebuildViewsOnly) {
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
