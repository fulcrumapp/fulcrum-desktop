import { PersistentObject } from 'minidb';
import { DateUtils } from 'fulcrum-core';

export default class Video {
  static get tableName() {
    return 'videos';
  }

  static get columns() {
    return [
      { name: 'accountRowID', column: 'account_id', type: 'integer', null: false },
      { name: 'id', column: 'resource_id', type: 'string', null: false },
      { name: 'metadata', column: 'metadata', type: 'json' },
      { name: 'filePath', column: 'file_path', type: 'string' },
      { name: 'fileSize', column: 'file_size', type: 'integer' },
      { name: 'contentType', column: 'content_type', type: 'string' },
      { name: 'isDownloaded', column: 'is_downloaded', type: 'boolean', null: false },
      { name: 'isUploaded', column: 'is_uploaded', type: 'boolean', null: false },
      { name: 'isStored', column: 'is_stored', type: 'boolean', null: false },
      { name: 'isProcessed', column: 'is_processed', type: 'boolean', null: false },
      { name: 'formRowID', column: 'form_id', type: 'integer' },
      { name: 'formID', column: 'form_resource_id', type: 'string' },
      { name: 'recordRowID', column: 'record_id', type: 'integer' },
      { name: 'recordID', column: 'record_resource_id', type: 'string' },
      { name: 'updatedByRowID', column: 'updated_by_id', type: 'integer' },
      { name: 'updatedByID', column: 'updated_by_resource_id', type: 'string' },
      { name: 'createdByRowID', column: 'created_by_id', type: 'integer' },
      { name: 'createdByID', column: 'created_by_resource_id', type: 'string' },
      { name: 'hasTrack', column: 'has_track', type: 'boolean' },
      { name: 'trackJSON', column: 'track', type: 'json' },
      { name: 'width', column: 'width', type: 'integer' },
      { name: 'height', column: 'height', type: 'integer' },
      { name: 'duration', column: 'duration', type: 'double' },
      { name: 'bitRate', column: 'bit_rate', type: 'double' },
      { name: 'createdAt', column: 'server_created_at', type: 'datetime' },
      { name: 'updatedAt', column: 'server_updated_at', type: 'datetime' }
    ];
  }

  get id() {
    return this._id;
  }

  updateFromAPIAttributes(attributes) {
    this._id = attributes.access_key;
    this._metadata = attributes.metadata;
    this._fileSize = attributes.file_size;
    this._isUploaded = attributes.uploaded;
    this._isStored = attributes.stored;
    this._isProcessed = attributes.processed;
    this._contentType = attributes.content_type;
    this._hasTrack = !!attributes.track;
    this._trackJSON = attributes.track;
    this._createdByID = attributes.created_by_id;
    this._updatedByID = attributes.updated_by_id;
    this._createdAt = DateUtils.parseISOTimestamp(attributes.created_at);
    this._updatedAt = DateUtils.parseISOTimestamp(attributes.updated_at);
    this._formID = attributes.form_id;
    this._recordID = attributes.record_id;

    this._width = null;
    this._height = null;
    this._bitRate = null;

    if (attributes.metadata) {
      const video = attributes.metadata && attributes.metadata.streams && attributes.metadata.streams.find(s => s.codec_type === 'video');

      if (video) {
        this._width = video.width;
        this._height = video.height;
      }

      if (attributes.metadata && attributes.metadata.format) {
        if (attributes.metadata.format.duration != null) {
          this._duration = +attributes.metadata.format.duration;
        }

        if (attributes.metadata.format.bit_rate != null) {
          this._bitRate = +attributes.metadata.format.bit_rate;
        }
      }
    }
  }

  get isDownloaded() {
    return this._isDownloaded;
  }

  set isDownloaded(value) {
    this._isDownloaded = !!value;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }
}

PersistentObject.register(Video);
