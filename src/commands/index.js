import * as console from './console-module';
import * as query from './query-module';
import * as reset from './reset-module';
import * as setup from './setup-module';
import * as sync from './sync-module';
import * as postgres from '../plugins/postgres/plugin-module'

export const commands = [console, query, reset, setup, sync, postgres];