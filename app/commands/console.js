"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _repl = _interopRequireDefault(require("repl"));

var _fs = _interopRequireDefault(require("fs"));

var _version = _interopRequireDefault(require("../version"));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9jb25zb2xlLmpzIl0sIm5hbWVzIjpbImFwcCIsImFjdGl2YXRlUGx1Z2lucyIsImFjY291bnQiLCJmdWxjcnVtIiwiZmV0Y2hBY2NvdW50IiwiYXJncyIsIm9yZyIsImNvZGUiLCJmaWxlIiwiZnMiLCJyZWFkRmlsZVN5bmMiLCJ0b1N0cmluZyIsImV2YWwiLCJjb25zb2xlIiwibG9nIiwiZ3JlZW4iLCJwa2ciLCJ2ZXJzaW9uIiwiZGF0YWJhc2VGaWxlUGF0aCIsInNlcnZlciIsInJlcGwiLCJzdGFydCIsInByb21wdCIsInRlcm1pbmFsIiwiY29udGV4dCIsIlByb21pc2UiLCJyZXNvbHZlIiwib24iLCJ0YXNrIiwiY2xpIiwiY29tbWFuZCIsImRlc2MiLCJidWlsZGVyIiwidHlwZSIsImhhbmRsZXIiLCJydW5Db21tYW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVlLGVBQU07QUFBQTtBQUFBLHdDQXVCTixZQUFZO0FBQ3ZCLFlBQU0sS0FBS0EsR0FBTCxDQUFTQyxlQUFULEVBQU47QUFFQSxZQUFNQyxPQUFPLEdBQUcsTUFBTUMsT0FBTyxDQUFDQyxZQUFSLENBQXFCRCxPQUFPLENBQUNFLElBQVIsQ0FBYUMsR0FBbEMsQ0FBdEI7QUFDQSxZQUFNTixHQUFHLEdBQUcsS0FBS0EsR0FBakI7QUFFQSxZQUFNTyxJQUFJLEdBQUdKLE9BQU8sQ0FBQ0UsSUFBUixDQUFhRyxJQUFiLEdBQW9CQyxZQUFHQyxZQUFILENBQWdCUCxPQUFPLENBQUNFLElBQVIsQ0FBYUcsSUFBN0IsRUFBbUNHLFFBQW5DLEVBQXBCLEdBQW9FUixPQUFPLENBQUNFLElBQVIsQ0FBYUUsSUFBOUY7O0FBRUEsVUFBSUEsSUFBSixFQUFVO0FBQ1IsY0FBTUssSUFBSSxDQUFDTCxJQUFELENBQVY7QUFDQTtBQUNEOztBQUVETSxNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxFQUFaO0FBQ0FELE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLFVBQVVDLEtBQXRCLEVBQTZCQyxpQkFBSUMsT0FBSixDQUFZRixLQUF6QyxFQUFnRFosT0FBTyxDQUFDZSxnQkFBeEQ7QUFDQUwsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksRUFBWjs7QUFFQSxZQUFNSyxNQUFNLEdBQUdDLGNBQUtDLEtBQUwsQ0FBVztBQUFDQyxRQUFBQSxNQUFNLEVBQUUsSUFBVDtBQUFlQyxRQUFBQSxRQUFRLEVBQUU7QUFBekIsT0FBWCxDQUFmOztBQUVBSixNQUFBQSxNQUFNLENBQUNLLE9BQVAsQ0FBZXRCLE9BQWYsR0FBeUJBLE9BQXpCO0FBQ0FpQixNQUFBQSxNQUFNLENBQUNLLE9BQVAsQ0FBZXhCLEdBQWYsR0FBcUIsS0FBS0EsR0FBMUIsQ0FwQnVCLENBc0J2Qjs7QUFDQSxZQUFNLElBQUl5QixPQUFKLENBQWFDLE9BQUQsSUFBYTtBQUM3QlAsUUFBQUEsTUFBTSxDQUFDUSxFQUFQLENBQVUsTUFBVixFQUFrQkQsT0FBbEI7QUFDRCxPQUZLLENBQU47QUFHRCxLQWpEa0I7QUFBQTs7QUFDVCxRQUFKRSxJQUFJLENBQUNDLEdBQUQsRUFBTTtBQUNkLFdBQU9BLEdBQUcsQ0FBQ0MsT0FBSixDQUFZO0FBQ2pCQSxNQUFBQSxPQUFPLEVBQUUsU0FEUTtBQUVqQkMsTUFBQUEsSUFBSSxFQUFFLGlCQUZXO0FBR2pCQyxNQUFBQSxPQUFPLEVBQUU7QUFDUDFCLFFBQUFBLEdBQUcsRUFBRTtBQUNIeUIsVUFBQUEsSUFBSSxFQUFFLG1CQURIO0FBRUhFLFVBQUFBLElBQUksRUFBRTtBQUZILFNBREU7QUFLUHpCLFFBQUFBLElBQUksRUFBRTtBQUNKdUIsVUFBQUEsSUFBSSxFQUFFLGlCQURGO0FBRUpFLFVBQUFBLElBQUksRUFBRTtBQUZGLFNBTEM7QUFTUDFCLFFBQUFBLElBQUksRUFBRTtBQUNKd0IsVUFBQUEsSUFBSSxFQUFFLGlCQURGO0FBRUpFLFVBQUFBLElBQUksRUFBRTtBQUZGO0FBVEMsT0FIUTtBQWlCakJDLE1BQUFBLE9BQU8sRUFBRSxLQUFLQztBQWpCRyxLQUFaLENBQVA7QUFtQkQ7O0FBckJrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCByZXBsIGZyb20gJ3JlcGwnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwa2cgZnJvbSAnLi4vdmVyc2lvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgYXN5bmMgdGFzayhjbGkpIHtcbiAgICByZXR1cm4gY2xpLmNvbW1hbmQoe1xuICAgICAgY29tbWFuZDogJ2NvbnNvbGUnLFxuICAgICAgZGVzYzogJ3J1biB0aGUgY29uc29sZScsXG4gICAgICBidWlsZGVyOiB7XG4gICAgICAgIG9yZzoge1xuICAgICAgICAgIGRlc2M6ICdvcmdhbml6YXRpb24gbmFtZScsXG4gICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgfSxcbiAgICAgICAgZmlsZToge1xuICAgICAgICAgIGRlc2M6ICdmaWxlIHRvIGV4ZWN1dGUnLFxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIH0sXG4gICAgICAgIGNvZGU6IHtcbiAgICAgICAgICBkZXNjOiAnY29kZSB0byBleGVjdXRlJyxcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaGFuZGxlcjogdGhpcy5ydW5Db21tYW5kXG4gICAgfSk7XG4gIH1cblxuICBydW5Db21tYW5kID0gYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IHRoaXMuYXBwLmFjdGl2YXRlUGx1Z2lucygpO1xuXG4gICAgY29uc3QgYWNjb3VudCA9IGF3YWl0IGZ1bGNydW0uZmV0Y2hBY2NvdW50KGZ1bGNydW0uYXJncy5vcmcpO1xuICAgIGNvbnN0IGFwcCA9IHRoaXMuYXBwO1xuXG4gICAgY29uc3QgY29kZSA9IGZ1bGNydW0uYXJncy5maWxlID8gZnMucmVhZEZpbGVTeW5jKGZ1bGNydW0uYXJncy5maWxlKS50b1N0cmluZygpIDogZnVsY3J1bS5hcmdzLmNvZGU7XG5cbiAgICBpZiAoY29kZSkge1xuICAgICAgYXdhaXQgZXZhbChjb2RlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZygnJyk7XG4gICAgY29uc29sZS5sb2coJ0Z1bGNydW0nLmdyZWVuLCBwa2cudmVyc2lvbi5ncmVlbiwgZnVsY3J1bS5kYXRhYmFzZUZpbGVQYXRoKTtcbiAgICBjb25zb2xlLmxvZygnJyk7XG5cbiAgICBjb25zdCBzZXJ2ZXIgPSByZXBsLnN0YXJ0KHtwcm9tcHQ6ICc+ICcsIHRlcm1pbmFsOiB0cnVlfSk7XG5cbiAgICBzZXJ2ZXIuY29udGV4dC5hY2NvdW50ID0gYWNjb3VudDtcbiAgICBzZXJ2ZXIuY29udGV4dC5hcHAgPSB0aGlzLmFwcDtcblxuICAgIC8vIHRoZSBwcm9jZXNzIHF1aXRzIGltbWVkaWF0ZWx5IHVubGVzcyB3ZSB3aXJlIHVwIGFuIGV4aXQgZXZlbnRcbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgc2VydmVyLm9uKCdleGl0JywgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==