import { PersistentObject } from 'minidb';
import { Changeset as ChangesetBase } from 'fulcrum-core';

export default class Changeset extends ChangesetBase {
  static get tableName() {
    return 'changesets';
  }

  static get columns() {
    return [
      { name: 'accountRowID', column: 'account_id', type: 'integer', null: false },
      { name: 'id', column: 'resource_id', type: 'string', null: false },
      { name: 'formRowID', column: 'form_id', type: 'integer' },
      { name: 'formID', column: 'form_resource_id', type: 'string' },
      { name: 'metadata', column: 'metadata', type: 'json' },
      { name: 'metadataIndexText', column: 'metadata_index_text', type: 'string' },
      { name: 'closedAt', column: 'closed_at', type: 'datetime' },
      { name: 'closedByRowID', column: 'closed_by_id', type: 'integer' },
      { name: 'closedByID', column: 'closed_by_resource_id', type: 'string' },
      { name: 'createdByRowID', column: 'created_by_id', type: 'integer' },
      { name: 'createdByID', column: 'created_by_resource_id', type: 'string' },
      { name: 'updatedByRowID', column: 'updated_by_id', type: 'integer' },
      { name: 'updatedByID', column: 'updated_by_resource_id', type: 'string' },
      { name: 'numberOfChanges', column: 'number_of_changes', type: 'integer' },
      { name: 'numberOfCreates', column: 'number_of_creates', type: 'integer' },
      { name: 'numberOfUpdates', column: 'number_of_updates', type: 'integer' },
      { name: 'numberOfDeletes', column: 'number_of_deletes', type: 'integer' },
      { name: 'minLat', column: 'min_lat', type: 'double' },
      { name: 'maxLat', column: 'max_lat', type: 'double' },
      { name: 'minLon', column: 'min_lon', type: 'double' },
      { name: 'maxLon', column: 'max_lon', type: 'double' },
      { name: 'createdAt', column: 'server_created_at', type: 'datetime' },
      { name: 'updatedAt', column: 'server_updated_at', type: 'datetime' }
    ];
  }

  async beforeSave(options) {
    this._metadataIndexText = this.metadataIndexText;
  }
}

PersistentObject.register(Changeset);
