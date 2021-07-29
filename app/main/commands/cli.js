"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _colors = _interopRequireDefault(require("colors"));

var _yargs = _interopRequireDefault(require("yargs"));

var _account = _interopRequireDefault(require("../models/account"));

var _fulcrumCore = require("fulcrum-core");

var _localDatabaseDataSource = _interopRequireDefault(require("../local-database-data-source"));

var _app = _interopRequireDefault(require("../app"));

var _setup = _interopRequireDefault(require("./setup"));

var _installPlugin = _interopRequireDefault(require("./install-plugin"));

var _createPlugin = _interopRequireDefault(require("./create-plugin"));

var _updatePlugins = _interopRequireDefault(require("./update-plugins"));

var _buildPlugins = _interopRequireDefault(require("./build-plugins"));

var _watchPlugins = _interopRequireDefault(require("./watch-plugins"));

var _sync = _interopRequireDefault(require("./sync"));

var _query = _interopRequireDefault(require("./query"));

var _reset = _interopRequireDefault(require("./reset"));

var _console = _interopRequireDefault(require("./console"));

var _version = _interopRequireDefault(require("../../version"));

var _minidb = require("minidb");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

_yargs.default.$0 = 'fulcrum';

require('source-map-support').install();

const COMMANDS = [_setup.default, _sync.default, _reset.default, _installPlugin.default, _createPlugin.default, _updatePlugins.default, _buildPlugins.default, _watchPlugins.default, _query.default, _console.default];

class CLI {
  constructor() {
    _defineProperty(this, "wrapAsync", (obj, resolve, reject) => {
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
    });
  }

  async setup() {
    this.app = _app.default;

    if (this.args.colors === false) {
      _colors.default.enabled = false;
    }

    if (this.args.debugsql) {
      _minidb.Database.debug = true;
    }

    if (this.args.debug) {
      fulcrum.logger.log(this.args);
    }

    await this.app.initialize();
  }

  async destroy() {
    await this.app.dispose();
  }

  async run() {
    let cli = this.yargs.usage('Usage: fulcrum <cmd> [args]');
    cli.$0 = 'fulcrum'; // this is some hacks to coordinate the yargs handler function with this async function.
    // if yargs adds support for promises in the command handlers this can go away.

    let promiseResolve = null;
    let promiseReject = null;
    const completion = new Promise((resolve, reject) => {
      promiseResolve = resolve;
      promiseReject = reject;
    }); // cli = await this.addDefault(this.wrapAsync(cli, promiseResolve, promiseReject));

    for (const CommandClass of COMMANDS) {
      const command = new CommandClass();
      command.app = this.app;
      const commandCli = await command.task(this.wrapAsync(cli, promiseResolve, promiseReject));

      if (commandCli) {
        cli = commandCli;
      }
    }

    for (const plugin of this.app._plugins) {
      if (plugin.task) {
        const pluginCommand = await plugin.task(this.wrapAsync(cli, promiseResolve, promiseReject));

        if (pluginCommand) {
          cli = pluginCommand;
        }
      }
    }

    this.argv = cli.demandCommand().version(_version.default.version).help().argv;
    await completion;
  } // addDefault = async (cli) => {
  //   return cli.command({
  //     command: 'yoyo',
  //     desc: 'yyo',
  //     builder: {},
  //     handler: this.runDefaultCommand
  //   });
  // }
  // runDefaultCommand = async () => {
  // }


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

    const accounts = await _account.default.findAll(this.db, where);
    return accounts;
  }

  async createDataSource(account) {
    let dataSource = new _fulcrumCore.DataSource();
    const localDatabase = new _localDatabaseDataSource.default(account);
    dataSource.add(localDatabase);
    await localDatabase.load(this.db);
    return dataSource;
  }

  async start() {
    // TODO(zhm) required or it hangs for ~30sec https://github.com/electron/electron/issues/4944
    process.on('SIGINT', function () {
      process.exit();
    });

    try {
      await this.setup();
      await this.run();
      await this.destroy();
    } catch (err) {
      process.exitCode = 1;
      fulcrum.logger.error(err.stack);
      await this.destroy();
    } // TODO(zhm) required or it hangs for ~30sec https://github.com/electron/electron/issues/4944


    process.exit();
  } // this hacks the yargs command handler to allow it to return a promise (async function)


}

exports.default = CLI;
new CLI().start().then(() => {}).catch(err => {
  process.exitCode = 1;
  fulcrum.logger.error(err);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL2NsaS5qcyJdLCJuYW1lcyI6WyJ5YXJncyIsIiQwIiwicmVxdWlyZSIsImluc3RhbGwiLCJDT01NQU5EUyIsIlNldHVwIiwiU3luYyIsIlJlc2V0IiwiSW5zdGFsbFBsdWdpbiIsIkNyZWF0ZVBsdWdpbiIsIlVwZGF0ZVBsdWdpbnMiLCJCdWlsZFBsdWdpbnMiLCJXYXRjaFBsdWdpbnMiLCJRdWVyeSIsIkNvbnNvbGUiLCJDTEkiLCJvYmoiLCJyZXNvbHZlIiwicmVqZWN0IiwiX19jb21tYW5kIiwiY29tbWFuZCIsImJpbmQiLCJhcmdzIiwiaGFuZGxlciIsInJlc3VsdCIsInRoZW4iLCJjYXRjaCIsInNldHVwIiwiYXBwIiwiY29sb3JzIiwiZW5hYmxlZCIsImRlYnVnc3FsIiwiRGF0YWJhc2UiLCJkZWJ1ZyIsImZ1bGNydW0iLCJsb2dnZXIiLCJsb2ciLCJpbml0aWFsaXplIiwiZGVzdHJveSIsImRpc3Bvc2UiLCJydW4iLCJjbGkiLCJ1c2FnZSIsInByb21pc2VSZXNvbHZlIiwicHJvbWlzZVJlamVjdCIsImNvbXBsZXRpb24iLCJQcm9taXNlIiwiQ29tbWFuZENsYXNzIiwiY29tbWFuZENsaSIsInRhc2siLCJ3cmFwQXN5bmMiLCJwbHVnaW4iLCJfcGx1Z2lucyIsInBsdWdpbkNvbW1hbmQiLCJhcmd2IiwiZGVtYW5kQ29tbWFuZCIsInZlcnNpb24iLCJmdWxjcnVtUGFja2FnZSIsImhlbHAiLCJkYiIsImZldGNoQWNjb3VudCIsIm5hbWUiLCJ3aGVyZSIsIm9yZ2FuaXphdGlvbl9uYW1lIiwiYWNjb3VudHMiLCJBY2NvdW50IiwiZmluZEFsbCIsImNyZWF0ZURhdGFTb3VyY2UiLCJhY2NvdW50IiwiZGF0YVNvdXJjZSIsIkRhdGFTb3VyY2UiLCJsb2NhbERhdGFiYXNlIiwiTG9jYWxEYXRhYmFzZURhdGFTb3VyY2UiLCJhZGQiLCJsb2FkIiwic3RhcnQiLCJwcm9jZXNzIiwib24iLCJleGl0IiwiZXJy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QUEsT0FBTyxDQUFDRSxJQUFSO0FBQ0QsR0F6SXNCLENBMkl2Qjs7O0FBM0l1Qjs7O0FBbUt6QixJQUFJL0QsR0FBSixHQUFVNEQsS0FBVixHQUFrQmxELElBQWxCLENBQXVCLE1BQU0sQ0FDNUIsQ0FERCxFQUNHQyxLQURILENBQ1VxRCxHQUFELElBQVM7QUFDaEJILEVBQUFBLE9BQU8sQ0FBQ0ksUUFBUixHQUFtQixDQUFuQjtBQUNBOUMsRUFBQUEsT0FBTyxDQUFDQyxNQUFSLENBQWU4QyxLQUFmLENBQXFCRixHQUFyQjtBQUNELENBSkQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY29sb3JzIGZyb20gJ2NvbG9ycyc7XG5pbXBvcnQgeWFyZ3MgZnJvbSAneWFyZ3MnO1xuaW1wb3J0IEFjY291bnQgZnJvbSAnLi4vbW9kZWxzL2FjY291bnQnO1xuaW1wb3J0IHsgRGF0YVNvdXJjZSB9IGZyb20gJ2Z1bGNydW0tY29yZSc7XG5pbXBvcnQgTG9jYWxEYXRhYmFzZURhdGFTb3VyY2UgZnJvbSAnLi4vbG9jYWwtZGF0YWJhc2UtZGF0YS1zb3VyY2UnO1xuaW1wb3J0IGFwcCBmcm9tICcuLi9hcHAnO1xuXG5pbXBvcnQgU2V0dXAgZnJvbSAnLi9zZXR1cCc7XG5pbXBvcnQgSW5zdGFsbFBsdWdpbiBmcm9tICcuL2luc3RhbGwtcGx1Z2luJztcbmltcG9ydCBDcmVhdGVQbHVnaW4gZnJvbSAnLi9jcmVhdGUtcGx1Z2luJztcbmltcG9ydCBVcGRhdGVQbHVnaW5zIGZyb20gJy4vdXBkYXRlLXBsdWdpbnMnO1xuaW1wb3J0IEJ1aWxkUGx1Z2lucyBmcm9tICcuL2J1aWxkLXBsdWdpbnMnO1xuaW1wb3J0IFdhdGNoUGx1Z2lucyBmcm9tICcuL3dhdGNoLXBsdWdpbnMnO1xuaW1wb3J0IFN5bmMgZnJvbSAnLi9zeW5jJztcbmltcG9ydCBRdWVyeSBmcm9tICcuL3F1ZXJ5JztcbmltcG9ydCBSZXNldCBmcm9tICcuL3Jlc2V0JztcbmltcG9ydCBDb25zb2xlIGZyb20gJy4vY29uc29sZSc7XG5pbXBvcnQgZnVsY3J1bVBhY2thZ2UgZnJvbSAnLi4vLi4vdmVyc2lvbic7XG5cbmltcG9ydCB7IERhdGFiYXNlIH0gZnJvbSAnbWluaWRiJztcblxueWFyZ3MuJDAgPSAnZnVsY3J1bSc7XG5cbnJlcXVpcmUoJ3NvdXJjZS1tYXAtc3VwcG9ydCcpLmluc3RhbGwoKTtcblxuY29uc3QgQ09NTUFORFMgPSBbXG4gIFNldHVwLFxuICBTeW5jLFxuICBSZXNldCxcbiAgSW5zdGFsbFBsdWdpbixcbiAgQ3JlYXRlUGx1Z2luLFxuICBVcGRhdGVQbHVnaW5zLFxuICBCdWlsZFBsdWdpbnMsXG4gIFdhdGNoUGx1Z2lucyxcbiAgUXVlcnksXG4gIENvbnNvbGVcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENMSSB7XG4gIGFzeW5jIHNldHVwKCkge1xuICAgIHRoaXMuYXBwID0gYXBwO1xuXG4gICAgaWYgKHRoaXMuYXJncy5jb2xvcnMgPT09IGZhbHNlKSB7XG4gICAgICBjb2xvcnMuZW5hYmxlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmFyZ3MuZGVidWdzcWwpIHtcbiAgICAgIERhdGFiYXNlLmRlYnVnID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5hcmdzLmRlYnVnKSB7XG4gICAgICBmdWxjcnVtLmxvZ2dlci5sb2codGhpcy5hcmdzKTtcbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLmFwcC5pbml0aWFsaXplKCk7XG4gIH1cblxuICBhc3luYyBkZXN0cm95KCkge1xuICAgIGF3YWl0IHRoaXMuYXBwLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIGFzeW5jIHJ1bigpIHtcbiAgICBsZXQgY2xpID0gdGhpcy55YXJncy51c2FnZSgnVXNhZ2U6IGZ1bGNydW0gPGNtZD4gW2FyZ3NdJyk7XG5cbiAgICBjbGkuJDAgPSAnZnVsY3J1bSc7XG5cbiAgICAvLyB0aGlzIGlzIHNvbWUgaGFja3MgdG8gY29vcmRpbmF0ZSB0aGUgeWFyZ3MgaGFuZGxlciBmdW5jdGlvbiB3aXRoIHRoaXMgYXN5bmMgZnVuY3Rpb24uXG4gICAgLy8gaWYgeWFyZ3MgYWRkcyBzdXBwb3J0IGZvciBwcm9taXNlcyBpbiB0aGUgY29tbWFuZCBoYW5kbGVycyB0aGlzIGNhbiBnbyBhd2F5LlxuICAgIGxldCBwcm9taXNlUmVzb2x2ZSA9IG51bGw7XG4gICAgbGV0IHByb21pc2VSZWplY3QgPSBudWxsO1xuXG4gICAgY29uc3QgY29tcGxldGlvbiA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHByb21pc2VSZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIHByb21pc2VSZWplY3QgPSByZWplY3Q7XG4gICAgfSk7XG5cbiAgICAvLyBjbGkgPSBhd2FpdCB0aGlzLmFkZERlZmF1bHQodGhpcy53cmFwQXN5bmMoY2xpLCBwcm9taXNlUmVzb2x2ZSwgcHJvbWlzZVJlamVjdCkpO1xuXG4gICAgZm9yIChjb25zdCBDb21tYW5kQ2xhc3Mgb2YgQ09NTUFORFMpIHtcbiAgICAgIGNvbnN0IGNvbW1hbmQgPSBuZXcgQ29tbWFuZENsYXNzKCk7XG5cbiAgICAgIGNvbW1hbmQuYXBwID0gdGhpcy5hcHA7XG5cbiAgICAgIGNvbnN0IGNvbW1hbmRDbGkgPSBhd2FpdCBjb21tYW5kLnRhc2sodGhpcy53cmFwQXN5bmMoY2xpLCBwcm9taXNlUmVzb2x2ZSwgcHJvbWlzZVJlamVjdCkpO1xuXG4gICAgICBpZiAoY29tbWFuZENsaSkge1xuICAgICAgICBjbGkgPSBjb21tYW5kQ2xpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgcGx1Z2luIG9mIHRoaXMuYXBwLl9wbHVnaW5zKSB7XG4gICAgICBpZiAocGx1Z2luLnRhc2spIHtcbiAgICAgICAgY29uc3QgcGx1Z2luQ29tbWFuZCA9IGF3YWl0IHBsdWdpbi50YXNrKHRoaXMud3JhcEFzeW5jKGNsaSwgcHJvbWlzZVJlc29sdmUsIHByb21pc2VSZWplY3QpKTtcblxuICAgICAgICBpZiAocGx1Z2luQ29tbWFuZCkge1xuICAgICAgICAgIGNsaSA9IHBsdWdpbkNvbW1hbmQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmFyZ3YgPVxuICAgICAgY2xpLmRlbWFuZENvbW1hbmQoKVxuICAgICAgICAgLnZlcnNpb24oZnVsY3J1bVBhY2thZ2UudmVyc2lvbilcbiAgICAgICAgIC5oZWxwKClcbiAgICAgICAgIC5hcmd2O1xuXG4gICAgYXdhaXQgY29tcGxldGlvbjtcbiAgfVxuXG4gIC8vIGFkZERlZmF1bHQgPSBhc3luYyAoY2xpKSA9PiB7XG4gIC8vICAgcmV0dXJuIGNsaS5jb21tYW5kKHtcbiAgLy8gICAgIGNvbW1hbmQ6ICd5b3lvJyxcbiAgLy8gICAgIGRlc2M6ICd5eW8nLFxuICAvLyAgICAgYnVpbGRlcjoge30sXG4gIC8vICAgICBoYW5kbGVyOiB0aGlzLnJ1bkRlZmF1bHRDb21tYW5kXG4gIC8vICAgfSk7XG4gIC8vIH1cblxuICAvLyBydW5EZWZhdWx0Q29tbWFuZCA9IGFzeW5jICgpID0+IHtcbiAgLy8gfVxuXG4gIGdldCBkYigpIHtcbiAgICByZXR1cm4gdGhpcy5hcHAuZGI7XG4gIH1cblxuICBnZXQgeWFyZ3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwLnlhcmdzO1xuICB9XG5cbiAgZ2V0IGFyZ3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwLnlhcmdzLmFyZ3Y7XG4gIH1cblxuICBhc3luYyBmZXRjaEFjY291bnQobmFtZSkge1xuICAgIGNvbnN0IHdoZXJlID0ge307XG5cbiAgICBpZiAobmFtZSkge1xuICAgICAgd2hlcmUub3JnYW5pemF0aW9uX25hbWUgPSBuYW1lO1xuICAgIH1cblxuICAgIGNvbnN0IGFjY291bnRzID0gYXdhaXQgQWNjb3VudC5maW5kQWxsKHRoaXMuZGIsIHdoZXJlKTtcblxuICAgIHJldHVybiBhY2NvdW50cztcbiAgfVxuXG4gIGFzeW5jIGNyZWF0ZURhdGFTb3VyY2UoYWNjb3VudCkge1xuICAgIGxldCBkYXRhU291cmNlID0gbmV3IERhdGFTb3VyY2UoKTtcblxuICAgIGNvbnN0IGxvY2FsRGF0YWJhc2UgPSBuZXcgTG9jYWxEYXRhYmFzZURhdGFTb3VyY2UoYWNjb3VudCk7XG5cbiAgICBkYXRhU291cmNlLmFkZChsb2NhbERhdGFiYXNlKTtcblxuICAgIGF3YWl0IGxvY2FsRGF0YWJhc2UubG9hZCh0aGlzLmRiKTtcblxuICAgIHJldHVybiBkYXRhU291cmNlO1xuICB9XG5cbiAgYXN5bmMgc3RhcnQoKSB7XG4gICAgLy8gVE9ETyh6aG0pIHJlcXVpcmVkIG9yIGl0IGhhbmdzIGZvciB+MzBzZWMgaHR0cHM6Ly9naXRodWIuY29tL2VsZWN0cm9uL2VsZWN0cm9uL2lzc3Vlcy80OTQ0XG4gICAgcHJvY2Vzcy5vbignU0lHSU5UJywgZnVuY3Rpb24oKSB7XG4gICAgICBwcm9jZXNzLmV4aXQoKTtcbiAgICB9KTtcblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCB0aGlzLnNldHVwKCk7XG4gICAgICBhd2FpdCB0aGlzLnJ1bigpO1xuICAgICAgYXdhaXQgdGhpcy5kZXN0cm95KCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBwcm9jZXNzLmV4aXRDb2RlID0gMTtcbiAgICAgIGZ1bGNydW0ubG9nZ2VyLmVycm9yKGVyci5zdGFjayk7XG4gICAgICBhd2FpdCB0aGlzLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICAvLyBUT0RPKHpobSkgcmVxdWlyZWQgb3IgaXQgaGFuZ3MgZm9yIH4zMHNlYyBodHRwczovL2dpdGh1Yi5jb20vZWxlY3Ryb24vZWxlY3Ryb24vaXNzdWVzLzQ5NDRcbiAgICBwcm9jZXNzLmV4aXQoKTtcbiAgfVxuXG4gIC8vIHRoaXMgaGFja3MgdGhlIHlhcmdzIGNvbW1hbmQgaGFuZGxlciB0byBhbGxvdyBpdCB0byByZXR1cm4gYSBwcm9taXNlIChhc3luYyBmdW5jdGlvbilcbiAgd3JhcEFzeW5jID0gKG9iaiwgcmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgX19jb21tYW5kID0gb2JqLmNvbW1hbmQuYmluZChvYmopO1xuXG4gICAgb2JqLmNvbW1hbmQgPSAoLi4uYXJncykgPT4ge1xuICAgICAgaWYgKGFyZ3MgJiYgYXJnc1swXSAmJiBhcmdzWzBdLmhhbmRsZXIpIHtcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IGFyZ3NbMF0uaGFuZGxlcjtcblxuICAgICAgICBhcmdzWzBdLmhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gaGFuZGxlcigpO1xuXG4gICAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQudGhlbikge1xuICAgICAgICAgICAgcmVzdWx0LnRoZW4ocmVzb2x2ZSkuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBfX2NvbW1hbmQoLi4uYXJncyk7XG4gICAgfTtcblxuICAgIHJldHVybiBvYmo7XG4gIH1cbn1cblxubmV3IENMSSgpLnN0YXJ0KCkudGhlbigoKSA9PiB7XG59KS5jYXRjaCgoZXJyKSA9PiB7XG4gIHByb2Nlc3MuZXhpdENvZGUgPSAxO1xuICBmdWxjcnVtLmxvZ2dlci5lcnJvcihlcnIpO1xufSk7XG4iXX0=