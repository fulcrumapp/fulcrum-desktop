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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sb2dnZXIuanMiXSwibmFtZXMiOlsiTE9HIiwiV0FSTiIsIkVSUk9SIiwiSU5GTyIsIkxFVkVMUyIsImxvZyIsIndhcm4iLCJlcnJvciIsImluZm8iLCJMb2dnZXIiLCJjb25zdHJ1Y3RvciIsImxvZ1BhdGgiLCJjb250ZXh0IiwibG9nZ2VyIiwiYXJncyIsIm91dHB1dCIsImxldmVsIiwid3JpdGUiLCJwcmVmaXgiLCJmdWxjcnVtIiwiZGVidWciLCJjb25zb2xlIiwiX3BhdGgiLCJjb250ZW50IiwiZnMiLCJhcHBlbmRGaWxlU3luYyIsImxvZ0ZpbGVQYXRoIiwidG9TdHJpbmciLCJwYXRoIiwiam9pbiIsImZvcm1hdCIsIkRhdGUiLCJ0b0lTT1N0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFFQSxNQUFNQSxHQUFHLEdBQUcsS0FBWjtBQUNBLE1BQU1DLElBQUksR0FBRyxNQUFiO0FBQ0EsTUFBTUMsS0FBSyxHQUFHLE9BQWQ7QUFDQSxNQUFNQyxJQUFJLEdBQUcsTUFBYjtBQUVBLE1BQU1DLE1BQU0sR0FBRztBQUNiQyxFQUFBQSxHQUFHLEVBQUVMLEdBRFE7QUFFYk0sRUFBQUEsSUFBSSxFQUFFTCxJQUZPO0FBR2JNLEVBQUFBLEtBQUssRUFBRUwsS0FITTtBQUliTSxFQUFBQSxJQUFJLEVBQUVMO0FBSk8sQ0FBZjs7QUFPZSxNQUFNTSxNQUFOLENBQWE7QUFDMUJDLEVBQUFBLFdBQVcsQ0FBQ0MsT0FBRCxFQUFVO0FBQUEseUNBY05DLE9BQUQsSUFBYTtBQUN6QixZQUFNQyxNQUFNLEdBQUcsSUFBZjtBQUVBLGFBQU87QUFDTFIsUUFBQUEsR0FBRyxFQUFFLENBQUMsR0FBR1MsSUFBSixLQUFhLEtBQUtDLE1BQUwsQ0FBWWYsR0FBWixFQUFpQlksT0FBakIsRUFBMEIsR0FBR0UsSUFBN0IsQ0FEYjtBQUVMUixRQUFBQSxJQUFJLEVBQUUsQ0FBQyxHQUFHUSxJQUFKLEtBQWEsS0FBS0MsTUFBTCxDQUFZZCxJQUFaLEVBQWtCVyxPQUFsQixFQUEyQixHQUFHRSxJQUE5QixDQUZkO0FBR0xQLFFBQUFBLEtBQUssRUFBRSxDQUFDLEdBQUdPLElBQUosS0FBYSxLQUFLQyxNQUFMLENBQVliLEtBQVosRUFBbUJVLE9BQW5CLEVBQTRCLEdBQUdFLElBQS9CLENBSGY7QUFJTE4sUUFBQUEsSUFBSSxFQUFFLENBQUMsR0FBR00sSUFBSixLQUFhLEtBQUtDLE1BQUwsQ0FBWVosSUFBWixFQUFrQlMsT0FBbEIsRUFBMkIsR0FBR0UsSUFBOUI7QUFKZCxPQUFQO0FBTUQsS0F2Qm9COztBQUFBLG9DQXlCWixDQUFDRSxLQUFELEVBQVFKLE9BQVIsRUFBaUIsR0FBR0UsSUFBcEIsS0FBNkI7QUFDcEMsV0FBS0csS0FBTCxDQUFXLEtBQUtDLE1BQUwsQ0FBWWQsTUFBTSxDQUFDWSxLQUFELENBQU4sSUFBaUJoQixHQUE3QixFQUFrQ1ksT0FBbEMsSUFBNkMsR0FBN0MsR0FBbUQsa0JBQU8sR0FBR0UsSUFBVixDQUE5RDs7QUFFQSxVQUFJRSxLQUFLLEtBQUtiLElBQVYsSUFBa0IsQ0FBQ2dCLE9BQU8sQ0FBQ0wsSUFBUixDQUFhTSxLQUFwQyxFQUEyQztBQUN6Q0MsUUFBQUEsT0FBTyxDQUFDTCxLQUFELENBQVAsQ0FBZSxHQUFHRixJQUFsQjtBQUNEO0FBQ0YsS0EvQm9COztBQUFBLGlDQWlDZixDQUFDLEdBQUdBLElBQUosS0FBYTtBQUNqQixXQUFLQyxNQUFMLENBQVlmLEdBQVosRUFBaUIsSUFBakIsRUFBdUIsR0FBR2MsSUFBMUI7QUFDRCxLQW5Db0I7O0FBQUEsa0NBcUNkLENBQUMsR0FBR0EsSUFBSixLQUFhO0FBQ2xCLFdBQUtDLE1BQUwsQ0FBWWQsSUFBWixFQUFrQixJQUFsQixFQUF3QixHQUFHYSxJQUEzQjtBQUNELEtBdkNvQjs7QUFBQSxtQ0F5Q2IsQ0FBQyxHQUFHQSxJQUFKLEtBQWE7QUFDbkIsV0FBS0MsTUFBTCxDQUFZYixLQUFaLEVBQW1CLElBQW5CLEVBQXlCLEdBQUdZLElBQTVCO0FBQ0QsS0EzQ29COztBQUFBLGtDQTZDZCxDQUFDLEdBQUdBLElBQUosS0FBYTtBQUNsQixXQUFLQyxNQUFMLENBQVlaLElBQVosRUFBa0IsSUFBbEIsRUFBd0IsR0FBR1csSUFBM0I7QUFDRCxLQS9Db0I7O0FBQ25CLFNBQUtRLEtBQUwsR0FBYVgsT0FBYjtBQUNEOztBQUVETSxFQUFBQSxLQUFLLENBQUNNLE9BQUQsRUFBVTtBQUNiLFFBQUlBLE9BQU8sSUFBSSxJQUFmLEVBQXFCO0FBQ25CQyxrQkFBR0MsY0FBSCxDQUFrQixLQUFLQyxXQUF2QixFQUFvQ0gsT0FBTyxDQUFDSSxRQUFSLEtBQXFCLElBQXpEO0FBQ0Q7QUFDRjs7QUFFYyxNQUFYRCxXQUFXLEdBQUc7QUFDaEIsV0FBT0UsY0FBS0MsSUFBTCxDQUFVLEtBQUtQLEtBQWYsRUFBdUIsV0FBVyx1QkFBU1EsTUFBVCxDQUFnQixZQUFoQixDQUErQixNQUFqRSxDQUFQO0FBQ0Q7O0FBcUNEWixFQUFBQSxNQUFNLENBQUNGLEtBQUQsRUFBUUosT0FBUixFQUFpQjtBQUNyQixXQUFRLElBQUcsSUFBSW1CLElBQUosR0FBV0MsV0FBWCxFQUF5QixNQUFLaEIsS0FBTSxHQUF4QyxJQUE4Q0osT0FBTyxHQUFJLEtBQUlBLE9BQVEsR0FBaEIsR0FBcUIsRUFBMUUsQ0FBUDtBQUNEOztBQXBEeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBmb3JtYXQgfSBmcm9tICd1dGlsJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCBlbnYgZnJvbSAnLi9lbnZpcm9ubWVudCc7XG5cbmNvbnN0IExPRyA9ICdsb2cnO1xuY29uc3QgV0FSTiA9ICd3YXJuJztcbmNvbnN0IEVSUk9SID0gJ2Vycm9yJztcbmNvbnN0IElORk8gPSAnaW5mbyc7XG5cbmNvbnN0IExFVkVMUyA9IHtcbiAgbG9nOiBMT0csXG4gIHdhcm46IFdBUk4sXG4gIGVycm9yOiBFUlJPUixcbiAgaW5mbzogSU5GT1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9nZ2VyIHtcbiAgY29uc3RydWN0b3IobG9nUGF0aCkge1xuICAgIHRoaXMuX3BhdGggPSBsb2dQYXRoO1xuICB9XG5cbiAgd3JpdGUoY29udGVudCkge1xuICAgIGlmIChjb250ZW50ICE9IG51bGwpIHtcbiAgICAgIGZzLmFwcGVuZEZpbGVTeW5jKHRoaXMubG9nRmlsZVBhdGgsIGNvbnRlbnQudG9TdHJpbmcoKSArICdcXG4nKTtcbiAgICB9XG4gIH1cblxuICBnZXQgbG9nRmlsZVBhdGgoKSB7XG4gICAgcmV0dXJuIHBhdGguam9pbih0aGlzLl9wYXRoLCBgZnVsY3J1bS0keyBtb21lbnQoKS5mb3JtYXQoJ1lZWVktTU0tREQnKSB9LmxvZ2ApO1xuICB9XG5cbiAgd2l0aENvbnRleHQgPSAoY29udGV4dCkgPT4ge1xuICAgIGNvbnN0IGxvZ2dlciA9IHRoaXM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbG9nOiAoLi4uYXJncykgPT4gdGhpcy5vdXRwdXQoTE9HLCBjb250ZXh0LCAuLi5hcmdzKSxcbiAgICAgIHdhcm46ICguLi5hcmdzKSA9PiB0aGlzLm91dHB1dChXQVJOLCBjb250ZXh0LCAuLi5hcmdzKSxcbiAgICAgIGVycm9yOiAoLi4uYXJncykgPT4gdGhpcy5vdXRwdXQoRVJST1IsIGNvbnRleHQsIC4uLmFyZ3MpLFxuICAgICAgaW5mbzogKC4uLmFyZ3MpID0+IHRoaXMub3V0cHV0KElORk8sIGNvbnRleHQsIC4uLmFyZ3MpXG4gICAgfTtcbiAgfVxuXG4gIG91dHB1dCA9IChsZXZlbCwgY29udGV4dCwgLi4uYXJncykgPT4ge1xuICAgIHRoaXMud3JpdGUodGhpcy5wcmVmaXgoTEVWRUxTW2xldmVsXSB8fCBMT0csIGNvbnRleHQpICsgJyAnICsgZm9ybWF0KC4uLmFyZ3MpKTtcblxuICAgIGlmIChsZXZlbCAhPT0gSU5GTyAmJiAhZnVsY3J1bS5hcmdzLmRlYnVnKSB7XG4gICAgICBjb25zb2xlW2xldmVsXSguLi5hcmdzKTtcbiAgICB9XG4gIH1cblxuICBsb2cgPSAoLi4uYXJncykgPT4ge1xuICAgIHRoaXMub3V0cHV0KExPRywgbnVsbCwgLi4uYXJncyk7XG4gIH1cblxuICB3YXJuID0gKC4uLmFyZ3MpID0+IHtcbiAgICB0aGlzLm91dHB1dChXQVJOLCBudWxsLCAuLi5hcmdzKTtcbiAgfVxuXG4gIGVycm9yID0gKC4uLmFyZ3MpID0+IHtcbiAgICB0aGlzLm91dHB1dChFUlJPUiwgbnVsbCwgLi4uYXJncyk7XG4gIH1cblxuICBpbmZvID0gKC4uLmFyZ3MpID0+IHtcbiAgICB0aGlzLm91dHB1dChJTkZPLCBudWxsLCAuLi5hcmdzKTtcbiAgfVxuXG4gIHByZWZpeChsZXZlbCwgY29udGV4dCkge1xuICAgIHJldHVybiBgWyR7bmV3IERhdGUoKS50b0lTT1N0cmluZygpfV0gWyR7bGV2ZWx9XWAgKyAoY29udGV4dCA/IGAgWyR7Y29udGV4dH1dYCA6ICcnKTtcbiAgfVxufVxuIl19