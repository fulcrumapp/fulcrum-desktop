import * as core from 'fulcrum-core';
import ReportGenerator from './reports/generator';
import HtmlToPdf from './reports/html-to-pdf';
import RecordValues from './models/record-values/record-values';
import SQLiteRecordValues from './models/record-values/sqlite-record-values';
import PostgresRecordValues from './models/record-values/postgres-record-values';
import { Postgres, SQLite, MSSQL, PersistentObject } from 'minidb';
import APIClient from './api/client';
import SchemaLoader from './utils/schema-loader';
import * as data from './models';

const api = {};

Object.assign(api, {
  core,
  data,
  ReportGenerator,
  RecordValues,
  SQLiteRecordValues,
  PostgresRecordValues,
  Postgres,
  SQLite,
  MSSQL,
  PersistentObject,
  APIClient,
  HtmlToPdf,
  SchemaLoader
});

export default api;
