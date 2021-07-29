import V1 from './migrations/version_001';
import V2 from './migrations/version_002';
import V3 from './migrations/version_003';

const MIGRATIONS = {
  '001': V1,
  '002': V2,
  '003': V3
};

export default class Migration {
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
