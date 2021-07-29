"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _glob = _interopRequireDefault(require("glob"));

var _yarn = _interopRequireDefault(require("../yarn"));

var _pluginLogger = _interopRequireDefault(require("../plugin-logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class _default {
  constructor() {
    _defineProperty(this, "runCommand", async () => {
      const pluginPaths = _glob.default.sync(_path.default.join(fulcrum.dir('plugins'), '*', 'plugin.js'));

      for (const pluginPath of pluginPaths) {
        const pluginDir = _path.default.resolve(_path.default.dirname(pluginPath));

        const logger = (0, _pluginLogger.default)(pluginDir);

        try {
          logger.log('Installing dependencies...', pluginPath);
          await _yarn.default.run('install', {
            cwd: pluginDir,
            logger
          });
          logger.log('Compiling plugin...', pluginPath);
          await _yarn.default.run('build', {
            cwd: pluginDir,
            logger
          });
          logger.log('Plugin built.');
        } catch (ex) {
          logger.error('Error building plugin', pluginPath, ex);
        }
      }
    });
  }

  async task(cli) {
    return cli.command({
      command: 'build-plugins',
      desc: 'build all plugins',
      handler: this.runCommand
    });
  }

}

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL2J1aWxkLXBsdWdpbnMuanMiXSwibmFtZXMiOlsicGx1Z2luUGF0aHMiLCJnbG9iIiwic3luYyIsInBhdGgiLCJqb2luIiwiZnVsY3J1bSIsImRpciIsInBsdWdpblBhdGgiLCJwbHVnaW5EaXIiLCJyZXNvbHZlIiwiZGlybmFtZSIsImxvZ2dlciIsImxvZyIsInlhcm4iLCJydW4iLCJjd2QiLCJleCIsImVycm9yIiwidGFzayIsImNsaSIsImNvbW1hbmQiLCJkZXNjIiwiaGFuZGxlciIsInJ1bkNvbW1hbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRWUsZUFBTTtBQUFBO0FBQUEsd0NBU04sWUFBWTtBQUN2QixZQUFNQSxXQUFXLEdBQUdDLGNBQUtDLElBQUwsQ0FBVUMsY0FBS0MsSUFBTCxDQUFVQyxPQUFPLENBQUNDLEdBQVIsQ0FBWSxTQUFaLENBQVYsRUFBa0MsR0FBbEMsRUFBdUMsV0FBdkMsQ0FBVixDQUFwQjs7QUFFQSxXQUFLLE1BQU1DLFVBQVgsSUFBeUJQLFdBQXpCLEVBQXNDO0FBQ3BDLGNBQU1RLFNBQVMsR0FBR0wsY0FBS00sT0FBTCxDQUFhTixjQUFLTyxPQUFMLENBQWFILFVBQWIsQ0FBYixDQUFsQjs7QUFDQSxjQUFNSSxNQUFNLEdBQUcsMkJBQWFILFNBQWIsQ0FBZjs7QUFFQSxZQUFJO0FBQ0ZHLFVBQUFBLE1BQU0sQ0FBQ0MsR0FBUCxDQUFXLDRCQUFYLEVBQXlDTCxVQUF6QztBQUVBLGdCQUFNTSxjQUFLQyxHQUFMLENBQVMsU0FBVCxFQUFvQjtBQUFDQyxZQUFBQSxHQUFHLEVBQUVQLFNBQU47QUFBaUJHLFlBQUFBO0FBQWpCLFdBQXBCLENBQU47QUFFQUEsVUFBQUEsTUFBTSxDQUFDQyxHQUFQLENBQVcscUJBQVgsRUFBa0NMLFVBQWxDO0FBRUEsZ0JBQU1NLGNBQUtDLEdBQUwsQ0FBUyxPQUFULEVBQWtCO0FBQUNDLFlBQUFBLEdBQUcsRUFBRVAsU0FBTjtBQUFpQkcsWUFBQUE7QUFBakIsV0FBbEIsQ0FBTjtBQUVBQSxVQUFBQSxNQUFNLENBQUNDLEdBQVAsQ0FBVyxlQUFYO0FBQ0QsU0FWRCxDQVVFLE9BQU9JLEVBQVAsRUFBVztBQUNYTCxVQUFBQSxNQUFNLENBQUNNLEtBQVAsQ0FBYSx1QkFBYixFQUFzQ1YsVUFBdEMsRUFBa0RTLEVBQWxEO0FBQ0Q7QUFDRjtBQUNGLEtBOUJrQjtBQUFBOztBQUNULFFBQUpFLElBQUksQ0FBQ0MsR0FBRCxFQUFNO0FBQ2QsV0FBT0EsR0FBRyxDQUFDQyxPQUFKLENBQVk7QUFDakJBLE1BQUFBLE9BQU8sRUFBRSxlQURRO0FBRWpCQyxNQUFBQSxJQUFJLEVBQUUsbUJBRlc7QUFHakJDLE1BQUFBLE9BQU8sRUFBRSxLQUFLQztBQUhHLEtBQVosQ0FBUDtBQUtEOztBQVBrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGdsb2IgZnJvbSAnZ2xvYic7XG5pbXBvcnQgeWFybiBmcm9tICcuLi95YXJuJztcbmltcG9ydCBwbHVnaW5Mb2dnZXIgZnJvbSAnLi4vcGx1Z2luLWxvZ2dlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgYXN5bmMgdGFzayhjbGkpIHtcbiAgICByZXR1cm4gY2xpLmNvbW1hbmQoe1xuICAgICAgY29tbWFuZDogJ2J1aWxkLXBsdWdpbnMnLFxuICAgICAgZGVzYzogJ2J1aWxkIGFsbCBwbHVnaW5zJyxcbiAgICAgIGhhbmRsZXI6IHRoaXMucnVuQ29tbWFuZFxuICAgIH0pO1xuICB9XG5cbiAgcnVuQ29tbWFuZCA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBwbHVnaW5QYXRocyA9IGdsb2Iuc3luYyhwYXRoLmpvaW4oZnVsY3J1bS5kaXIoJ3BsdWdpbnMnKSwgJyonLCAncGx1Z2luLmpzJykpO1xuXG4gICAgZm9yIChjb25zdCBwbHVnaW5QYXRoIG9mIHBsdWdpblBhdGhzKSB7XG4gICAgICBjb25zdCBwbHVnaW5EaXIgPSBwYXRoLnJlc29sdmUocGF0aC5kaXJuYW1lKHBsdWdpblBhdGgpKTtcbiAgICAgIGNvbnN0IGxvZ2dlciA9IHBsdWdpbkxvZ2dlcihwbHVnaW5EaXIpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBsb2dnZXIubG9nKCdJbnN0YWxsaW5nIGRlcGVuZGVuY2llcy4uLicsIHBsdWdpblBhdGgpO1xuXG4gICAgICAgIGF3YWl0IHlhcm4ucnVuKCdpbnN0YWxsJywge2N3ZDogcGx1Z2luRGlyLCBsb2dnZXJ9KTtcblxuICAgICAgICBsb2dnZXIubG9nKCdDb21waWxpbmcgcGx1Z2luLi4uJywgcGx1Z2luUGF0aCk7XG5cbiAgICAgICAgYXdhaXQgeWFybi5ydW4oJ2J1aWxkJywge2N3ZDogcGx1Z2luRGlyLCBsb2dnZXJ9KTtcblxuICAgICAgICBsb2dnZXIubG9nKCdQbHVnaW4gYnVpbHQuJyk7XG4gICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIGJ1aWxkaW5nIHBsdWdpbicsIHBsdWdpblBhdGgsIGV4KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==