import { PersistentObject } from 'minidb';
import Project from './project';
import ChoiceList from './choice-list';
import ClassificationSet from './classification-set';
import Form from './form';
import Record from './record';
import Role from './role';
import Membership from './membership';
import Changeset from './changeset';
import Photo from './photo';
import Video from './video';
import Audio from './audio';
import Signature from './signature';
import SyncState from './sync-state';

export default class Account {
  static get tableName() {
    return 'accounts';
  }

  static get columns() {
    return [
      { name: 'userResourceID', column: 'user_resource_id', type: 'string', null: false },
      { name: 'organizationResourceID', column: 'organization_resource_id', type: 'string', null: false },
      { name: 'organizationName', column: 'organization_name', type: 'string', null: false },
      { name: 'email', column: 'email', type: 'string', null: false },
      { name: 'description', column: 'description', type: 'string' },
      { name: 'firstName', column: 'first_name', type: 'string' },
      { name: 'lastName', column: 'last_name', type: 'string' },
      { name: 'lastSyncPhotos', column: 'last_sync_photos', type: 'datetime' },
      { name: 'lastSyncVideos', column: 'last_sync_videos', type: 'datetime' },
      { name: 'lastSyncAudio', column: 'last_sync_audio', type: 'datetime' },
      { name: 'lastSyncSignatures', column: 'last_sync_signatures', type: 'datetime' },
      { name: 'lastSyncChangesets', column: 'last_sync_changesets', type: 'datetime' },
      { name: 'token', column: 'token', type: 'string' },
      { name: 'deletedAt', column: 'deleted_at', type: 'datetime' }
    ];
  }

  get userResourceID() {
    return this._userResourceID;
  }

  get organizationResourceID() {
    return this._organizationResourceID;
  }

  get organizationName() {
    return this._organizationName;
  }

  get email() {
    return this._email;
  }

  get firstName() {
    return this._firstName;
  }

  get lastName() {
    return this._lastName;
  }

  get token() {
    return this._token;
  }

  static findByUserAndOrganization(userID, organizationID, callback) {
    return Account.findFirst({user_resource_id: userID,
                              organization_resource_id: organizationID}, callback);
  }

  findForms(where) {
    return Form.findAll(this.db, {...where, account_id: this.rowID}, 'name ASC');
  }

  findProjects(where) {
    return Project.findAll(this.db, {...where, account_id: this.rowID}, 'name ASC');
  }

  findChoiceLists(where) {
    return ChoiceList.findAll(this.db, {...where, account_id: this.rowID}, 'name ASC');
  }

  findClassificationSets(where) {
    return ClassificationSet.findAll(this.db, {...where, account_id: this.rowID}, 'name ASC');
  }

  findRoles(where) {
    return Role.findAll(this.db, {...where, account_id: this.rowID}, 'name ASC');
  }

  findMemberships(where) {
    return Membership.findAll(this.db, {...where, account_id: this.rowID}, 'email ASC');
  }

  findFirstForm(where) {
    return Form.findFirst(this.db, {...where, account_id: this.rowID}, 'name ASC');
  }

  findFirstRecord(where) {
    return Record.findFirst(this.db, {...where, account_id: this.rowID});
  }

  findEachRecord(where, callback) {
    return Record.findEach(this.db, {where: {...where, account_id: this.rowID}}, callback);
  }

  findEachPhoto(where, callback) {
    return Photo.findEach(this.db, {where: {...where, account_id: this.rowID}}, callback);
  }

  findEachVideo(where, callback) {
    return Video.findEach(this.db, {where: {...where, account_id: this.rowID}}, callback);
  }

  findEachAudio(where, callback) {
    return Audio.findEach(this.db, {where: {...where, account_id: this.rowID}}, callback);
  }

  findEachSignature(where, callback) {
    return Signature.findEach(this.db, {where: {...where, account_id: this.rowID}}, callback);
  }

  findEachChangeset(where, callback) {
    return Changeset.findEach(this.db, {where: {...where, account_id: this.rowID}}, callback);
  }

  findEachRole(where, callback) {
    return Role.findEach(this.db, {where: {...where, account_id: this.rowID}}, callback);
  }

  findEachChoiceList(where, callback) {
    return ChoiceList.findEach(this.db, {where: {...where, account_id: this.rowID}}, callback);
  }

  findEachClassificationSet(where, callback) {
    return ClassificationSet.findEach(this.db, {where: {...where, account_id: this.rowID}}, callback);
  }

  findEachForm(where, callback) {
    return Form.findEach(this.db, {where: {...where, account_id: this.rowID}}, callback);
  }

  findEachProject(where, callback) {
    return Project.findEach(this.db, {where: {...where, account_id: this.rowID}}, callback);
  }

  findEachMembership(where, callback) {
    return Membership.findEach(this.db, {where: {...where, account_id: this.rowID}}, callback);
  }

  findEachBySQL(sql, values, callback) {
    return this.db.each(sql, values, callback);
  }

  findBySQL(sql, values, callback) {
    return this.db.all(sql, values, callback);
  }

  findActiveForms(where) {
    return Form.findAll(this.db, {...where, account_id: this.rowID, deleted_at: null}, 'name ASC');
  }

  projectByResourceID(projectId) {
    return Project.findFirst(this.db, {account_id: this.rowID});
  }

  findSyncState(where) {
    return SyncState.findOrCreate(this.db, {...where, account_id: this.rowID});
  }

  async reset() {
    await this.db.execute(`
      DELETE FROM columns WHERE table_name IN (
        SELECT name FROM tables WHERE name LIKE 'account_${this.rowID}_%'
      );
    `);

    await this.db.execute(`
      DELETE FROM tables WHERE name LIKE 'account_${this.rowID}_%';
    `);

    const viewNames = (await this.db.all(`
      SELECT tbl_name AS name FROM sqlite_master
      WHERE type = 'view' AND tbl_name LIKE 'account_${this.rowID}_%'
      ORDER BY tbl_name;
    `)).map(o => o.name);

    for (const viewName of viewNames) {
      await this.db.execute(`DROP VIEW ${this.db.ident(viewName)};`);
    }

    const tableNames = (await this.db.all(`
      SELECT tbl_name AS name FROM sqlite_master
      WHERE type = 'table' AND tbl_name LIKE 'account_${this.rowID}_%'
      ORDER BY tbl_name;
    `)).map(o => o.name);

    for (const tableName of tableNames) {
      await this.db.execute(`DROP TABLE ${this.db.ident(tableName)};`);
    }

    const accountTables = [
      'audio',
      'changesets',
      'choice_lists',
      'classification_sets',
      'forms',
      'memberships',
      'photos',
      'projects',
      'records',
      'roles',
      'signatures',
      'videos'
    ];

    for (const tableName of accountTables) {
      await this.db.execute(`DELETE FROM ${this.db.ident(tableName)} WHERE account_id = ${this.rowID};`);
    }

    await this.db.execute(`DELETE FROM sync_state WHERE account_id = ${this.rowID};`);

    this._lastSyncPhotos = null;
    this._lastSyncVideos = null;
    this._lastSyncAudio = null;
    this._lastSyncSignatures = null;
    this._lastSyncChangesets = null;

    await this.save();

    await this.db.execute('VACUUM');
  }
}

PersistentObject.register(Account);
