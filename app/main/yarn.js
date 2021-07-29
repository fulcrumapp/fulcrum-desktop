"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _child_process = require("child_process");

var _path = _interopRequireDefault(require("path"));

var _pluginEnv = _interopRequireDefault(require("./plugin-env"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Yarn {
  static get yarnBin() {
    if (process.env.DEVELOPMENT) {
      return _path.default.resolve(_path.default.join(__dirname, '..', '..', 'resources', 'scripts', 'yarn.js'));
    }

    if (process.platform === 'darwin') {
      return _path.default.resolve(_path.default.join(_path.default.dirname(process.execPath), '..', 'scripts', 'yarn.js'));
    }

    return _path.default.join(_path.default.dirname(process.execPath), 'scripts', 'yarn.js');
  }

  static run(command, options = {}) {
    const env = { ...process.env,
      ...options.env,
      ..._pluginEnv.default,
      ELECTRON_RUN_AS_NODE: 1
    };
    const wrappedCommand = [process.execPath, this.yarnBin, command].join(' ');
    return new Promise((resolve, reject) => {
      try {
        const child = (0, _child_process.exec)(wrappedCommand, { ...options,
          env
        });
        child.stdout.on('data', options.logger.stdoutWrite);
        child.stderr.on('data', options.logger.stderrWrite);
        child.on('exit', function () {
          resolve();
        });
      } catch (ex) {
        reject(ex);
      }
    });
  }

}

exports.default = Yarn;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluL3lhcm4uanMiXSwibmFtZXMiOlsiWWFybiIsInlhcm5CaW4iLCJwcm9jZXNzIiwiZW52IiwiREVWRUxPUE1FTlQiLCJwYXRoIiwicmVzb2x2ZSIsImpvaW4iLCJfX2Rpcm5hbWUiLCJwbGF0Zm9ybSIsImRpcm5hbWUiLCJleGVjUGF0aCIsInJ1biIsImNvbW1hbmQiLCJvcHRpb25zIiwicGx1Z2luRW52IiwiRUxFQ1RST05fUlVOX0FTX05PREUiLCJ3cmFwcGVkQ29tbWFuZCIsIlByb21pc2UiLCJyZWplY3QiLCJjaGlsZCIsInN0ZG91dCIsIm9uIiwibG9nZ2VyIiwic3Rkb3V0V3JpdGUiLCJzdGRlcnIiLCJzdGRlcnJXcml0ZSIsImV4Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7QUFFZSxNQUFNQSxJQUFOLENBQVc7QUFDTixhQUFQQyxPQUFPLEdBQUc7QUFDbkIsUUFBSUMsT0FBTyxDQUFDQyxHQUFSLENBQVlDLFdBQWhCLEVBQTZCO0FBQzNCLGFBQU9DLGNBQUtDLE9BQUwsQ0FBYUQsY0FBS0UsSUFBTCxDQUFVQyxTQUFWLEVBQXFCLElBQXJCLEVBQTJCLElBQTNCLEVBQWlDLFdBQWpDLEVBQThDLFNBQTlDLEVBQXlELFNBQXpELENBQWIsQ0FBUDtBQUNEOztBQUVELFFBQUlOLE9BQU8sQ0FBQ08sUUFBUixLQUFxQixRQUF6QixFQUFtQztBQUNqQyxhQUFPSixjQUFLQyxPQUFMLENBQWFELGNBQUtFLElBQUwsQ0FBVUYsY0FBS0ssT0FBTCxDQUFhUixPQUFPLENBQUNTLFFBQXJCLENBQVYsRUFBMEMsSUFBMUMsRUFBZ0QsU0FBaEQsRUFBMkQsU0FBM0QsQ0FBYixDQUFQO0FBQ0Q7O0FBRUQsV0FBT04sY0FBS0UsSUFBTCxDQUFVRixjQUFLSyxPQUFMLENBQWFSLE9BQU8sQ0FBQ1MsUUFBckIsQ0FBVixFQUEwQyxTQUExQyxFQUFxRCxTQUFyRCxDQUFQO0FBQ0Q7O0FBRVMsU0FBSEMsR0FBRyxDQUFDQyxPQUFELEVBQVVDLE9BQU8sR0FBRyxFQUFwQixFQUF3QjtBQUNoQyxVQUFNWCxHQUFHLEdBQUcsRUFDVixHQUFHRCxPQUFPLENBQUNDLEdBREQ7QUFFVixTQUFHVyxPQUFPLENBQUNYLEdBRkQ7QUFHVixTQUFHWSxrQkFITztBQUlWQyxNQUFBQSxvQkFBb0IsRUFBRTtBQUpaLEtBQVo7QUFPQSxVQUFNQyxjQUFjLEdBQUcsQ0FDckJmLE9BQU8sQ0FBQ1MsUUFEYSxFQUVyQixLQUFLVixPQUZnQixFQUdyQlksT0FIcUIsRUFJckJOLElBSnFCLENBSWhCLEdBSmdCLENBQXZCO0FBTUEsV0FBTyxJQUFJVyxPQUFKLENBQVksQ0FBQ1osT0FBRCxFQUFVYSxNQUFWLEtBQXFCO0FBQ3RDLFVBQUk7QUFDRixjQUFNQyxLQUFLLEdBQUcseUJBQUtILGNBQUwsRUFBcUIsRUFBQyxHQUFHSCxPQUFKO0FBQWFYLFVBQUFBO0FBQWIsU0FBckIsQ0FBZDtBQUVBaUIsUUFBQUEsS0FBSyxDQUFDQyxNQUFOLENBQWFDLEVBQWIsQ0FBZ0IsTUFBaEIsRUFBd0JSLE9BQU8sQ0FBQ1MsTUFBUixDQUFlQyxXQUF2QztBQUVBSixRQUFBQSxLQUFLLENBQUNLLE1BQU4sQ0FBYUgsRUFBYixDQUFnQixNQUFoQixFQUF3QlIsT0FBTyxDQUFDUyxNQUFSLENBQWVHLFdBQXZDO0FBRUFOLFFBQUFBLEtBQUssQ0FBQ0UsRUFBTixDQUFTLE1BQVQsRUFBaUIsWUFBVztBQUMxQmhCLFVBQUFBLE9BQU87QUFDUixTQUZEO0FBR0QsT0FWRCxDQVVFLE9BQU9xQixFQUFQLEVBQVc7QUFDWFIsUUFBQUEsTUFBTSxDQUFDUSxFQUFELENBQU47QUFDRDtBQUNGLEtBZE0sQ0FBUDtBQWVEOztBQTFDdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2V4ZWN9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgcGx1Z2luRW52IGZyb20gJy4vcGx1Z2luLWVudic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFlhcm4ge1xuICBzdGF0aWMgZ2V0IHlhcm5CaW4oKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52LkRFVkVMT1BNRU5UKSB7XG4gICAgICByZXR1cm4gcGF0aC5yZXNvbHZlKHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICcuLicsICdyZXNvdXJjZXMnLCAnc2NyaXB0cycsICd5YXJuLmpzJykpO1xuICAgIH1cblxuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnZGFyd2luJykge1xuICAgICAgcmV0dXJuIHBhdGgucmVzb2x2ZShwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKHByb2Nlc3MuZXhlY1BhdGgpLCAnLi4nLCAnc2NyaXB0cycsICd5YXJuLmpzJykpO1xuICAgIH1cblxuICAgIHJldHVybiBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKHByb2Nlc3MuZXhlY1BhdGgpLCAnc2NyaXB0cycsICd5YXJuLmpzJyk7XG4gIH1cblxuICBzdGF0aWMgcnVuKGNvbW1hbmQsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGVudiA9IHtcbiAgICAgIC4uLnByb2Nlc3MuZW52LFxuICAgICAgLi4ub3B0aW9ucy5lbnYsXG4gICAgICAuLi5wbHVnaW5FbnYsXG4gICAgICBFTEVDVFJPTl9SVU5fQVNfTk9ERTogMVxuICAgIH07XG5cbiAgICBjb25zdCB3cmFwcGVkQ29tbWFuZCA9IFtcbiAgICAgIHByb2Nlc3MuZXhlY1BhdGgsXG4gICAgICB0aGlzLnlhcm5CaW4sXG4gICAgICBjb21tYW5kXG4gICAgXS5qb2luKCcgJyk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgY2hpbGQgPSBleGVjKHdyYXBwZWRDb21tYW5kLCB7Li4ub3B0aW9ucywgZW52fSk7XG5cbiAgICAgICAgY2hpbGQuc3Rkb3V0Lm9uKCdkYXRhJywgb3B0aW9ucy5sb2dnZXIuc3Rkb3V0V3JpdGUpO1xuXG4gICAgICAgIGNoaWxkLnN0ZGVyci5vbignZGF0YScsIG9wdGlvbnMubG9nZ2VyLnN0ZGVycldyaXRlKTtcblxuICAgICAgICBjaGlsZC5vbignZXhpdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICByZWplY3QoZXgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbiJdfQ==