"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = pluginPath => {
  const parts = pluginPath.split(_path.default.sep);
  const name = parts[parts.length - 1];

  const stdoutWrite = data => {
    process.stdout.write(name.green + ' ' + data.toString());
  };

  const stderrWrite = data => {
    process.stderr.write(name.red + ' ' + data.toString());
  };

  return {
    stdoutWrite,
    stderrWrite,
    log: (...args) => {
      stdoutWrite(_util.format.apply(null, args) + '\n');
    },
    error: (...args) => {
      stderrWrite(_util.format.apply(null, args) + '\n');
    }
  };
};

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wbHVnaW4tbG9nZ2VyLmpzIl0sIm5hbWVzIjpbInBsdWdpblBhdGgiLCJwYXJ0cyIsInNwbGl0IiwicGF0aCIsInNlcCIsIm5hbWUiLCJsZW5ndGgiLCJzdGRvdXRXcml0ZSIsImRhdGEiLCJwcm9jZXNzIiwic3Rkb3V0Iiwid3JpdGUiLCJncmVlbiIsInRvU3RyaW5nIiwic3RkZXJyV3JpdGUiLCJzdGRlcnIiLCJyZWQiLCJsb2ciLCJhcmdzIiwiZm9ybWF0IiwiYXBwbHkiLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOzs7O2VBRWdCQSxVQUFELElBQWdCO0FBQzdCLFFBQU1DLEtBQUssR0FBR0QsVUFBVSxDQUFDRSxLQUFYLENBQWlCQyxjQUFLQyxHQUF0QixDQUFkO0FBQ0EsUUFBTUMsSUFBSSxHQUFHSixLQUFLLENBQUNBLEtBQUssQ0FBQ0ssTUFBTixHQUFlLENBQWhCLENBQWxCOztBQUVBLFFBQU1DLFdBQVcsR0FBSUMsSUFBRCxJQUFVO0FBQzVCQyxJQUFBQSxPQUFPLENBQUNDLE1BQVIsQ0FBZUMsS0FBZixDQUFxQk4sSUFBSSxDQUFDTyxLQUFMLEdBQWEsR0FBYixHQUFtQkosSUFBSSxDQUFDSyxRQUFMLEVBQXhDO0FBQ0QsR0FGRDs7QUFJQSxRQUFNQyxXQUFXLEdBQUlOLElBQUQsSUFBVTtBQUM1QkMsSUFBQUEsT0FBTyxDQUFDTSxNQUFSLENBQWVKLEtBQWYsQ0FBcUJOLElBQUksQ0FBQ1csR0FBTCxHQUFXLEdBQVgsR0FBaUJSLElBQUksQ0FBQ0ssUUFBTCxFQUF0QztBQUNELEdBRkQ7O0FBSUEsU0FBTztBQUNMTixJQUFBQSxXQURLO0FBRUxPLElBQUFBLFdBRks7QUFHTEcsSUFBQUEsR0FBRyxFQUFFLENBQUMsR0FBR0MsSUFBSixLQUFhO0FBQ2hCWCxNQUFBQSxXQUFXLENBQUNZLGFBQU9DLEtBQVAsQ0FBYSxJQUFiLEVBQW1CRixJQUFuQixJQUEyQixJQUE1QixDQUFYO0FBQ0QsS0FMSTtBQU1MRyxJQUFBQSxLQUFLLEVBQUUsQ0FBQyxHQUFHSCxJQUFKLEtBQWE7QUFDbEJKLE1BQUFBLFdBQVcsQ0FBQ0ssYUFBT0MsS0FBUCxDQUFhLElBQWIsRUFBbUJGLElBQW5CLElBQTJCLElBQTVCLENBQVg7QUFDRDtBQVJJLEdBQVA7QUFVRCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQge2Zvcm1hdH0gZnJvbSAndXRpbCc7XG5cbmV4cG9ydCBkZWZhdWx0IChwbHVnaW5QYXRoKSA9PiB7XG4gIGNvbnN0IHBhcnRzID0gcGx1Z2luUGF0aC5zcGxpdChwYXRoLnNlcCk7XG4gIGNvbnN0IG5hbWUgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXTtcblxuICBjb25zdCBzdGRvdXRXcml0ZSA9IChkYXRhKSA9PiB7XG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUobmFtZS5ncmVlbiArICcgJyArIGRhdGEudG9TdHJpbmcoKSk7XG4gIH07XG5cbiAgY29uc3Qgc3RkZXJyV3JpdGUgPSAoZGF0YSkgPT4ge1xuICAgIHByb2Nlc3Muc3RkZXJyLndyaXRlKG5hbWUucmVkICsgJyAnICsgZGF0YS50b1N0cmluZygpKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHN0ZG91dFdyaXRlLFxuICAgIHN0ZGVycldyaXRlLFxuICAgIGxvZzogKC4uLmFyZ3MpID0+IHtcbiAgICAgIHN0ZG91dFdyaXRlKGZvcm1hdC5hcHBseShudWxsLCBhcmdzKSArICdcXG4nKTtcbiAgICB9LFxuICAgIGVycm9yOiAoLi4uYXJncykgPT4ge1xuICAgICAgc3RkZXJyV3JpdGUoZm9ybWF0LmFwcGx5KG51bGwsIGFyZ3MpICsgJ1xcbicpO1xuICAgIH1cbiAgfTtcbn07XG4iXX0=