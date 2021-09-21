import glob from 'glob';
import path from 'path';
import mkdirp from 'mkdirp';
import os from 'os';
import database from './db/database';
import api from './api';
import Environment from './environment';
import Account from './models/account';
import LocalDatabaseDataSource from './local-database-data-source';
import { DataSource } from 'fulcrum-core';
import paths from './application-paths';
import pluginLogger from './plugin-logger';
import Logger from './logger';
import * as postgres from './plugins/postgres/plugin-postgres-module';
import * as mssql from './plugins/mssql/plugin-mssql-module';
import * as media from './plugins/media/plugin-media-module';
import * as reports from './plugins/reports/plugin-reports-module'

const yargs = require('yargs')(process.argv.slice(3));

let app = null;

class App {
  static get instance() {
    return app;
  }

  constructor() {
    this._plugins = [];
    this._pluginsByName = [];
    this._listeners = {};
    this._api = api;

    const pathOverride = this.args.homePath;
    const rootPath = this.args.osPaths ? paths.userData : path.resolve(path.join(__dirname, '..'));

    this._appPath = pathOverride || rootPath;
    this._homePath = pathOverride || path.join(os.homedir(), '.fulcrum');
    this._dataPath = this.args.dataPath || this.appPath('data');
    this._logPath = this.args.logPath || this.appPath('log');
    this._pluginPath = path.join(__dirname, 'plugins');

    mkdirp.sync(this._appPath);
    mkdirp.sync(this._homePath);
    mkdirp.sync(this._dataPath);
    mkdirp.sync(this._logPath);
    mkdirp.sync(this._pluginPath);

    this.logger = new Logger(this._logPath);

    this._environment = new Environment({app: this});
  }

  get pluginsByName() {
    return this._pluginsByName;
  }

  get environment() {
    return this._environment;
  }

  get api() {
    return this._api;
  }

  get yargs() {
    if (!this._yargs) {
      this._yargs = yargs.env('FULCRUM');
    }
    return this._yargs;
  }

  get args() {
    return this.yargs.argv;
  }

  appPath(name) {
    return path.join(this._appPath, name);
  }

  appDir(name) {
    return this.appPath(name);
  }

  path(name) {
    return path.join(this._homePath, name);
  }

  dir(name) {
    return this.path(name);
  }

  mkdirp(name) {
    mkdirp.sync(this.path(name));
  }

  get pluginPath() {
    return this._pluginPath;
  }

  get dataPath() {
    return this._dataPath;
  }

  get databaseFilePath() {
    return path.join(this.dataPath, 'fulcrum.db');
  }

  get logPath() {
    return this._logPath;
  }

  get db() {
    return this._db;
  }

  on(name, func) {
    if (!this._listeners[name]) {
      this._listeners[name] = [];
    }

    this._listeners[name].push(func);
  }

  off(name, func) {
    if (this._listeners[name]) {
      const index = this._listeners.indexOf(func);

      if (index > -1) {
        this._listeners.splice(index, 1);
      }
    }
  }

  async emit(name, ...args) {
    if (this._listeners[name]) {
      for (const listener of this._listeners[name]) {
        await listener(...args);
      }
    }
  }

  async initialize() {
    this._db = await database({file: this.databaseFilePath});
    
    if (!this.args.safe) {
      await this.initializePlugins();
    }
  }

  async dispose() {
    for (const plugin of this._plugins) {
      if (plugin.deactivate) {
        await plugin.deactivate();
      }
    }

    if (this._db) {
      await this._db.close();
    }
  }

  async initializePlugins() {
    const PLUGINS = {
      postgres: postgres,
      mssql: mssql,
      media: media,
      reports: reports
    }

    for (const pluginName of Object.keys(PLUGINS)) {
      if (process.env[`${pluginName.toUpperCase()}_PLUGIN_ENABLED`] !== '1') {
        continue;
      }

      const logger = pluginLogger(pluginName);
      const plugin = PLUGINS[pluginName];

      try {
        this._pluginsByName[pluginName] = plugin;
        this._plugins.push(plugin);

        if (this.args.debug) {
          logger.error('Loading plugin', pluginName);
        }
      } catch (ex) {
        logger.error('Failed to load plugin', ex);
        logger.error('This is most likely an error in the plugin.');
      }
    }
  }

  async activatePlugins() {
    for (const plugin of this._plugins) {
      await plugin.activate();
    }
  }

  async fetchAccount(name) {
    const where = {};

    if (name) {
      where.organization_name = name;
    }

    const accounts = await Account.findAll(this.db, where, 'updated_at DESC');

    return accounts[0];
  }

  async createDataSource(account) {
    let dataSource = new DataSource();

    const localDatabase = new LocalDatabaseDataSource(account);

    dataSource.add(localDatabase);

    await localDatabase.load(this.db);

    return dataSource;
  }
}

app = new App();

Environment.app = app;

global.__app__ = app;
global.__api__ = api;
global.fulcrum = app.environment;

export default App;
