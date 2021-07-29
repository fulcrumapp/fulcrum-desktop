import { PersistentObject } from 'minidb';
import { Project as ProjectBase } from 'fulcrum-core';

export default class Project extends ProjectBase {
  static get tableName() {
    return 'projects';
  }

  static get columns() {
    return [
      { name: 'accountRowID', column: 'account_id', type: 'integer', null: false },
      { name: 'id', column: 'resource_id', type: 'string', null: false },
      { name: 'name', column: 'name', type: 'string', null: false },
      { name: 'description', column: 'description', type: 'string' },
      { name: 'createdAt', column: 'server_created_at', type: 'datetime' },
      { name: 'updatedAt', column: 'server_updated_at', type: 'datetime' },
      { name: 'deletedAt', column: 'deleted_at', type: 'datetime' }
    ];
  }
}

PersistentObject.register(Project);
