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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcGkuanMiXSwibmFtZXMiOlsiYXBpIiwiT2JqZWN0IiwiYXNzaWduIiwiY29yZSIsImRhdGEiLCJSZXBvcnRHZW5lcmF0b3IiLCJSZWNvcmRWYWx1ZXMiLCJTUUxpdGVSZWNvcmRWYWx1ZXMiLCJQb3N0Z3Jlc1JlY29yZFZhbHVlcyIsIlBvc3RncmVzIiwiU1FMaXRlIiwiTVNTUUwiLCJQZXJzaXN0ZW50T2JqZWN0IiwiQVBJQ2xpZW50IiwiSHRtbFRvUGRmIiwiU2NoZW1hTG9hZGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUEsTUFBTUEsR0FBRyxHQUFHLEVBQVo7QUFFQUMsTUFBTSxDQUFDQyxNQUFQLENBQWNGLEdBQWQsRUFBbUI7QUFDakJHLEVBQUFBLElBRGlCO0FBRWpCQyxFQUFBQSxJQUZpQjtBQUdqQkMsRUFBQUEsZUFBZSxFQUFmQSxrQkFIaUI7QUFJakJDLEVBQUFBLFlBQVksRUFBWkEscUJBSmlCO0FBS2pCQyxFQUFBQSxrQkFBa0IsRUFBbEJBLDJCQUxpQjtBQU1qQkMsRUFBQUEsb0JBQW9CLEVBQXBCQSw2QkFOaUI7QUFPakJDLEVBQUFBLFFBQVEsRUFBUkEsZ0JBUGlCO0FBUWpCQyxFQUFBQSxNQUFNLEVBQU5BLGNBUmlCO0FBU2pCQyxFQUFBQSxLQUFLLEVBQUxBLGFBVGlCO0FBVWpCQyxFQUFBQSxnQkFBZ0IsRUFBaEJBLHdCQVZpQjtBQVdqQkMsRUFBQUEsU0FBUyxFQUFUQSxlQVhpQjtBQVlqQkMsRUFBQUEsU0FBUyxFQUFUQSxrQkFaaUI7QUFhakJDLEVBQUFBLFlBQVksRUFBWkE7QUFiaUIsQ0FBbkI7ZUFnQmVmLEciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjb3JlIGZyb20gJ2Z1bGNydW0tY29yZSc7XG5pbXBvcnQgUmVwb3J0R2VuZXJhdG9yIGZyb20gJy4vcmVwb3J0cy9nZW5lcmF0b3InO1xuaW1wb3J0IEh0bWxUb1BkZiBmcm9tICcuL3JlcG9ydHMvaHRtbC10by1wZGYnO1xuaW1wb3J0IFJlY29yZFZhbHVlcyBmcm9tICcuL21vZGVscy9yZWNvcmQtdmFsdWVzL3JlY29yZC12YWx1ZXMnO1xuaW1wb3J0IFNRTGl0ZVJlY29yZFZhbHVlcyBmcm9tICcuL21vZGVscy9yZWNvcmQtdmFsdWVzL3NxbGl0ZS1yZWNvcmQtdmFsdWVzJztcbmltcG9ydCBQb3N0Z3Jlc1JlY29yZFZhbHVlcyBmcm9tICcuL21vZGVscy9yZWNvcmQtdmFsdWVzL3Bvc3RncmVzLXJlY29yZC12YWx1ZXMnO1xuaW1wb3J0IHsgUG9zdGdyZXMsIFNRTGl0ZSwgTVNTUUwsIFBlcnNpc3RlbnRPYmplY3QgfSBmcm9tICdtaW5pZGInO1xuaW1wb3J0IEFQSUNsaWVudCBmcm9tICcuL2FwaS9jbGllbnQnO1xuaW1wb3J0IFNjaGVtYUxvYWRlciBmcm9tICcuL3V0aWxzL3NjaGVtYS1sb2FkZXInO1xuaW1wb3J0ICogYXMgZGF0YSBmcm9tICcuL21vZGVscyc7XG5cbmNvbnN0IGFwaSA9IHt9O1xuXG5PYmplY3QuYXNzaWduKGFwaSwge1xuICBjb3JlLFxuICBkYXRhLFxuICBSZXBvcnRHZW5lcmF0b3IsXG4gIFJlY29yZFZhbHVlcyxcbiAgU1FMaXRlUmVjb3JkVmFsdWVzLFxuICBQb3N0Z3Jlc1JlY29yZFZhbHVlcyxcbiAgUG9zdGdyZXMsXG4gIFNRTGl0ZSxcbiAgTVNTUUwsXG4gIFBlcnNpc3RlbnRPYmplY3QsXG4gIEFQSUNsaWVudCxcbiAgSHRtbFRvUGRmLFxuICBTY2hlbWFMb2FkZXJcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBhcGk7XG4iXX0=