import * as console from './console-module';
import * as query from './query-module';
import * as reset from './reset-module';
import * as setup from './setup-module';
import * as sync from './sync-module';
import * as postgres from '../plugins/postgres/plugin-postgres-module'
import * as mssql from '../plugins/mssql/plugin-mssql-module'
import * as media from '../plugins/media/plugin-media-module'
import * as reports from '../plugins/reports/plugin-reports-module'

export const commands = [console, query, reset, setup, sync, postgres, mssql, media, reports];