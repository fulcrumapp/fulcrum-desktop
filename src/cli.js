import App from './app';
import colors from 'colors';
import { Database } from 'minidb';
import Account from './models/account';
import fulcrumPackage from './version';
import { DataSource } from 'fulcrum-core';
import { commands, plugins } from './commands/command-exporter';
import LocalDatabaseDataSource from './local-database-data-source';

require('source-map-support').install();

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

    await this.app.initialize(plugins);
  }

  async destroy() {
    await this.app.dispose();
  }

  async run() {
    let cli = this.yargs.usage('Usage: fulcrum <cmd> [args]');

    cli.$0 = '';

    const sincronizationPlugins= ['s3', 'mssql', 'postgres'];

    if (plugins.filter(plugin => sincronizationPlugins.includes(plugin.command)).length > 1) {
      fulcrum.logger.error(`It's no allowed to enable more than one sync plugin at the same time.`.red);
      return
    }

    const enabledCommands = commands.concat(plugins);

    this.argv = await cli.command(enabledCommands)
        .demandCommand()
        .version(fulcrumPackage.version)
        .help()
        .argv
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
}

new CLI().start().then(() => {
}).catch((err) => {
  process.exitCode = 1;
  App.instance.logger.error(err);
});
