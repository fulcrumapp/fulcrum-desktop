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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2RiL21pZ3JhdGlvbi5qcyJdLCJuYW1lcyI6WyJNSUdSQVRJT05TIiwiVjEiLCJWMiIsIlYzIiwiTWlncmF0aW9uIiwiY29uc3RydWN0b3IiLCJkYiIsInZlcnNpb25OYW1lIiwiZXhlY3V0ZU1pZ3JhdGlvblNRTCIsInN1ZmZpeCIsImRhdGEiLCJzcWwiLCJwYXJ0Iiwic3BsaXQiLCJ0cmltIiwibGVuZ3RoIiwic3Vic3RyaW5nIiwicHVzaCIsInJlc3VsdHMiLCJzY3JpcHQiLCJ2ZXJib3NlIiwiZnVsY3J1bSIsImxvZ2dlciIsImxvZyIsImV4ZWN1dGUiLCJleGVjdXRlVXBncmFkZVNRTCIsImV4ZWN1dGVEb3duZ3JhZGVTUUwiLCJ1cCIsImRvd24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7OztBQUVBLE1BQU1BLFVBQVUsR0FBRztBQUNqQixTQUFPQyxpQkFEVTtBQUVqQixTQUFPQyxrQkFGVTtBQUdqQixTQUFPQztBQUhVLENBQW5COztBQU1lLE1BQU1DLFNBQU4sQ0FBZ0I7QUFDN0JDLEVBQUFBLFdBQVcsQ0FBQ0MsRUFBRCxFQUFLQyxXQUFMLEVBQWtCO0FBQzNCLFNBQUtELEVBQUwsR0FBVUEsRUFBVjtBQUNBLFNBQUtDLFdBQUwsR0FBbUJBLFdBQW5CO0FBQ0Q7O0FBRXdCLFFBQW5CQyxtQkFBbUIsQ0FBQ0MsTUFBRCxFQUFTO0FBQ2hDLFVBQU1DLElBQUksR0FBR1YsVUFBVSxDQUFDLEtBQUtPLFdBQU4sQ0FBdkI7QUFFQSxVQUFNSSxHQUFHLEdBQUcsRUFBWjs7QUFFQSxTQUFLLElBQUlDLElBQVQsSUFBaUJGLElBQUksQ0FBQ0csS0FBTCxDQUFXLE1BQVgsQ0FBakIsRUFBcUM7QUFDbkMsVUFBSUQsSUFBSSxDQUFDRSxJQUFMLEdBQVlDLE1BQVosSUFBc0JILElBQUksQ0FBQ0UsSUFBTCxHQUFZRSxTQUFaLENBQXNCLENBQXRCLEVBQXlCLENBQXpCLE1BQWdDLElBQTFELEVBQWdFO0FBQzlETCxRQUFBQSxHQUFHLENBQUNNLElBQUosQ0FBU0wsSUFBSSxDQUFDRSxJQUFMLEVBQVQ7QUFDRDtBQUNGOztBQUVELFFBQUlILEdBQUcsQ0FBQ0ksTUFBSixLQUFlLENBQW5CLEVBQXNCO0FBQ3BCLGFBQU8sRUFBUDtBQUNEOztBQUVELFVBQU1HLE9BQU8sR0FBRyxFQUFoQjs7QUFFQSxTQUFLLElBQUlDLE1BQVQsSUFBbUJSLEdBQW5CLEVBQXdCO0FBQ3RCLFVBQUksS0FBS0wsRUFBTCxDQUFRYyxPQUFaLEVBQXFCO0FBQ25CQyxRQUFBQSxPQUFPLENBQUNDLE1BQVIsQ0FBZUMsR0FBZixDQUFtQkosTUFBbkIsRUFBMkIsSUFBM0I7QUFDRDs7QUFFREQsTUFBQUEsT0FBTyxDQUFDRCxJQUFSLENBQWEsTUFBTSxLQUFLWCxFQUFMLENBQVFrQixPQUFSLENBQWdCTCxNQUFoQixDQUFuQjtBQUNEOztBQUVELFdBQU9ELE9BQVA7QUFDRDs7QUFFc0IsUUFBakJPLGlCQUFpQixHQUFHO0FBQ3hCLFdBQU8sTUFBTSxLQUFLakIsbUJBQUwsQ0FBeUIsSUFBekIsQ0FBYjtBQUNEOztBQUV3QixRQUFuQmtCLG1CQUFtQixHQUFHO0FBQzFCLFdBQU8sTUFBTSxLQUFLbEIsbUJBQUwsQ0FBeUIsTUFBekIsQ0FBYjtBQUNEOztBQUVPLFFBQUZtQixFQUFFLEdBQUc7QUFDVCxXQUFPLE1BQU0sS0FBS0YsaUJBQUwsRUFBYjtBQUNEOztBQUVTLFFBQUpHLElBQUksR0FBRztBQUNYLFdBQU8sTUFBTSxLQUFLRixtQkFBTCxFQUFiO0FBQ0Q7O0FBaEQ0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWMSBmcm9tICcuL21pZ3JhdGlvbnMvdmVyc2lvbl8wMDEnO1xuaW1wb3J0IFYyIGZyb20gJy4vbWlncmF0aW9ucy92ZXJzaW9uXzAwMic7XG5pbXBvcnQgVjMgZnJvbSAnLi9taWdyYXRpb25zL3ZlcnNpb25fMDAzJztcblxuY29uc3QgTUlHUkFUSU9OUyA9IHtcbiAgJzAwMSc6IFYxLFxuICAnMDAyJzogVjIsXG4gICcwMDMnOiBWM1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWlncmF0aW9uIHtcbiAgY29uc3RydWN0b3IoZGIsIHZlcnNpb25OYW1lKSB7XG4gICAgdGhpcy5kYiA9IGRiO1xuICAgIHRoaXMudmVyc2lvbk5hbWUgPSB2ZXJzaW9uTmFtZTtcbiAgfVxuXG4gIGFzeW5jIGV4ZWN1dGVNaWdyYXRpb25TUUwoc3VmZml4KSB7XG4gICAgY29uc3QgZGF0YSA9IE1JR1JBVElPTlNbdGhpcy52ZXJzaW9uTmFtZV07XG5cbiAgICBjb25zdCBzcWwgPSBbXTtcblxuICAgIGZvciAobGV0IHBhcnQgb2YgZGF0YS5zcGxpdCgnXFxuXFxuJykpIHtcbiAgICAgIGlmIChwYXJ0LnRyaW0oKS5sZW5ndGggJiYgcGFydC50cmltKCkuc3Vic3RyaW5nKDAsIDIpICE9PSAnLS0nKSB7XG4gICAgICAgIHNxbC5wdXNoKHBhcnQudHJpbSgpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3FsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdHMgPSBbXTtcblxuICAgIGZvciAobGV0IHNjcmlwdCBvZiBzcWwpIHtcbiAgICAgIGlmICh0aGlzLmRiLnZlcmJvc2UpIHtcbiAgICAgICAgZnVsY3J1bS5sb2dnZXIubG9nKHNjcmlwdCwgJ1xcbicpO1xuICAgICAgfVxuXG4gICAgICByZXN1bHRzLnB1c2goYXdhaXQgdGhpcy5kYi5leGVjdXRlKHNjcmlwdCkpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgYXN5bmMgZXhlY3V0ZVVwZ3JhZGVTUUwoKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZXhlY3V0ZU1pZ3JhdGlvblNRTCgndXAnKTtcbiAgfVxuXG4gIGFzeW5jIGV4ZWN1dGVEb3duZ3JhZGVTUUwoKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZXhlY3V0ZU1pZ3JhdGlvblNRTCgnZG93bicpO1xuICB9XG5cbiAgYXN5bmMgdXAoKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZXhlY3V0ZVVwZ3JhZGVTUUwoKTtcbiAgfVxuXG4gIGFzeW5jIGRvd24oKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZXhlY3V0ZURvd25ncmFkZVNRTCgpO1xuICB9XG59XG4iXX0=