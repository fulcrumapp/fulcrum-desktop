import { PersistentObject } from 'minidb';
import Role from './role';
import { DateUtils } from 'fulcrum-core';

export default class Membership {
  constructor(attributes) {
    this.updateFromAPIAttributes(attributes);
  }

  updateFromAPIAttributes(attrs) {
    const attributes = attrs || {};

    this._id = attributes.id;
    this._firstName = attributes.first_name;
    this._lastName = attributes.last_name;
    this._userID = attributes.user_id;
    this._email = attributes.email;
    this._roleID = attributes.role_id;
    this._createdAt = DateUtils.parseISOTimestamp(attributes.created_at);
    this._updatedAt = DateUtils.parseISOTimestamp(attributes.updated_at);
  }

  get id() {
    return this._id;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  static get tableName() {
    return 'memberships';
  }

  static get columns() {
    return [
      { name: 'accountRowID', column: 'account_id', type: 'integer', null: false },
      { name: 'id', column: 'resource_id', type: 'string', null: false },
      { name: 'userID', column: 'user_resource_id', type: 'string', null: false },
      { name: 'roleID', column: 'role_resource_id', type: 'string', null: false },
      { name: 'roleRowID', column: 'role_id', type: 'integer', null: false },
      { name: 'email', column: 'email', type: 'string', null: false },
      { name: 'firstName', column: 'first_name', type: 'string', null: false },
      { name: 'lastName', column: 'last_name', type: 'string', null: false },
      { name: 'createdAt', column: 'server_created_at', type: 'datetime' },
      { name: 'updatedAt', column: 'server_updated_at', type: 'datetime' },
      { name: 'deletedAt', column: 'deleted_at', type: 'datetime' }
    ];
  }

  async getLocalRole() {
    this._role = await Role.findFirst(this.db, {resource_id: this._roleID});
    this._roleRowID = this._role ? this._role.rowID : null;
    return this._role;
  }

  // role
  getRole() {
    return this.loadOne('role', Role);
  }

  get role() {
    return this._role;
  }

  set role(role) {
    this.setOne('role', role);
  }
}

PersistentObject.register(Membership);
