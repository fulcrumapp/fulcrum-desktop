"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _child_process = require("child_process");

var _glob = _interopRequireDefault(require("glob"));

var _yarn = _interopRequireDefault(require("../yarn"));

var _pluginLogger = _interopRequireDefault(require("../plugin-logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class _default {
  constructor() {
    _defineProperty(this, "runCommand", async () => {
      const pluginPaths = _glob.default.sync(_path.default.join(fulcrum.dir('plugins'), '*'));

      const promises = [];

      for (const pluginPath of pluginPaths) {
        const pluginDir = _path.default.resolve(pluginPath);

        const logger = (0, _pluginLogger.default)(pluginDir);
        const parts = pluginPath.split(_path.default.sep);
        const name = parts[parts.length - 1];

        if (fulcrum.args.name && name !== fulcrum.args.name) {
          continue;
        }

        logger.log('Watching plugin...', pluginPath);
        promises.push(_yarn.default.run('watch', {
          cwd: pluginDir,
          logger
        }));
      }

      await Promise.all(promises);
    });
  }

  async task(cli) {
    return cli.command({
      command: 'watch-plugins',
      desc: 'watch and recompile all plugins',
      builder: {
        name: {
          desc: 'plugin name to watch',
          type: 'string'
        }
      },
      handler: this.runCommand
    });
  }

}

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL3dhdGNoLXBsdWdpbnMuanMiXSwibmFtZXMiOlsicGx1Z2luUGF0aHMiLCJnbG9iIiwic3luYyIsInBhdGgiLCJqb2luIiwiZnVsY3J1bSIsImRpciIsInByb21pc2VzIiwicGx1Z2luUGF0aCIsInBsdWdpbkRpciIsInJlc29sdmUiLCJsb2dnZXIiLCJwYXJ0cyIsInNwbGl0Iiwic2VwIiwibmFtZSIsImxlbmd0aCIsImFyZ3MiLCJsb2ciLCJwdXNoIiwieWFybiIsInJ1biIsImN3ZCIsIlByb21pc2UiLCJhbGwiLCJ0YXNrIiwiY2xpIiwiY29tbWFuZCIsImRlc2MiLCJidWlsZGVyIiwidHlwZSIsImhhbmRsZXIiLCJydW5Db21tYW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVlLGVBQU07QUFBQTtBQUFBLHdDQWVOLFlBQVk7QUFDdkIsWUFBTUEsV0FBVyxHQUFHQyxjQUFLQyxJQUFMLENBQVVDLGNBQUtDLElBQUwsQ0FBVUMsT0FBTyxDQUFDQyxHQUFSLENBQVksU0FBWixDQUFWLEVBQWtDLEdBQWxDLENBQVYsQ0FBcEI7O0FBRUEsWUFBTUMsUUFBUSxHQUFHLEVBQWpCOztBQUVBLFdBQUssTUFBTUMsVUFBWCxJQUF5QlIsV0FBekIsRUFBc0M7QUFDcEMsY0FBTVMsU0FBUyxHQUFHTixjQUFLTyxPQUFMLENBQWFGLFVBQWIsQ0FBbEI7O0FBRUEsY0FBTUcsTUFBTSxHQUFHLDJCQUFhRixTQUFiLENBQWY7QUFFQSxjQUFNRyxLQUFLLEdBQUdKLFVBQVUsQ0FBQ0ssS0FBWCxDQUFpQlYsY0FBS1csR0FBdEIsQ0FBZDtBQUNBLGNBQU1DLElBQUksR0FBR0gsS0FBSyxDQUFDQSxLQUFLLENBQUNJLE1BQU4sR0FBZSxDQUFoQixDQUFsQjs7QUFFQSxZQUFJWCxPQUFPLENBQUNZLElBQVIsQ0FBYUYsSUFBYixJQUFxQkEsSUFBSSxLQUFLVixPQUFPLENBQUNZLElBQVIsQ0FBYUYsSUFBL0MsRUFBcUQ7QUFDbkQ7QUFDRDs7QUFFREosUUFBQUEsTUFBTSxDQUFDTyxHQUFQLENBQVcsb0JBQVgsRUFBaUNWLFVBQWpDO0FBRUFELFFBQUFBLFFBQVEsQ0FBQ1ksSUFBVCxDQUFjQyxjQUFLQyxHQUFMLENBQVMsT0FBVCxFQUFrQjtBQUFDQyxVQUFBQSxHQUFHLEVBQUViLFNBQU47QUFBaUJFLFVBQUFBO0FBQWpCLFNBQWxCLENBQWQ7QUFDRDs7QUFFRCxZQUFNWSxPQUFPLENBQUNDLEdBQVIsQ0FBWWpCLFFBQVosQ0FBTjtBQUNELEtBdENrQjtBQUFBOztBQUNULFFBQUprQixJQUFJLENBQUNDLEdBQUQsRUFBTTtBQUNkLFdBQU9BLEdBQUcsQ0FBQ0MsT0FBSixDQUFZO0FBQ2pCQSxNQUFBQSxPQUFPLEVBQUUsZUFEUTtBQUVqQkMsTUFBQUEsSUFBSSxFQUFFLGlDQUZXO0FBR2pCQyxNQUFBQSxPQUFPLEVBQUU7QUFDUGQsUUFBQUEsSUFBSSxFQUFFO0FBQ0phLFVBQUFBLElBQUksRUFBRSxzQkFERjtBQUVKRSxVQUFBQSxJQUFJLEVBQUU7QUFGRjtBQURDLE9BSFE7QUFTakJDLE1BQUFBLE9BQU8sRUFBRSxLQUFLQztBQVRHLEtBQVosQ0FBUDtBQVdEOztBQWJrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgc3Bhd24sIGV4ZWMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCBnbG9iIGZyb20gJ2dsb2InO1xuaW1wb3J0IHlhcm4gZnJvbSAnLi4veWFybic7XG5pbXBvcnQgcGx1Z2luTG9nZ2VyIGZyb20gJy4uL3BsdWdpbi1sb2dnZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gIGFzeW5jIHRhc2soY2xpKSB7XG4gICAgcmV0dXJuIGNsaS5jb21tYW5kKHtcbiAgICAgIGNvbW1hbmQ6ICd3YXRjaC1wbHVnaW5zJyxcbiAgICAgIGRlc2M6ICd3YXRjaCBhbmQgcmVjb21waWxlIGFsbCBwbHVnaW5zJyxcbiAgICAgIGJ1aWxkZXI6IHtcbiAgICAgICAgbmFtZToge1xuICAgICAgICAgIGRlc2M6ICdwbHVnaW4gbmFtZSB0byB3YXRjaCcsXG4gICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGhhbmRsZXI6IHRoaXMucnVuQ29tbWFuZFxuICAgIH0pO1xuICB9XG5cbiAgcnVuQ29tbWFuZCA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBwbHVnaW5QYXRocyA9IGdsb2Iuc3luYyhwYXRoLmpvaW4oZnVsY3J1bS5kaXIoJ3BsdWdpbnMnKSwgJyonKSk7XG5cbiAgICBjb25zdCBwcm9taXNlcyA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBwbHVnaW5QYXRoIG9mIHBsdWdpblBhdGhzKSB7XG4gICAgICBjb25zdCBwbHVnaW5EaXIgPSBwYXRoLnJlc29sdmUocGx1Z2luUGF0aCk7XG5cbiAgICAgIGNvbnN0IGxvZ2dlciA9IHBsdWdpbkxvZ2dlcihwbHVnaW5EaXIpO1xuXG4gICAgICBjb25zdCBwYXJ0cyA9IHBsdWdpblBhdGguc3BsaXQocGF0aC5zZXApO1xuICAgICAgY29uc3QgbmFtZSA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdO1xuXG4gICAgICBpZiAoZnVsY3J1bS5hcmdzLm5hbWUgJiYgbmFtZSAhPT0gZnVsY3J1bS5hcmdzLm5hbWUpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxvZ2dlci5sb2coJ1dhdGNoaW5nIHBsdWdpbi4uLicsIHBsdWdpblBhdGgpO1xuXG4gICAgICBwcm9taXNlcy5wdXNoKHlhcm4ucnVuKCd3YXRjaCcsIHtjd2Q6IHBsdWdpbkRpciwgbG9nZ2VyfSkpO1xuICAgIH1cblxuICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgfVxufVxuIl19