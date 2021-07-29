"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = require("util");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _moment = _interopRequireDefault(require("moment"));

var _environment = _interopRequireDefault(require("./environment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const LOG = 'log';
const WARN = 'warn';
const ERROR = 'error';
const INFO = 'info';
const LEVELS = {
  log: LOG,
  warn: WARN,
  error: ERROR,
  info: INFO
};

class Logger {
  constructor(logPath) {
    _defineProperty(this, "withContext", context => {
      const logger = this;
      return {
        log: (...args) => this.output(LOG, context, ...args),
        warn: (...args) => this.output(WARN, context, ...args),
        error: (...args) => this.output(ERROR, context, ...args),
        info: (...args) => this.output(INFO, context, ...args)
      };
    });

    _defineProperty(this, "output", (level, context, ...args) => {
      this.write(this.prefix(LEVELS[level] || LOG, context) + ' ' + (0, _util.format)(...args));

      if (level !== INFO && !fulcrum.args.debug) {
        console[level](...args);
      }
    });

    _defineProperty(this, "log", (...args) => {
      this.output(LOG, null, ...args);
    });

    _defineProperty(this, "warn", (...args) => {
      this.output(WARN, null, ...args);
    });

    _defineProperty(this, "error", (...args) => {
      this.output(ERROR, null, ...args);
    });

    _defineProperty(this, "info", (...args) => {
      this.output(INFO, null, ...args);
    });

    this._path = logPath;
  }

  write(content) {
    if (content != null) {
      _fs.default.appendFileSync(this.logFilePath, content.toString() + '\n');
    }
  }

  get logFilePath() {
    return _path.default.join(this._path, `fulcrum-${(0, _moment.default)().format('YYYY-MM-DD')}.log`);
  }

  prefix(level, context) {
    return `[${new Date().toISOString()}] [${level}]` + (context ? ` [${context}]` : '');
  }

}

exports.default = Logger;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluL2xvZ2dlci5qcyJdLCJuYW1lcyI6WyJMT0ciLCJXQVJOIiwiRVJST1IiLCJJTkZPIiwiTEVWRUxTIiwibG9nIiwid2FybiIsImVycm9yIiwiaW5mbyIsIkxvZ2dlciIsImNvbnN0cnVjdG9yIiwibG9nUGF0aCIsImNvbnRleHQiLCJsb2dnZXIiLCJhcmdzIiwib3V0cHV0IiwibGV2ZWwiLCJ3cml0ZSIsInByZWZpeCIsImZ1bGNydW0iLCJkZWJ1ZyIsImNvbnNvbGUiLCJfcGF0aCIsImNvbnRlbnQiLCJmcyIsImFwcGVuZEZpbGVTeW5jIiwibG9nRmlsZVBhdGgiLCJ0b1N0cmluZyIsInBhdGgiLCJqb2luIiwiZm9ybWF0IiwiRGF0ZSIsInRvSVNPU3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLE1BQU1BLEdBQUcsR0FBRyxLQUFaO0FBQ0EsTUFBTUMsSUFBSSxHQUFHLE1BQWI7QUFDQSxNQUFNQyxLQUFLLEdBQUcsT0FBZDtBQUNBLE1BQU1DLElBQUksR0FBRyxNQUFiO0FBRUEsTUFBTUMsTUFBTSxHQUFHO0FBQ2JDLEVBQUFBLEdBQUcsRUFBRUwsR0FEUTtBQUViTSxFQUFBQSxJQUFJLEVBQUVMLElBRk87QUFHYk0sRUFBQUEsS0FBSyxFQUFFTCxLQUhNO0FBSWJNLEVBQUFBLElBQUksRUFBRUw7QUFKTyxDQUFmOztBQU9lLE1BQU1NLE1BQU4sQ0FBYTtBQUMxQkMsRUFBQUEsV0FBVyxDQUFDQyxPQUFELEVBQVU7QUFBQSx5Q0FjTkMsT0FBRCxJQUFhO0FBQ3pCLFlBQU1DLE1BQU0sR0FBRyxJQUFmO0FBRUEsYUFBTztBQUNMUixRQUFBQSxHQUFHLEVBQUUsQ0FBQyxHQUFHUyxJQUFKLEtBQWEsS0FBS0MsTUFBTCxDQUFZZixHQUFaLEVBQWlCWSxPQUFqQixFQUEwQixHQUFHRSxJQUE3QixDQURiO0FBRUxSLFFBQUFBLElBQUksRUFBRSxDQUFDLEdBQUdRLElBQUosS0FBYSxLQUFLQyxNQUFMLENBQVlkLElBQVosRUFBa0JXLE9BQWxCLEVBQTJCLEdBQUdFLElBQTlCLENBRmQ7QUFHTFAsUUFBQUEsS0FBSyxFQUFFLENBQUMsR0FBR08sSUFBSixLQUFhLEtBQUtDLE1BQUwsQ0FBWWIsS0FBWixFQUFtQlUsT0FBbkIsRUFBNEIsR0FBR0UsSUFBL0IsQ0FIZjtBQUlMTixRQUFBQSxJQUFJLEVBQUUsQ0FBQyxHQUFHTSxJQUFKLEtBQWEsS0FBS0MsTUFBTCxDQUFZWixJQUFaLEVBQWtCUyxPQUFsQixFQUEyQixHQUFHRSxJQUE5QjtBQUpkLE9BQVA7QUFNRCxLQXZCb0I7O0FBQUEsb0NBeUJaLENBQUNFLEtBQUQsRUFBUUosT0FBUixFQUFpQixHQUFHRSxJQUFwQixLQUE2QjtBQUNwQyxXQUFLRyxLQUFMLENBQVcsS0FBS0MsTUFBTCxDQUFZZCxNQUFNLENBQUNZLEtBQUQsQ0FBTixJQUFpQmhCLEdBQTdCLEVBQWtDWSxPQUFsQyxJQUE2QyxHQUE3QyxHQUFtRCxrQkFBTyxHQUFHRSxJQUFWLENBQTlEOztBQUVBLFVBQUlFLEtBQUssS0FBS2IsSUFBVixJQUFrQixDQUFDZ0IsT0FBTyxDQUFDTCxJQUFSLENBQWFNLEtBQXBDLEVBQTJDO0FBQ3pDQyxRQUFBQSxPQUFPLENBQUNMLEtBQUQsQ0FBUCxDQUFlLEdBQUdGLElBQWxCO0FBQ0Q7QUFDRixLQS9Cb0I7O0FBQUEsaUNBaUNmLENBQUMsR0FBR0EsSUFBSixLQUFhO0FBQ2pCLFdBQUtDLE1BQUwsQ0FBWWYsR0FBWixFQUFpQixJQUFqQixFQUF1QixHQUFHYyxJQUExQjtBQUNELEtBbkNvQjs7QUFBQSxrQ0FxQ2QsQ0FBQyxHQUFHQSxJQUFKLEtBQWE7QUFDbEIsV0FBS0MsTUFBTCxDQUFZZCxJQUFaLEVBQWtCLElBQWxCLEVBQXdCLEdBQUdhLElBQTNCO0FBQ0QsS0F2Q29COztBQUFBLG1DQXlDYixDQUFDLEdBQUdBLElBQUosS0FBYTtBQUNuQixXQUFLQyxNQUFMLENBQVliLEtBQVosRUFBbUIsSUFBbkIsRUFBeUIsR0FBR1ksSUFBNUI7QUFDRCxLQTNDb0I7O0FBQUEsa0NBNkNkLENBQUMsR0FBR0EsSUFBSixLQUFhO0FBQ2xCLFdBQUtDLE1BQUwsQ0FBWVosSUFBWixFQUFrQixJQUFsQixFQUF3QixHQUFHVyxJQUEzQjtBQUNELEtBL0NvQjs7QUFDbkIsU0FBS1EsS0FBTCxHQUFhWCxPQUFiO0FBQ0Q7O0FBRURNLEVBQUFBLEtBQUssQ0FBQ00sT0FBRCxFQUFVO0FBQ2IsUUFBSUEsT0FBTyxJQUFJLElBQWYsRUFBcUI7QUFDbkJDLGtCQUFHQyxjQUFILENBQWtCLEtBQUtDLFdBQXZCLEVBQW9DSCxPQUFPLENBQUNJLFFBQVIsS0FBcUIsSUFBekQ7QUFDRDtBQUNGOztBQUVjLE1BQVhELFdBQVcsR0FBRztBQUNoQixXQUFPRSxjQUFLQyxJQUFMLENBQVUsS0FBS1AsS0FBZixFQUF1QixXQUFXLHVCQUFTUSxNQUFULENBQWdCLFlBQWhCLENBQStCLE1BQWpFLENBQVA7QUFDRDs7QUFxQ0RaLEVBQUFBLE1BQU0sQ0FBQ0YsS0FBRCxFQUFRSixPQUFSLEVBQWlCO0FBQ3JCLFdBQVEsSUFBRyxJQUFJbUIsSUFBSixHQUFXQyxXQUFYLEVBQXlCLE1BQUtoQixLQUFNLEdBQXhDLElBQThDSixPQUFPLEdBQUksS0FBSUEsT0FBUSxHQUFoQixHQUFxQixFQUExRSxDQUFQO0FBQ0Q7O0FBcER5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZvcm1hdCB9IGZyb20gJ3V0aWwnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IGVudiBmcm9tICcuL2Vudmlyb25tZW50JztcblxuY29uc3QgTE9HID0gJ2xvZyc7XG5jb25zdCBXQVJOID0gJ3dhcm4nO1xuY29uc3QgRVJST1IgPSAnZXJyb3InO1xuY29uc3QgSU5GTyA9ICdpbmZvJztcblxuY29uc3QgTEVWRUxTID0ge1xuICBsb2c6IExPRyxcbiAgd2FybjogV0FSTixcbiAgZXJyb3I6IEVSUk9SLFxuICBpbmZvOiBJTkZPXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2dnZXIge1xuICBjb25zdHJ1Y3Rvcihsb2dQYXRoKSB7XG4gICAgdGhpcy5fcGF0aCA9IGxvZ1BhdGg7XG4gIH1cblxuICB3cml0ZShjb250ZW50KSB7XG4gICAgaWYgKGNvbnRlbnQgIT0gbnVsbCkge1xuICAgICAgZnMuYXBwZW5kRmlsZVN5bmModGhpcy5sb2dGaWxlUGF0aCwgY29udGVudC50b1N0cmluZygpICsgJ1xcbicpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBsb2dGaWxlUGF0aCgpIHtcbiAgICByZXR1cm4gcGF0aC5qb2luKHRoaXMuX3BhdGgsIGBmdWxjcnVtLSR7IG1vbWVudCgpLmZvcm1hdCgnWVlZWS1NTS1ERCcpIH0ubG9nYCk7XG4gIH1cblxuICB3aXRoQ29udGV4dCA9IChjb250ZXh0KSA9PiB7XG4gICAgY29uc3QgbG9nZ2VyID0gdGhpcztcblxuICAgIHJldHVybiB7XG4gICAgICBsb2c6ICguLi5hcmdzKSA9PiB0aGlzLm91dHB1dChMT0csIGNvbnRleHQsIC4uLmFyZ3MpLFxuICAgICAgd2FybjogKC4uLmFyZ3MpID0+IHRoaXMub3V0cHV0KFdBUk4sIGNvbnRleHQsIC4uLmFyZ3MpLFxuICAgICAgZXJyb3I6ICguLi5hcmdzKSA9PiB0aGlzLm91dHB1dChFUlJPUiwgY29udGV4dCwgLi4uYXJncyksXG4gICAgICBpbmZvOiAoLi4uYXJncykgPT4gdGhpcy5vdXRwdXQoSU5GTywgY29udGV4dCwgLi4uYXJncylcbiAgICB9O1xuICB9XG5cbiAgb3V0cHV0ID0gKGxldmVsLCBjb250ZXh0LCAuLi5hcmdzKSA9PiB7XG4gICAgdGhpcy53cml0ZSh0aGlzLnByZWZpeChMRVZFTFNbbGV2ZWxdIHx8IExPRywgY29udGV4dCkgKyAnICcgKyBmb3JtYXQoLi4uYXJncykpO1xuXG4gICAgaWYgKGxldmVsICE9PSBJTkZPICYmICFmdWxjcnVtLmFyZ3MuZGVidWcpIHtcbiAgICAgIGNvbnNvbGVbbGV2ZWxdKC4uLmFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIGxvZyA9ICguLi5hcmdzKSA9PiB7XG4gICAgdGhpcy5vdXRwdXQoTE9HLCBudWxsLCAuLi5hcmdzKTtcbiAgfVxuXG4gIHdhcm4gPSAoLi4uYXJncykgPT4ge1xuICAgIHRoaXMub3V0cHV0KFdBUk4sIG51bGwsIC4uLmFyZ3MpO1xuICB9XG5cbiAgZXJyb3IgPSAoLi4uYXJncykgPT4ge1xuICAgIHRoaXMub3V0cHV0KEVSUk9SLCBudWxsLCAuLi5hcmdzKTtcbiAgfVxuXG4gIGluZm8gPSAoLi4uYXJncykgPT4ge1xuICAgIHRoaXMub3V0cHV0KElORk8sIG51bGwsIC4uLmFyZ3MpO1xuICB9XG5cbiAgcHJlZml4KGxldmVsLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIGBbJHtuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCl9XSBbJHtsZXZlbH1dYCArIChjb250ZXh0ID8gYCBbJHtjb250ZXh0fV1gIDogJycpO1xuICB9XG59XG4iXX0=