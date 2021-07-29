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

var _sync = _interopRequireDefault(require("./sync"));

var _query = _interopRequireDefault(require("./query"));

var _reset = _interopRequireDefault(require("./reset"));

var _console = _interopRequireDefault(require("./console"));

var _version = _interopRequireDefault(require("../version"));

var _minidb = require("minidb");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

_yargs.default.$0 = 'fulcrum';

require('source-map-support').install();

const COMMANDS = [_setup.default, _sync.default, _reset.default, _query.default, _console.default];

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9jbGkuanMiXSwibmFtZXMiOlsieWFyZ3MiLCIkMCIsInJlcXVpcmUiLCJpbnN0YWxsIiwiQ09NTUFORFMiLCJTZXR1cCIsIlN5bmMiLCJSZXNldCIsIlF1ZXJ5IiwiQ29uc29sZSIsIkNMSSIsIm9iaiIsInJlc29sdmUiLCJyZWplY3QiLCJfX2NvbW1hbmQiLCJjb21tYW5kIiwiYmluZCIsImFyZ3MiLCJoYW5kbGVyIiwicmVzdWx0IiwidGhlbiIsImNhdGNoIiwic2V0dXAiLCJhcHAiLCJjb2xvcnMiLCJlbmFibGVkIiwiZGVidWdzcWwiLCJEYXRhYmFzZSIsImRlYnVnIiwiZnVsY3J1bSIsImxvZ2dlciIsImxvZyIsImluaXRpYWxpemUiLCJkZXN0cm95IiwiZGlzcG9zZSIsInJ1biIsImNsaSIsInVzYWdlIiwicHJvbWlzZVJlc29sdmUiLCJwcm9taXNlUmVqZWN0IiwiY29tcGxldGlvbiIsIlByb21pc2UiLCJDb21tYW5kQ2xhc3MiLCJjb21tYW5kQ2xpIiwidGFzayIsIndyYXBBc3luYyIsInBsdWdpbiIsIl9wbHVnaW5zIiwicGx1Z2luQ29tbWFuZCIsImFyZ3YiLCJkZW1hbmRDb21tYW5kIiwidmVyc2lvbiIsImZ1bGNydW1QYWNrYWdlIiwiaGVscCIsImRiIiwiZmV0Y2hBY2NvdW50IiwibmFtZSIsIndoZXJlIiwib3JnYW5pemF0aW9uX25hbWUiLCJhY2NvdW50cyIsIkFjY291bnQiLCJmaW5kQWxsIiwiY3JlYXRlRGF0YVNvdXJjZSIsImFjY291bnQiLCJkYXRhU291cmNlIiwiRGF0YVNvdXJjZSIsImxvY2FsRGF0YWJhc2UiLCJMb2NhbERhdGFiYXNlRGF0YVNvdXJjZSIsImFkZCIsImxvYWQiLCJzdGFydCIsInByb2Nlc3MiLCJvbiIsImV4aXQiLCJlcnIiLCJleGl0Q29kZSIsImVycm9yIiwic3RhY2siXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7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bUIsQ0FBbkI7QUFDQTlDLEVBQUFBLE9BQU8sQ0FBQ0MsTUFBUixDQUFlOEMsS0FBZixDQUFxQkYsR0FBckI7QUFDRCxDQUpEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbG9ycyBmcm9tICdjb2xvcnMnO1xuaW1wb3J0IHlhcmdzIGZyb20gJ3lhcmdzJztcbmltcG9ydCBBY2NvdW50IGZyb20gJy4uL21vZGVscy9hY2NvdW50JztcbmltcG9ydCB7IERhdGFTb3VyY2UgfSBmcm9tICdmdWxjcnVtLWNvcmUnO1xuaW1wb3J0IExvY2FsRGF0YWJhc2VEYXRhU291cmNlIGZyb20gJy4uL2xvY2FsLWRhdGFiYXNlLWRhdGEtc291cmNlJztcbmltcG9ydCBhcHAgZnJvbSAnLi4vYXBwJztcblxuaW1wb3J0IFNldHVwIGZyb20gJy4vc2V0dXAnO1xuaW1wb3J0IFN5bmMgZnJvbSAnLi9zeW5jJztcbmltcG9ydCBRdWVyeSBmcm9tICcuL3F1ZXJ5JztcbmltcG9ydCBSZXNldCBmcm9tICcuL3Jlc2V0JztcbmltcG9ydCBDb25zb2xlIGZyb20gJy4vY29uc29sZSc7XG5pbXBvcnQgZnVsY3J1bVBhY2thZ2UgZnJvbSAnLi4vdmVyc2lvbic7XG5cbmltcG9ydCB7IERhdGFiYXNlIH0gZnJvbSAnbWluaWRiJztcblxueWFyZ3MuJDAgPSAnZnVsY3J1bSc7XG5cbnJlcXVpcmUoJ3NvdXJjZS1tYXAtc3VwcG9ydCcpLmluc3RhbGwoKTtcblxuY29uc3QgQ09NTUFORFMgPSBbXG4gIFNldHVwLFxuICBTeW5jLFxuICBSZXNldCxcbiAgUXVlcnksXG4gIENvbnNvbGVcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENMSSB7XG4gIGFzeW5jIHNldHVwKCkge1xuICAgIHRoaXMuYXBwID0gYXBwO1xuXG4gICAgaWYgKHRoaXMuYXJncy5jb2xvcnMgPT09IGZhbHNlKSB7XG4gICAgICBjb2xvcnMuZW5hYmxlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmFyZ3MuZGVidWdzcWwpIHtcbiAgICAgIERhdGFiYXNlLmRlYnVnID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5hcmdzLmRlYnVnKSB7XG4gICAgICBmdWxjcnVtLmxvZ2dlci5sb2codGhpcy5hcmdzKTtcbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLmFwcC5pbml0aWFsaXplKCk7XG4gIH1cblxuICBhc3luYyBkZXN0cm95KCkge1xuICAgIGF3YWl0IHRoaXMuYXBwLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIGFzeW5jIHJ1bigpIHtcbiAgICBsZXQgY2xpID0gdGhpcy55YXJncy51c2FnZSgnVXNhZ2U6IGZ1bGNydW0gPGNtZD4gW2FyZ3NdJyk7XG5cbiAgICBjbGkuJDAgPSAnZnVsY3J1bSc7XG5cbiAgICAvLyB0aGlzIGlzIHNvbWUgaGFja3MgdG8gY29vcmRpbmF0ZSB0aGUgeWFyZ3MgaGFuZGxlciBmdW5jdGlvbiB3aXRoIHRoaXMgYXN5bmMgZnVuY3Rpb24uXG4gICAgLy8gaWYgeWFyZ3MgYWRkcyBzdXBwb3J0IGZvciBwcm9taXNlcyBpbiB0aGUgY29tbWFuZCBoYW5kbGVycyB0aGlzIGNhbiBnbyBhd2F5LlxuICAgIGxldCBwcm9taXNlUmVzb2x2ZSA9IG51bGw7XG4gICAgbGV0IHByb21pc2VSZWplY3QgPSBudWxsO1xuXG4gICAgY29uc3QgY29tcGxldGlvbiA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHByb21pc2VSZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIHByb21pc2VSZWplY3QgPSByZWplY3Q7XG4gICAgfSk7XG5cbiAgICAvLyBjbGkgPSBhd2FpdCB0aGlzLmFkZERlZmF1bHQodGhpcy53cmFwQXN5bmMoY2xpLCBwcm9taXNlUmVzb2x2ZSwgcHJvbWlzZVJlamVjdCkpO1xuXG4gICAgZm9yIChjb25zdCBDb21tYW5kQ2xhc3Mgb2YgQ09NTUFORFMpIHtcbiAgICAgIGNvbnN0IGNvbW1hbmQgPSBuZXcgQ29tbWFuZENsYXNzKCk7XG5cbiAgICAgIGNvbW1hbmQuYXBwID0gdGhpcy5hcHA7XG5cbiAgICAgIGNvbnN0IGNvbW1hbmRDbGkgPSBhd2FpdCBjb21tYW5kLnRhc2sodGhpcy53cmFwQXN5bmMoY2xpLCBwcm9taXNlUmVzb2x2ZSwgcHJvbWlzZVJlamVjdCkpO1xuXG4gICAgICBpZiAoY29tbWFuZENsaSkge1xuICAgICAgICBjbGkgPSBjb21tYW5kQ2xpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgcGx1Z2luIG9mIHRoaXMuYXBwLl9wbHVnaW5zKSB7XG4gICAgICBpZiAocGx1Z2luLnRhc2spIHtcbiAgICAgICAgY29uc3QgcGx1Z2luQ29tbWFuZCA9IGF3YWl0IHBsdWdpbi50YXNrKHRoaXMud3JhcEFzeW5jKGNsaSwgcHJvbWlzZVJlc29sdmUsIHByb21pc2VSZWplY3QpKTtcblxuICAgICAgICBpZiAocGx1Z2luQ29tbWFuZCkge1xuICAgICAgICAgIGNsaSA9IHBsdWdpbkNvbW1hbmQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmFyZ3YgPVxuICAgICAgY2xpLmRlbWFuZENvbW1hbmQoKVxuICAgICAgICAgLnZlcnNpb24oZnVsY3J1bVBhY2thZ2UudmVyc2lvbilcbiAgICAgICAgIC5oZWxwKClcbiAgICAgICAgIC5hcmd2O1xuXG4gICAgYXdhaXQgY29tcGxldGlvbjtcbiAgfVxuXG4gIC8vIGFkZERlZmF1bHQgPSBhc3luYyAoY2xpKSA9PiB7XG4gIC8vICAgcmV0dXJuIGNsaS5jb21tYW5kKHtcbiAgLy8gICAgIGNvbW1hbmQ6ICd5b3lvJyxcbiAgLy8gICAgIGRlc2M6ICd5eW8nLFxuICAvLyAgICAgYnVpbGRlcjoge30sXG4gIC8vICAgICBoYW5kbGVyOiB0aGlzLnJ1bkRlZmF1bHRDb21tYW5kXG4gIC8vICAgfSk7XG4gIC8vIH1cblxuICAvLyBydW5EZWZhdWx0Q29tbWFuZCA9IGFzeW5jICgpID0+IHtcbiAgLy8gfVxuXG4gIGdldCBkYigpIHtcbiAgICByZXR1cm4gdGhpcy5hcHAuZGI7XG4gIH1cblxuICBnZXQgeWFyZ3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwLnlhcmdzO1xuICB9XG5cbiAgZ2V0IGFyZ3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwLnlhcmdzLmFyZ3Y7XG4gIH1cblxuICBhc3luYyBmZXRjaEFjY291bnQobmFtZSkge1xuICAgIGNvbnN0IHdoZXJlID0ge307XG5cbiAgICBpZiAobmFtZSkge1xuICAgICAgd2hlcmUub3JnYW5pemF0aW9uX25hbWUgPSBuYW1lO1xuICAgIH1cblxuICAgIGNvbnN0IGFjY291bnRzID0gYXdhaXQgQWNjb3VudC5maW5kQWxsKHRoaXMuZGIsIHdoZXJlKTtcblxuICAgIHJldHVybiBhY2NvdW50cztcbiAgfVxuXG4gIGFzeW5jIGNyZWF0ZURhdGFTb3VyY2UoYWNjb3VudCkge1xuICAgIGxldCBkYXRhU291cmNlID0gbmV3IERhdGFTb3VyY2UoKTtcblxuICAgIGNvbnN0IGxvY2FsRGF0YWJhc2UgPSBuZXcgTG9jYWxEYXRhYmFzZURhdGFTb3VyY2UoYWNjb3VudCk7XG5cbiAgICBkYXRhU291cmNlLmFkZChsb2NhbERhdGFiYXNlKTtcblxuICAgIGF3YWl0IGxvY2FsRGF0YWJhc2UubG9hZCh0aGlzLmRiKTtcblxuICAgIHJldHVybiBkYXRhU291cmNlO1xuICB9XG5cbiAgYXN5bmMgc3RhcnQoKSB7XG4gICAgLy8gVE9ETyh6aG0pIHJlcXVpcmVkIG9yIGl0IGhhbmdzIGZvciB+MzBzZWMgaHR0cHM6Ly9naXRodWIuY29tL2VsZWN0cm9uL2VsZWN0cm9uL2lzc3Vlcy80OTQ0XG4gICAgcHJvY2Vzcy5vbignU0lHSU5UJywgZnVuY3Rpb24oKSB7XG4gICAgICBwcm9jZXNzLmV4aXQoKTtcbiAgICB9KTtcblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCB0aGlzLnNldHVwKCk7XG4gICAgICBhd2FpdCB0aGlzLnJ1bigpO1xuICAgICAgYXdhaXQgdGhpcy5kZXN0cm95KCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBwcm9jZXNzLmV4aXRDb2RlID0gMTtcbiAgICAgIGZ1bGNydW0ubG9nZ2VyLmVycm9yKGVyci5zdGFjayk7XG4gICAgICBhd2FpdCB0aGlzLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICAvLyBUT0RPKHpobSkgcmVxdWlyZWQgb3IgaXQgaGFuZ3MgZm9yIH4zMHNlYyBodHRwczovL2dpdGh1Yi5jb20vZWxlY3Ryb24vZWxlY3Ryb24vaXNzdWVzLzQ5NDRcbiAgICBwcm9jZXNzLmV4aXQoKTtcbiAgfVxuXG4gIC8vIHRoaXMgaGFja3MgdGhlIHlhcmdzIGNvbW1hbmQgaGFuZGxlciB0byBhbGxvdyBpdCB0byByZXR1cm4gYSBwcm9taXNlIChhc3luYyBmdW5jdGlvbilcbiAgd3JhcEFzeW5jID0gKG9iaiwgcmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgX19jb21tYW5kID0gb2JqLmNvbW1hbmQuYmluZChvYmopO1xuXG4gICAgb2JqLmNvbW1hbmQgPSAoLi4uYXJncykgPT4ge1xuICAgICAgaWYgKGFyZ3MgJiYgYXJnc1swXSAmJiBhcmdzWzBdLmhhbmRsZXIpIHtcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IGFyZ3NbMF0uaGFuZGxlcjtcblxuICAgICAgICBhcmdzWzBdLmhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gaGFuZGxlcigpO1xuXG4gICAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQudGhlbikge1xuICAgICAgICAgICAgcmVzdWx0LnRoZW4ocmVzb2x2ZSkuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBfX2NvbW1hbmQoLi4uYXJncyk7XG4gICAgfTtcblxuICAgIHJldHVybiBvYmo7XG4gIH1cbn1cblxubmV3IENMSSgpLnN0YXJ0KCkudGhlbigoKSA9PiB7XG59KS5jYXRjaCgoZXJyKSA9PiB7XG4gIHByb2Nlc3MuZXhpdENvZGUgPSAxO1xuICBmdWxjcnVtLmxvZ2dlci5lcnJvcihlcnIpO1xufSk7XG4iXX0=