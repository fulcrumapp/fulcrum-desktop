import Migration from './migration';

const CURRENT_VERSION = 3;

export default class Migrations {
  static get currentVersion() {
    return CURRENT_VERSION;
  }

  constructor(db) {
    this.db = db;
  }

  async executeMigrations() {
    const methods = [];
    const versions = [];

    let upgrade = true;

    if (this.version !== CURRENT_VERSION) {
      if (this.version > CURRENT_VERSION) {
        for (let i = this.version; i > CURRENT_VERSION + 1; --i) {
          versions.push(i);
        }
        upgrade = false;
      } else {
        for (let i = this.version + 1; i < CURRENT_VERSION + 1; ++i) {
          versions.push(i);
        }
      }
    }

    if (versions.length > 0) {
      for (let version of versions) {
        await this.runMigration(version, upgrade);
      }
    }

    return methods;
  }

  async runMigration(version, upgrade) {
    let versionName = '000' + version.toString();

    versionName = versionName.slice(-3);

    const newVersion = upgrade ? version : version - 1;

    await this.db.execute('BEGIN TRANSACTION');

    const migration = new Migration(this.db, versionName);

    if (upgrade) {
      this.log('\nUpgrading database to version ' + version + '\n');
      await migration.up();
      this.log('\nUpgraded database to version ' + version + '\n');
    } else {
      this.log('\nDowngrading database to version ' + newVersion + '\n');
      await migration.down();
      this.log('\nDowngraded database to version ' + newVersion);
    }

    await this.updateDatabaseVersion(newVersion);

    await this.db.execute('COMMIT TRANSACTION');
  }

  async updateDatabaseVersion(version) {
    await this.db.execute("UPDATE metadata SET value = '" + version + "' WHERE key = 'database_version'", null);
  }

  log(message) {
    if (process.env.FULCRUM_DEBUG) {
      fulcrum.logger.log(message);
    }
  }

  async migrate() {
    await this.createMetadataTable();
    await this.getDatabaseVersion();
    await this.executeMigrations();
  }

  async getDatabaseVersion() {
    const result = await this.db.get("SELECT key, value FROM metadata WHERE key = 'database_version'");
    this.version = result ? +result.value : 0;
  }

  async createMetadataTable() {
    await this.db.execute('CREATE TABLE IF NOT EXISTS metadata (key TEXT, value TEXT)', null);
    await this.db.execute("INSERT INTO metadata (key, value) SELECT 'database_version', 0 WHERE NOT EXISTS (SELECT 1 FROM metadata WHERE key = 'database_version')", null);
  }
}
