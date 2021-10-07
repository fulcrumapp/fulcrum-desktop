import fs from 'fs';
import path from 'path';
import * as console from './console-module';
import * as query from './query-module';
import * as reset from './reset-module';
import * as setup from './setup-module';
import * as sync from './sync-module';
import * as postgres from '../plugins/postgres/plugin-postgres-module'
import * as mssql from '../plugins/mssql/plugin-mssql-module'
import * as media from '../plugins/media/plugin-media-module'
import * as reports from '../plugins/reports/plugin-reports-module'
import * as s3 from '../plugins/s3/plugin-s3-module';
import * as geopackage from '../plugins/geopackage/plugin-geopackage-module';

const filteredEnabledPlugins = () => {
    const file = path.join(process.cwd(), 'config','plugin.json')

    const readFile = fs.readFileSync(file);

    const fileAsArray = Object.entries(JSON.parse(readFile))

    const filterEnabledPlugins = fileAsArray.filter(([key, value]) => value == true);

    const filteredPlugins = Object.fromEntries(filterEnabledPlugins);

    const enabledPluginNames = Object.keys(filteredPlugins);

    const pluginModules = [geopackage, media, mssql, postgres, reports, s3];

    return pluginModules.filter((plugin) => enabledPluginNames.includes(plugin.command));
}

export const commands = [console, query, reset, setup, sync];
export const plugins = filteredEnabledPlugins();
