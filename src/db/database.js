import { SQLite } from 'minidb';
import Migrations from './migrations';

let instance = null;

const defaultDatabaseOptions = {
  wal: true,
  autoVacuum: true,
  synchronous: 'off'
};

export default async function database(options) {
  if (instance) {
    return instance;
  }

  instance = await SQLite.open({...defaultDatabaseOptions, ...options});

  const migrations = new Migrations(instance);

  await migrations.migrate();

  return instance;
}
