'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('util');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _environment = require('./environment');

var _environment2 = _interopRequireDefault(_environment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    this.withContext = context => {
      const logger = this;

      return {
        log: (...args) => this.output(LOG, context, ...args),
        warn: (...args) => this.output(WARN, context, ...args),
        error: (...args) => this.output(ERROR, context, ...args),
        info: (...args) => this.output(INFO, context, ...args)
      };
    };

    this.output = (level, context, ...args) => {
      this.write(this.prefix(LEVELS[level] || LOG, context) + ' ' + (0, _util.format)(...args));

      if (level !== INFO && !fulcrum.args.debug) {
        console[level](...args);
      }
    };

    this.log = (...args) => {
      this.output(LOG, null, ...args);
    };

    this.warn = (...args) => {
      this.output(WARN, null, ...args);
    };

    this.error = (...args) => {
      this.output(ERROR, null, ...args);
    };

    this.info = (...args) => {
      this.output(INFO, null, ...args);
    };

    this._path = logPath;
  }

  write(content) {
    if (content != null) {
      _fs2.default.appendFileSync(this.logFilePath, content.toString() + '\n');
    }
  }

  get logFilePath() {
    return _path2.default.join(this._path, `fulcrum-${(0, _moment2.default)().format('YYYY-MM-DD')}.log`);
  }

  prefix(level, context) {
    return `[${new Date().toISOString()}] [${level}]` + (context ? ` [${context}]` : '');
  }
}
exports.default = Logger;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluL2xvZ2dlci5qcyJdLCJuYW1lcyI6WyJMT0ciLCJXQVJOIiwiRVJST1IiLCJJTkZPIiwiTEVWRUxTIiwibG9nIiwid2FybiIsImVycm9yIiwiaW5mbyIsIkxvZ2dlciIsImNvbnN0cnVjdG9yIiwibG9nUGF0aCIsIndpdGhDb250ZXh0IiwiY29udGV4dCIsImxvZ2dlciIsImFyZ3MiLCJvdXRwdXQiLCJsZXZlbCIsIndyaXRlIiwicHJlZml4IiwiZnVsY3J1bSIsImRlYnVnIiwiY29uc29sZSIsIl9wYXRoIiwiY29udGVudCIsImFwcGVuZEZpbGVTeW5jIiwibG9nRmlsZVBhdGgiLCJ0b1N0cmluZyIsImpvaW4iLCJmb3JtYXQiLCJEYXRlIiwidG9JU09TdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxNQUFNQSxNQUFNLEtBQVo7QUFDQSxNQUFNQyxPQUFPLE1BQWI7QUFDQSxNQUFNQyxRQUFRLE9BQWQ7QUFDQSxNQUFNQyxPQUFPLE1BQWI7O0FBRUEsTUFBTUMsU0FBUztBQUNiQyxPQUFLTCxHQURRO0FBRWJNLFFBQU1MLElBRk87QUFHYk0sU0FBT0wsS0FITTtBQUliTSxRQUFNTDtBQUpPLENBQWY7O0FBT2UsTUFBTU0sTUFBTixDQUFhO0FBQzFCQyxjQUFZQyxPQUFaLEVBQXFCO0FBQUEsU0FjckJDLFdBZHFCLEdBY05DLE9BQUQsSUFBYTtBQUN6QixZQUFNQyxTQUFTLElBQWY7O0FBRUEsYUFBTztBQUNMVCxhQUFLLENBQUMsR0FBR1UsSUFBSixLQUFhLEtBQUtDLE1BQUwsQ0FBWWhCLEdBQVosRUFBaUJhLE9BQWpCLEVBQTBCLEdBQUdFLElBQTdCLENBRGI7QUFFTFQsY0FBTSxDQUFDLEdBQUdTLElBQUosS0FBYSxLQUFLQyxNQUFMLENBQVlmLElBQVosRUFBa0JZLE9BQWxCLEVBQTJCLEdBQUdFLElBQTlCLENBRmQ7QUFHTFIsZUFBTyxDQUFDLEdBQUdRLElBQUosS0FBYSxLQUFLQyxNQUFMLENBQVlkLEtBQVosRUFBbUJXLE9BQW5CLEVBQTRCLEdBQUdFLElBQS9CLENBSGY7QUFJTFAsY0FBTSxDQUFDLEdBQUdPLElBQUosS0FBYSxLQUFLQyxNQUFMLENBQVliLElBQVosRUFBa0JVLE9BQWxCLEVBQTJCLEdBQUdFLElBQTlCO0FBSmQsT0FBUDtBQU1ELEtBdkJvQjs7QUFBQSxTQXlCckJDLE1BekJxQixHQXlCWixDQUFDQyxLQUFELEVBQVFKLE9BQVIsRUFBaUIsR0FBR0UsSUFBcEIsS0FBNkI7QUFDcEMsV0FBS0csS0FBTCxDQUFXLEtBQUtDLE1BQUwsQ0FBWWYsT0FBT2EsS0FBUCxLQUFpQmpCLEdBQTdCLEVBQWtDYSxPQUFsQyxJQUE2QyxHQUE3QyxHQUFtRCxrQkFBTyxHQUFHRSxJQUFWLENBQTlEOztBQUVBLFVBQUlFLFVBQVVkLElBQVYsSUFBa0IsQ0FBQ2lCLFFBQVFMLElBQVIsQ0FBYU0sS0FBcEMsRUFBMkM7QUFDekNDLGdCQUFRTCxLQUFSLEVBQWUsR0FBR0YsSUFBbEI7QUFDRDtBQUNGLEtBL0JvQjs7QUFBQSxTQWlDckJWLEdBakNxQixHQWlDZixDQUFDLEdBQUdVLElBQUosS0FBYTtBQUNqQixXQUFLQyxNQUFMLENBQVloQixHQUFaLEVBQWlCLElBQWpCLEVBQXVCLEdBQUdlLElBQTFCO0FBQ0QsS0FuQ29COztBQUFBLFNBcUNyQlQsSUFyQ3FCLEdBcUNkLENBQUMsR0FBR1MsSUFBSixLQUFhO0FBQ2xCLFdBQUtDLE1BQUwsQ0FBWWYsSUFBWixFQUFrQixJQUFsQixFQUF3QixHQUFHYyxJQUEzQjtBQUNELEtBdkNvQjs7QUFBQSxTQXlDckJSLEtBekNxQixHQXlDYixDQUFDLEdBQUdRLElBQUosS0FBYTtBQUNuQixXQUFLQyxNQUFMLENBQVlkLEtBQVosRUFBbUIsSUFBbkIsRUFBeUIsR0FBR2EsSUFBNUI7QUFDRCxLQTNDb0I7O0FBQUEsU0E2Q3JCUCxJQTdDcUIsR0E2Q2QsQ0FBQyxHQUFHTyxJQUFKLEtBQWE7QUFDbEIsV0FBS0MsTUFBTCxDQUFZYixJQUFaLEVBQWtCLElBQWxCLEVBQXdCLEdBQUdZLElBQTNCO0FBQ0QsS0EvQ29COztBQUNuQixTQUFLUSxLQUFMLEdBQWFaLE9BQWI7QUFDRDs7QUFFRE8sUUFBTU0sT0FBTixFQUFlO0FBQ2IsUUFBSUEsV0FBVyxJQUFmLEVBQXFCO0FBQ25CLG1CQUFHQyxjQUFILENBQWtCLEtBQUtDLFdBQXZCLEVBQW9DRixRQUFRRyxRQUFSLEtBQXFCLElBQXpEO0FBQ0Q7QUFDRjs7QUFFRCxNQUFJRCxXQUFKLEdBQWtCO0FBQ2hCLFdBQU8sZUFBS0UsSUFBTCxDQUFVLEtBQUtMLEtBQWYsRUFBdUIsV0FBVyx3QkFBU00sTUFBVCxDQUFnQixZQUFoQixDQUErQixNQUFqRSxDQUFQO0FBQ0Q7O0FBcUNEVixTQUFPRixLQUFQLEVBQWNKLE9BQWQsRUFBdUI7QUFDckIsV0FBUSxJQUFHLElBQUlpQixJQUFKLEdBQVdDLFdBQVgsRUFBeUIsTUFBS2QsS0FBTSxHQUF4QyxJQUE4Q0osVUFBVyxLQUFJQSxPQUFRLEdBQXZCLEdBQTRCLEVBQTFFLENBQVA7QUFDRDtBQXBEeUI7a0JBQVBKLE0iLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZm9ybWF0IH0gZnJvbSAndXRpbCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgZW52IGZyb20gJy4vZW52aXJvbm1lbnQnO1xuXG5jb25zdCBMT0cgPSAnbG9nJztcbmNvbnN0IFdBUk4gPSAnd2Fybic7XG5jb25zdCBFUlJPUiA9ICdlcnJvcic7XG5jb25zdCBJTkZPID0gJ2luZm8nO1xuXG5jb25zdCBMRVZFTFMgPSB7XG4gIGxvZzogTE9HLFxuICB3YXJuOiBXQVJOLFxuICBlcnJvcjogRVJST1IsXG4gIGluZm86IElORk9cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ2dlciB7XG4gIGNvbnN0cnVjdG9yKGxvZ1BhdGgpIHtcbiAgICB0aGlzLl9wYXRoID0gbG9nUGF0aDtcbiAgfVxuXG4gIHdyaXRlKGNvbnRlbnQpIHtcbiAgICBpZiAoY29udGVudCAhPSBudWxsKSB7XG4gICAgICBmcy5hcHBlbmRGaWxlU3luYyh0aGlzLmxvZ0ZpbGVQYXRoLCBjb250ZW50LnRvU3RyaW5nKCkgKyAnXFxuJyk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGxvZ0ZpbGVQYXRoKCkge1xuICAgIHJldHVybiBwYXRoLmpvaW4odGhpcy5fcGF0aCwgYGZ1bGNydW0tJHsgbW9tZW50KCkuZm9ybWF0KCdZWVlZLU1NLUREJykgfS5sb2dgKTtcbiAgfVxuXG4gIHdpdGhDb250ZXh0ID0gKGNvbnRleHQpID0+IHtcbiAgICBjb25zdCBsb2dnZXIgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGxvZzogKC4uLmFyZ3MpID0+IHRoaXMub3V0cHV0KExPRywgY29udGV4dCwgLi4uYXJncyksXG4gICAgICB3YXJuOiAoLi4uYXJncykgPT4gdGhpcy5vdXRwdXQoV0FSTiwgY29udGV4dCwgLi4uYXJncyksXG4gICAgICBlcnJvcjogKC4uLmFyZ3MpID0+IHRoaXMub3V0cHV0KEVSUk9SLCBjb250ZXh0LCAuLi5hcmdzKSxcbiAgICAgIGluZm86ICguLi5hcmdzKSA9PiB0aGlzLm91dHB1dChJTkZPLCBjb250ZXh0LCAuLi5hcmdzKVxuICAgIH07XG4gIH1cblxuICBvdXRwdXQgPSAobGV2ZWwsIGNvbnRleHQsIC4uLmFyZ3MpID0+IHtcbiAgICB0aGlzLndyaXRlKHRoaXMucHJlZml4KExFVkVMU1tsZXZlbF0gfHwgTE9HLCBjb250ZXh0KSArICcgJyArIGZvcm1hdCguLi5hcmdzKSk7XG5cbiAgICBpZiAobGV2ZWwgIT09IElORk8gJiYgIWZ1bGNydW0uYXJncy5kZWJ1Zykge1xuICAgICAgY29uc29sZVtsZXZlbF0oLi4uYXJncyk7XG4gICAgfVxuICB9XG5cbiAgbG9nID0gKC4uLmFyZ3MpID0+IHtcbiAgICB0aGlzLm91dHB1dChMT0csIG51bGwsIC4uLmFyZ3MpO1xuICB9XG5cbiAgd2FybiA9ICguLi5hcmdzKSA9PiB7XG4gICAgdGhpcy5vdXRwdXQoV0FSTiwgbnVsbCwgLi4uYXJncyk7XG4gIH1cblxuICBlcnJvciA9ICguLi5hcmdzKSA9PiB7XG4gICAgdGhpcy5vdXRwdXQoRVJST1IsIG51bGwsIC4uLmFyZ3MpO1xuICB9XG5cbiAgaW5mbyA9ICguLi5hcmdzKSA9PiB7XG4gICAgdGhpcy5vdXRwdXQoSU5GTywgbnVsbCwgLi4uYXJncyk7XG4gIH1cblxuICBwcmVmaXgobGV2ZWwsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gYFske25ldyBEYXRlKCkudG9JU09TdHJpbmcoKX1dIFske2xldmVsfV1gICsgKGNvbnRleHQgPyBgIFske2NvbnRleHR9XWAgOiAnJyk7XG4gIH1cbn1cbiJdfQ==