"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _version_ = _interopRequireDefault(require("./migrations/version_001"));

var _version_2 = _interopRequireDefault(require("./migrations/version_002"));

var _version_3 = _interopRequireDefault(require("./migrations/version_003"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MIGRATIONS = {
  '001': _version_.default,
  '002': _version_2.default,
  '003': _version_3.default
};

class Migration {
  constructor(db, versionName) {
    this.db = db;
    this.versionName = versionName;
  }

  async executeMigrationSQL(suffix) {
    const data = MIGRATIONS[this.versionName];
    const sql = [];

    for (let part of data.split('\n\n')) {
      if (part.trim().length && part.trim().substring(0, 2) !== '--') {
        sql.push(part.trim());
      }
    }

    if (sql.length === 0) {
      return [];
    }

    const results = [];

    for (let script of sql) {
      if (this.db.verbose) {
        fulcrum.logger.log(script, '\n');
      }

      results.push(await this.db.execute(script));
    }

    return results;
  }

  async executeUpgradeSQL() {
    return await this.executeMigrationSQL('up');
  }

  async executeDowngradeSQL() {
    return await this.executeMigrationSQL('down');
  }

  async up() {
    return await this.executeUpgradeSQL();
  }

  async down() {
    return await this.executeDowngradeSQL();
  }

}

exports.default = Migration;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kYi9taWdyYXRpb24uanMiXSwibmFtZXMiOlsiTUlHUkFUSU9OUyIsIlYxIiwiVjIiLCJWMyIsIk1pZ3JhdGlvbiIsImNvbnN0cnVjdG9yIiwiZGIiLCJ2ZXJzaW9uTmFtZSIsImV4ZWN1dGVNaWdyYXRpb25TUUwiLCJzdWZmaXgiLCJkYXRhIiwic3FsIiwicGFydCIsInNwbGl0IiwidHJpbSIsImxlbmd0aCIsInN1YnN0cmluZyIsInB1c2giLCJyZXN1bHRzIiwic2NyaXB0IiwidmVyYm9zZSIsImZ1bGNydW0iLCJsb2dnZXIiLCJsb2ciLCJleGVjdXRlIiwiZXhlY3V0ZVVwZ3JhZGVTUUwiLCJleGVjdXRlRG93bmdyYWRlU1FMIiwidXAiLCJkb3duIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxNQUFNQSxVQUFVLEdBQUc7QUFDakIsU0FBT0MsaUJBRFU7QUFFakIsU0FBT0Msa0JBRlU7QUFHakIsU0FBT0M7QUFIVSxDQUFuQjs7QUFNZSxNQUFNQyxTQUFOLENBQWdCO0FBQzdCQyxFQUFBQSxXQUFXLENBQUNDLEVBQUQsRUFBS0MsV0FBTCxFQUFrQjtBQUMzQixTQUFLRCxFQUFMLEdBQVVBLEVBQVY7QUFDQSxTQUFLQyxXQUFMLEdBQW1CQSxXQUFuQjtBQUNEOztBQUV3QixRQUFuQkMsbUJBQW1CLENBQUNDLE1BQUQsRUFBUztBQUNoQyxVQUFNQyxJQUFJLEdBQUdWLFVBQVUsQ0FBQyxLQUFLTyxXQUFOLENBQXZCO0FBRUEsVUFBTUksR0FBRyxHQUFHLEVBQVo7O0FBRUEsU0FBSyxJQUFJQyxJQUFULElBQWlCRixJQUFJLENBQUNHLEtBQUwsQ0FBVyxNQUFYLENBQWpCLEVBQXFDO0FBQ25DLFVBQUlELElBQUksQ0FBQ0UsSUFBTCxHQUFZQyxNQUFaLElBQXNCSCxJQUFJLENBQUNFLElBQUwsR0FBWUUsU0FBWixDQUFzQixDQUF0QixFQUF5QixDQUF6QixNQUFnQyxJQUExRCxFQUFnRTtBQUM5REwsUUFBQUEsR0FBRyxDQUFDTSxJQUFKLENBQVNMLElBQUksQ0FBQ0UsSUFBTCxFQUFUO0FBQ0Q7QUFDRjs7QUFFRCxRQUFJSCxHQUFHLENBQUNJLE1BQUosS0FBZSxDQUFuQixFQUFzQjtBQUNwQixhQUFPLEVBQVA7QUFDRDs7QUFFRCxVQUFNRyxPQUFPLEdBQUcsRUFBaEI7O0FBRUEsU0FBSyxJQUFJQyxNQUFULElBQW1CUixHQUFuQixFQUF3QjtBQUN0QixVQUFJLEtBQUtMLEVBQUwsQ0FBUWMsT0FBWixFQUFxQjtBQUNuQkMsUUFBQUEsT0FBTyxDQUFDQyxNQUFSLENBQWVDLEdBQWYsQ0FBbUJKLE1BQW5CLEVBQTJCLElBQTNCO0FBQ0Q7O0FBRURELE1BQUFBLE9BQU8sQ0FBQ0QsSUFBUixDQUFhLE1BQU0sS0FBS1gsRUFBTCxDQUFRa0IsT0FBUixDQUFnQkwsTUFBaEIsQ0FBbkI7QUFDRDs7QUFFRCxXQUFPRCxPQUFQO0FBQ0Q7O0FBRXNCLFFBQWpCTyxpQkFBaUIsR0FBRztBQUN4QixXQUFPLE1BQU0sS0FBS2pCLG1CQUFMLENBQXlCLElBQXpCLENBQWI7QUFDRDs7QUFFd0IsUUFBbkJrQixtQkFBbUIsR0FBRztBQUMxQixXQUFPLE1BQU0sS0FBS2xCLG1CQUFMLENBQXlCLE1BQXpCLENBQWI7QUFDRDs7QUFFTyxRQUFGbUIsRUFBRSxHQUFHO0FBQ1QsV0FBTyxNQUFNLEtBQUtGLGlCQUFMLEVBQWI7QUFDRDs7QUFFUyxRQUFKRyxJQUFJLEdBQUc7QUFDWCxXQUFPLE1BQU0sS0FBS0YsbUJBQUwsRUFBYjtBQUNEOztBQWhENEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVjEgZnJvbSAnLi9taWdyYXRpb25zL3ZlcnNpb25fMDAxJztcbmltcG9ydCBWMiBmcm9tICcuL21pZ3JhdGlvbnMvdmVyc2lvbl8wMDInO1xuaW1wb3J0IFYzIGZyb20gJy4vbWlncmF0aW9ucy92ZXJzaW9uXzAwMyc7XG5cbmNvbnN0IE1JR1JBVElPTlMgPSB7XG4gICcwMDEnOiBWMSxcbiAgJzAwMic6IFYyLFxuICAnMDAzJzogVjNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1pZ3JhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKGRiLCB2ZXJzaW9uTmFtZSkge1xuICAgIHRoaXMuZGIgPSBkYjtcbiAgICB0aGlzLnZlcnNpb25OYW1lID0gdmVyc2lvbk5hbWU7XG4gIH1cblxuICBhc3luYyBleGVjdXRlTWlncmF0aW9uU1FMKHN1ZmZpeCkge1xuICAgIGNvbnN0IGRhdGEgPSBNSUdSQVRJT05TW3RoaXMudmVyc2lvbk5hbWVdO1xuXG4gICAgY29uc3Qgc3FsID0gW107XG5cbiAgICBmb3IgKGxldCBwYXJ0IG9mIGRhdGEuc3BsaXQoJ1xcblxcbicpKSB7XG4gICAgICBpZiAocGFydC50cmltKCkubGVuZ3RoICYmIHBhcnQudHJpbSgpLnN1YnN0cmluZygwLCAyKSAhPT0gJy0tJykge1xuICAgICAgICBzcWwucHVzaChwYXJ0LnRyaW0oKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNxbC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHRzID0gW107XG5cbiAgICBmb3IgKGxldCBzY3JpcHQgb2Ygc3FsKSB7XG4gICAgICBpZiAodGhpcy5kYi52ZXJib3NlKSB7XG4gICAgICAgIGZ1bGNydW0ubG9nZ2VyLmxvZyhzY3JpcHQsICdcXG4nKTtcbiAgICAgIH1cblxuICAgICAgcmVzdWx0cy5wdXNoKGF3YWl0IHRoaXMuZGIuZXhlY3V0ZShzY3JpcHQpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIGFzeW5jIGV4ZWN1dGVVcGdyYWRlU1FMKCkge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmV4ZWN1dGVNaWdyYXRpb25TUUwoJ3VwJyk7XG4gIH1cblxuICBhc3luYyBleGVjdXRlRG93bmdyYWRlU1FMKCkge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmV4ZWN1dGVNaWdyYXRpb25TUUwoJ2Rvd24nKTtcbiAgfVxuXG4gIGFzeW5jIHVwKCkge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmV4ZWN1dGVVcGdyYWRlU1FMKCk7XG4gIH1cblxuICBhc3luYyBkb3duKCkge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmV4ZWN1dGVEb3duZ3JhZGVTUUwoKTtcbiAgfVxufVxuIl19