"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _glob = _interopRequireDefault(require("glob"));

var _yarn = _interopRequireDefault(require("../yarn"));

var _git = _interopRequireDefault(require("../git"));

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
          logger.log('Pulling changes...');
          await _git.default.pull(pluginDir);
          logger.log('Installing dependencies...');
          await _yarn.default.run('install', {
            cwd: pluginDir,
            logger
          });
          logger.log('Plugin updated.');
        } catch (ex) {
          logger.error('Error updating plugin', pluginPath, ex);
        }
      }
    });
  }

  async task(cli) {
    return cli.command({
      command: 'update-plugins',
      desc: 'update all plugins',
      handler: this.runCommand
    });
  }

}

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL3VwZGF0ZS1wbHVnaW5zLmpzIl0sIm5hbWVzIjpbInBsdWdpblBhdGhzIiwiZ2xvYiIsInN5bmMiLCJwYXRoIiwiam9pbiIsImZ1bGNydW0iLCJkaXIiLCJwbHVnaW5QYXRoIiwicGx1Z2luRGlyIiwicmVzb2x2ZSIsImRpcm5hbWUiLCJsb2dnZXIiLCJsb2ciLCJnaXQiLCJwdWxsIiwieWFybiIsInJ1biIsImN3ZCIsImV4IiwiZXJyb3IiLCJ0YXNrIiwiY2xpIiwiY29tbWFuZCIsImRlc2MiLCJoYW5kbGVyIiwicnVuQ29tbWFuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFFZSxlQUFNO0FBQUE7QUFBQSx3Q0FTTixZQUFZO0FBQ3ZCLFlBQU1BLFdBQVcsR0FBR0MsY0FBS0MsSUFBTCxDQUFVQyxjQUFLQyxJQUFMLENBQVVDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLFNBQVosQ0FBVixFQUFrQyxHQUFsQyxFQUF1QyxXQUF2QyxDQUFWLENBQXBCOztBQUVBLFdBQUssTUFBTUMsVUFBWCxJQUF5QlAsV0FBekIsRUFBc0M7QUFDcEMsY0FBTVEsU0FBUyxHQUFHTCxjQUFLTSxPQUFMLENBQWFOLGNBQUtPLE9BQUwsQ0FBYUgsVUFBYixDQUFiLENBQWxCOztBQUVBLGNBQU1JLE1BQU0sR0FBRywyQkFBYUgsU0FBYixDQUFmOztBQUVBLFlBQUk7QUFDRkcsVUFBQUEsTUFBTSxDQUFDQyxHQUFQLENBQVcsb0JBQVg7QUFFQSxnQkFBTUMsYUFBSUMsSUFBSixDQUFTTixTQUFULENBQU47QUFFQUcsVUFBQUEsTUFBTSxDQUFDQyxHQUFQLENBQVcsNEJBQVg7QUFFQSxnQkFBTUcsY0FBS0MsR0FBTCxDQUFTLFNBQVQsRUFBb0I7QUFBQ0MsWUFBQUEsR0FBRyxFQUFFVCxTQUFOO0FBQWlCRyxZQUFBQTtBQUFqQixXQUFwQixDQUFOO0FBRUFBLFVBQUFBLE1BQU0sQ0FBQ0MsR0FBUCxDQUFXLGlCQUFYO0FBQ0QsU0FWRCxDQVVFLE9BQU9NLEVBQVAsRUFBVztBQUNYUCxVQUFBQSxNQUFNLENBQUNRLEtBQVAsQ0FBYSx1QkFBYixFQUFzQ1osVUFBdEMsRUFBa0RXLEVBQWxEO0FBQ0Q7QUFDRjtBQUNGLEtBL0JrQjtBQUFBOztBQUNULFFBQUpFLElBQUksQ0FBQ0MsR0FBRCxFQUFNO0FBQ2QsV0FBT0EsR0FBRyxDQUFDQyxPQUFKLENBQVk7QUFDakJBLE1BQUFBLE9BQU8sRUFBRSxnQkFEUTtBQUVqQkMsTUFBQUEsSUFBSSxFQUFFLG9CQUZXO0FBR2pCQyxNQUFBQSxPQUFPLEVBQUUsS0FBS0M7QUFIRyxLQUFaLENBQVA7QUFLRDs7QUFQa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBnbG9iIGZyb20gJ2dsb2InO1xuaW1wb3J0IHlhcm4gZnJvbSAnLi4veWFybic7XG5pbXBvcnQgZ2l0IGZyb20gJy4uL2dpdCc7XG5pbXBvcnQgcGx1Z2luTG9nZ2VyIGZyb20gJy4uL3BsdWdpbi1sb2dnZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gIGFzeW5jIHRhc2soY2xpKSB7XG4gICAgcmV0dXJuIGNsaS5jb21tYW5kKHtcbiAgICAgIGNvbW1hbmQ6ICd1cGRhdGUtcGx1Z2lucycsXG4gICAgICBkZXNjOiAndXBkYXRlIGFsbCBwbHVnaW5zJyxcbiAgICAgIGhhbmRsZXI6IHRoaXMucnVuQ29tbWFuZFxuICAgIH0pO1xuICB9XG5cbiAgcnVuQ29tbWFuZCA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBwbHVnaW5QYXRocyA9IGdsb2Iuc3luYyhwYXRoLmpvaW4oZnVsY3J1bS5kaXIoJ3BsdWdpbnMnKSwgJyonLCAncGx1Z2luLmpzJykpO1xuXG4gICAgZm9yIChjb25zdCBwbHVnaW5QYXRoIG9mIHBsdWdpblBhdGhzKSB7XG4gICAgICBjb25zdCBwbHVnaW5EaXIgPSBwYXRoLnJlc29sdmUocGF0aC5kaXJuYW1lKHBsdWdpblBhdGgpKTtcblxuICAgICAgY29uc3QgbG9nZ2VyID0gcGx1Z2luTG9nZ2VyKHBsdWdpbkRpcik7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGxvZ2dlci5sb2coJ1B1bGxpbmcgY2hhbmdlcy4uLicpO1xuXG4gICAgICAgIGF3YWl0IGdpdC5wdWxsKHBsdWdpbkRpcik7XG5cbiAgICAgICAgbG9nZ2VyLmxvZygnSW5zdGFsbGluZyBkZXBlbmRlbmNpZXMuLi4nKTtcblxuICAgICAgICBhd2FpdCB5YXJuLnJ1bignaW5zdGFsbCcsIHtjd2Q6IHBsdWdpbkRpciwgbG9nZ2VyfSk7XG5cbiAgICAgICAgbG9nZ2VyLmxvZygnUGx1Z2luIHVwZGF0ZWQuJyk7XG4gICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIHVwZGF0aW5nIHBsdWdpbicsIHBsdWdpblBhdGgsIGV4KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==