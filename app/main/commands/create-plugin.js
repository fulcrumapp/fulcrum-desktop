"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _yarn = _interopRequireDefault(require("../yarn"));

var _git = _interopRequireDefault(require("../git"));

var _mkdirp = _interopRequireDefault(require("mkdirp"));

var _fs = _interopRequireDefault(require("fs"));

var _pluginLogger = _interopRequireDefault(require("../plugin-logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class _default {
  constructor() {
    _defineProperty(this, "runCommand", async () => {
      const pluginPath = fulcrum.dir('plugins');
      const files = ['package.json', 'plugin.js', '.gitignore'];

      const newPluginPath = _path.default.join(pluginPath, fulcrum.args.name);

      _mkdirp.default.sync(newPluginPath);

      for (const file of files) {
        let sourcePath = null;

        if (process.env.DEVELOPMENT) {
          sourcePath = _path.default.resolve(_path.default.join(__dirname, '..', '..', '..', 'resources', 'default-plugin', file));
        } else if (process.platform === 'darwin') {
          sourcePath = _path.default.join(_path.default.dirname(process.execPath), '..', 'default-plugin', file);
        } else {
          sourcePath = _path.default.join(_path.default.dirname(process.execPath), 'default-plugin', file);
        }

        _fs.default.writeFileSync(_path.default.join(newPluginPath, file), _fs.default.readFileSync(sourcePath));
      }

      const logger = (0, _pluginLogger.default)(newPluginPath);
      logger.log('Installing dependencies...');
      await _yarn.default.run('install', {
        cwd: newPluginPath,
        logger
      });
      logger.log('Compiling...');
      await _yarn.default.run('build', {
        cwd: newPluginPath,
        logger
      });
      logger.log('Setting up git repository...');
      await _git.default.init(newPluginPath);
      logger.log('Plugin created at', _path.default.join(pluginPath, fulcrum.args.name));
      logger.log('Run the plugin task using:');
      logger.log('  fulcrum ' + fulcrum.args.name);
    });
  }

  async task(cli) {
    return cli.command({
      command: 'create-plugin',
      desc: 'create a new plugin',
      builder: {
        name: {
          type: 'string',
          desc: 'the new plugin name',
          required: true
        }
      },
      handler: this.runCommand
    });
  }

}

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL2NyZWF0ZS1wbHVnaW4uanMiXSwibmFtZXMiOlsicGx1Z2luUGF0aCIsImZ1bGNydW0iLCJkaXIiLCJmaWxlcyIsIm5ld1BsdWdpblBhdGgiLCJwYXRoIiwiam9pbiIsImFyZ3MiLCJuYW1lIiwibWtkaXJwIiwic3luYyIsImZpbGUiLCJzb3VyY2VQYXRoIiwicHJvY2VzcyIsImVudiIsIkRFVkVMT1BNRU5UIiwicmVzb2x2ZSIsIl9fZGlybmFtZSIsInBsYXRmb3JtIiwiZGlybmFtZSIsImV4ZWNQYXRoIiwiZnMiLCJ3cml0ZUZpbGVTeW5jIiwicmVhZEZpbGVTeW5jIiwibG9nZ2VyIiwibG9nIiwieWFybiIsInJ1biIsImN3ZCIsImdpdCIsImluaXQiLCJ0YXNrIiwiY2xpIiwiY29tbWFuZCIsImRlc2MiLCJidWlsZGVyIiwidHlwZSIsInJlcXVpcmVkIiwiaGFuZGxlciIsInJ1bkNvbW1hbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRWUsZUFBTTtBQUFBO0FBQUEsd0NBZ0JOLFlBQVk7QUFDdkIsWUFBTUEsVUFBVSxHQUFHQyxPQUFPLENBQUNDLEdBQVIsQ0FBWSxTQUFaLENBQW5CO0FBRUEsWUFBTUMsS0FBSyxHQUFHLENBQ1osY0FEWSxFQUVaLFdBRlksRUFHWixZQUhZLENBQWQ7O0FBTUEsWUFBTUMsYUFBYSxHQUFHQyxjQUFLQyxJQUFMLENBQVVOLFVBQVYsRUFBc0JDLE9BQU8sQ0FBQ00sSUFBUixDQUFhQyxJQUFuQyxDQUF0Qjs7QUFFQUMsc0JBQU9DLElBQVAsQ0FBWU4sYUFBWjs7QUFFQSxXQUFLLE1BQU1PLElBQVgsSUFBbUJSLEtBQW5CLEVBQTBCO0FBQ3hCLFlBQUlTLFVBQVUsR0FBRyxJQUFqQjs7QUFFQSxZQUFJQyxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsV0FBaEIsRUFBNkI7QUFDM0JILFVBQUFBLFVBQVUsR0FBR1AsY0FBS1csT0FBTCxDQUFhWCxjQUFLQyxJQUFMLENBQVVXLFNBQVYsRUFBcUIsSUFBckIsRUFBMkIsSUFBM0IsRUFBaUMsSUFBakMsRUFBdUMsV0FBdkMsRUFBb0QsZ0JBQXBELEVBQXNFTixJQUF0RSxDQUFiLENBQWI7QUFDRCxTQUZELE1BRU8sSUFBSUUsT0FBTyxDQUFDSyxRQUFSLEtBQXFCLFFBQXpCLEVBQW1DO0FBQ3hDTixVQUFBQSxVQUFVLEdBQUdQLGNBQUtDLElBQUwsQ0FBVUQsY0FBS2MsT0FBTCxDQUFhTixPQUFPLENBQUNPLFFBQXJCLENBQVYsRUFBMEMsSUFBMUMsRUFBZ0QsZ0JBQWhELEVBQWtFVCxJQUFsRSxDQUFiO0FBQ0QsU0FGTSxNQUVBO0FBQ0xDLFVBQUFBLFVBQVUsR0FBR1AsY0FBS0MsSUFBTCxDQUFVRCxjQUFLYyxPQUFMLENBQWFOLE9BQU8sQ0FBQ08sUUFBckIsQ0FBVixFQUEwQyxnQkFBMUMsRUFBNERULElBQTVELENBQWI7QUFDRDs7QUFFRFUsb0JBQUdDLGFBQUgsQ0FBaUJqQixjQUFLQyxJQUFMLENBQVVGLGFBQVYsRUFBeUJPLElBQXpCLENBQWpCLEVBQWlEVSxZQUFHRSxZQUFILENBQWdCWCxVQUFoQixDQUFqRDtBQUNEOztBQUVELFlBQU1ZLE1BQU0sR0FBRywyQkFBYXBCLGFBQWIsQ0FBZjtBQUVBb0IsTUFBQUEsTUFBTSxDQUFDQyxHQUFQLENBQVcsNEJBQVg7QUFFQSxZQUFNQyxjQUFLQyxHQUFMLENBQVMsU0FBVCxFQUFvQjtBQUFDQyxRQUFBQSxHQUFHLEVBQUV4QixhQUFOO0FBQXFCb0IsUUFBQUE7QUFBckIsT0FBcEIsQ0FBTjtBQUVBQSxNQUFBQSxNQUFNLENBQUNDLEdBQVAsQ0FBVyxjQUFYO0FBRUEsWUFBTUMsY0FBS0MsR0FBTCxDQUFTLE9BQVQsRUFBa0I7QUFBQ0MsUUFBQUEsR0FBRyxFQUFFeEIsYUFBTjtBQUFxQm9CLFFBQUFBO0FBQXJCLE9BQWxCLENBQU47QUFFQUEsTUFBQUEsTUFBTSxDQUFDQyxHQUFQLENBQVcsOEJBQVg7QUFFQSxZQUFNSSxhQUFJQyxJQUFKLENBQVMxQixhQUFULENBQU47QUFFQW9CLE1BQUFBLE1BQU0sQ0FBQ0MsR0FBUCxDQUFXLG1CQUFYLEVBQWdDcEIsY0FBS0MsSUFBTCxDQUFVTixVQUFWLEVBQXNCQyxPQUFPLENBQUNNLElBQVIsQ0FBYUMsSUFBbkMsQ0FBaEM7QUFDQWdCLE1BQUFBLE1BQU0sQ0FBQ0MsR0FBUCxDQUFXLDRCQUFYO0FBQ0FELE1BQUFBLE1BQU0sQ0FBQ0MsR0FBUCxDQUFXLGVBQWV4QixPQUFPLENBQUNNLElBQVIsQ0FBYUMsSUFBdkM7QUFDRCxLQTVEa0I7QUFBQTs7QUFDVCxRQUFKdUIsSUFBSSxDQUFDQyxHQUFELEVBQU07QUFDZCxXQUFPQSxHQUFHLENBQUNDLE9BQUosQ0FBWTtBQUNqQkEsTUFBQUEsT0FBTyxFQUFFLGVBRFE7QUFFakJDLE1BQUFBLElBQUksRUFBRSxxQkFGVztBQUdqQkMsTUFBQUEsT0FBTyxFQUFFO0FBQ1AzQixRQUFBQSxJQUFJLEVBQUU7QUFDSjRCLFVBQUFBLElBQUksRUFBRSxRQURGO0FBRUpGLFVBQUFBLElBQUksRUFBRSxxQkFGRjtBQUdKRyxVQUFBQSxRQUFRLEVBQUU7QUFITjtBQURDLE9BSFE7QUFVakJDLE1BQUFBLE9BQU8sRUFBRSxLQUFLQztBQVZHLEtBQVosQ0FBUDtBQVlEOztBQWRrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHlhcm4gZnJvbSAnLi4veWFybic7XG5pbXBvcnQgZ2l0IGZyb20gJy4uL2dpdCc7XG5pbXBvcnQgbWtkaXJwIGZyb20gJ21rZGlycCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBsdWdpbkxvZ2dlciBmcm9tICcuLi9wbHVnaW4tbG9nZ2VyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICBhc3luYyB0YXNrKGNsaSkge1xuICAgIHJldHVybiBjbGkuY29tbWFuZCh7XG4gICAgICBjb21tYW5kOiAnY3JlYXRlLXBsdWdpbicsXG4gICAgICBkZXNjOiAnY3JlYXRlIGEgbmV3IHBsdWdpbicsXG4gICAgICBidWlsZGVyOiB7XG4gICAgICAgIG5hbWU6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZXNjOiAndGhlIG5ldyBwbHVnaW4gbmFtZScsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWVcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGhhbmRsZXI6IHRoaXMucnVuQ29tbWFuZFxuICAgIH0pO1xuICB9XG5cbiAgcnVuQ29tbWFuZCA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBwbHVnaW5QYXRoID0gZnVsY3J1bS5kaXIoJ3BsdWdpbnMnKTtcblxuICAgIGNvbnN0IGZpbGVzID0gW1xuICAgICAgJ3BhY2thZ2UuanNvbicsXG4gICAgICAncGx1Z2luLmpzJyxcbiAgICAgICcuZ2l0aWdub3JlJ1xuICAgIF07XG5cbiAgICBjb25zdCBuZXdQbHVnaW5QYXRoID0gcGF0aC5qb2luKHBsdWdpblBhdGgsIGZ1bGNydW0uYXJncy5uYW1lKTtcblxuICAgIG1rZGlycC5zeW5jKG5ld1BsdWdpblBhdGgpO1xuXG4gICAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgICBsZXQgc291cmNlUGF0aCA9IG51bGw7XG5cbiAgICAgIGlmIChwcm9jZXNzLmVudi5ERVZFTE9QTUVOVCkge1xuICAgICAgICBzb3VyY2VQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICcuLicsICcuLicsICdyZXNvdXJjZXMnLCAnZGVmYXVsdC1wbHVnaW4nLCBmaWxlKSk7XG4gICAgICB9IGVsc2UgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICdkYXJ3aW4nKSB7XG4gICAgICAgIHNvdXJjZVBhdGggPSBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKHByb2Nlc3MuZXhlY1BhdGgpLCAnLi4nLCAnZGVmYXVsdC1wbHVnaW4nLCBmaWxlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNvdXJjZVBhdGggPSBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKHByb2Nlc3MuZXhlY1BhdGgpLCAnZGVmYXVsdC1wbHVnaW4nLCBmaWxlKTtcbiAgICAgIH1cblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4obmV3UGx1Z2luUGF0aCwgZmlsZSksIGZzLnJlYWRGaWxlU3luYyhzb3VyY2VQYXRoKSk7XG4gICAgfVxuXG4gICAgY29uc3QgbG9nZ2VyID0gcGx1Z2luTG9nZ2VyKG5ld1BsdWdpblBhdGgpO1xuXG4gICAgbG9nZ2VyLmxvZygnSW5zdGFsbGluZyBkZXBlbmRlbmNpZXMuLi4nKTtcblxuICAgIGF3YWl0IHlhcm4ucnVuKCdpbnN0YWxsJywge2N3ZDogbmV3UGx1Z2luUGF0aCwgbG9nZ2VyfSk7XG5cbiAgICBsb2dnZXIubG9nKCdDb21waWxpbmcuLi4nKTtcblxuICAgIGF3YWl0IHlhcm4ucnVuKCdidWlsZCcsIHtjd2Q6IG5ld1BsdWdpblBhdGgsIGxvZ2dlcn0pO1xuXG4gICAgbG9nZ2VyLmxvZygnU2V0dGluZyB1cCBnaXQgcmVwb3NpdG9yeS4uLicpO1xuXG4gICAgYXdhaXQgZ2l0LmluaXQobmV3UGx1Z2luUGF0aCk7XG5cbiAgICBsb2dnZXIubG9nKCdQbHVnaW4gY3JlYXRlZCBhdCcsIHBhdGguam9pbihwbHVnaW5QYXRoLCBmdWxjcnVtLmFyZ3MubmFtZSkpO1xuICAgIGxvZ2dlci5sb2coJ1J1biB0aGUgcGx1Z2luIHRhc2sgdXNpbmc6Jyk7XG4gICAgbG9nZ2VyLmxvZygnICBmdWxjcnVtICcgKyBmdWxjcnVtLmFyZ3MubmFtZSk7XG4gIH1cbn1cbiJdfQ==