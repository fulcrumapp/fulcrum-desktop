"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _pluginEnv = _interopRequireDefault(require("../plugin-env"));

var _git = _interopRequireDefault(require("../git"));

var _yarn = _interopRequireDefault(require("../yarn"));

var _pluginLogger = _interopRequireDefault(require("../plugin-logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class _default {
  constructor() {
    _defineProperty(this, "runCommand", async () => {
      const pluginPath = fulcrum.dir('plugins');
      let pluginName = fulcrum.args.name;

      if (pluginName && pluginName.indexOf('fulcrum-desktop') !== 0) {
        pluginName = `fulcrum-desktop-${pluginName}`;
      }

      const url = fulcrum.args.url || `https://github.com/fulcrumapp/${pluginName}`;
      const parts = url.split('/');
      const name = parts[parts.length - 1].replace(/\.git/, '');

      const newPluginPath = _path.default.join(pluginPath, name);

      const logger = (0, _pluginLogger.default)(newPluginPath);
      logger.log('Cloning...');
      await _git.default.clone(url, newPluginPath);
      logger.log('Installing dependencies...');
      await _yarn.default.run('install', {
        env: _pluginEnv.default,
        cwd: newPluginPath,
        logger
      });
      logger.log('Plugin installed at', newPluginPath);
    });
  }

  async task(cli) {
    return cli.command({
      command: 'install-plugin',
      desc: 'install a plugin',
      builder: {
        name: {
          type: 'string',
          desc: 'the plugin name'
        },
        url: {
          type: 'string',
          desc: 'the URL to a git repo'
        }
      },
      handler: this.runCommand
    });
  }

}

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL2luc3RhbGwtcGx1Z2luLmpzIl0sIm5hbWVzIjpbInBsdWdpblBhdGgiLCJmdWxjcnVtIiwiZGlyIiwicGx1Z2luTmFtZSIsImFyZ3MiLCJuYW1lIiwiaW5kZXhPZiIsInVybCIsInBhcnRzIiwic3BsaXQiLCJsZW5ndGgiLCJyZXBsYWNlIiwibmV3UGx1Z2luUGF0aCIsInBhdGgiLCJqb2luIiwibG9nZ2VyIiwibG9nIiwiZ2l0IiwiY2xvbmUiLCJ5YXJuIiwicnVuIiwiZW52IiwicGx1Z2luRW52IiwiY3dkIiwidGFzayIsImNsaSIsImNvbW1hbmQiLCJkZXNjIiwiYnVpbGRlciIsInR5cGUiLCJoYW5kbGVyIiwicnVuQ29tbWFuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFFZSxlQUFNO0FBQUE7QUFBQSx3Q0FtQk4sWUFBWTtBQUN2QixZQUFNQSxVQUFVLEdBQUdDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLFNBQVosQ0FBbkI7QUFFQSxVQUFJQyxVQUFVLEdBQUdGLE9BQU8sQ0FBQ0csSUFBUixDQUFhQyxJQUE5Qjs7QUFFQSxVQUFJRixVQUFVLElBQUlBLFVBQVUsQ0FBQ0csT0FBWCxDQUFtQixpQkFBbkIsTUFBMEMsQ0FBNUQsRUFBK0Q7QUFDN0RILFFBQUFBLFVBQVUsR0FBSSxtQkFBbUJBLFVBQVksRUFBN0M7QUFDRDs7QUFFRCxZQUFNSSxHQUFHLEdBQUdOLE9BQU8sQ0FBQ0csSUFBUixDQUFhRyxHQUFiLElBQXFCLGlDQUFpQ0osVUFBWSxFQUE5RTtBQUVBLFlBQU1LLEtBQUssR0FBR0QsR0FBRyxDQUFDRSxLQUFKLENBQVUsR0FBVixDQUFkO0FBRUEsWUFBTUosSUFBSSxHQUFHRyxLQUFLLENBQUNBLEtBQUssQ0FBQ0UsTUFBTixHQUFlLENBQWhCLENBQUwsQ0FBd0JDLE9BQXhCLENBQWdDLE9BQWhDLEVBQXlDLEVBQXpDLENBQWI7O0FBRUEsWUFBTUMsYUFBYSxHQUFHQyxjQUFLQyxJQUFMLENBQVVkLFVBQVYsRUFBc0JLLElBQXRCLENBQXRCOztBQUVBLFlBQU1VLE1BQU0sR0FBRywyQkFBYUgsYUFBYixDQUFmO0FBRUFHLE1BQUFBLE1BQU0sQ0FBQ0MsR0FBUCxDQUFXLFlBQVg7QUFFQSxZQUFNQyxhQUFJQyxLQUFKLENBQVVYLEdBQVYsRUFBZUssYUFBZixDQUFOO0FBRUFHLE1BQUFBLE1BQU0sQ0FBQ0MsR0FBUCxDQUFXLDRCQUFYO0FBRUEsWUFBTUcsY0FBS0MsR0FBTCxDQUFTLFNBQVQsRUFBb0I7QUFBQ0MsUUFBQUEsR0FBRyxFQUFFQyxrQkFBTjtBQUFpQkMsUUFBQUEsR0FBRyxFQUFFWCxhQUF0QjtBQUFxQ0csUUFBQUE7QUFBckMsT0FBcEIsQ0FBTjtBQUVBQSxNQUFBQSxNQUFNLENBQUNDLEdBQVAsQ0FBVyxxQkFBWCxFQUFrQ0osYUFBbEM7QUFDRCxLQS9Da0I7QUFBQTs7QUFDVCxRQUFKWSxJQUFJLENBQUNDLEdBQUQsRUFBTTtBQUNkLFdBQU9BLEdBQUcsQ0FBQ0MsT0FBSixDQUFZO0FBQ2pCQSxNQUFBQSxPQUFPLEVBQUUsZ0JBRFE7QUFFakJDLE1BQUFBLElBQUksRUFBRSxrQkFGVztBQUdqQkMsTUFBQUEsT0FBTyxFQUFFO0FBQ1B2QixRQUFBQSxJQUFJLEVBQUU7QUFDSndCLFVBQUFBLElBQUksRUFBRSxRQURGO0FBRUpGLFVBQUFBLElBQUksRUFBRTtBQUZGLFNBREM7QUFLUHBCLFFBQUFBLEdBQUcsRUFBRTtBQUNIc0IsVUFBQUEsSUFBSSxFQUFFLFFBREg7QUFFSEYsVUFBQUEsSUFBSSxFQUFFO0FBRkg7QUFMRSxPQUhRO0FBYWpCRyxNQUFBQSxPQUFPLEVBQUUsS0FBS0M7QUFiRyxLQUFaLENBQVA7QUFlRDs7QUFqQmtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgcGx1Z2luRW52IGZyb20gJy4uL3BsdWdpbi1lbnYnO1xuaW1wb3J0IGdpdCBmcm9tICcuLi9naXQnO1xuaW1wb3J0IHlhcm4gZnJvbSAnLi4veWFybic7XG5pbXBvcnQgcGx1Z2luTG9nZ2VyIGZyb20gJy4uL3BsdWdpbi1sb2dnZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gIGFzeW5jIHRhc2soY2xpKSB7XG4gICAgcmV0dXJuIGNsaS5jb21tYW5kKHtcbiAgICAgIGNvbW1hbmQ6ICdpbnN0YWxsLXBsdWdpbicsXG4gICAgICBkZXNjOiAnaW5zdGFsbCBhIHBsdWdpbicsXG4gICAgICBidWlsZGVyOiB7XG4gICAgICAgIG5hbWU6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZXNjOiAndGhlIHBsdWdpbiBuYW1lJ1xuICAgICAgICB9LFxuICAgICAgICB1cmw6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZXNjOiAndGhlIFVSTCB0byBhIGdpdCByZXBvJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaGFuZGxlcjogdGhpcy5ydW5Db21tYW5kXG4gICAgfSk7XG4gIH1cblxuICBydW5Db21tYW5kID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHBsdWdpblBhdGggPSBmdWxjcnVtLmRpcigncGx1Z2lucycpO1xuXG4gICAgbGV0IHBsdWdpbk5hbWUgPSBmdWxjcnVtLmFyZ3MubmFtZTtcblxuICAgIGlmIChwbHVnaW5OYW1lICYmIHBsdWdpbk5hbWUuaW5kZXhPZignZnVsY3J1bS1kZXNrdG9wJykgIT09IDApIHtcbiAgICAgIHBsdWdpbk5hbWUgPSBgZnVsY3J1bS1kZXNrdG9wLSR7IHBsdWdpbk5hbWUgfWA7XG4gICAgfVxuXG4gICAgY29uc3QgdXJsID0gZnVsY3J1bS5hcmdzLnVybCB8fCBgaHR0cHM6Ly9naXRodWIuY29tL2Z1bGNydW1hcHAvJHsgcGx1Z2luTmFtZSB9YDtcblxuICAgIGNvbnN0IHBhcnRzID0gdXJsLnNwbGl0KCcvJyk7XG5cbiAgICBjb25zdCBuYW1lID0gcGFydHNbcGFydHMubGVuZ3RoIC0gMV0ucmVwbGFjZSgvXFwuZ2l0LywgJycpO1xuXG4gICAgY29uc3QgbmV3UGx1Z2luUGF0aCA9IHBhdGguam9pbihwbHVnaW5QYXRoLCBuYW1lKTtcblxuICAgIGNvbnN0IGxvZ2dlciA9IHBsdWdpbkxvZ2dlcihuZXdQbHVnaW5QYXRoKTtcblxuICAgIGxvZ2dlci5sb2coJ0Nsb25pbmcuLi4nKTtcblxuICAgIGF3YWl0IGdpdC5jbG9uZSh1cmwsIG5ld1BsdWdpblBhdGgpO1xuXG4gICAgbG9nZ2VyLmxvZygnSW5zdGFsbGluZyBkZXBlbmRlbmNpZXMuLi4nKTtcblxuICAgIGF3YWl0IHlhcm4ucnVuKCdpbnN0YWxsJywge2VudjogcGx1Z2luRW52LCBjd2Q6IG5ld1BsdWdpblBhdGgsIGxvZ2dlcn0pO1xuXG4gICAgbG9nZ2VyLmxvZygnUGx1Z2luIGluc3RhbGxlZCBhdCcsIG5ld1BsdWdpblBhdGgpO1xuICB9XG59XG4iXX0=