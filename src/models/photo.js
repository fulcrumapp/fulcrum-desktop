import { PersistentObject } from 'minidb';
import { DateUtils } from 'fulcrum-core';

export default class Photo {
  static get tableName() {
    return 'photos';
  }

  static get columns() {
    return [
      { name: 'accountRowID', column: 'account_id', type: 'integer', null: false },
      { name: 'id', column: 'resource_id', type: 'string', null: false },
      { name: 'exif', column: 'exif', type: 'json' },
      { name: 'filePath', column: 'file_path', type: 'string' },
      { name: 'isDownloaded', column: 'is_downloaded', type: 'boolean', null: false },
      { name: 'latitude', column: 'latitude', type: 'double' },
      { name: 'longitude', column: 'longitude', type: 'double' },
      { name: 'formRowID', column: 'form_id', type: 'integer' },
      { name: 'recordRowID', column: 'record_id', type: 'integer' }
    ];
  }

  updateFromAPIAttributes(attributes) {
    this._id = attributes.access_key;
    this._exif = attributes.exif;
    this._createdAt = DateUtils.parseISOTimestamp(attributes.created_at);
    this._updatedAt = DateUtils.parseISOTimestamp(attributes.updated_at);
  }

  get isDownloaded() {
    return this._isDownloaded;
  }

  set isDownloaded(value) {
    this._isDownloaded = !!value;
  }
}

PersistentObject.register(Photo);
