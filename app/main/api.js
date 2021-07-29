"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var core = _interopRequireWildcard(require("fulcrum-core"));

var _generator = _interopRequireDefault(require("./reports/generator"));

var _htmlToPdf = _interopRequireDefault(require("./reports/html-to-pdf"));

var _recordValues = _interopRequireDefault(require("./models/record-values/record-values"));

var _sqliteRecordValues = _interopRequireDefault(require("./models/record-values/sqlite-record-values"));

var _postgresRecordValues = _interopRequireDefault(require("./models/record-values/postgres-record-values"));

var _minidb = require("minidb");

var _client = _interopRequireDefault(require("./api/client"));

var _schemaLoader = _interopRequireDefault(require("./utils/schema-loader"));

var data = _interopRequireWildcard(require("./models"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const api = {};
Object.assign(api, {
  core,
  data,
  ReportGenerator: _generator.default,
  RecordValues: _recordValues.default,
  SQLiteRecordValues: _sqliteRecordValues.default,
  PostgresRecordValues: _postgresRecordValues.default,
  Postgres: _minidb.Postgres,
  SQLite: _minidb.SQLite,
  MSSQL: _minidb.MSSQL,
  PersistentObject: _minidb.PersistentObject,
  APIClient: _client.default,
  HtmlToPdf: _htmlToPdf.default,
  SchemaLoader: _schemaLoader.default
});
var _default = api;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluL2FwaS5qcyJdLCJuYW1lcyI6WyJhcGkiLCJPYmplY3QiLCJhc3NpZ24iLCJjb3JlIiwiZGF0YSIsIlJlcG9ydEdlbmVyYXRvciIsIlJlY29yZFZhbHVlcyIsIlNRTGl0ZVJlY29yZFZhbHVlcyIsIlBvc3RncmVzUmVjb3JkVmFsdWVzIiwiUG9zdGdyZXMiLCJTUUxpdGUiLCJNU1NRTCIsIlBlcnNpc3RlbnRPYmplY3QiLCJBUElDbGllbnQiLCJIdG1sVG9QZGYiLCJTY2hlbWFMb2FkZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFQSxNQUFNQSxHQUFHLEdBQUcsRUFBWjtBQUVBQyxNQUFNLENBQUNDLE1BQVAsQ0FBY0YsR0FBZCxFQUFtQjtBQUNqQkcsRUFBQUEsSUFEaUI7QUFFakJDLEVBQUFBLElBRmlCO0FBR2pCQyxFQUFBQSxlQUFlLEVBQWZBLGtCQUhpQjtBQUlqQkMsRUFBQUEsWUFBWSxFQUFaQSxxQkFKaUI7QUFLakJDLEVBQUFBLGtCQUFrQixFQUFsQkEsMkJBTGlCO0FBTWpCQyxFQUFBQSxvQkFBb0IsRUFBcEJBLDZCQU5pQjtBQU9qQkMsRUFBQUEsUUFBUSxFQUFSQSxnQkFQaUI7QUFRakJDLEVBQUFBLE1BQU0sRUFBTkEsY0FSaUI7QUFTakJDLEVBQUFBLEtBQUssRUFBTEEsYUFUaUI7QUFVakJDLEVBQUFBLGdCQUFnQixFQUFoQkEsd0JBVmlCO0FBV2pCQyxFQUFBQSxTQUFTLEVBQVRBLGVBWGlCO0FBWWpCQyxFQUFBQSxTQUFTLEVBQVRBLGtCQVppQjtBQWFqQkMsRUFBQUEsWUFBWSxFQUFaQTtBQWJpQixDQUFuQjtlQWdCZWYsRyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvcmUgZnJvbSAnZnVsY3J1bS1jb3JlJztcbmltcG9ydCBSZXBvcnRHZW5lcmF0b3IgZnJvbSAnLi9yZXBvcnRzL2dlbmVyYXRvcic7XG5pbXBvcnQgSHRtbFRvUGRmIGZyb20gJy4vcmVwb3J0cy9odG1sLXRvLXBkZic7XG5pbXBvcnQgUmVjb3JkVmFsdWVzIGZyb20gJy4vbW9kZWxzL3JlY29yZC12YWx1ZXMvcmVjb3JkLXZhbHVlcyc7XG5pbXBvcnQgU1FMaXRlUmVjb3JkVmFsdWVzIGZyb20gJy4vbW9kZWxzL3JlY29yZC12YWx1ZXMvc3FsaXRlLXJlY29yZC12YWx1ZXMnO1xuaW1wb3J0IFBvc3RncmVzUmVjb3JkVmFsdWVzIGZyb20gJy4vbW9kZWxzL3JlY29yZC12YWx1ZXMvcG9zdGdyZXMtcmVjb3JkLXZhbHVlcyc7XG5pbXBvcnQgeyBQb3N0Z3JlcywgU1FMaXRlLCBNU1NRTCwgUGVyc2lzdGVudE9iamVjdCB9IGZyb20gJ21pbmlkYic7XG5pbXBvcnQgQVBJQ2xpZW50IGZyb20gJy4vYXBpL2NsaWVudCc7XG5pbXBvcnQgU2NoZW1hTG9hZGVyIGZyb20gJy4vdXRpbHMvc2NoZW1hLWxvYWRlcic7XG5pbXBvcnQgKiBhcyBkYXRhIGZyb20gJy4vbW9kZWxzJztcblxuY29uc3QgYXBpID0ge307XG5cbk9iamVjdC5hc3NpZ24oYXBpLCB7XG4gIGNvcmUsXG4gIGRhdGEsXG4gIFJlcG9ydEdlbmVyYXRvcixcbiAgUmVjb3JkVmFsdWVzLFxuICBTUUxpdGVSZWNvcmRWYWx1ZXMsXG4gIFBvc3RncmVzUmVjb3JkVmFsdWVzLFxuICBQb3N0Z3JlcyxcbiAgU1FMaXRlLFxuICBNU1NRTCxcbiAgUGVyc2lzdGVudE9iamVjdCxcbiAgQVBJQ2xpZW50LFxuICBIdG1sVG9QZGYsXG4gIFNjaGVtYUxvYWRlclxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGFwaTtcbiJdfQ==