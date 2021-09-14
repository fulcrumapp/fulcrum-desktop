import colors from 'colors';
import Account from '../models/account';
import { DataSource } from 'fulcrum-core';
import LocalDatabaseDataSource from '../local-database-data-source';
import App from '../app';

import Setup from './setup';
import Sync from './sync';
import Query from './query';
import Reset from './reset';
//import Console from './console';
import fulcrumPackage from '../version';

import { Database } from 'minidb';

require('source-map-support').install();

const COMMANDS = [
  Setup,
  Sync,
  Reset,
  Query
  //Console
];

export default class CLI {
  async setup() {
    this.app = App.instance;

    if (this.args.colors === false) {
      colors.enabled = false;
    }

    if (this.args.debugsql) {
      Database.debug = true;
    }

    if (this.args.debug) {
      this.app.logger.log(this.args);
    }

    await this.app.initialize();
  }

  async destroy() {
    await this.app.dispose();
  }

  async run() {
    let cli = this.yargs.usage('Usage: fulcrum <cmd> [args]');

    // this is some hacks to coordinate the yargs handler function with this async function.
    // if yargs adds support for promises in the command handlers this can go away.
    /*let promiseResolve = null;
    let promiseReject = null;

    const completion = new Promise((resolve, reject) => {
      promiseResolve = resolve;
      promiseReject = reject;
    });*/

    // cli = await this.addDefault(this.wrapAsync(cli, promiseResolve, promiseReject));

    for (const CommandClass of COMMANDS) {
      const command = new CommandClass();

      command.app = this.app;

      const commandCli = await command.task(cli);

      if (commandCli) {
        cli = commandCli;
      }
    }

    for (const plugin of this.app._plugins) {
      if (plugin.task) {
        const pluginCommand = await plugin.task(cli);

        if (pluginCommand) {
          cli = pluginCommand;
        }
      }
    }

    this.argv = await cli.demandCommand()
         .version(fulcrumPackage.version)
         .scriptName('')
         .help()
         .argv

    //await completion;
  }

  get db() {
    return this.app.db;
  }

  get yargs() {
    return this.app.yargs;
  }

  get args() {
    return this.app.yargs.argv;
  }

  async fetchAccount(name) {
    const where = {};

    if (name) {
      where.organization_name = name;
    }

    const accounts = await Account.findAll(this.db, where);

    return accounts;
  }

  async createDataSource(account) {
    let dataSource = new DataSource();

    const localDatabase = new LocalDatabaseDataSource(account);

    dataSource.add(localDatabase);

    await localDatabase.load(this.db);

    return dataSource;
  }

  async start() {
    // TODO(zhm) required or it hangs for ~30sec https://github.com/electron/electron/issues/4944
    process.on('SIGINT', function() {
      process.exit();
    });

    try {
      await this.setup();
      await this.run();
      await this.destroy();
    } catch (err) {
      process.exitCode = 1;
      this.app.logger.error(err.stack);
      await this.destroy();
    }

    // TODO(zhm) required or it hangs for ~30sec https://github.com/electron/electron/issues/4944
    process.exit();
  }

  // this hacks the yargs command handler to allow it to return a promise (async function)
  /*wrapAsync = (obj, resolve, reject) => {
    const __command = obj.command.bind(obj);

    obj.command = (...args) => {
      if (args && args[0] && args[0].handler) {
        const handler = args[0].handler;

        args[0].handler = () => {
          const result = handler();

          if (result && result.then) {
            result.then(resolve).catch(reject);
          }
        };
      }

      return __command(...args);
    };

    return obj;
  }*/
}

new CLI().start().then(() => {
}).catch((err) => {
  process.exitCode = 1;
  App.instance.logger.error(err);
});
