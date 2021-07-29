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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluL3BsdWdpbi1sb2dnZXIuanMiXSwibmFtZXMiOlsicGx1Z2luUGF0aCIsInBhcnRzIiwic3BsaXQiLCJwYXRoIiwic2VwIiwibmFtZSIsImxlbmd0aCIsInN0ZG91dFdyaXRlIiwiZGF0YSIsInByb2Nlc3MiLCJzdGRvdXQiLCJ3cml0ZSIsImdyZWVuIiwidG9TdHJpbmciLCJzdGRlcnJXcml0ZSIsInN0ZGVyciIsInJlZCIsImxvZyIsImFyZ3MiLCJmb3JtYXQiLCJhcHBseSIsImVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7Ozs7ZUFFZ0JBLFVBQUQsSUFBZ0I7QUFDN0IsUUFBTUMsS0FBSyxHQUFHRCxVQUFVLENBQUNFLEtBQVgsQ0FBaUJDLGNBQUtDLEdBQXRCLENBQWQ7QUFDQSxRQUFNQyxJQUFJLEdBQUdKLEtBQUssQ0FBQ0EsS0FBSyxDQUFDSyxNQUFOLEdBQWUsQ0FBaEIsQ0FBbEI7O0FBRUEsUUFBTUMsV0FBVyxHQUFJQyxJQUFELElBQVU7QUFDNUJDLElBQUFBLE9BQU8sQ0FBQ0MsTUFBUixDQUFlQyxLQUFmLENBQXFCTixJQUFJLENBQUNPLEtBQUwsR0FBYSxHQUFiLEdBQW1CSixJQUFJLENBQUNLLFFBQUwsRUFBeEM7QUFDRCxHQUZEOztBQUlBLFFBQU1DLFdBQVcsR0FBSU4sSUFBRCxJQUFVO0FBQzVCQyxJQUFBQSxPQUFPLENBQUNNLE1BQVIsQ0FBZUosS0FBZixDQUFxQk4sSUFBSSxDQUFDVyxHQUFMLEdBQVcsR0FBWCxHQUFpQlIsSUFBSSxDQUFDSyxRQUFMLEVBQXRDO0FBQ0QsR0FGRDs7QUFJQSxTQUFPO0FBQ0xOLElBQUFBLFdBREs7QUFFTE8sSUFBQUEsV0FGSztBQUdMRyxJQUFBQSxHQUFHLEVBQUUsQ0FBQyxHQUFHQyxJQUFKLEtBQWE7QUFDaEJYLE1BQUFBLFdBQVcsQ0FBQ1ksYUFBT0MsS0FBUCxDQUFhLElBQWIsRUFBbUJGLElBQW5CLElBQTJCLElBQTVCLENBQVg7QUFDRCxLQUxJO0FBTUxHLElBQUFBLEtBQUssRUFBRSxDQUFDLEdBQUdILElBQUosS0FBYTtBQUNsQkosTUFBQUEsV0FBVyxDQUFDSyxhQUFPQyxLQUFQLENBQWEsSUFBYixFQUFtQkYsSUFBbkIsSUFBMkIsSUFBNUIsQ0FBWDtBQUNEO0FBUkksR0FBUDtBQVVELEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7Zm9ybWF0fSBmcm9tICd1dGlsJztcblxuZXhwb3J0IGRlZmF1bHQgKHBsdWdpblBhdGgpID0+IHtcbiAgY29uc3QgcGFydHMgPSBwbHVnaW5QYXRoLnNwbGl0KHBhdGguc2VwKTtcbiAgY29uc3QgbmFtZSA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdO1xuXG4gIGNvbnN0IHN0ZG91dFdyaXRlID0gKGRhdGEpID0+IHtcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShuYW1lLmdyZWVuICsgJyAnICsgZGF0YS50b1N0cmluZygpKTtcbiAgfTtcblxuICBjb25zdCBzdGRlcnJXcml0ZSA9IChkYXRhKSA9PiB7XG4gICAgcHJvY2Vzcy5zdGRlcnIud3JpdGUobmFtZS5yZWQgKyAnICcgKyBkYXRhLnRvU3RyaW5nKCkpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgc3Rkb3V0V3JpdGUsXG4gICAgc3RkZXJyV3JpdGUsXG4gICAgbG9nOiAoLi4uYXJncykgPT4ge1xuICAgICAgc3Rkb3V0V3JpdGUoZm9ybWF0LmFwcGx5KG51bGwsIGFyZ3MpICsgJ1xcbicpO1xuICAgIH0sXG4gICAgZXJyb3I6ICguLi5hcmdzKSA9PiB7XG4gICAgICBzdGRlcnJXcml0ZShmb3JtYXQuYXBwbHkobnVsbCwgYXJncykgKyAnXFxuJyk7XG4gICAgfVxuICB9O1xufTtcbiJdfQ==