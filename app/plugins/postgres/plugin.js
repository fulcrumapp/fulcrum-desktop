"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pg = _interopRequireDefault(require("pg"));

var _util = require("util");

var _schema = _interopRequireDefault(require("./schema"));

var api = _interopRequireWildcard(require("../../api"));

var _snakeCase = _interopRequireDefault(require("snake-case"));

var _templateDrop = _interopRequireDefault(require("./template.drop.sql"));

var _schemaMap = _interopRequireDefault(require("./schema-map"));

var _lodash = require("lodash");

var _version = _interopRequireDefault(require("./version-001.sql"));

var _version2 = _interopRequireDefault(require("./version-002.sql"));

var _version3 = _interopRequireDefault(require("./version-003.sql"));

var _version4 = _interopRequireDefault(require("./version-004.sql"));

var _version5 = _interopRequireDefault(require("./version-005.sql"));

var _version6 = _interopRequireDefault(require("./version-006.sql"));

var _version7 = _interopRequireDefault(require("./version-007.sql"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const MAX_IDENTIFIER_LENGTH = 63;
const POSTGRES_CONFIG = {
  database: 'fulcrumapp',
  host: 'localhost',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
};
const MIGRATIONS = {
  '002': _version2.default,
  '003': _version3.default,
  '004': _version4.default,
  '005': _version5.default,
  '006': _version6.default,
  '007': _version7.default
};
const CURRENT_VERSION = 7;
const DEFAULT_SCHEMA = 'public';
let log, warn, error;

class _default {
  constructor() {
    _defineProperty(this, "runCommand", async () => {
      await this.activate();

      if (fulcrum.args.pgDrop) {
        await this.dropSystemTables();
        return;
      }

      if (fulcrum.args.pgSetup) {
        await this.setupDatabase();
        return;
      }

      const account = await fulcrum.fetchAccount(fulcrum.args.org);

      if (account) {
        if (fulcrum.args.pgSystemTablesOnly) {
          await this.setupSystemTables(account);
          return;
        }

        await this.invokeBeforeFunction();
        const forms = await account.findActiveForms({});

        for (const form of forms) {
          if (fulcrum.args.pgForm && form.id !== fulcrum.args.pgForm) {
            continue;
          }

          if (fulcrum.args.pgRebuildViewsOnly) {
            await this.rebuildFriendlyViews(form, account);
          } else {
            await this.rebuildForm(form, account, index => {
              this.updateStatus(form.name.green + ' : ' + index.toString().red + ' records');
            });
          }

          log('');
        }

        await this.invokeAfterFunction();
      } else {
        error('Unable to find account', fulcrum.args.org);
      }
    });

    _defineProperty(this, "escapeIdentifier", identifier => {
      return identifier && this.pgdb.ident(this.trimIdentifier(identifier));
    });

    _defineProperty(this, "run", sql => {
      sql = sql.replace(/\0/g, '');

      if (fulcrum.args.debug) {
        log(sql);
      }

      return new Promise((resolve, reject) => {
        this.pool.query(sql, [], (err, res) => {
          if (err) {
            return reject(err);
          }

          return resolve(res.rows);
        });
      });
    });

    _defineProperty(this, "log", (...args) => {// console.log(...args);
    });

    _defineProperty(this, "tableName", (account, name) => {
      if (this.useAccountPrefix) {
        return 'account_' + account.rowID + '_' + name;
      }

      return name;
    });

    _defineProperty(this, "onSyncStart", async ({
      account,
      tasks
    }) => {
      await this.invokeBeforeFunction();
    });

    _defineProperty(this, "onSyncFinish", async ({
      account
    }) => {
      await this.cleanupFriendlyViews(account);
      await this.invokeAfterFunction();
    });

    _defineProperty(this, "onFormSave", async ({
      form,
      account,
      oldForm,
      newForm
    }) => {
      await this.updateForm(form, account, oldForm, newForm);
    });

    _defineProperty(this, "onFormDelete", async ({
      form,
      account
    }) => {
      const oldForm = {
        id: form._id,
        row_id: form.rowID,
        name: form._name,
        elements: form._elementsJSON
      };
      await this.updateForm(form, account, oldForm, null);
    });

    _defineProperty(this, "onRecordSave", async ({
      record,
      account
    }) => {
      await this.updateRecord(record, account);
    });

    _defineProperty(this, "onRecordDelete", async ({
      record
    }) => {
      const statements = api.PostgresRecordValues.deleteForRecordStatements(this.pgdb, record, record.form, this.recordValueOptions);
      await this.run(statements.map(o => o.sql).join('\n'));
    });

    _defineProperty(this, "onPhotoSave", async ({
      photo,
      account
    }) => {
      await this.updatePhoto(photo, account);
    });

    _defineProperty(this, "onVideoSave", async ({
      video,
      account
    }) => {
      await this.updateVideo(video, account);
    });

    _defineProperty(this, "onAudioSave", async ({
      audio,
      account
    }) => {
      await this.updateAudio(audio, account);
    });

    _defineProperty(this, "onSignatureSave", async ({
      signature,
      account
    }) => {
      await this.updateSignature(signature, account);
    });

    _defineProperty(this, "onChangesetSave", async ({
      changeset,
      account
    }) => {
      await this.updateChangeset(changeset, account);
    });

    _defineProperty(this, "onChoiceListSave", async ({
      choiceList,
      account
    }) => {
      await this.updateChoiceList(choiceList, account);
    });

    _defineProperty(this, "onClassificationSetSave", async ({
      classificationSet,
      account
    }) => {
      await this.updateClassificationSet(classificationSet, account);
    });

    _defineProperty(this, "onProjectSave", async ({
      project,
      account
    }) => {
      await this.updateProject(project, account);
    });

    _defineProperty(this, "onRoleSave", async ({
      role,
      account
    }) => {
      await this.updateRole(role, account);
    });

    _defineProperty(this, "onMembershipSave", async ({
      membership,
      account
    }) => {
      await this.updateMembership(membership, account);
    });

    _defineProperty(this, "reloadTableList", async () => {
      const rows = await this.run(`SELECT table_name AS name FROM information_schema.tables WHERE table_schema='${this.dataSchema}'`);
      this.tableNames = rows.map(o => o.name);
    });

    _defineProperty(this, "reloadViewList", async () => {
      const rows = await this.run(`SELECT table_name AS name FROM information_schema.tables WHERE table_schema='${this.viewSchema}'`);
      this.viewNames = rows.map(o => o.name);
    });

    _defineProperty(this, "baseMediaURL", () => {});

    _defineProperty(this, "formatPhotoURL", id => {
      return `${this.baseMediaURL}/photos/${id}.jpg`;
    });

    _defineProperty(this, "formatVideoURL", id => {
      return `${this.baseMediaURL}/videos/${id}.mp4`;
    });

    _defineProperty(this, "formatAudioURL", id => {
      return `${this.baseMediaURL}/audio/${id}.m4a`;
    });

    _defineProperty(this, "formatSignatureURL", id => {
      return `${this.baseMediaURL}/signatures/${id}.png`;
    });

    _defineProperty(this, "updateRecord", async (record, account, skipTableCheck) => {
      if (!skipTableCheck && !this.rootTableExists(record.form)) {
        await this.rebuildForm(record.form, account, () => {});
      }

      if (this.pgCustomModule && this.pgCustomModule.shouldUpdateRecord && !this.pgCustomModule.shouldUpdateRecord({
        record,
        account
      })) {
        return;
      }

      const statements = api.PostgresRecordValues.updateForRecordStatements(this.pgdb, record, this.recordValueOptions);
      await this.run(statements.map(o => o.sql).join('\n'));
      const systemValues = api.PostgresRecordValues.systemColumnValuesForFeature(record, null, record, { ...this.recordValueOptions,
        disableComplexTypes: false
      });
      await this.updateObject(_schemaMap.default.record(record, systemValues), 'records');
    });

    _defineProperty(this, "rootTableExists", form => {
      return this.tableNames.indexOf(api.PostgresRecordValues.tableNameWithForm(form, null, this.recordValueOptions)) !== -1;
    });

    _defineProperty(this, "recreateFormTables", async (form, account) => {
      try {
        await this.updateForm(form, account, this.formVersion(form), null);
      } catch (ex) {
        if (fulcrum.args.debug) {
          error(ex);
        }
      }

      await this.updateForm(form, account, null, this.formVersion(form));
    });

    _defineProperty(this, "updateForm", async (form, account, oldForm, newForm) => {
      if (this.pgCustomModule && this.pgCustomModule.shouldUpdateForm && !this.pgCustomModule.shouldUpdateForm({
        form,
        account
      })) {
        return;
      }

      try {
        await this.updateFormObject(form, account);

        if (!this.rootTableExists(form) && newForm != null) {
          oldForm = null;
        }

        const options = {
          disableArrays: this.disableArrays,
          disableComplexTypes: this.disableComplexTypes,
          userModule: this.pgCustomModule,
          tableSchema: this.dataSchema,
          calculatedFieldDateFormat: 'date',
          metadata: true,
          useResourceID: false,
          accountPrefix: this.useAccountPrefix ? 'account_' + this.account.rowID : null
        };
        const {
          statements
        } = await _schema.default.generateSchemaStatements(account, oldForm, newForm, options);
        await this.dropFriendlyView(form, null);

        for (const repeatable of form.elementsOfType('Repeatable')) {
          await this.dropFriendlyView(form, repeatable);
        }

        await this.run(['BEGIN TRANSACTION;', ...statements, 'COMMIT TRANSACTION;'].join('\n'));

        if (newForm) {
          await this.createFriendlyView(form, null);

          for (const repeatable of form.elementsOfType('Repeatable')) {
            await this.createFriendlyView(form, repeatable);
          }
        }
      } catch (ex) {
        this.integrityWarning(ex);
        throw ex;
      }
    });

    _defineProperty(this, "formVersion", form => {
      if (form == null) {
        return null;
      }

      return {
        id: form._id,
        row_id: form.rowID,
        name: form._name,
        elements: form._elementsJSON
      };
    });

    _defineProperty(this, "updateStatus", message => {
      if (process.stdout.isTTY) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(message);
      }
    });

    _defineProperty(this, "progress", (name, index) => {
      this.updateStatus(name.green + ' : ' + index.toString().red);
    });
  }

  async task(cli) {
    return cli.command({
      command: 'postgres',
      desc: 'run the postgres sync for a specific organization',
      builder: {
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
      handler: this.runCommand
    });
  }

  trimIdentifier(identifier) {
    return identifier.substring(0, MAX_IDENTIFIER_LENGTH);
  }

  get useSyncEvents() {
    return fulcrum.args.pgSyncEvents != null ? fulcrum.args.pgSyncEvents : true;
  }

  async activate() {
    const logger = fulcrum.logger.withContext('postgres');
    log = logger.log;
    warn = logger.warn;
    error = logger.error;
    this.account = await fulcrum.fetchAccount(fulcrum.args.org);
    const options = { ...POSTGRES_CONFIG,
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
      this.pgCustomModule = require(fulcrum.args.pgCustomModule);
      this.pgCustomModule.api = api;
      this.pgCustomModule.app = fulcrum;
    }

    if (fulcrum.args.pgArrays === false) {
      this.disableArrays = true;
    }

    if (fulcrum.args.pgSimpleTypes === true) {
      this.disableComplexTypes = true;
    } // if (fulcrum.args.pgPersistentTableNames === true) {
    // this.persistentTableNames = true;
    // }


    this.useAccountPrefix = fulcrum.args.pgPrefix !== false;
    this.useUniqueViews = fulcrum.args.pgUniqueViews !== false;
    this.pool = new _pg.default.Pool(options);

    if (this.useSyncEvents) {
      fulcrum.on('sync:start', this.onSyncStart);
      fulcrum.on('sync:finish', this.onSyncFinish);
      fulcrum.on('photo:save', this.onPhotoSave);
      fulcrum.on('video:save', this.onVideoSave);
      fulcrum.on('audio:save', this.onAudioSave);
      fulcrum.on('signature:save', this.onSignatureSave);
      fulcrum.on('changeset:save', this.onChangesetSave);
      fulcrum.on('record:save', this.onRecordSave);
      fulcrum.on('record:delete', this.onRecordDelete);
      fulcrum.on('choice-list:save', this.onChoiceListSave);
      fulcrum.on('choice-list:delete', this.onChoiceListSave);
      fulcrum.on('form:save', this.onFormSave);
      fulcrum.on('form:delete', this.onFormSave);
      fulcrum.on('classification-set:save', this.onClassificationSetSave);
      fulcrum.on('classification-set:delete', this.onClassificationSetSave);
      fulcrum.on('role:save', this.onRoleSave);
      fulcrum.on('role:delete', this.onRoleSave);
      fulcrum.on('project:save', this.onProjectSave);
      fulcrum.on('project:delete', this.onProjectSave);
      fulcrum.on('membership:save', this.onMembershipSave);
      fulcrum.on('membership:delete', this.onMembershipSave);
    }

    this.viewSchema = fulcrum.args.pgSchemaViews || DEFAULT_SCHEMA;
    this.dataSchema = fulcrum.args.pgSchema || DEFAULT_SCHEMA; // Fetch all the existing tables on startup. This allows us to special case the
    // creation of new tables even when the form isn't version 1. If the table doesn't
    // exist, we can pretend the form is version 1 so it creates all new tables instead
    // of applying a schema diff.

    const rows = await this.run(`SELECT table_name AS name FROM information_schema.tables WHERE table_schema='${this.dataSchema}'`);
    this.tableNames = rows.map(o => o.name); // make a client so we can use it to build SQL statements

    this.pgdb = new api.Postgres({});
    this.setupOptions();
    await this.maybeInitialize();
  }

  async deactivate() {
    if (this.pool) {
      await this.pool.end();
    }
  }

  async updatePhoto(object, account) {
    const values = _schemaMap.default.photo(object);

    values.file = this.formatPhotoURL(values.access_key);
    await this.updateObject(values, 'photos');
  }

  async updateVideo(object, account) {
    const values = _schemaMap.default.video(object);

    values.file = this.formatVideoURL(values.access_key);
    await this.updateObject(values, 'videos');
  }

  async updateAudio(object, account) {
    const values = _schemaMap.default.audio(object);

    values.file = this.formatAudioURL(values.access_key);
    await this.updateObject(values, 'audio');
  }

  async updateSignature(object, account) {
    const values = _schemaMap.default.signature(object);

    values.file = this.formatSignatureURL(values.access_key);
    await this.updateObject(values, 'signatures');
  }

  async updateChangeset(object, account) {
    await this.updateObject(_schemaMap.default.changeset(object), 'changesets');
  }

  async updateProject(object, account) {
    await this.updateObject(_schemaMap.default.project(object), 'projects');
  }

  async updateMembership(object, account) {
    await this.updateObject(_schemaMap.default.membership(object), 'memberships');
  }

  async updateRole(object, account) {
    await this.updateObject(_schemaMap.default.role(object), 'roles');
  }

  async updateFormObject(object, account) {
    await this.updateObject(_schemaMap.default.form(object), 'forms');
  }

  async updateChoiceList(object, account) {
    await this.updateObject(_schemaMap.default.choiceList(object), 'choice_lists');
  }

  async updateClassificationSet(object, account) {
    await this.updateObject(_schemaMap.default.classificationSet(object), 'classification_sets');
  }

  async updateObject(values, table) {
    const deleteStatement = this.pgdb.deleteStatement(`${this.dataSchema}.system_${table}`, {
      row_resource_id: values.row_resource_id
    });
    const insertStatement = this.pgdb.insertStatement(`${this.dataSchema}.system_${table}`, values, {
      pk: 'id'
    });
    const sql = [deleteStatement.sql, insertStatement.sql].join('\n');

    try {
      await this.run(sql);
    } catch (ex) {
      this.integrityWarning(ex);
      throw ex;
    }
  }

  integrityWarning(ex) {
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
${ex.message}

Stack:
${ex.stack}
---------------------------------------------------------------------
`.red);
  }

  setupOptions() {
    this.baseMediaURL = fulcrum.args.pgMediaBaseUrl ? fulcrum.args.pgMediaBaseUrl : 'https://api.fulcrumapp.com/api/v2';
    this.recordValueOptions = {
      schema: this.dataSchema,
      disableArrays: this.disableArrays,
      escapeIdentifier: this.escapeIdentifier,
      // persistentTableNames: this.persistentTableNames,
      accountPrefix: this.useAccountPrefix ? 'account_' + this.account.rowID : null,
      calculatedFieldDateFormat: 'date',
      disableComplexTypes: this.disableComplexTypes,
      valuesTransformer: this.pgCustomModule && this.pgCustomModule.valuesTransformer,
      mediaURLFormatter: mediaValue => {
        return mediaValue.items.map(item => {
          if (mediaValue.element.isPhotoElement) {
            return this.formatPhotoURL(item.mediaID);
          } else if (mediaValue.element.isVideoElement) {
            return this.formatVideoURL(item.mediaID);
          } else if (mediaValue.element.isAudioElement) {
            return this.formatAudioURL(item.mediaID);
          }

          return null;
        });
      },
      mediaViewURLFormatter: mediaValue => {
        const ids = mediaValue.items.map(o => o.mediaID);

        if (mediaValue.element.isPhotoElement) {
          return `${this.baseMediaURL}/photos/view?photos=${ids}`;
        } else if (mediaValue.element.isVideoElement) {
          return `${this.baseMediaURL}/videos/view?videos=${ids}`;
        } else if (mediaValue.element.isAudioElement) {
          return `${this.baseMediaURL}/audio/view?audio=${ids}`;
        }

        return null;
      }
    };

    if (fulcrum.args.pgReportBaseUrl) {
      this.recordValueOptions.reportURLFormatter = feature => {
        return `${fulcrum.args.pgReportBaseUrl}/reports/${feature.id}.pdf`;
      };
    }
  }

  async dropFriendlyView(form, repeatable) {
    const viewName = this.getFriendlyTableName(form, repeatable);

    try {
      await this.run((0, _util.format)('DROP VIEW IF EXISTS %s.%s CASCADE;', this.escapeIdentifier(this.viewSchema), this.escapeIdentifier(viewName)));
    } catch (ex) {
      this.integrityWarning(ex);
    }
  }

  async createFriendlyView(form, repeatable) {
    const viewName = this.getFriendlyTableName(form, repeatable);

    try {
      await this.run((0, _util.format)('CREATE VIEW %s.%s AS SELECT * FROM %s;', this.escapeIdentifier(this.viewSchema), this.escapeIdentifier(viewName), api.PostgresRecordValues.tableNameWithFormAndSchema(form, repeatable, this.recordValueOptions, '_view_full')));
    } catch (ex) {
      // sometimes it doesn't exist
      this.integrityWarning(ex);
    }
  }

  getFriendlyTableName(form, repeatable) {
    let name = (0, _lodash.compact)([form.name, repeatable && repeatable.dataName]).join(' - ');

    if (this.useUniqueViews) {
      const formID = this.persistentTableNames ? form.id : form.rowID;
      const prefix = (0, _lodash.compact)(['view', formID, repeatable && repeatable.key]).join(' - ');
      name = [prefix, name].join(' - ');
    }

    return this.trimIdentifier(fulcrum.args.pgUnderscoreNames !== false ? (0, _snakeCase.default)(name) : name);
  }

  async invokeBeforeFunction() {
    if (fulcrum.args.pgBeforeFunction) {
      await this.run((0, _util.format)('SELECT %s();', fulcrum.args.pgBeforeFunction));
    }

    if (this.pgCustomModule && this.pgCustomModule.beforeSync) {
      await this.pgCustomModule.beforeSync();
    }
  }

  async invokeAfterFunction() {
    if (fulcrum.args.pgAfterFunction) {
      await this.run((0, _util.format)('SELECT %s();', fulcrum.args.pgAfterFunction));
    }

    if (this.pgCustomModule && this.pgCustomModule.afterSync) {
      await this.pgCustomModule.afterSync();
    }
  }

  async rebuildForm(form, account, progress) {
    await this.recreateFormTables(form, account);
    await this.reloadTableList();
    let index = 0;
    await form.findEachRecord({}, async record => {
      record.form = form;

      if (++index % 10 === 0) {
        progress(index);
      }

      await this.updateRecord(record, account, true);
    });
    progress(index);
  }

  async cleanupFriendlyViews(account) {
    await this.reloadViewList();
    const activeViewNames = [];
    const forms = await account.findActiveForms({});

    for (const form of forms) {
      activeViewNames.push(this.getFriendlyTableName(form, null));

      for (const repeatable of form.elementsOfType('Repeatable')) {
        activeViewNames.push(this.getFriendlyTableName(form, repeatable));
      }
    }

    const remove = (0, _lodash.difference)(this.viewNames, activeViewNames);

    for (const viewName of remove) {
      if (viewName.indexOf('view_') === 0 || viewName.indexOf('view - ') === 0) {
        try {
          await this.run((0, _util.format)('DROP VIEW IF EXISTS %s.%s;', this.escapeIdentifier(this.viewSchema), this.escapeIdentifier(viewName)));
        } catch (ex) {
          this.integrityWarning(ex);
        }
      }
    }
  }

  async rebuildFriendlyViews(form, account) {
    await this.dropFriendlyView(form, null);

    for (const repeatable of form.elementsOfType('Repeatable')) {
      await this.dropFriendlyView(form, repeatable);
    }

    await this.createFriendlyView(form, null);

    for (const repeatable of form.elementsOfType('Repeatable')) {
      await this.createFriendlyView(form, repeatable);
    }
  }

  async dropSystemTables() {
    await this.run(this.prepareMigrationScript(_templateDrop.default));
  }

  async setupDatabase() {
    await this.run(this.prepareMigrationScript(_version.default));
  }

  prepareMigrationScript(sql) {
    return sql.replace(/__SCHEMA__/g, this.dataSchema).replace(/__VIEW_SCHEMA__/g, this.viewSchema);
  }

  async setupSystemTables(account) {
    const progress = (name, index) => {
      this.updateStatus(name.green + ' : ' + index.toString().red);
    };

    await account.findEachPhoto({}, async (photo, {
      index
    }) => {
      if (++index % 10 === 0) {
        progress('Photos', index);
      }

      await this.updatePhoto(photo, account);
    });
    await account.findEachVideo({}, async (video, {
      index
    }) => {
      if (++index % 10 === 0) {
        progress('Videos', index);
      }

      await this.updateVideo(video, account);
    });
    await account.findEachAudio({}, async (audio, {
      index
    }) => {
      if (++index % 10 === 0) {
        progress('Audio', index);
      }

      await this.updateAudio(audio, account);
    });
    await account.findEachSignature({}, async (signature, {
      index
    }) => {
      if (++index % 10 === 0) {
        progress('Signatures', index);
      }

      await this.updateSignature(signature, account);
    });
    await account.findEachChangeset({}, async (changeset, {
      index
    }) => {
      if (++index % 10 === 0) {
        progress('Changesets', index);
      }

      await this.updateChangeset(changeset, account);
    });
    await account.findEachRole({}, async (object, {
      index
    }) => {
      if (++index % 10 === 0) {
        progress('Roles', index);
      }

      await this.updateRole(object, account);
    });
    await account.findEachProject({}, async (object, {
      index
    }) => {
      if (++index % 10 === 0) {
        progress('Projects', index);
      }

      await this.updateProject(object, account);
    });
    await account.findEachForm({}, async (object, {
      index
    }) => {
      if (++index % 10 === 0) {
        progress('Forms', index);
      }

      await this.updateFormObject(object, account);
    });
    await account.findEachMembership({}, async (object, {
      index
    }) => {
      if (++index % 10 === 0) {
        progress('Memberships', index);
      }

      await this.updateMembership(object, account);
    });
    await account.findEachChoiceList({}, async (object, {
      index
    }) => {
      if (++index % 10 === 0) {
        progress('Choice Lists', index);
      }

      await this.updateChoiceList(object, account);
    });
    await account.findEachClassificationSet({}, async (object, {
      index
    }) => {
      if (++index % 10 === 0) {
        progress('Classification Sets', index);
      }

      await this.updateClassificationSet(object, account);
    });
  }

  async maybeInitialize() {
    const account = await fulcrum.fetchAccount(fulcrum.args.org);

    if (this.tableNames.indexOf('migrations') === -1) {
      log('Inititalizing database...');
      await this.setupDatabase();
    }

    await this.maybeRunMigrations(account);
  }

  async maybeRunMigrations(account) {
    this.migrations = (await this.run(`SELECT name FROM ${this.dataSchema}.migrations`)).map(o => o.name);
    let populateRecords = false;

    for (let count = 2; count <= CURRENT_VERSION; ++count) {
      const version = (0, _lodash.padStart)(count, 3, '0');
      const needsMigration = this.migrations.indexOf(version) === -1 && MIGRATIONS[version];

      if (needsMigration) {
        await this.run(this.prepareMigrationScript(MIGRATIONS[version]));

        if (version === '002') {
          log('Populating system tables...');
          await this.setupSystemTables(account);
          populateRecords = true;
        } else if (version === '005') {
          log('Migrating date calculation fields...');
          await this.migrateCalculatedFieldsDateFormat(account);
        }
      }
    }

    if (populateRecords) {
      await this.populateRecords(account);
    }
  }

  async populateRecords(account) {
    const forms = await account.findActiveForms({});
    let index = 0;

    for (const form of forms) {
      index = 0;
      await form.findEachRecord({}, async record => {
        record.form = form;

        if (++index % 10 === 0) {
          this.progress(form.name, index);
        }

        await this.updateRecord(record, account, false);
      });
    }
  }

  async migrateCalculatedFieldsDateFormat(account) {
    const forms = await account.findActiveForms({});

    for (const form of forms) {
      const fields = form.elementsOfType('CalculatedField').filter(element => element.display.isDate);

      if (fields.length) {
        log('Migrating date calculation fields in form...', form.name);
        await this.rebuildForm(form, account, () => {});
      }
    }
  }

}

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wbHVnaW5zL3Bvc3RncmVzL3BsdWdpbi5qcyJdLCJuYW1lcyI6WyJNQVhfSURFTlRJRklFUl9MRU5HVEgiLCJQT1NUR1JFU19DT05GSUciLCJkYXRhYmFzZSIsImhvc3QiLCJwb3J0IiwibWF4IiwiaWRsZVRpbWVvdXRNaWxsaXMiLCJNSUdSQVRJT05TIiwidmVyc2lvbjAwMiIsInZlcnNpb24wMDMiLCJ2ZXJzaW9uMDA0IiwidmVyc2lvbjAwNSIsInZlcnNpb24wMDYiLCJ2ZXJzaW9uMDA3IiwiQ1VSUkVOVF9WRVJTSU9OIiwiREVGQVVMVF9TQ0hFTUEiLCJsb2ciLCJ3YXJuIiwiZXJyb3IiLCJhY3RpdmF0ZSIsImZ1bGNydW0iLCJhcmdzIiwicGdEcm9wIiwiZHJvcFN5c3RlbVRhYmxlcyIsInBnU2V0dXAiLCJzZXR1cERhdGFiYXNlIiwiYWNjb3VudCIsImZldGNoQWNjb3VudCIsIm9yZyIsInBnU3lzdGVtVGFibGVzT25seSIsInNldHVwU3lzdGVtVGFibGVzIiwiaW52b2tlQmVmb3JlRnVuY3Rpb24iLCJmb3JtcyIsImZpbmRBY3RpdmVGb3JtcyIsImZvcm0iLCJwZ0Zvcm0iLCJpZCIsInBnUmVidWlsZFZpZXdzT25seSIsInJlYnVpbGRGcmllbmRseVZpZXdzIiwicmVidWlsZEZvcm0iLCJpbmRleCIsInVwZGF0ZVN0YXR1cyIsIm5hbWUiLCJncmVlbiIsInRvU3RyaW5nIiwicmVkIiwiaW52b2tlQWZ0ZXJGdW5jdGlvbiIsImlkZW50aWZpZXIiLCJwZ2RiIiwiaWRlbnQiLCJ0cmltSWRlbnRpZmllciIsInNxbCIsInJlcGxhY2UiLCJkZWJ1ZyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwicG9vbCIsInF1ZXJ5IiwiZXJyIiwicmVzIiwicm93cyIsInVzZUFjY291bnRQcmVmaXgiLCJyb3dJRCIsInRhc2tzIiwiY2xlYW51cEZyaWVuZGx5Vmlld3MiLCJvbGRGb3JtIiwibmV3Rm9ybSIsInVwZGF0ZUZvcm0iLCJfaWQiLCJyb3dfaWQiLCJfbmFtZSIsImVsZW1lbnRzIiwiX2VsZW1lbnRzSlNPTiIsInJlY29yZCIsInVwZGF0ZVJlY29yZCIsInN0YXRlbWVudHMiLCJQb3N0Z3Jlc1JlY29yZFZhbHVlcyIsImRlbGV0ZUZvclJlY29yZFN0YXRlbWVudHMiLCJyZWNvcmRWYWx1ZU9wdGlvbnMiLCJydW4iLCJtYXAiLCJvIiwiam9pbiIsInBob3RvIiwidXBkYXRlUGhvdG8iLCJ2aWRlbyIsInVwZGF0ZVZpZGVvIiwiYXVkaW8iLCJ1cGRhdGVBdWRpbyIsInNpZ25hdHVyZSIsInVwZGF0ZVNpZ25hdHVyZSIsImNoYW5nZXNldCIsInVwZGF0ZUNoYW5nZXNldCIsImNob2ljZUxpc3QiLCJ1cGRhdGVDaG9pY2VMaXN0IiwiY2xhc3NpZmljYXRpb25TZXQiLCJ1cGRhdGVDbGFzc2lmaWNhdGlvblNldCIsInByb2plY3QiLCJ1cGRhdGVQcm9qZWN0Iiwicm9sZSIsInVwZGF0ZVJvbGUiLCJtZW1iZXJzaGlwIiwidXBkYXRlTWVtYmVyc2hpcCIsImRhdGFTY2hlbWEiLCJ0YWJsZU5hbWVzIiwidmlld1NjaGVtYSIsInZpZXdOYW1lcyIsImJhc2VNZWRpYVVSTCIsInNraXBUYWJsZUNoZWNrIiwicm9vdFRhYmxlRXhpc3RzIiwicGdDdXN0b21Nb2R1bGUiLCJzaG91bGRVcGRhdGVSZWNvcmQiLCJ1cGRhdGVGb3JSZWNvcmRTdGF0ZW1lbnRzIiwic3lzdGVtVmFsdWVzIiwic3lzdGVtQ29sdW1uVmFsdWVzRm9yRmVhdHVyZSIsImRpc2FibGVDb21wbGV4VHlwZXMiLCJ1cGRhdGVPYmplY3QiLCJTY2hlbWFNYXAiLCJpbmRleE9mIiwidGFibGVOYW1lV2l0aEZvcm0iLCJmb3JtVmVyc2lvbiIsImV4Iiwic2hvdWxkVXBkYXRlRm9ybSIsInVwZGF0ZUZvcm1PYmplY3QiLCJvcHRpb25zIiwiZGlzYWJsZUFycmF5cyIsInVzZXJNb2R1bGUiLCJ0YWJsZVNjaGVtYSIsImNhbGN1bGF0ZWRGaWVsZERhdGVGb3JtYXQiLCJtZXRhZGF0YSIsInVzZVJlc291cmNlSUQiLCJhY2NvdW50UHJlZml4IiwiUG9zdGdyZXNTY2hlbWEiLCJnZW5lcmF0ZVNjaGVtYVN0YXRlbWVudHMiLCJkcm9wRnJpZW5kbHlWaWV3IiwicmVwZWF0YWJsZSIsImVsZW1lbnRzT2ZUeXBlIiwiY3JlYXRlRnJpZW5kbHlWaWV3IiwiaW50ZWdyaXR5V2FybmluZyIsIm1lc3NhZ2UiLCJwcm9jZXNzIiwic3Rkb3V0IiwiaXNUVFkiLCJjbGVhckxpbmUiLCJjdXJzb3JUbyIsIndyaXRlIiwidGFzayIsImNsaSIsImNvbW1hbmQiLCJkZXNjIiwiYnVpbGRlciIsInBnRGF0YWJhc2UiLCJ0eXBlIiwiZGVmYXVsdCIsInBnSG9zdCIsInBnUG9ydCIsInBnVXNlciIsInBnUGFzc3dvcmQiLCJwZ1NjaGVtYSIsInBnU2NoZW1hVmlld3MiLCJwZ1N5bmNFdmVudHMiLCJwZ0JlZm9yZUZ1bmN0aW9uIiwicGdBZnRlckZ1bmN0aW9uIiwicmVxdWlyZWQiLCJwZ1JlcG9ydEJhc2VVcmwiLCJwZ01lZGlhQmFzZVVybCIsInBnVW5kZXJzY29yZU5hbWVzIiwicGdBcnJheXMiLCJwZ1ByZWZpeCIsInBnVW5pcXVlVmlld3MiLCJwZ1NpbXBsZVR5cGVzIiwiaGFuZGxlciIsInJ1bkNvbW1hbmQiLCJzdWJzdHJpbmciLCJ1c2VTeW5jRXZlbnRzIiwibG9nZ2VyIiwid2l0aENvbnRleHQiLCJ1c2VyIiwicGFzc3dvcmQiLCJyZXF1aXJlIiwiYXBpIiwiYXBwIiwidXNlVW5pcXVlVmlld3MiLCJwZyIsIlBvb2wiLCJvbiIsIm9uU3luY1N0YXJ0Iiwib25TeW5jRmluaXNoIiwib25QaG90b1NhdmUiLCJvblZpZGVvU2F2ZSIsIm9uQXVkaW9TYXZlIiwib25TaWduYXR1cmVTYXZlIiwib25DaGFuZ2VzZXRTYXZlIiwib25SZWNvcmRTYXZlIiwib25SZWNvcmREZWxldGUiLCJvbkNob2ljZUxpc3RTYXZlIiwib25Gb3JtU2F2ZSIsIm9uQ2xhc3NpZmljYXRpb25TZXRTYXZlIiwib25Sb2xlU2F2ZSIsIm9uUHJvamVjdFNhdmUiLCJvbk1lbWJlcnNoaXBTYXZlIiwiUG9zdGdyZXMiLCJzZXR1cE9wdGlvbnMiLCJtYXliZUluaXRpYWxpemUiLCJkZWFjdGl2YXRlIiwiZW5kIiwib2JqZWN0IiwidmFsdWVzIiwiZmlsZSIsImZvcm1hdFBob3RvVVJMIiwiYWNjZXNzX2tleSIsImZvcm1hdFZpZGVvVVJMIiwiZm9ybWF0QXVkaW9VUkwiLCJmb3JtYXRTaWduYXR1cmVVUkwiLCJ0YWJsZSIsImRlbGV0ZVN0YXRlbWVudCIsInJvd19yZXNvdXJjZV9pZCIsImluc2VydFN0YXRlbWVudCIsInBrIiwic3RhY2siLCJzY2hlbWEiLCJlc2NhcGVJZGVudGlmaWVyIiwidmFsdWVzVHJhbnNmb3JtZXIiLCJtZWRpYVVSTEZvcm1hdHRlciIsIm1lZGlhVmFsdWUiLCJpdGVtcyIsIml0ZW0iLCJlbGVtZW50IiwiaXNQaG90b0VsZW1lbnQiLCJtZWRpYUlEIiwiaXNWaWRlb0VsZW1lbnQiLCJpc0F1ZGlvRWxlbWVudCIsIm1lZGlhVmlld1VSTEZvcm1hdHRlciIsImlkcyIsInJlcG9ydFVSTEZvcm1hdHRlciIsImZlYXR1cmUiLCJ2aWV3TmFtZSIsImdldEZyaWVuZGx5VGFibGVOYW1lIiwidGFibGVOYW1lV2l0aEZvcm1BbmRTY2hlbWEiLCJkYXRhTmFtZSIsImZvcm1JRCIsInBlcnNpc3RlbnRUYWJsZU5hbWVzIiwicHJlZml4Iiwia2V5IiwiYmVmb3JlU3luYyIsImFmdGVyU3luYyIsInByb2dyZXNzIiwicmVjcmVhdGVGb3JtVGFibGVzIiwicmVsb2FkVGFibGVMaXN0IiwiZmluZEVhY2hSZWNvcmQiLCJyZWxvYWRWaWV3TGlzdCIsImFjdGl2ZVZpZXdOYW1lcyIsInB1c2giLCJyZW1vdmUiLCJwcmVwYXJlTWlncmF0aW9uU2NyaXB0IiwidGVtcGxhdGVEcm9wIiwidmVyc2lvbjAwMSIsImZpbmRFYWNoUGhvdG8iLCJmaW5kRWFjaFZpZGVvIiwiZmluZEVhY2hBdWRpbyIsImZpbmRFYWNoU2lnbmF0dXJlIiwiZmluZEVhY2hDaGFuZ2VzZXQiLCJmaW5kRWFjaFJvbGUiLCJmaW5kRWFjaFByb2plY3QiLCJmaW5kRWFjaEZvcm0iLCJmaW5kRWFjaE1lbWJlcnNoaXAiLCJmaW5kRWFjaENob2ljZUxpc3QiLCJmaW5kRWFjaENsYXNzaWZpY2F0aW9uU2V0IiwibWF5YmVSdW5NaWdyYXRpb25zIiwibWlncmF0aW9ucyIsInBvcHVsYXRlUmVjb3JkcyIsImNvdW50IiwidmVyc2lvbiIsIm5lZWRzTWlncmF0aW9uIiwibWlncmF0ZUNhbGN1bGF0ZWRGaWVsZHNEYXRlRm9ybWF0IiwiZmllbGRzIiwiZmlsdGVyIiwiZGlzcGxheSIsImlzRGF0ZSIsImxlbmd0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRUEsTUFBTUEscUJBQXFCLEdBQUcsRUFBOUI7QUFFQSxNQUFNQyxlQUFlLEdBQUc7QUFDdEJDLEVBQUFBLFFBQVEsRUFBRSxZQURZO0FBRXRCQyxFQUFBQSxJQUFJLEVBQUUsV0FGZ0I7QUFHdEJDLEVBQUFBLElBQUksRUFBRSxJQUhnQjtBQUl0QkMsRUFBQUEsR0FBRyxFQUFFLEVBSmlCO0FBS3RCQyxFQUFBQSxpQkFBaUIsRUFBRTtBQUxHLENBQXhCO0FBUUEsTUFBTUMsVUFBVSxHQUFHO0FBQ2pCLFNBQU9DLGlCQURVO0FBRWpCLFNBQU9DLGlCQUZVO0FBR2pCLFNBQU9DLGlCQUhVO0FBSWpCLFNBQU9DLGlCQUpVO0FBS2pCLFNBQU9DLGlCQUxVO0FBTWpCLFNBQU9DO0FBTlUsQ0FBbkI7QUFTQSxNQUFNQyxlQUFlLEdBQUcsQ0FBeEI7QUFFQSxNQUFNQyxjQUFjLEdBQUcsUUFBdkI7QUFFQSxJQUFJQyxHQUFKLEVBQVNDLElBQVQsRUFBZUMsS0FBZjs7QUFFZSxlQUFNO0FBQUE7QUFBQSx3Q0F3SU4sWUFBWTtBQUN2QixZQUFNLEtBQUtD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RCxPQUFPLElBQUlBLE9BQU8sQ0FBQ2tELE9BQVIsQ0FBZ0JDLE1BQXpFLENBQWY7O0FBRUEsVUFBSUgsTUFBTSxDQUFDSSxNQUFYLEVBQW1CO0FBQ2pCeFEsUUFBQUEsR0FBRyxDQUFDLDhDQUFELEVBQWlEa0IsSUFBSSxDQUFDUSxJQUF0RCxDQUFIO0FBRUEsY0FBTSxLQUFLSCxXQUFMLENBQWlCTCxJQUFqQixFQUF1QlIsT0FBdkIsRUFBZ0MsTUFBTSxDQUFFLENBQXhDLENBQU47QUFDRDtBQUNGO0FBQ0Y7O0FBMytCa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGcgZnJvbSAncGcnO1xuaW1wb3J0IHsgZm9ybWF0IH0gZnJvbSAndXRpbCc7XG5pbXBvcnQgUG9zdGdyZXNTY2hlbWEgZnJvbSAnLi9zY2hlbWEnO1xuaW1wb3J0IHsgUG9zdGdyZXNSZWNvcmRWYWx1ZXMsIFBvc3RncmVzIH0gZnJvbSAnLi4vLi4vYXBpJztcbmltcG9ydCBzbmFrZSBmcm9tICdzbmFrZS1jYXNlJztcbmltcG9ydCB0ZW1wbGF0ZURyb3AgZnJvbSAnLi90ZW1wbGF0ZS5kcm9wLnNxbCc7XG5pbXBvcnQgU2NoZW1hTWFwIGZyb20gJy4vc2NoZW1hLW1hcCc7XG5pbXBvcnQgKiBhcyBhcGkgZnJvbSAnLi4vLi4vYXBpJztcbmltcG9ydCB7IGNvbXBhY3QsIGRpZmZlcmVuY2UsIHBhZFN0YXJ0IH0gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHZlcnNpb24wMDEgZnJvbSAnLi92ZXJzaW9uLTAwMS5zcWwnO1xuaW1wb3J0IHZlcnNpb24wMDIgZnJvbSAnLi92ZXJzaW9uLTAwMi5zcWwnO1xuaW1wb3J0IHZlcnNpb24wMDMgZnJvbSAnLi92ZXJzaW9uLTAwMy5zcWwnO1xuaW1wb3J0IHZlcnNpb24wMDQgZnJvbSAnLi92ZXJzaW9uLTAwNC5zcWwnO1xuaW1wb3J0IHZlcnNpb24wMDUgZnJvbSAnLi92ZXJzaW9uLTAwNS5zcWwnO1xuaW1wb3J0IHZlcnNpb24wMDYgZnJvbSAnLi92ZXJzaW9uLTAwNi5zcWwnO1xuaW1wb3J0IHZlcnNpb24wMDcgZnJvbSAnLi92ZXJzaW9uLTAwNy5zcWwnO1xuXG5jb25zdCBNQVhfSURFTlRJRklFUl9MRU5HVEggPSA2MztcblxuY29uc3QgUE9TVEdSRVNfQ09ORklHID0ge1xuICBkYXRhYmFzZTogJ2Z1bGNydW1hcHAnLFxuICBob3N0OiAnbG9jYWxob3N0JyxcbiAgcG9ydDogNTQzMixcbiAgbWF4OiAxMCxcbiAgaWRsZVRpbWVvdXRNaWxsaXM6IDMwMDAwXG59O1xuXG5jb25zdCBNSUdSQVRJT05TID0ge1xuICAnMDAyJzogdmVyc2lvbjAwMixcbiAgJzAwMyc6IHZlcnNpb24wMDMsXG4gICcwMDQnOiB2ZXJzaW9uMDA0LFxuICAnMDA1JzogdmVyc2lvbjAwNSxcbiAgJzAwNic6IHZlcnNpb24wMDYsXG4gICcwMDcnOiB2ZXJzaW9uMDA3XG59O1xuXG5jb25zdCBDVVJSRU5UX1ZFUlNJT04gPSA3O1xuXG5jb25zdCBERUZBVUxUX1NDSEVNQSA9ICdwdWJsaWMnO1xuXG5sZXQgbG9nLCB3YXJuLCBlcnJvcjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICBhc3luYyB0YXNrKGNsaSkge1xuICAgIHJldHVybiBjbGkuY29tbWFuZCh7XG4gICAgICBjb21tYW5kOiAncG9zdGdyZXMnLFxuICAgICAgZGVzYzogJ3J1biB0aGUgcG9zdGdyZXMgc3luYyBmb3IgYSBzcGVjaWZpYyBvcmdhbml6YXRpb24nLFxuICAgICAgYnVpbGRlcjoge1xuICAgICAgICBwZ0RhdGFiYXNlOiB7XG4gICAgICAgICAgZGVzYzogJ3Bvc3RncmVzcWwgZGF0YWJhc2UgbmFtZScsXG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZGVmYXVsdDogUE9TVEdSRVNfQ09ORklHLmRhdGFiYXNlXG4gICAgICAgIH0sXG4gICAgICAgIHBnSG9zdDoge1xuICAgICAgICAgIGRlc2M6ICdwb3N0Z3Jlc3FsIHNlcnZlciBob3N0JyxcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZWZhdWx0OiBQT1NUR1JFU19DT05GSUcuaG9zdFxuICAgICAgICB9LFxuICAgICAgICBwZ1BvcnQ6IHtcbiAgICAgICAgICBkZXNjOiAncG9zdGdyZXNxbCBzZXJ2ZXIgcG9ydCcsXG4gICAgICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgICAgIGRlZmF1bHQ6IFBPU1RHUkVTX0NPTkZJRy5wb3J0XG4gICAgICAgIH0sXG4gICAgICAgIHBnVXNlcjoge1xuICAgICAgICAgIGRlc2M6ICdwb3N0Z3Jlc3FsIHVzZXInLFxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIH0sXG4gICAgICAgIHBnUGFzc3dvcmQ6IHtcbiAgICAgICAgICBkZXNjOiAncG9zdGdyZXNxbCBwYXNzd29yZCcsXG4gICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgfSxcbiAgICAgICAgcGdTY2hlbWE6IHtcbiAgICAgICAgICBkZXNjOiAncG9zdGdyZXNxbCBzY2hlbWEnLFxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIH0sXG4gICAgICAgIHBnU2NoZW1hVmlld3M6IHtcbiAgICAgICAgICBkZXNjOiAncG9zdGdyZXNxbCBzY2hlbWEgZm9yIHRoZSBmcmllbmRseSB2aWV3cycsXG4gICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgfSxcbiAgICAgICAgcGdTeW5jRXZlbnRzOiB7XG4gICAgICAgICAgZGVzYzogJ2FkZCBzeW5jIGV2ZW50IGhvb2tzJyxcbiAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBwZ0JlZm9yZUZ1bmN0aW9uOiB7XG4gICAgICAgICAgZGVzYzogJ2NhbGwgdGhpcyBmdW5jdGlvbiBiZWZvcmUgdGhlIHN5bmMnLFxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIH0sXG4gICAgICAgIHBnQWZ0ZXJGdW5jdGlvbjoge1xuICAgICAgICAgIGRlc2M6ICdjYWxsIHRoaXMgZnVuY3Rpb24gYWZ0ZXIgdGhlIHN5bmMnLFxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIH0sXG4gICAgICAgIG9yZzoge1xuICAgICAgICAgIGRlc2M6ICdvcmdhbml6YXRpb24gbmFtZScsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgfSxcbiAgICAgICAgcGdGb3JtOiB7XG4gICAgICAgICAgZGVzYzogJ3RoZSBmb3JtIElEIHRvIHJlYnVpbGQnLFxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIH0sXG4gICAgICAgIHBnUmVwb3J0QmFzZVVybDoge1xuICAgICAgICAgIGRlc2M6ICdyZXBvcnQgVVJMIGJhc2UnLFxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIH0sXG4gICAgICAgIHBnTWVkaWFCYXNlVXJsOiB7XG4gICAgICAgICAgZGVzYzogJ21lZGlhIFVSTCBiYXNlJyxcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICB9LFxuICAgICAgICBwZ1VuZGVyc2NvcmVOYW1lczoge1xuICAgICAgICAgIGRlc2M6ICd1c2UgdW5kZXJzY29yZSBuYW1lcyAoZS5nLiBcIlBhcmsgSW5zcGVjdGlvbnNcIiBiZWNvbWVzIFwicGFya19pbnNwZWN0aW9uc1wiKScsXG4gICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHBnUmVidWlsZFZpZXdzT25seToge1xuICAgICAgICAgIGRlc2M6ICdvbmx5IHJlYnVpbGQgdGhlIHZpZXdzJyxcbiAgICAgICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIHBnQ3VzdG9tTW9kdWxlOiB7XG4gICAgICAgICAgZGVzYzogJ2EgY3VzdG9tIG1vZHVsZSB0byBsb2FkIHdpdGggc3luYyBleHRlbnNpb25zJyxcbiAgICAgICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgfSxcbiAgICAgICAgcGdTZXR1cDoge1xuICAgICAgICAgIGRlc2M6ICdzZXR1cCB0aGUgZGF0YWJhc2UnLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgfSxcbiAgICAgICAgcGdEcm9wOiB7XG4gICAgICAgICAgZGVzYzogJ2Ryb3AgdGhlIHN5c3RlbSB0YWJsZXMnLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgcGdBcnJheXM6IHtcbiAgICAgICAgICBkZXNjOiAndXNlIGFycmF5IHR5cGVzIGZvciBtdWx0aS12YWx1ZSBmaWVsZHMgbGlrZSBjaG9pY2UgZmllbGRzLCBjbGFzc2lmaWNhdGlvbiBmaWVsZHMgYW5kIG1lZGlhIGZpZWxkcycsXG4gICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIC8vIHBnUGVyc2lzdGVudFRhYmxlTmFtZXM6IHtcbiAgICAgICAgLy8gICBkZXNjOiAndXNlIHRoZSBzZXJ2ZXIgaWQgaW4gdGhlIGZvcm0gdGFibGUgbmFtZXMnLFxuICAgICAgICAvLyAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgLy8gICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgIC8vICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgcGdQcmVmaXg6IHtcbiAgICAgICAgICBkZXNjOiAndXNlIHRoZSBvcmdhbml6YXRpb24gYXMgYSBwcmVmaXggaW4gdGhlIG9iamVjdCBuYW1lcycsXG4gICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHBnVW5pcXVlVmlld3M6IHtcbiAgICAgICAgICBkZXNjOiAnbWFrZSBzdXJlIHRoZSB2aWV3cyBhcmUgdW5pcXVlbHkgaWRlbnRpZmlhYmxlLiBEaXNhYmxpbmcgdGhpcyBtYWtlcyB0aGUgdmlld3MgZWFzaWVyIHRvIHVzZSwgYnV0IGhhcyBsaW1pdGF0aW9ucyB3aGVuIGZvcm1zIGFyZSByZW5hbWVkLiBPTkxZIHVzZSB0aGlzIGlzIHlvdSBrbm93IHlvdSB3aWxsIG5vdCByZW5hbWUgb3Igc3dhcCBvdXQgZm9ybXMgb3IgZHJhc3RpY2FsbHkgYWx0ZXIgZm9ybSBzY2hlbWFzLicsXG4gICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHBnU2ltcGxlVHlwZXM6IHtcbiAgICAgICAgICBkZXNjOiAndXNlIHNpbXBsZSB0eXBlcyBpbiB0aGUgZGF0YWJhc2UgdGhhdCBhcmUgbW9yZSBjb21wYXRpYmxlIHdpdGggb3RoZXIgYXBwbGljYXRpb25zIChubyB0c3ZlY3RvciwgZ2VvbWV0cnksIGFycmF5cyknLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgcGdTeXN0ZW1UYWJsZXNPbmx5OiB7XG4gICAgICAgICAgZGVzYzogJ29ubHkgY3JlYXRlIHRoZSBzeXN0ZW0gcmVjb3JkcycsXG4gICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaGFuZGxlcjogdGhpcy5ydW5Db21tYW5kXG4gICAgfSk7XG4gIH1cblxuICBydW5Db21tYW5kID0gYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IHRoaXMuYWN0aXZhdGUoKTtcblxuICAgIGlmIChmdWxjcnVtLmFyZ3MucGdEcm9wKSB7XG4gICAgICBhd2FpdCB0aGlzLmRyb3BTeXN0ZW1UYWJsZXMoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZnVsY3J1bS5hcmdzLnBnU2V0dXApIHtcbiAgICAgIGF3YWl0IHRoaXMuc2V0dXBEYXRhYmFzZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGFjY291bnQgPSBhd2FpdCBmdWxjcnVtLmZldGNoQWNjb3VudChmdWxjcnVtLmFyZ3Mub3JnKTtcblxuICAgIGlmIChhY2NvdW50KSB7XG4gICAgICBpZiAoZnVsY3J1bS5hcmdzLnBnU3lzdGVtVGFibGVzT25seSkge1xuICAgICAgICBhd2FpdCB0aGlzLnNldHVwU3lzdGVtVGFibGVzKGFjY291bnQpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IHRoaXMuaW52b2tlQmVmb3JlRnVuY3Rpb24oKTtcblxuICAgICAgY29uc3QgZm9ybXMgPSBhd2FpdCBhY2NvdW50LmZpbmRBY3RpdmVGb3Jtcyh7fSk7XG5cbiAgICAgIGZvciAoY29uc3QgZm9ybSBvZiBmb3Jtcykge1xuICAgICAgICBpZiAoZnVsY3J1bS5hcmdzLnBnRm9ybSAmJiBmb3JtLmlkICE9PSBmdWxjcnVtLmFyZ3MucGdGb3JtKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZnVsY3J1bS5hcmdzLnBnUmVidWlsZFZpZXdzT25seSkge1xuICAgICAgICAgIGF3YWl0IHRoaXMucmVidWlsZEZyaWVuZGx5Vmlld3MoZm9ybSwgYWNjb3VudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXdhaXQgdGhpcy5yZWJ1aWxkRm9ybShmb3JtLCBhY2NvdW50LCAoaW5kZXgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU3RhdHVzKGZvcm0ubmFtZS5ncmVlbiArICcgOiAnICsgaW5kZXgudG9TdHJpbmcoKS5yZWQgKyAnIHJlY29yZHMnKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvZygnJyk7XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IHRoaXMuaW52b2tlQWZ0ZXJGdW5jdGlvbigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlcnJvcignVW5hYmxlIHRvIGZpbmQgYWNjb3VudCcsIGZ1bGNydW0uYXJncy5vcmcpO1xuICAgIH1cbiAgfVxuXG4gIHRyaW1JZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgICByZXR1cm4gaWRlbnRpZmllci5zdWJzdHJpbmcoMCwgTUFYX0lERU5USUZJRVJfTEVOR1RIKTtcbiAgfVxuXG4gIGVzY2FwZUlkZW50aWZpZXIgPSAoaWRlbnRpZmllcikgPT4ge1xuICAgIHJldHVybiBpZGVudGlmaWVyICYmIHRoaXMucGdkYi5pZGVudCh0aGlzLnRyaW1JZGVudGlmaWVyKGlkZW50aWZpZXIpKTtcbiAgfVxuXG4gIGdldCB1c2VTeW5jRXZlbnRzKCkge1xuICAgIHJldHVybiBmdWxjcnVtLmFyZ3MucGdTeW5jRXZlbnRzICE9IG51bGwgPyBmdWxjcnVtLmFyZ3MucGdTeW5jRXZlbnRzIDogdHJ1ZTtcbiAgfVxuXG4gIGFzeW5jIGFjdGl2YXRlKCkge1xuICAgIGNvbnN0IGxvZ2dlciA9IGZ1bGNydW0ubG9nZ2VyLndpdGhDb250ZXh0KCdwb3N0Z3JlcycpO1xuXG4gICAgbG9nID0gbG9nZ2VyLmxvZztcbiAgICB3YXJuID0gbG9nZ2VyLndhcm47XG4gICAgZXJyb3IgPSBsb2dnZXIuZXJyb3I7XG5cbiAgICB0aGlzLmFjY291bnQgPSBhd2FpdCBmdWxjcnVtLmZldGNoQWNjb3VudChmdWxjcnVtLmFyZ3Mub3JnKTtcblxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAuLi5QT1NUR1JFU19DT05GSUcsXG4gICAgICBob3N0OiBmdWxjcnVtLmFyZ3MucGdIb3N0IHx8IFBPU1RHUkVTX0NPTkZJRy5ob3N0LFxuICAgICAgcG9ydDogZnVsY3J1bS5hcmdzLnBnUG9ydCB8fCBQT1NUR1JFU19DT05GSUcucG9ydCxcbiAgICAgIGRhdGFiYXNlOiBmdWxjcnVtLmFyZ3MucGdEYXRhYmFzZSB8fCBQT1NUR1JFU19DT05GSUcuZGF0YWJhc2UsXG4gICAgICB1c2VyOiBmdWxjcnVtLmFyZ3MucGdVc2VyIHx8IFBPU1RHUkVTX0NPTkZJRy51c2VyLFxuICAgICAgcGFzc3dvcmQ6IGZ1bGNydW0uYXJncy5wZ1Bhc3N3b3JkIHx8IFBPU1RHUkVTX0NPTkZJRy51c2VyXG4gICAgfTtcblxuICAgIGlmIChmdWxjcnVtLmFyZ3MucGdVc2VyKSB7XG4gICAgICBvcHRpb25zLnVzZXIgPSBmdWxjcnVtLmFyZ3MucGdVc2VyO1xuICAgIH1cblxuICAgIGlmIChmdWxjcnVtLmFyZ3MucGdQYXNzd29yZCkge1xuICAgICAgb3B0aW9ucy5wYXNzd29yZCA9IGZ1bGNydW0uYXJncy5wZ1Bhc3N3b3JkO1xuICAgIH1cblxuICAgIGlmIChmdWxjcnVtLmFyZ3MucGdDdXN0b21Nb2R1bGUpIHtcbiAgICAgIHRoaXMucGdDdXN0b21Nb2R1bGUgPSByZXF1aXJlKGZ1bGNydW0uYXJncy5wZ0N1c3RvbU1vZHVsZSk7XG4gICAgICB0aGlzLnBnQ3VzdG9tTW9kdWxlLmFwaSA9IGFwaTtcbiAgICAgIHRoaXMucGdDdXN0b21Nb2R1bGUuYXBwID0gZnVsY3J1bTtcbiAgICB9XG5cbiAgICBpZiAoZnVsY3J1bS5hcmdzLnBnQXJyYXlzID09PSBmYWxzZSkge1xuICAgICAgdGhpcy5kaXNhYmxlQXJyYXlzID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZnVsY3J1bS5hcmdzLnBnU2ltcGxlVHlwZXMgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuZGlzYWJsZUNvbXBsZXhUeXBlcyA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gaWYgKGZ1bGNydW0uYXJncy5wZ1BlcnNpc3RlbnRUYWJsZU5hbWVzID09PSB0cnVlKSB7XG4gICAgICAvLyB0aGlzLnBlcnNpc3RlbnRUYWJsZU5hbWVzID0gdHJ1ZTtcbiAgICAvLyB9XG5cbiAgICB0aGlzLnVzZUFjY291bnRQcmVmaXggPSAoZnVsY3J1bS5hcmdzLnBnUHJlZml4ICE9PSBmYWxzZSk7XG4gICAgdGhpcy51c2VVbmlxdWVWaWV3cyA9IChmdWxjcnVtLmFyZ3MucGdVbmlxdWVWaWV3cyAhPT0gZmFsc2UpO1xuXG4gICAgdGhpcy5wb29sID0gbmV3IHBnLlBvb2wob3B0aW9ucyk7XG5cbiAgICBpZiAodGhpcy51c2VTeW5jRXZlbnRzKSB7XG4gICAgICBmdWxjcnVtLm9uKCdzeW5jOnN0YXJ0JywgdGhpcy5vblN5bmNTdGFydCk7XG4gICAgICBmdWxjcnVtLm9uKCdzeW5jOmZpbmlzaCcsIHRoaXMub25TeW5jRmluaXNoKTtcbiAgICAgIGZ1bGNydW0ub24oJ3Bob3RvOnNhdmUnLCB0aGlzLm9uUGhvdG9TYXZlKTtcbiAgICAgIGZ1bGNydW0ub24oJ3ZpZGVvOnNhdmUnLCB0aGlzLm9uVmlkZW9TYXZlKTtcbiAgICAgIGZ1bGNydW0ub24oJ2F1ZGlvOnNhdmUnLCB0aGlzLm9uQXVkaW9TYXZlKTtcbiAgICAgIGZ1bGNydW0ub24oJ3NpZ25hdHVyZTpzYXZlJywgdGhpcy5vblNpZ25hdHVyZVNhdmUpO1xuICAgICAgZnVsY3J1bS5vbignY2hhbmdlc2V0OnNhdmUnLCB0aGlzLm9uQ2hhbmdlc2V0U2F2ZSk7XG4gICAgICBmdWxjcnVtLm9uKCdyZWNvcmQ6c2F2ZScsIHRoaXMub25SZWNvcmRTYXZlKTtcbiAgICAgIGZ1bGNydW0ub24oJ3JlY29yZDpkZWxldGUnLCB0aGlzLm9uUmVjb3JkRGVsZXRlKTtcblxuICAgICAgZnVsY3J1bS5vbignY2hvaWNlLWxpc3Q6c2F2ZScsIHRoaXMub25DaG9pY2VMaXN0U2F2ZSk7XG4gICAgICBmdWxjcnVtLm9uKCdjaG9pY2UtbGlzdDpkZWxldGUnLCB0aGlzLm9uQ2hvaWNlTGlzdFNhdmUpO1xuXG4gICAgICBmdWxjcnVtLm9uKCdmb3JtOnNhdmUnLCB0aGlzLm9uRm9ybVNhdmUpO1xuICAgICAgZnVsY3J1bS5vbignZm9ybTpkZWxldGUnLCB0aGlzLm9uRm9ybVNhdmUpO1xuXG4gICAgICBmdWxjcnVtLm9uKCdjbGFzc2lmaWNhdGlvbi1zZXQ6c2F2ZScsIHRoaXMub25DbGFzc2lmaWNhdGlvblNldFNhdmUpO1xuICAgICAgZnVsY3J1bS5vbignY2xhc3NpZmljYXRpb24tc2V0OmRlbGV0ZScsIHRoaXMub25DbGFzc2lmaWNhdGlvblNldFNhdmUpO1xuXG4gICAgICBmdWxjcnVtLm9uKCdyb2xlOnNhdmUnLCB0aGlzLm9uUm9sZVNhdmUpO1xuICAgICAgZnVsY3J1bS5vbigncm9sZTpkZWxldGUnLCB0aGlzLm9uUm9sZVNhdmUpO1xuXG4gICAgICBmdWxjcnVtLm9uKCdwcm9qZWN0OnNhdmUnLCB0aGlzLm9uUHJvamVjdFNhdmUpO1xuICAgICAgZnVsY3J1bS5vbigncHJvamVjdDpkZWxldGUnLCB0aGlzLm9uUHJvamVjdFNhdmUpO1xuXG4gICAgICBmdWxjcnVtLm9uKCdtZW1iZXJzaGlwOnNhdmUnLCB0aGlzLm9uTWVtYmVyc2hpcFNhdmUpO1xuICAgICAgZnVsY3J1bS5vbignbWVtYmVyc2hpcDpkZWxldGUnLCB0aGlzLm9uTWVtYmVyc2hpcFNhdmUpO1xuICAgIH1cblxuICAgIHRoaXMudmlld1NjaGVtYSA9IGZ1bGNydW0uYXJncy5wZ1NjaGVtYVZpZXdzIHx8IERFRkFVTFRfU0NIRU1BO1xuICAgIHRoaXMuZGF0YVNjaGVtYSA9IGZ1bGNydW0uYXJncy5wZ1NjaGVtYSB8fCBERUZBVUxUX1NDSEVNQTtcblxuICAgIC8vIEZldGNoIGFsbCB0aGUgZXhpc3RpbmcgdGFibGVzIG9uIHN0YXJ0dXAuIFRoaXMgYWxsb3dzIHVzIHRvIHNwZWNpYWwgY2FzZSB0aGVcbiAgICAvLyBjcmVhdGlvbiBvZiBuZXcgdGFibGVzIGV2ZW4gd2hlbiB0aGUgZm9ybSBpc24ndCB2ZXJzaW9uIDEuIElmIHRoZSB0YWJsZSBkb2Vzbid0XG4gICAgLy8gZXhpc3QsIHdlIGNhbiBwcmV0ZW5kIHRoZSBmb3JtIGlzIHZlcnNpb24gMSBzbyBpdCBjcmVhdGVzIGFsbCBuZXcgdGFibGVzIGluc3RlYWRcbiAgICAvLyBvZiBhcHBseWluZyBhIHNjaGVtYSBkaWZmLlxuICAgIGNvbnN0IHJvd3MgPSBhd2FpdCB0aGlzLnJ1bihgU0VMRUNUIHRhYmxlX25hbWUgQVMgbmFtZSBGUk9NIGluZm9ybWF0aW9uX3NjaGVtYS50YWJsZXMgV0hFUkUgdGFibGVfc2NoZW1hPSckeyB0aGlzLmRhdGFTY2hlbWEgfSdgKTtcblxuICAgIHRoaXMudGFibGVOYW1lcyA9IHJvd3MubWFwKG8gPT4gby5uYW1lKTtcblxuICAgIC8vIG1ha2UgYSBjbGllbnQgc28gd2UgY2FuIHVzZSBpdCB0byBidWlsZCBTUUwgc3RhdGVtZW50c1xuICAgIHRoaXMucGdkYiA9IG5ldyBQb3N0Z3Jlcyh7fSk7XG5cbiAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuXG4gICAgYXdhaXQgdGhpcy5tYXliZUluaXRpYWxpemUoKTtcbiAgfVxuXG4gIGFzeW5jIGRlYWN0aXZhdGUoKSB7XG4gICAgaWYgKHRoaXMucG9vbCkge1xuICAgICAgYXdhaXQgdGhpcy5wb29sLmVuZCgpO1xuICAgIH1cbiAgfVxuXG4gIHJ1biA9IChzcWwpID0+IHtcbiAgICBzcWwgPSBzcWwucmVwbGFjZSgvXFwwL2csICcnKTtcblxuICAgIGlmIChmdWxjcnVtLmFyZ3MuZGVidWcpIHtcbiAgICAgIGxvZyhzcWwpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnBvb2wucXVlcnkoc3FsLCBbXSwgKGVyciwgcmVzKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzb2x2ZShyZXMucm93cyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGxvZyA9ICguLi5hcmdzKSA9PiB7XG4gICAgLy8gY29uc29sZS5sb2coLi4uYXJncyk7XG4gIH1cblxuICB0YWJsZU5hbWUgPSAoYWNjb3VudCwgbmFtZSkgPT4ge1xuICAgIGlmICh0aGlzLnVzZUFjY291bnRQcmVmaXgpIHtcbiAgICAgIHJldHVybiAnYWNjb3VudF8nICsgYWNjb3VudC5yb3dJRCArICdfJyArIG5hbWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5hbWU7XG4gIH1cblxuICBvblN5bmNTdGFydCA9IGFzeW5jICh7YWNjb3VudCwgdGFza3N9KSA9PiB7XG4gICAgYXdhaXQgdGhpcy5pbnZva2VCZWZvcmVGdW5jdGlvbigpO1xuICB9XG5cbiAgb25TeW5jRmluaXNoID0gYXN5bmMgKHthY2NvdW50fSkgPT4ge1xuICAgIGF3YWl0IHRoaXMuY2xlYW51cEZyaWVuZGx5Vmlld3MoYWNjb3VudCk7XG4gICAgYXdhaXQgdGhpcy5pbnZva2VBZnRlckZ1bmN0aW9uKCk7XG4gIH1cblxuICBvbkZvcm1TYXZlID0gYXN5bmMgKHtmb3JtLCBhY2NvdW50LCBvbGRGb3JtLCBuZXdGb3JtfSkgPT4ge1xuICAgIGF3YWl0IHRoaXMudXBkYXRlRm9ybShmb3JtLCBhY2NvdW50LCBvbGRGb3JtLCBuZXdGb3JtKTtcbiAgfVxuXG4gIG9uRm9ybURlbGV0ZSA9IGFzeW5jICh7Zm9ybSwgYWNjb3VudH0pID0+IHtcbiAgICBjb25zdCBvbGRGb3JtID0ge1xuICAgICAgaWQ6IGZvcm0uX2lkLFxuICAgICAgcm93X2lkOiBmb3JtLnJvd0lELFxuICAgICAgbmFtZTogZm9ybS5fbmFtZSxcbiAgICAgIGVsZW1lbnRzOiBmb3JtLl9lbGVtZW50c0pTT05cbiAgICB9O1xuXG4gICAgYXdhaXQgdGhpcy51cGRhdGVGb3JtKGZvcm0sIGFjY291bnQsIG9sZEZvcm0sIG51bGwpO1xuICB9XG5cbiAgb25SZWNvcmRTYXZlID0gYXN5bmMgKHtyZWNvcmQsIGFjY291bnR9KSA9PiB7XG4gICAgYXdhaXQgdGhpcy51cGRhdGVSZWNvcmQocmVjb3JkLCBhY2NvdW50KTtcbiAgfVxuXG4gIG9uUmVjb3JkRGVsZXRlID0gYXN5bmMgKHtyZWNvcmR9KSA9PiB7XG4gICAgY29uc3Qgc3RhdGVtZW50cyA9IFBvc3RncmVzUmVjb3JkVmFsdWVzLmRlbGV0ZUZvclJlY29yZFN0YXRlbWVudHModGhpcy5wZ2RiLCByZWNvcmQsIHJlY29yZC5mb3JtLCB0aGlzLnJlY29yZFZhbHVlT3B0aW9ucyk7XG5cbiAgICBhd2FpdCB0aGlzLnJ1bihzdGF0ZW1lbnRzLm1hcChvID0+IG8uc3FsKS5qb2luKCdcXG4nKSk7XG4gIH1cblxuICBvblBob3RvU2F2ZSA9IGFzeW5jICh7cGhvdG8sIGFjY291bnR9KSA9PiB7XG4gICAgYXdhaXQgdGhpcy51cGRhdGVQaG90byhwaG90bywgYWNjb3VudCk7XG4gIH1cblxuICBvblZpZGVvU2F2ZSA9IGFzeW5jICh7dmlkZW8sIGFjY291bnR9KSA9PiB7XG4gICAgYXdhaXQgdGhpcy51cGRhdGVWaWRlbyh2aWRlbywgYWNjb3VudCk7XG4gIH1cblxuICBvbkF1ZGlvU2F2ZSA9IGFzeW5jICh7YXVkaW8sIGFjY291bnR9KSA9PiB7XG4gICAgYXdhaXQgdGhpcy51cGRhdGVBdWRpbyhhdWRpbywgYWNjb3VudCk7XG4gIH1cblxuICBvblNpZ25hdHVyZVNhdmUgPSBhc3luYyAoe3NpZ25hdHVyZSwgYWNjb3VudH0pID0+IHtcbiAgICBhd2FpdCB0aGlzLnVwZGF0ZVNpZ25hdHVyZShzaWduYXR1cmUsIGFjY291bnQpO1xuICB9XG5cbiAgb25DaGFuZ2VzZXRTYXZlID0gYXN5bmMgKHtjaGFuZ2VzZXQsIGFjY291bnR9KSA9PiB7XG4gICAgYXdhaXQgdGhpcy51cGRhdGVDaGFuZ2VzZXQoY2hhbmdlc2V0LCBhY2NvdW50KTtcbiAgfVxuXG4gIG9uQ2hvaWNlTGlzdFNhdmUgPSBhc3luYyAoe2Nob2ljZUxpc3QsIGFjY291bnR9KSA9PiB7XG4gICAgYXdhaXQgdGhpcy51cGRhdGVDaG9pY2VMaXN0KGNob2ljZUxpc3QsIGFjY291bnQpO1xuICB9XG5cbiAgb25DbGFzc2lmaWNhdGlvblNldFNhdmUgPSBhc3luYyAoe2NsYXNzaWZpY2F0aW9uU2V0LCBhY2NvdW50fSkgPT4ge1xuICAgIGF3YWl0IHRoaXMudXBkYXRlQ2xhc3NpZmljYXRpb25TZXQoY2xhc3NpZmljYXRpb25TZXQsIGFjY291bnQpO1xuICB9XG5cbiAgb25Qcm9qZWN0U2F2ZSA9IGFzeW5jICh7cHJvamVjdCwgYWNjb3VudH0pID0+IHtcbiAgICBhd2FpdCB0aGlzLnVwZGF0ZVByb2plY3QocHJvamVjdCwgYWNjb3VudCk7XG4gIH1cblxuICBvblJvbGVTYXZlID0gYXN5bmMgKHtyb2xlLCBhY2NvdW50fSkgPT4ge1xuICAgIGF3YWl0IHRoaXMudXBkYXRlUm9sZShyb2xlLCBhY2NvdW50KTtcbiAgfVxuXG4gIG9uTWVtYmVyc2hpcFNhdmUgPSBhc3luYyAoe21lbWJlcnNoaXAsIGFjY291bnR9KSA9PiB7XG4gICAgYXdhaXQgdGhpcy51cGRhdGVNZW1iZXJzaGlwKG1lbWJlcnNoaXAsIGFjY291bnQpO1xuICB9XG5cbiAgYXN5bmMgdXBkYXRlUGhvdG8ob2JqZWN0LCBhY2NvdW50KSB7XG4gICAgY29uc3QgdmFsdWVzID0gU2NoZW1hTWFwLnBob3RvKG9iamVjdCk7XG5cbiAgICB2YWx1ZXMuZmlsZSA9IHRoaXMuZm9ybWF0UGhvdG9VUkwodmFsdWVzLmFjY2Vzc19rZXkpO1xuXG4gICAgYXdhaXQgdGhpcy51cGRhdGVPYmplY3QodmFsdWVzLCAncGhvdG9zJyk7XG4gIH1cblxuICBhc3luYyB1cGRhdGVWaWRlbyhvYmplY3QsIGFjY291bnQpIHtcbiAgICBjb25zdCB2YWx1ZXMgPSBTY2hlbWFNYXAudmlkZW8ob2JqZWN0KTtcblxuICAgIHZhbHVlcy5maWxlID0gdGhpcy5mb3JtYXRWaWRlb1VSTCh2YWx1ZXMuYWNjZXNzX2tleSk7XG5cbiAgICBhd2FpdCB0aGlzLnVwZGF0ZU9iamVjdCh2YWx1ZXMsICd2aWRlb3MnKTtcbiAgfVxuXG4gIGFzeW5jIHVwZGF0ZUF1ZGlvKG9iamVjdCwgYWNjb3VudCkge1xuICAgIGNvbnN0IHZhbHVlcyA9IFNjaGVtYU1hcC5hdWRpbyhvYmplY3QpO1xuXG4gICAgdmFsdWVzLmZpbGUgPSB0aGlzLmZvcm1hdEF1ZGlvVVJMKHZhbHVlcy5hY2Nlc3Nfa2V5KTtcblxuICAgIGF3YWl0IHRoaXMudXBkYXRlT2JqZWN0KHZhbHVlcywgJ2F1ZGlvJyk7XG4gIH1cblxuICBhc3luYyB1cGRhdGVTaWduYXR1cmUob2JqZWN0LCBhY2NvdW50KSB7XG4gICAgY29uc3QgdmFsdWVzID0gU2NoZW1hTWFwLnNpZ25hdHVyZShvYmplY3QpO1xuXG4gICAgdmFsdWVzLmZpbGUgPSB0aGlzLmZvcm1hdFNpZ25hdHVyZVVSTCh2YWx1ZXMuYWNjZXNzX2tleSk7XG5cbiAgICBhd2FpdCB0aGlzLnVwZGF0ZU9iamVjdCh2YWx1ZXMsICdzaWduYXR1cmVzJyk7XG4gIH1cblxuICBhc3luYyB1cGRhdGVDaGFuZ2VzZXQob2JqZWN0LCBhY2NvdW50KSB7XG4gICAgYXdhaXQgdGhpcy51cGRhdGVPYmplY3QoU2NoZW1hTWFwLmNoYW5nZXNldChvYmplY3QpLCAnY2hhbmdlc2V0cycpO1xuICB9XG5cbiAgYXN5bmMgdXBkYXRlUHJvamVjdChvYmplY3QsIGFjY291bnQpIHtcbiAgICBhd2FpdCB0aGlzLnVwZGF0ZU9iamVjdChTY2hlbWFNYXAucHJvamVjdChvYmplY3QpLCAncHJvamVjdHMnKTtcbiAgfVxuXG4gIGFzeW5jIHVwZGF0ZU1lbWJlcnNoaXAob2JqZWN0LCBhY2NvdW50KSB7XG4gICAgYXdhaXQgdGhpcy51cGRhdGVPYmplY3QoU2NoZW1hTWFwLm1lbWJlcnNoaXAob2JqZWN0KSwgJ21lbWJlcnNoaXBzJyk7XG4gIH1cblxuICBhc3luYyB1cGRhdGVSb2xlKG9iamVjdCwgYWNjb3VudCkge1xuICAgIGF3YWl0IHRoaXMudXBkYXRlT2JqZWN0KFNjaGVtYU1hcC5yb2xlKG9iamVjdCksICdyb2xlcycpO1xuICB9XG5cbiAgYXN5bmMgdXBkYXRlRm9ybU9iamVjdChvYmplY3QsIGFjY291bnQpIHtcbiAgICBhd2FpdCB0aGlzLnVwZGF0ZU9iamVjdChTY2hlbWFNYXAuZm9ybShvYmplY3QpLCAnZm9ybXMnKTtcbiAgfVxuXG4gIGFzeW5jIHVwZGF0ZUNob2ljZUxpc3Qob2JqZWN0LCBhY2NvdW50KSB7XG4gICAgYXdhaXQgdGhpcy51cGRhdGVPYmplY3QoU2NoZW1hTWFwLmNob2ljZUxpc3Qob2JqZWN0KSwgJ2Nob2ljZV9saXN0cycpO1xuICB9XG5cbiAgYXN5bmMgdXBkYXRlQ2xhc3NpZmljYXRpb25TZXQob2JqZWN0LCBhY2NvdW50KSB7XG4gICAgYXdhaXQgdGhpcy51cGRhdGVPYmplY3QoU2NoZW1hTWFwLmNsYXNzaWZpY2F0aW9uU2V0KG9iamVjdCksICdjbGFzc2lmaWNhdGlvbl9zZXRzJyk7XG4gIH1cblxuXG4gIGFzeW5jIHVwZGF0ZU9iamVjdCh2YWx1ZXMsIHRhYmxlKSB7XG4gICAgY29uc3QgZGVsZXRlU3RhdGVtZW50ID0gdGhpcy5wZ2RiLmRlbGV0ZVN0YXRlbWVudChgJHsgdGhpcy5kYXRhU2NoZW1hIH0uc3lzdGVtXyR7dGFibGV9YCwge3Jvd19yZXNvdXJjZV9pZDogdmFsdWVzLnJvd19yZXNvdXJjZV9pZH0pO1xuICAgIGNvbnN0IGluc2VydFN0YXRlbWVudCA9IHRoaXMucGdkYi5pbnNlcnRTdGF0ZW1lbnQoYCR7IHRoaXMuZGF0YVNjaGVtYSB9LnN5c3RlbV8ke3RhYmxlfWAsIHZhbHVlcywge3BrOiAnaWQnfSk7XG5cbiAgICBjb25zdCBzcWwgPSBbIGRlbGV0ZVN0YXRlbWVudC5zcWwsIGluc2VydFN0YXRlbWVudC5zcWwgXS5qb2luKCdcXG4nKTtcblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCB0aGlzLnJ1bihzcWwpO1xuICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICB0aGlzLmludGVncml0eVdhcm5pbmcoZXgpO1xuICAgICAgdGhyb3cgZXg7XG4gICAgfVxuICB9XG5cbiAgcmVsb2FkVGFibGVMaXN0ID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHJvd3MgPSBhd2FpdCB0aGlzLnJ1bihgU0VMRUNUIHRhYmxlX25hbWUgQVMgbmFtZSBGUk9NIGluZm9ybWF0aW9uX3NjaGVtYS50YWJsZXMgV0hFUkUgdGFibGVfc2NoZW1hPSckeyB0aGlzLmRhdGFTY2hlbWEgfSdgKTtcblxuICAgIHRoaXMudGFibGVOYW1lcyA9IHJvd3MubWFwKG8gPT4gby5uYW1lKTtcbiAgfVxuXG4gIHJlbG9hZFZpZXdMaXN0ID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHJvd3MgPSBhd2FpdCB0aGlzLnJ1bihgU0VMRUNUIHRhYmxlX25hbWUgQVMgbmFtZSBGUk9NIGluZm9ybWF0aW9uX3NjaGVtYS50YWJsZXMgV0hFUkUgdGFibGVfc2NoZW1hPSckeyB0aGlzLnZpZXdTY2hlbWEgfSdgKTtcbiAgICB0aGlzLnZpZXdOYW1lcyA9IHJvd3MubWFwKG8gPT4gby5uYW1lKTtcbiAgfVxuXG4gIGJhc2VNZWRpYVVSTCA9ICgpID0+IHtcbiAgfVxuXG4gIGZvcm1hdFBob3RvVVJMID0gKGlkKSA9PiB7XG4gICAgcmV0dXJuIGAkeyB0aGlzLmJhc2VNZWRpYVVSTCB9L3Bob3Rvcy8keyBpZCB9LmpwZ2A7XG4gIH1cblxuICBmb3JtYXRWaWRlb1VSTCA9IChpZCkgPT4ge1xuICAgIHJldHVybiBgJHsgdGhpcy5iYXNlTWVkaWFVUkwgfS92aWRlb3MvJHsgaWQgfS5tcDRgO1xuICB9XG5cbiAgZm9ybWF0QXVkaW9VUkwgPSAoaWQpID0+IHtcbiAgICByZXR1cm4gYCR7IHRoaXMuYmFzZU1lZGlhVVJMIH0vYXVkaW8vJHsgaWQgfS5tNGFgO1xuICB9XG5cbiAgZm9ybWF0U2lnbmF0dXJlVVJMID0gKGlkKSA9PiB7XG4gICAgcmV0dXJuIGAkeyB0aGlzLmJhc2VNZWRpYVVSTCB9L3NpZ25hdHVyZXMvJHsgaWQgfS5wbmdgO1xuICB9XG5cbiAgaW50ZWdyaXR5V2FybmluZyhleCkge1xuICAgIHdhcm4oYFxuLS0tLS0tLS0tLS0tLVxuISEgV0FSTklORyAhIVxuLS0tLS0tLS0tLS0tLVxuXG5Qb3N0Z3JlU1FMIGRhdGFiYXNlIGludGVncml0eSBpc3N1ZSBlbmNvdW50ZXJlZC4gQ29tbW9uIHNvdXJjZXMgb2YgcG9zdGdyZXMgZGF0YWJhc2UgaXNzdWVzIGFyZTpcblxuKiBSZWluc3RhbGxpbmcgRnVsY3J1bSBEZXNrdG9wIGFuZCB1c2luZyBhbiBvbGQgcG9zdGdyZXMgZGF0YWJhc2Ugd2l0aG91dCByZWNyZWF0aW5nXG4gIHRoZSBwb3N0Z3JlcyBkYXRhYmFzZS5cbiogRGVsZXRpbmcgdGhlIGludGVybmFsIGFwcGxpY2F0aW9uIGRhdGFiYXNlIGFuZCB1c2luZyBhbiBleGlzdGluZyBwb3N0Z3JlcyBkYXRhYmFzZVxuKiBNYW51YWxseSBtb2RpZnlpbmcgdGhlIHBvc3RncmVzIGRhdGFiYXNlXG4qIEZvcm0gbmFtZSBhbmQgcmVwZWF0YWJsZSBkYXRhIG5hbWUgY29tYmluYXRpb25zIHRoYXQgZXhjZWVlZCB0aGUgcG9zdGdyZXMgbGltaXQgb2YgNjNcbiAgY2hhcmFjdGVycy4gSXQncyBiZXN0IHRvIGtlZXAgeW91ciBmb3JtIG5hbWVzIHdpdGhpbiB0aGUgbGltaXQuIFRoZSBcImZyaWVuZGx5IHZpZXdcIlxuICBmZWF0dXJlIG9mIHRoZSBwbHVnaW4gZGVyaXZlcyB0aGUgb2JqZWN0IG5hbWVzIGZyb20gdGhlIGZvcm0gYW5kIHJlcGVhdGFibGUgbmFtZXMuXG4qIENyZWF0aW5nIG11bHRpcGxlIGFwcHMgaW4gRnVsY3J1bSB3aXRoIHRoZSBzYW1lIG5hbWUuIFRoaXMgaXMgZ2VuZXJhbGx5IE9LLCBleGNlcHRcbiAgeW91IHdpbGwgbm90IGJlIGFibGUgdG8gdXNlIHRoZSBcImZyaWVuZGx5IHZpZXdcIiBmZWF0dXJlIG9mIHRoZSBwb3N0Z3JlcyBwbHVnaW4gc2luY2VcbiAgdGhlIHZpZXcgbmFtZXMgYXJlIGRlcml2ZWQgZnJvbSB0aGUgZm9ybSBuYW1lcy5cblxuTm90ZTogV2hlbiByZWluc3RhbGxpbmcgRnVsY3J1bSBEZXNrdG9wIG9yIFwic3RhcnRpbmcgb3ZlclwiIHlvdSBuZWVkIHRvIGRyb3AgYW5kIHJlLWNyZWF0ZVxudGhlIHBvc3RncmVzIGRhdGFiYXNlLiBUaGUgbmFtZXMgb2YgZGF0YWJhc2Ugb2JqZWN0cyBhcmUgdGllZCBkaXJlY3RseSB0byB0aGUgZGF0YWJhc2Vcbm9iamVjdHMgaW4gdGhlIGludGVybmFsIGFwcGxpY2F0aW9uIGRhdGFiYXNlLlxuXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblJlcG9ydCBpc3N1ZXMgYXQgaHR0cHM6Ly9naXRodWIuY29tL2Z1bGNydW1hcHAvZnVsY3J1bS1kZXNrdG9wL2lzc3Vlc1xuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5NZXNzYWdlOlxuJHsgZXgubWVzc2FnZSB9XG5cblN0YWNrOlxuJHsgZXguc3RhY2sgfVxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5gLnJlZFxuICAgICk7XG4gIH1cblxuICBzZXR1cE9wdGlvbnMoKSB7XG4gICAgdGhpcy5iYXNlTWVkaWFVUkwgPSBmdWxjcnVtLmFyZ3MucGdNZWRpYUJhc2VVcmwgPyBmdWxjcnVtLmFyZ3MucGdNZWRpYUJhc2VVcmwgOiAnaHR0cHM6Ly9hcGkuZnVsY3J1bWFwcC5jb20vYXBpL3YyJztcblxuICAgIHRoaXMucmVjb3JkVmFsdWVPcHRpb25zID0ge1xuICAgICAgc2NoZW1hOiB0aGlzLmRhdGFTY2hlbWEsXG5cbiAgICAgIGRpc2FibGVBcnJheXM6IHRoaXMuZGlzYWJsZUFycmF5cyxcblxuICAgICAgZXNjYXBlSWRlbnRpZmllcjogdGhpcy5lc2NhcGVJZGVudGlmaWVyLFxuXG4gICAgICAvLyBwZXJzaXN0ZW50VGFibGVOYW1lczogdGhpcy5wZXJzaXN0ZW50VGFibGVOYW1lcyxcblxuICAgICAgYWNjb3VudFByZWZpeDogdGhpcy51c2VBY2NvdW50UHJlZml4ID8gJ2FjY291bnRfJyArIHRoaXMuYWNjb3VudC5yb3dJRCA6IG51bGwsXG5cbiAgICAgIGNhbGN1bGF0ZWRGaWVsZERhdGVGb3JtYXQ6ICdkYXRlJyxcblxuICAgICAgZGlzYWJsZUNvbXBsZXhUeXBlczogdGhpcy5kaXNhYmxlQ29tcGxleFR5cGVzLFxuXG4gICAgICB2YWx1ZXNUcmFuc2Zvcm1lcjogdGhpcy5wZ0N1c3RvbU1vZHVsZSAmJiB0aGlzLnBnQ3VzdG9tTW9kdWxlLnZhbHVlc1RyYW5zZm9ybWVyLFxuXG4gICAgICBtZWRpYVVSTEZvcm1hdHRlcjogKG1lZGlhVmFsdWUpID0+IHtcblxuICAgICAgICByZXR1cm4gbWVkaWFWYWx1ZS5pdGVtcy5tYXAoKGl0ZW0pID0+IHtcbiAgICAgICAgICBpZiAobWVkaWFWYWx1ZS5lbGVtZW50LmlzUGhvdG9FbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXRQaG90b1VSTChpdGVtLm1lZGlhSUQpO1xuICAgICAgICAgIH0gZWxzZSBpZiAobWVkaWFWYWx1ZS5lbGVtZW50LmlzVmlkZW9FbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXRWaWRlb1VSTChpdGVtLm1lZGlhSUQpO1xuICAgICAgICAgIH0gZWxzZSBpZiAobWVkaWFWYWx1ZS5lbGVtZW50LmlzQXVkaW9FbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXRBdWRpb1VSTChpdGVtLm1lZGlhSUQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG5cbiAgICAgIG1lZGlhVmlld1VSTEZvcm1hdHRlcjogKG1lZGlhVmFsdWUpID0+IHtcbiAgICAgICAgY29uc3QgaWRzID0gbWVkaWFWYWx1ZS5pdGVtcy5tYXAobyA9PiBvLm1lZGlhSUQpO1xuXG4gICAgICAgIGlmIChtZWRpYVZhbHVlLmVsZW1lbnQuaXNQaG90b0VsZW1lbnQpIHtcbiAgICAgICAgICByZXR1cm4gYCR7IHRoaXMuYmFzZU1lZGlhVVJMIH0vcGhvdG9zL3ZpZXc/cGhvdG9zPSR7IGlkcyB9YDtcbiAgICAgICAgfSBlbHNlIGlmIChtZWRpYVZhbHVlLmVsZW1lbnQuaXNWaWRlb0VsZW1lbnQpIHtcbiAgICAgICAgICByZXR1cm4gYCR7IHRoaXMuYmFzZU1lZGlhVVJMIH0vdmlkZW9zL3ZpZXc/dmlkZW9zPSR7IGlkcyB9YDtcbiAgICAgICAgfSBlbHNlIGlmIChtZWRpYVZhbHVlLmVsZW1lbnQuaXNBdWRpb0VsZW1lbnQpIHtcbiAgICAgICAgICByZXR1cm4gYCR7IHRoaXMuYmFzZU1lZGlhVVJMIH0vYXVkaW8vdmlldz9hdWRpbz0keyBpZHMgfWA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKGZ1bGNydW0uYXJncy5wZ1JlcG9ydEJhc2VVcmwpIHtcbiAgICAgIHRoaXMucmVjb3JkVmFsdWVPcHRpb25zLnJlcG9ydFVSTEZvcm1hdHRlciA9IChmZWF0dXJlKSA9PiB7XG4gICAgICAgIHJldHVybiBgJHsgZnVsY3J1bS5hcmdzLnBnUmVwb3J0QmFzZVVybCB9L3JlcG9ydHMvJHsgZmVhdHVyZS5pZCB9LnBkZmA7XG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZVJlY29yZCA9IGFzeW5jIChyZWNvcmQsIGFjY291bnQsIHNraXBUYWJsZUNoZWNrKSA9PiB7XG4gICAgaWYgKCFza2lwVGFibGVDaGVjayAmJiAhdGhpcy5yb290VGFibGVFeGlzdHMocmVjb3JkLmZvcm0pKSB7XG4gICAgICBhd2FpdCB0aGlzLnJlYnVpbGRGb3JtKHJlY29yZC5mb3JtLCBhY2NvdW50LCAoKSA9PiB7fSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGdDdXN0b21Nb2R1bGUgJiYgdGhpcy5wZ0N1c3RvbU1vZHVsZS5zaG91bGRVcGRhdGVSZWNvcmQgJiYgIXRoaXMucGdDdXN0b21Nb2R1bGUuc2hvdWxkVXBkYXRlUmVjb3JkKHtyZWNvcmQsIGFjY291bnR9KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHN0YXRlbWVudHMgPSBQb3N0Z3Jlc1JlY29yZFZhbHVlcy51cGRhdGVGb3JSZWNvcmRTdGF0ZW1lbnRzKHRoaXMucGdkYiwgcmVjb3JkLCB0aGlzLnJlY29yZFZhbHVlT3B0aW9ucyk7XG5cbiAgICBhd2FpdCB0aGlzLnJ1bihzdGF0ZW1lbnRzLm1hcChvID0+IG8uc3FsKS5qb2luKCdcXG4nKSk7XG5cbiAgICBjb25zdCBzeXN0ZW1WYWx1ZXMgPSBQb3N0Z3Jlc1JlY29yZFZhbHVlcy5zeXN0ZW1Db2x1bW5WYWx1ZXNGb3JGZWF0dXJlKHJlY29yZCwgbnVsbCwgcmVjb3JkLCB7Li4udGhpcy5yZWNvcmRWYWx1ZU9wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVDb21wbGV4VHlwZXM6IGZhbHNlfSk7XG5cbiAgICBhd2FpdCB0aGlzLnVwZGF0ZU9iamVjdChTY2hlbWFNYXAucmVjb3JkKHJlY29yZCwgc3lzdGVtVmFsdWVzKSwgJ3JlY29yZHMnKTtcbiAgfVxuXG4gIHJvb3RUYWJsZUV4aXN0cyA9IChmb3JtKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMudGFibGVOYW1lcy5pbmRleE9mKFBvc3RncmVzUmVjb3JkVmFsdWVzLnRhYmxlTmFtZVdpdGhGb3JtKGZvcm0sIG51bGwsIHRoaXMucmVjb3JkVmFsdWVPcHRpb25zKSkgIT09IC0xO1xuICB9XG5cbiAgcmVjcmVhdGVGb3JtVGFibGVzID0gYXN5bmMgKGZvcm0sIGFjY291bnQpID0+IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy51cGRhdGVGb3JtKGZvcm0sIGFjY291bnQsIHRoaXMuZm9ybVZlcnNpb24oZm9ybSksIG51bGwpO1xuICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICBpZiAoZnVsY3J1bS5hcmdzLmRlYnVnKSB7XG4gICAgICAgIGVycm9yKGV4KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLnVwZGF0ZUZvcm0oZm9ybSwgYWNjb3VudCwgbnVsbCwgdGhpcy5mb3JtVmVyc2lvbihmb3JtKSk7XG4gIH1cblxuICB1cGRhdGVGb3JtID0gYXN5bmMgKGZvcm0sIGFjY291bnQsIG9sZEZvcm0sIG5ld0Zvcm0pID0+IHtcbiAgICBpZiAodGhpcy5wZ0N1c3RvbU1vZHVsZSAmJiB0aGlzLnBnQ3VzdG9tTW9kdWxlLnNob3VsZFVwZGF0ZUZvcm0gJiYgIXRoaXMucGdDdXN0b21Nb2R1bGUuc2hvdWxkVXBkYXRlRm9ybSh7Zm9ybSwgYWNjb3VudH0pKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMudXBkYXRlRm9ybU9iamVjdChmb3JtLCBhY2NvdW50KTtcblxuICAgICAgaWYgKCF0aGlzLnJvb3RUYWJsZUV4aXN0cyhmb3JtKSAmJiBuZXdGb3JtICE9IG51bGwpIHtcbiAgICAgICAgb2xkRm9ybSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgIGRpc2FibGVBcnJheXM6IHRoaXMuZGlzYWJsZUFycmF5cyxcbiAgICAgICAgZGlzYWJsZUNvbXBsZXhUeXBlczogdGhpcy5kaXNhYmxlQ29tcGxleFR5cGVzLFxuICAgICAgICB1c2VyTW9kdWxlOiB0aGlzLnBnQ3VzdG9tTW9kdWxlLFxuICAgICAgICB0YWJsZVNjaGVtYTogdGhpcy5kYXRhU2NoZW1hLFxuICAgICAgICBjYWxjdWxhdGVkRmllbGREYXRlRm9ybWF0OiAnZGF0ZScsXG4gICAgICAgIG1ldGFkYXRhOiB0cnVlLFxuICAgICAgICB1c2VSZXNvdXJjZUlEOiBmYWxzZSxcbiAgICAgICAgYWNjb3VudFByZWZpeDogdGhpcy51c2VBY2NvdW50UHJlZml4ID8gJ2FjY291bnRfJyArIHRoaXMuYWNjb3VudC5yb3dJRCA6IG51bGxcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHtzdGF0ZW1lbnRzfSA9IGF3YWl0IFBvc3RncmVzU2NoZW1hLmdlbmVyYXRlU2NoZW1hU3RhdGVtZW50cyhhY2NvdW50LCBvbGRGb3JtLCBuZXdGb3JtLCBvcHRpb25zKTtcblxuICAgICAgYXdhaXQgdGhpcy5kcm9wRnJpZW5kbHlWaWV3KGZvcm0sIG51bGwpO1xuXG4gICAgICBmb3IgKGNvbnN0IHJlcGVhdGFibGUgb2YgZm9ybS5lbGVtZW50c09mVHlwZSgnUmVwZWF0YWJsZScpKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuZHJvcEZyaWVuZGx5Vmlldyhmb3JtLCByZXBlYXRhYmxlKTtcbiAgICAgIH1cblxuICAgICAgYXdhaXQgdGhpcy5ydW4oWydCRUdJTiBUUkFOU0FDVElPTjsnLFxuICAgICAgICAgICAgICAgICAgICAgIC4uLnN0YXRlbWVudHMsXG4gICAgICAgICAgICAgICAgICAgICAgJ0NPTU1JVCBUUkFOU0FDVElPTjsnXS5qb2luKCdcXG4nKSk7XG5cbiAgICAgIGlmIChuZXdGb3JtKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuY3JlYXRlRnJpZW5kbHlWaWV3KGZvcm0sIG51bGwpO1xuXG4gICAgICAgIGZvciAoY29uc3QgcmVwZWF0YWJsZSBvZiBmb3JtLmVsZW1lbnRzT2ZUeXBlKCdSZXBlYXRhYmxlJykpIHtcbiAgICAgICAgICBhd2FpdCB0aGlzLmNyZWF0ZUZyaWVuZGx5Vmlldyhmb3JtLCByZXBlYXRhYmxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICB0aGlzLmludGVncml0eVdhcm5pbmcoZXgpO1xuICAgICAgdGhyb3cgZXg7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZHJvcEZyaWVuZGx5Vmlldyhmb3JtLCByZXBlYXRhYmxlKSB7XG4gICAgY29uc3Qgdmlld05hbWUgPSB0aGlzLmdldEZyaWVuZGx5VGFibGVOYW1lKGZvcm0sIHJlcGVhdGFibGUpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMucnVuKGZvcm1hdCgnRFJPUCBWSUVXIElGIEVYSVNUUyAlcy4lcyBDQVNDQURFOycsIHRoaXMuZXNjYXBlSWRlbnRpZmllcih0aGlzLnZpZXdTY2hlbWEpLCB0aGlzLmVzY2FwZUlkZW50aWZpZXIodmlld05hbWUpKSk7XG4gICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgIHRoaXMuaW50ZWdyaXR5V2FybmluZyhleCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgY3JlYXRlRnJpZW5kbHlWaWV3KGZvcm0sIHJlcGVhdGFibGUpIHtcbiAgICBjb25zdCB2aWV3TmFtZSA9IHRoaXMuZ2V0RnJpZW5kbHlUYWJsZU5hbWUoZm9ybSwgcmVwZWF0YWJsZSk7XG5cbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5ydW4oZm9ybWF0KCdDUkVBVEUgVklFVyAlcy4lcyBBUyBTRUxFQ1QgKiBGUk9NICVzOycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lc2NhcGVJZGVudGlmaWVyKHRoaXMudmlld1NjaGVtYSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lc2NhcGVJZGVudGlmaWVyKHZpZXdOYW1lKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQb3N0Z3Jlc1JlY29yZFZhbHVlcy50YWJsZU5hbWVXaXRoRm9ybUFuZFNjaGVtYShmb3JtLCByZXBlYXRhYmxlLCB0aGlzLnJlY29yZFZhbHVlT3B0aW9ucywgJ192aWV3X2Z1bGwnKSkpO1xuICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAvLyBzb21ldGltZXMgaXQgZG9lc24ndCBleGlzdFxuICAgICAgdGhpcy5pbnRlZ3JpdHlXYXJuaW5nKGV4KTtcbiAgICB9XG4gIH1cblxuICBnZXRGcmllbmRseVRhYmxlTmFtZShmb3JtLCByZXBlYXRhYmxlKSB7XG4gICAgbGV0IG5hbWUgPSBjb21wYWN0KFtmb3JtLm5hbWUsIHJlcGVhdGFibGUgJiYgcmVwZWF0YWJsZS5kYXRhTmFtZV0pLmpvaW4oJyAtICcpXG5cbiAgICBpZiAodGhpcy51c2VVbmlxdWVWaWV3cykge1xuICAgICAgY29uc3QgZm9ybUlEID0gdGhpcy5wZXJzaXN0ZW50VGFibGVOYW1lcyA/IGZvcm0uaWQgOiBmb3JtLnJvd0lEO1xuXG4gICAgICBjb25zdCBwcmVmaXggPSBjb21wYWN0KFsndmlldycsIGZvcm1JRCwgcmVwZWF0YWJsZSAmJiByZXBlYXRhYmxlLmtleV0pLmpvaW4oJyAtICcpO1xuXG4gICAgICBuYW1lID0gW3ByZWZpeCwgbmFtZV0uam9pbignIC0gJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMudHJpbUlkZW50aWZpZXIoZnVsY3J1bS5hcmdzLnBnVW5kZXJzY29yZU5hbWVzICE9PSBmYWxzZSA/IHNuYWtlKG5hbWUpIDogbmFtZSk7XG4gIH1cblxuICBhc3luYyBpbnZva2VCZWZvcmVGdW5jdGlvbigpIHtcbiAgICBpZiAoZnVsY3J1bS5hcmdzLnBnQmVmb3JlRnVuY3Rpb24pIHtcbiAgICAgIGF3YWl0IHRoaXMucnVuKGZvcm1hdCgnU0VMRUNUICVzKCk7JywgZnVsY3J1bS5hcmdzLnBnQmVmb3JlRnVuY3Rpb24pKTtcbiAgICB9XG4gICAgaWYgKHRoaXMucGdDdXN0b21Nb2R1bGUgJiYgdGhpcy5wZ0N1c3RvbU1vZHVsZS5iZWZvcmVTeW5jKSB7XG4gICAgICBhd2FpdCB0aGlzLnBnQ3VzdG9tTW9kdWxlLmJlZm9yZVN5bmMoKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBpbnZva2VBZnRlckZ1bmN0aW9uKCkge1xuICAgIGlmIChmdWxjcnVtLmFyZ3MucGdBZnRlckZ1bmN0aW9uKSB7XG4gICAgICBhd2FpdCB0aGlzLnJ1bihmb3JtYXQoJ1NFTEVDVCAlcygpOycsIGZ1bGNydW0uYXJncy5wZ0FmdGVyRnVuY3Rpb24pKTtcbiAgICB9XG4gICAgaWYgKHRoaXMucGdDdXN0b21Nb2R1bGUgJiYgdGhpcy5wZ0N1c3RvbU1vZHVsZS5hZnRlclN5bmMpIHtcbiAgICAgIGF3YWl0IHRoaXMucGdDdXN0b21Nb2R1bGUuYWZ0ZXJTeW5jKCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgcmVidWlsZEZvcm0oZm9ybSwgYWNjb3VudCwgcHJvZ3Jlc3MpIHtcbiAgICBhd2FpdCB0aGlzLnJlY3JlYXRlRm9ybVRhYmxlcyhmb3JtLCBhY2NvdW50KTtcbiAgICBhd2FpdCB0aGlzLnJlbG9hZFRhYmxlTGlzdCgpO1xuXG4gICAgbGV0IGluZGV4ID0gMDtcblxuICAgIGF3YWl0IGZvcm0uZmluZEVhY2hSZWNvcmQoe30sIGFzeW5jIChyZWNvcmQpID0+IHtcbiAgICAgIHJlY29yZC5mb3JtID0gZm9ybTtcblxuICAgICAgaWYgKCsraW5kZXggJSAxMCA9PT0gMCkge1xuICAgICAgICBwcm9ncmVzcyhpbmRleCk7XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IHRoaXMudXBkYXRlUmVjb3JkKHJlY29yZCwgYWNjb3VudCwgdHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBwcm9ncmVzcyhpbmRleCk7XG4gIH1cblxuICBhc3luYyBjbGVhbnVwRnJpZW5kbHlWaWV3cyhhY2NvdW50KSB7XG4gICAgYXdhaXQgdGhpcy5yZWxvYWRWaWV3TGlzdCgpO1xuXG4gICAgY29uc3QgYWN0aXZlVmlld05hbWVzID0gW107XG5cbiAgICBjb25zdCBmb3JtcyA9IGF3YWl0IGFjY291bnQuZmluZEFjdGl2ZUZvcm1zKHt9KTtcblxuICAgIGZvciAoY29uc3QgZm9ybSBvZiBmb3Jtcykge1xuICAgICAgYWN0aXZlVmlld05hbWVzLnB1c2godGhpcy5nZXRGcmllbmRseVRhYmxlTmFtZShmb3JtLCBudWxsKSk7XG5cbiAgICAgIGZvciAoY29uc3QgcmVwZWF0YWJsZSBvZiBmb3JtLmVsZW1lbnRzT2ZUeXBlKCdSZXBlYXRhYmxlJykpIHtcbiAgICAgICAgYWN0aXZlVmlld05hbWVzLnB1c2godGhpcy5nZXRGcmllbmRseVRhYmxlTmFtZShmb3JtLCByZXBlYXRhYmxlKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcmVtb3ZlID0gZGlmZmVyZW5jZSh0aGlzLnZpZXdOYW1lcywgYWN0aXZlVmlld05hbWVzKTtcblxuICAgIGZvciAoY29uc3Qgdmlld05hbWUgb2YgcmVtb3ZlKSB7XG4gICAgICBpZiAodmlld05hbWUuaW5kZXhPZigndmlld18nKSA9PT0gMCB8fCB2aWV3TmFtZS5pbmRleE9mKCd2aWV3IC0gJykgPT09IDApIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhd2FpdCB0aGlzLnJ1bihmb3JtYXQoJ0RST1AgVklFVyBJRiBFWElTVFMgJXMuJXM7JywgdGhpcy5lc2NhcGVJZGVudGlmaWVyKHRoaXMudmlld1NjaGVtYSksIHRoaXMuZXNjYXBlSWRlbnRpZmllcih2aWV3TmFtZSkpKTtcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICB0aGlzLmludGVncml0eVdhcm5pbmcoZXgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgcmVidWlsZEZyaWVuZGx5Vmlld3MoZm9ybSwgYWNjb3VudCkge1xuICAgIGF3YWl0IHRoaXMuZHJvcEZyaWVuZGx5Vmlldyhmb3JtLCBudWxsKTtcblxuICAgIGZvciAoY29uc3QgcmVwZWF0YWJsZSBvZiBmb3JtLmVsZW1lbnRzT2ZUeXBlKCdSZXBlYXRhYmxlJykpIHtcbiAgICAgIGF3YWl0IHRoaXMuZHJvcEZyaWVuZGx5Vmlldyhmb3JtLCByZXBlYXRhYmxlKTtcbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLmNyZWF0ZUZyaWVuZGx5Vmlldyhmb3JtLCBudWxsKTtcblxuICAgIGZvciAoY29uc3QgcmVwZWF0YWJsZSBvZiBmb3JtLmVsZW1lbnRzT2ZUeXBlKCdSZXBlYXRhYmxlJykpIHtcbiAgICAgIGF3YWl0IHRoaXMuY3JlYXRlRnJpZW5kbHlWaWV3KGZvcm0sIHJlcGVhdGFibGUpO1xuICAgIH1cbiAgfVxuXG4gIGZvcm1WZXJzaW9uID0gKGZvcm0pID0+IHtcbiAgICBpZiAoZm9ybSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IGZvcm0uX2lkLFxuICAgICAgcm93X2lkOiBmb3JtLnJvd0lELFxuICAgICAgbmFtZTogZm9ybS5fbmFtZSxcbiAgICAgIGVsZW1lbnRzOiBmb3JtLl9lbGVtZW50c0pTT05cbiAgICB9O1xuICB9XG5cbiAgdXBkYXRlU3RhdHVzID0gKG1lc3NhZ2UpID0+IHtcbiAgICBpZiAocHJvY2Vzcy5zdGRvdXQuaXNUVFkpIHtcbiAgICAgIHByb2Nlc3Muc3Rkb3V0LmNsZWFyTGluZSgpO1xuICAgICAgcHJvY2Vzcy5zdGRvdXQuY3Vyc29yVG8oMCk7XG4gICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShtZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBkcm9wU3lzdGVtVGFibGVzKCkge1xuICAgIGF3YWl0IHRoaXMucnVuKHRoaXMucHJlcGFyZU1pZ3JhdGlvblNjcmlwdCh0ZW1wbGF0ZURyb3ApKTtcbiAgfVxuXG4gIGFzeW5jIHNldHVwRGF0YWJhc2UoKSB7XG4gICAgYXdhaXQgdGhpcy5ydW4odGhpcy5wcmVwYXJlTWlncmF0aW9uU2NyaXB0KHZlcnNpb24wMDEpKTtcbiAgfVxuXG4gIHByZXBhcmVNaWdyYXRpb25TY3JpcHQoc3FsKSB7XG4gICAgcmV0dXJuIHNxbC5yZXBsYWNlKC9fX1NDSEVNQV9fL2csIHRoaXMuZGF0YVNjaGVtYSlcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL19fVklFV19TQ0hFTUFfXy9nLCB0aGlzLnZpZXdTY2hlbWEpO1xuICB9XG5cbiAgYXN5bmMgc2V0dXBTeXN0ZW1UYWJsZXMoYWNjb3VudCkge1xuICAgIGNvbnN0IHByb2dyZXNzID0gKG5hbWUsIGluZGV4KSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVN0YXR1cyhuYW1lLmdyZWVuICsgJyA6ICcgKyBpbmRleC50b1N0cmluZygpLnJlZCk7XG4gICAgfTtcblxuICAgIGF3YWl0IGFjY291bnQuZmluZEVhY2hQaG90byh7fSwgYXN5bmMgKHBob3RvLCB7aW5kZXh9KSA9PiB7XG4gICAgICBpZiAoKytpbmRleCAlIDEwID09PSAwKSB7XG4gICAgICAgIHByb2dyZXNzKCdQaG90b3MnLCBpbmRleCk7XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IHRoaXMudXBkYXRlUGhvdG8ocGhvdG8sIGFjY291bnQpO1xuICAgIH0pO1xuXG4gICAgYXdhaXQgYWNjb3VudC5maW5kRWFjaFZpZGVvKHt9LCBhc3luYyAodmlkZW8sIHtpbmRleH0pID0+IHtcbiAgICAgIGlmICgrK2luZGV4ICUgMTAgPT09IDApIHtcbiAgICAgICAgcHJvZ3Jlc3MoJ1ZpZGVvcycsIGluZGV4KTtcbiAgICAgIH1cblxuICAgICAgYXdhaXQgdGhpcy51cGRhdGVWaWRlbyh2aWRlbywgYWNjb3VudCk7XG4gICAgfSk7XG5cbiAgICBhd2FpdCBhY2NvdW50LmZpbmRFYWNoQXVkaW8oe30sIGFzeW5jIChhdWRpbywge2luZGV4fSkgPT4ge1xuICAgICAgaWYgKCsraW5kZXggJSAxMCA9PT0gMCkge1xuICAgICAgICBwcm9ncmVzcygnQXVkaW8nLCBpbmRleCk7XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IHRoaXMudXBkYXRlQXVkaW8oYXVkaW8sIGFjY291bnQpO1xuICAgIH0pO1xuXG4gICAgYXdhaXQgYWNjb3VudC5maW5kRWFjaFNpZ25hdHVyZSh7fSwgYXN5bmMgKHNpZ25hdHVyZSwge2luZGV4fSkgPT4ge1xuICAgICAgaWYgKCsraW5kZXggJSAxMCA9PT0gMCkge1xuICAgICAgICBwcm9ncmVzcygnU2lnbmF0dXJlcycsIGluZGV4KTtcbiAgICAgIH1cblxuICAgICAgYXdhaXQgdGhpcy51cGRhdGVTaWduYXR1cmUoc2lnbmF0dXJlLCBhY2NvdW50KTtcbiAgICB9KTtcblxuICAgIGF3YWl0IGFjY291bnQuZmluZEVhY2hDaGFuZ2VzZXQoe30sIGFzeW5jIChjaGFuZ2VzZXQsIHtpbmRleH0pID0+IHtcbiAgICAgIGlmICgrK2luZGV4ICUgMTAgPT09IDApIHtcbiAgICAgICAgcHJvZ3Jlc3MoJ0NoYW5nZXNldHMnLCBpbmRleCk7XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IHRoaXMudXBkYXRlQ2hhbmdlc2V0KGNoYW5nZXNldCwgYWNjb3VudCk7XG4gICAgfSk7XG5cbiAgICBhd2FpdCBhY2NvdW50LmZpbmRFYWNoUm9sZSh7fSwgYXN5bmMgKG9iamVjdCwge2luZGV4fSkgPT4ge1xuICAgICAgaWYgKCsraW5kZXggJSAxMCA9PT0gMCkge1xuICAgICAgICBwcm9ncmVzcygnUm9sZXMnLCBpbmRleCk7XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IHRoaXMudXBkYXRlUm9sZShvYmplY3QsIGFjY291bnQpO1xuICAgIH0pO1xuXG4gICAgYXdhaXQgYWNjb3VudC5maW5kRWFjaFByb2plY3Qoe30sIGFzeW5jIChvYmplY3QsIHtpbmRleH0pID0+IHtcbiAgICAgIGlmICgrK2luZGV4ICUgMTAgPT09IDApIHtcbiAgICAgICAgcHJvZ3Jlc3MoJ1Byb2plY3RzJywgaW5kZXgpO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCB0aGlzLnVwZGF0ZVByb2plY3Qob2JqZWN0LCBhY2NvdW50KTtcbiAgICB9KTtcblxuICAgIGF3YWl0IGFjY291bnQuZmluZEVhY2hGb3JtKHt9LCBhc3luYyAob2JqZWN0LCB7aW5kZXh9KSA9PiB7XG4gICAgICBpZiAoKytpbmRleCAlIDEwID09PSAwKSB7XG4gICAgICAgIHByb2dyZXNzKCdGb3JtcycsIGluZGV4KTtcbiAgICAgIH1cblxuICAgICAgYXdhaXQgdGhpcy51cGRhdGVGb3JtT2JqZWN0KG9iamVjdCwgYWNjb3VudCk7XG4gICAgfSk7XG5cbiAgICBhd2FpdCBhY2NvdW50LmZpbmRFYWNoTWVtYmVyc2hpcCh7fSwgYXN5bmMgKG9iamVjdCwge2luZGV4fSkgPT4ge1xuICAgICAgaWYgKCsraW5kZXggJSAxMCA9PT0gMCkge1xuICAgICAgICBwcm9ncmVzcygnTWVtYmVyc2hpcHMnLCBpbmRleCk7XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IHRoaXMudXBkYXRlTWVtYmVyc2hpcChvYmplY3QsIGFjY291bnQpO1xuICAgIH0pO1xuXG4gICAgYXdhaXQgYWNjb3VudC5maW5kRWFjaENob2ljZUxpc3Qoe30sIGFzeW5jIChvYmplY3QsIHtpbmRleH0pID0+IHtcbiAgICAgIGlmICgrK2luZGV4ICUgMTAgPT09IDApIHtcbiAgICAgICAgcHJvZ3Jlc3MoJ0Nob2ljZSBMaXN0cycsIGluZGV4KTtcbiAgICAgIH1cblxuICAgICAgYXdhaXQgdGhpcy51cGRhdGVDaG9pY2VMaXN0KG9iamVjdCwgYWNjb3VudCk7XG4gICAgfSk7XG5cbiAgICBhd2FpdCBhY2NvdW50LmZpbmRFYWNoQ2xhc3NpZmljYXRpb25TZXQoe30sIGFzeW5jIChvYmplY3QsIHtpbmRleH0pID0+IHtcbiAgICAgIGlmICgrK2luZGV4ICUgMTAgPT09IDApIHtcbiAgICAgICAgcHJvZ3Jlc3MoJ0NsYXNzaWZpY2F0aW9uIFNldHMnLCBpbmRleCk7XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IHRoaXMudXBkYXRlQ2xhc3NpZmljYXRpb25TZXQob2JqZWN0LCBhY2NvdW50KTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIG1heWJlSW5pdGlhbGl6ZSgpIHtcbiAgICBjb25zdCBhY2NvdW50ID0gYXdhaXQgZnVsY3J1bS5mZXRjaEFjY291bnQoZnVsY3J1bS5hcmdzLm9yZyk7XG5cbiAgICBpZiAodGhpcy50YWJsZU5hbWVzLmluZGV4T2YoJ21pZ3JhdGlvbnMnKSA9PT0gLTEpIHtcbiAgICAgIGxvZygnSW5pdGl0YWxpemluZyBkYXRhYmFzZS4uLicpO1xuXG4gICAgICBhd2FpdCB0aGlzLnNldHVwRGF0YWJhc2UoKTtcbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLm1heWJlUnVuTWlncmF0aW9ucyhhY2NvdW50KTtcbiAgfVxuXG4gIGFzeW5jIG1heWJlUnVuTWlncmF0aW9ucyhhY2NvdW50KSB7XG4gICAgdGhpcy5taWdyYXRpb25zID0gKGF3YWl0IHRoaXMucnVuKGBTRUxFQ1QgbmFtZSBGUk9NICR7IHRoaXMuZGF0YVNjaGVtYSB9Lm1pZ3JhdGlvbnNgKSkubWFwKG8gPT4gby5uYW1lKTtcblxuICAgIGxldCBwb3B1bGF0ZVJlY29yZHMgPSBmYWxzZTtcblxuICAgIGZvciAobGV0IGNvdW50ID0gMjsgY291bnQgPD0gQ1VSUkVOVF9WRVJTSU9OOyArK2NvdW50KSB7XG4gICAgICBjb25zdCB2ZXJzaW9uID0gcGFkU3RhcnQoY291bnQsIDMsICcwJyk7XG5cbiAgICAgIGNvbnN0IG5lZWRzTWlncmF0aW9uID0gdGhpcy5taWdyYXRpb25zLmluZGV4T2YodmVyc2lvbikgPT09IC0xICYmIE1JR1JBVElPTlNbdmVyc2lvbl07XG5cbiAgICAgIGlmIChuZWVkc01pZ3JhdGlvbikge1xuICAgICAgICBhd2FpdCB0aGlzLnJ1bih0aGlzLnByZXBhcmVNaWdyYXRpb25TY3JpcHQoTUlHUkFUSU9OU1t2ZXJzaW9uXSkpO1xuXG4gICAgICAgIGlmICh2ZXJzaW9uID09PSAnMDAyJykge1xuICAgICAgICAgIGxvZygnUG9wdWxhdGluZyBzeXN0ZW0gdGFibGVzLi4uJyk7XG4gICAgICAgICAgYXdhaXQgdGhpcy5zZXR1cFN5c3RlbVRhYmxlcyhhY2NvdW50KTtcbiAgICAgICAgICBwb3B1bGF0ZVJlY29yZHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHZlcnNpb24gPT09ICcwMDUnKSB7XG4gICAgICAgICAgbG9nKCdNaWdyYXRpbmcgZGF0ZSBjYWxjdWxhdGlvbiBmaWVsZHMuLi4nKTtcbiAgICAgICAgICBhd2FpdCB0aGlzLm1pZ3JhdGVDYWxjdWxhdGVkRmllbGRzRGF0ZUZvcm1hdChhY2NvdW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3B1bGF0ZVJlY29yZHMpIHtcbiAgICAgIGF3YWl0IHRoaXMucG9wdWxhdGVSZWNvcmRzKGFjY291bnQpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHBvcHVsYXRlUmVjb3JkcyhhY2NvdW50KSB7XG4gICAgY29uc3QgZm9ybXMgPSBhd2FpdCBhY2NvdW50LmZpbmRBY3RpdmVGb3Jtcyh7fSk7XG5cbiAgICBsZXQgaW5kZXggPSAwO1xuXG4gICAgZm9yIChjb25zdCBmb3JtIG9mIGZvcm1zKSB7XG4gICAgICBpbmRleCA9IDA7XG5cbiAgICAgIGF3YWl0IGZvcm0uZmluZEVhY2hSZWNvcmQoe30sIGFzeW5jIChyZWNvcmQpID0+IHtcbiAgICAgICAgcmVjb3JkLmZvcm0gPSBmb3JtO1xuXG4gICAgICAgIGlmICgrK2luZGV4ICUgMTAgPT09IDApIHtcbiAgICAgICAgICB0aGlzLnByb2dyZXNzKGZvcm0ubmFtZSwgaW5kZXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgdGhpcy51cGRhdGVSZWNvcmQocmVjb3JkLCBhY2NvdW50LCBmYWxzZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBtaWdyYXRlQ2FsY3VsYXRlZEZpZWxkc0RhdGVGb3JtYXQoYWNjb3VudCkge1xuICAgIGNvbnN0IGZvcm1zID0gYXdhaXQgYWNjb3VudC5maW5kQWN0aXZlRm9ybXMoe30pO1xuXG4gICAgZm9yIChjb25zdCBmb3JtIG9mIGZvcm1zKSB7XG4gICAgICBjb25zdCBmaWVsZHMgPSBmb3JtLmVsZW1lbnRzT2ZUeXBlKCdDYWxjdWxhdGVkRmllbGQnKS5maWx0ZXIoZWxlbWVudCA9PiBlbGVtZW50LmRpc3BsYXkuaXNEYXRlKTtcblxuICAgICAgaWYgKGZpZWxkcy5sZW5ndGgpIHtcbiAgICAgICAgbG9nKCdNaWdyYXRpbmcgZGF0ZSBjYWxjdWxhdGlvbiBmaWVsZHMgaW4gZm9ybS4uLicsIGZvcm0ubmFtZSk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5yZWJ1aWxkRm9ybShmb3JtLCBhY2NvdW50LCAoKSA9PiB7fSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJvZ3Jlc3MgPSAobmFtZSwgaW5kZXgpID0+IHtcbiAgICB0aGlzLnVwZGF0ZVN0YXR1cyhuYW1lLmdyZWVuICsgJyA6ICcgKyBpbmRleC50b1N0cmluZygpLnJlZCk7XG4gIH1cbn1cbiJdfQ==