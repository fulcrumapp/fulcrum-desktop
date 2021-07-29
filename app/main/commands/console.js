"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _repl = _interopRequireDefault(require("repl"));

var _fs = _interopRequireDefault(require("fs"));

var _version = _interopRequireDefault(require("../../version"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class _default {
  constructor() {
    _defineProperty(this, "runCommand", async () => {
      await this.app.activatePlugins();
      const account = await fulcrum.fetchAccount(fulcrum.args.org);
      const app = this.app;
      const code = fulcrum.args.file ? _fs.default.readFileSync(fulcrum.args.file).toString() : fulcrum.args.code;

      if (code) {
        await eval(code);
        return;
      }

      console.log('');
      console.log('Fulcrum'.green, _version.default.version.green, fulcrum.databaseFilePath);
      console.log('');

      const server = _repl.default.start({
        prompt: '> ',
        terminal: true
      });

      server.context.account = account;
      server.context.app = this.app; // the process quits immediately unless we wire up an exit event

      await new Promise(resolve => {
        server.on('exit', resolve);
      });
    });
  }

  async task(cli) {
    return cli.command({
      command: 'console',
      desc: 'run the console',
      builder: {
        org: {
          desc: 'organization name',
          type: 'string'
        },
        file: {
          desc: 'file to execute',
          type: 'string'
        },
        code: {
          desc: 'code to execute',
          type: 'string'
        }
      },
      handler: this.runCommand
    });
  }

}

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL2NvbnNvbGUuanMiXSwibmFtZXMiOlsiYXBwIiwiYWN0aXZhdGVQbHVnaW5zIiwiYWNjb3VudCIsImZ1bGNydW0iLCJmZXRjaEFjY291bnQiLCJhcmdzIiwib3JnIiwiY29kZSIsImZpbGUiLCJmcyIsInJlYWRGaWxlU3luYyIsInRvU3RyaW5nIiwiZXZhbCIsImNvbnNvbGUiLCJsb2ciLCJncmVlbiIsInBrZyIsInZlcnNpb24iLCJkYXRhYmFzZUZpbGVQYXRoIiwic2VydmVyIiwicmVwbCIsInN0YXJ0IiwicHJvbXB0IiwidGVybWluYWwiLCJjb250ZXh0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJvbiIsInRhc2siLCJjbGkiLCJjb21tYW5kIiwiZGVzYyIsImJ1aWxkZXIiLCJ0eXBlIiwiaGFuZGxlciIsInJ1bkNvbW1hbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRWUsZUFBTTtBQUFBO0FBQUEsd0NBdUJOLFlBQVk7QUFDdkIsWUFBTSxLQUFLQSxHQUFMLENBQVNDLGVBQVQsRUFBTjtBQUVBLFlBQU1DLE9BQU8sR0FBRyxNQUFNQyxPQUFPLENBQUNDLFlBQVIsQ0FBcUJELE9BQU8sQ0FBQ0UsSUFBUixDQUFhQyxHQUFsQyxDQUF0QjtBQUNBLFlBQU1OLEdBQUcsR0FBRyxLQUFLQSxHQUFqQjtBQUVBLFlBQU1PLElBQUksR0FBR0osT0FBTyxDQUFDRSxJQUFSLENBQWFHLElBQWIsR0FBb0JDLFlBQUdDLFlBQUgsQ0FBZ0JQLE9BQU8sQ0FBQ0UsSUFBUixDQUFhRyxJQUE3QixFQUFtQ0csUUFBbkMsRUFBcEIsR0FBb0VSLE9BQU8sQ0FBQ0UsSUFBUixDQUFhRSxJQUE5Rjs7QUFFQSxVQUFJQSxJQUFKLEVBQVU7QUFDUixjQUFNSyxJQUFJLENBQUNMLElBQUQsQ0FBVjtBQUNBO0FBQ0Q7O0FBRURNLE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLEVBQVo7QUFDQUQsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksVUFBVUMsS0FBdEIsRUFBNkJDLGlCQUFJQyxPQUFKLENBQVlGLEtBQXpDLEVBQWdEWixPQUFPLENBQUNlLGdCQUF4RDtBQUNBTCxNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxFQUFaOztBQUVBLFlBQU1LLE1BQU0sR0FBR0MsY0FBS0MsS0FBTCxDQUFXO0FBQUNDLFFBQUFBLE1BQU0sRUFBRSxJQUFUO0FBQWVDLFFBQUFBLFFBQVEsRUFBRTtBQUF6QixPQUFYLENBQWY7O0FBRUFKLE1BQUFBLE1BQU0sQ0FBQ0ssT0FBUCxDQUFldEIsT0FBZixHQUF5QkEsT0FBekI7QUFDQWlCLE1BQUFBLE1BQU0sQ0FBQ0ssT0FBUCxDQUFleEIsR0FBZixHQUFxQixLQUFLQSxHQUExQixDQXBCdUIsQ0FzQnZCOztBQUNBLFlBQU0sSUFBSXlCLE9BQUosQ0FBYUMsT0FBRCxJQUFhO0FBQzdCUCxRQUFBQSxNQUFNLENBQUNRLEVBQVAsQ0FBVSxNQUFWLEVBQWtCRCxPQUFsQjtBQUNELE9BRkssQ0FBTjtBQUdELEtBakRrQjtBQUFBOztBQUNULFFBQUpFLElBQUksQ0FBQ0MsR0FBRCxFQUFNO0FBQ2QsV0FBT0EsR0FBRyxDQUFDQyxPQUFKLENBQVk7QUFDakJBLE1BQUFBLE9BQU8sRUFBRSxTQURRO0FBRWpCQyxNQUFBQSxJQUFJLEVBQUUsaUJBRlc7QUFHakJDLE1BQUFBLE9BQU8sRUFBRTtBQUNQMUIsUUFBQUEsR0FBRyxFQUFFO0FBQ0h5QixVQUFBQSxJQUFJLEVBQUUsbUJBREg7QUFFSEUsVUFBQUEsSUFBSSxFQUFFO0FBRkgsU0FERTtBQUtQekIsUUFBQUEsSUFBSSxFQUFFO0FBQ0p1QixVQUFBQSxJQUFJLEVBQUUsaUJBREY7QUFFSkUsVUFBQUEsSUFBSSxFQUFFO0FBRkYsU0FMQztBQVNQMUIsUUFBQUEsSUFBSSxFQUFFO0FBQ0p3QixVQUFBQSxJQUFJLEVBQUUsaUJBREY7QUFFSkUsVUFBQUEsSUFBSSxFQUFFO0FBRkY7QUFUQyxPQUhRO0FBaUJqQkMsTUFBQUEsT0FBTyxFQUFFLEtBQUtDO0FBakJHLEtBQVosQ0FBUDtBQW1CRDs7QUFyQmtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJlcGwgZnJvbSAncmVwbCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBrZyBmcm9tICcuLi8uLi92ZXJzaW9uJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICBhc3luYyB0YXNrKGNsaSkge1xuICAgIHJldHVybiBjbGkuY29tbWFuZCh7XG4gICAgICBjb21tYW5kOiAnY29uc29sZScsXG4gICAgICBkZXNjOiAncnVuIHRoZSBjb25zb2xlJyxcbiAgICAgIGJ1aWxkZXI6IHtcbiAgICAgICAgb3JnOiB7XG4gICAgICAgICAgZGVzYzogJ29yZ2FuaXphdGlvbiBuYW1lJyxcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICB9LFxuICAgICAgICBmaWxlOiB7XG4gICAgICAgICAgZGVzYzogJ2ZpbGUgdG8gZXhlY3V0ZScsXG4gICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgfSxcbiAgICAgICAgY29kZToge1xuICAgICAgICAgIGRlc2M6ICdjb2RlIHRvIGV4ZWN1dGUnLFxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBoYW5kbGVyOiB0aGlzLnJ1bkNvbW1hbmRcbiAgICB9KTtcbiAgfVxuXG4gIHJ1bkNvbW1hbmQgPSBhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgdGhpcy5hcHAuYWN0aXZhdGVQbHVnaW5zKCk7XG5cbiAgICBjb25zdCBhY2NvdW50ID0gYXdhaXQgZnVsY3J1bS5mZXRjaEFjY291bnQoZnVsY3J1bS5hcmdzLm9yZyk7XG4gICAgY29uc3QgYXBwID0gdGhpcy5hcHA7XG5cbiAgICBjb25zdCBjb2RlID0gZnVsY3J1bS5hcmdzLmZpbGUgPyBmcy5yZWFkRmlsZVN5bmMoZnVsY3J1bS5hcmdzLmZpbGUpLnRvU3RyaW5nKCkgOiBmdWxjcnVtLmFyZ3MuY29kZTtcblxuICAgIGlmIChjb2RlKSB7XG4gICAgICBhd2FpdCBldmFsKGNvZGUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKCcnKTtcbiAgICBjb25zb2xlLmxvZygnRnVsY3J1bScuZ3JlZW4sIHBrZy52ZXJzaW9uLmdyZWVuLCBmdWxjcnVtLmRhdGFiYXNlRmlsZVBhdGgpO1xuICAgIGNvbnNvbGUubG9nKCcnKTtcblxuICAgIGNvbnN0IHNlcnZlciA9IHJlcGwuc3RhcnQoe3Byb21wdDogJz4gJywgdGVybWluYWw6IHRydWV9KTtcblxuICAgIHNlcnZlci5jb250ZXh0LmFjY291bnQgPSBhY2NvdW50O1xuICAgIHNlcnZlci5jb250ZXh0LmFwcCA9IHRoaXMuYXBwO1xuXG4gICAgLy8gdGhlIHByb2Nlc3MgcXVpdHMgaW1tZWRpYXRlbHkgdW5sZXNzIHdlIHdpcmUgdXAgYW4gZXhpdCBldmVudFxuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICBzZXJ2ZXIub24oJ2V4aXQnLCByZXNvbHZlKTtcbiAgICB9KTtcbiAgfVxufVxuIl19