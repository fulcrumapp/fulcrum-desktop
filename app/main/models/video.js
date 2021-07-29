"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _minidb = require("minidb");

var _fulcrumCore = require("fulcrum-core");

class Video {
  static get tableName() {
    return 'videos';
  }

  static get columns() {
    return [{
      name: 'accountRowID',
      column: 'account_id',
      type: 'integer',
      null: false
    }, {
      name: 'id',
      column: 'resource_id',
      type: 'string',
      null: false
    }, {
      name: 'metadata',
      column: 'metadata',
      type: 'json'
    }, {
      name: 'filePath',
      column: 'file_path',
      type: 'string'
    }, {
      name: 'fileSize',
      column: 'file_size',
      type: 'integer'
    }, {
      name: 'contentType',
      column: 'content_type',
      type: 'string'
    }, {
      name: 'isDownloaded',
      column: 'is_downloaded',
      type: 'boolean',
      null: false
    }, {
      name: 'isUploaded',
      column: 'is_uploaded',
      type: 'boolean',
      null: false
    }, {
      name: 'isStored',
      column: 'is_stored',
      type: 'boolean',
      null: false
    }, {
      name: 'isProcessed',
      column: 'is_processed',
      type: 'boolean',
      null: false
    }, {
      name: 'formRowID',
      column: 'form_id',
      type: 'integer'
    }, {
      name: 'formID',
      column: 'form_resource_id',
      type: 'string'
    }, {
      name: 'recordRowID',
      column: 'record_id',
      type: 'integer'
    }, {
      name: 'recordID',
      column: 'record_resource_id',
      type: 'string'
    }, {
      name: 'updatedByRowID',
      column: 'updated_by_id',
      type: 'integer'
    }, {
      name: 'updatedByID',
      column: 'updated_by_resource_id',
      type: 'string'
    }, {
      name: 'createdByRowID',
      column: 'created_by_id',
      type: 'integer'
    }, {
      name: 'createdByID',
      column: 'created_by_resource_id',
      type: 'string'
    }, {
      name: 'hasTrack',
      column: 'has_track',
      type: 'boolean'
    }, {
      name: 'trackJSON',
      column: 'track',
      type: 'json'
    }, {
      name: 'width',
      column: 'width',
      type: 'integer'
    }, {
      name: 'height',
      column: 'height',
      type: 'integer'
    }, {
      name: 'duration',
      column: 'duration',
      type: 'double'
    }, {
      name: 'bitRate',
      column: 'bit_rate',
      type: 'double'
    }, {
      name: 'createdAt',
      column: 'server_created_at',
      type: 'datetime'
    }, {
      name: 'updatedAt',
      column: 'server_updated_at',
      type: 'datetime'
    }];
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
    this._createdAt = _fulcrumCore.DateUtils.parseISOTimestamp(attributes.created_at);
    this._updatedAt = _fulcrumCore.DateUtils.parseISOTimestamp(attributes.updated_at);
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

exports.default = Video;

_minidb.PersistentObject.register(Video);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL21vZGVscy92aWRlby5qcyJdLCJuYW1lcyI6WyJWaWRlbyIsInRhYmxlTmFtZSIsImNvbHVtbnMiLCJuYW1lIiwiY29sdW1uIiwidHlwZSIsIm51bGwiLCJpZCIsIl9pZCIsInVwZGF0ZUZyb21BUElBdHRyaWJ1dGVzIiwiYXR0cmlidXRlcyIsImFjY2Vzc19rZXkiLCJfbWV0YWRhdGEiLCJtZXRhZGF0YSIsIl9maWxlU2l6ZSIsImZpbGVfc2l6ZSIsIl9pc1VwbG9hZGVkIiwidXBsb2FkZWQiLCJfaXNTdG9yZWQiLCJzdG9yZWQiLCJfaXNQcm9jZXNzZWQiLCJwcm9jZXNzZWQiLCJfY29udGVudFR5cGUiLCJjb250ZW50X3R5cGUiLCJfaGFzVHJhY2siLCJ0cmFjayIsIl90cmFja0pTT04iLCJfY3JlYXRlZEJ5SUQiLCJjcmVhdGVkX2J5X2lkIiwiX3VwZGF0ZWRCeUlEIiwidXBkYXRlZF9ieV9pZCIsIl9jcmVhdGVkQXQiLCJEYXRlVXRpbHMiLCJwYXJzZUlTT1RpbWVzdGFtcCIsImNyZWF0ZWRfYXQiLCJfdXBkYXRlZEF0IiwidXBkYXRlZF9hdCIsIl9mb3JtSUQiLCJmb3JtX2lkIiwiX3JlY29yZElEIiwicmVjb3JkX2lkIiwiX3dpZHRoIiwiX2hlaWdodCIsIl9iaXRSYXRlIiwidmlkZW8iLCJzdHJlYW1zIiwiZmluZCIsInMiLCJjb2RlY190eXBlIiwid2lkdGgiLCJoZWlnaHQiLCJmb3JtYXQiLCJkdXJhdGlvbiIsIl9kdXJhdGlvbiIsImJpdF9yYXRlIiwiaXNEb3dubG9hZGVkIiwiX2lzRG93bmxvYWRlZCIsInZhbHVlIiwiY3JlYXRlZEF0IiwidXBkYXRlZEF0IiwiUGVyc2lzdGVudE9iamVjdCIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBRWUsTUFBTUEsS0FBTixDQUFZO0FBQ0wsYUFBVEMsU0FBUyxHQUFHO0FBQ3JCLFdBQU8sUUFBUDtBQUNEOztBQUVpQixhQUFQQyxP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eUJBQWlCQyxRQUFqQixDQUEwQjdELEtBQTFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGVyc2lzdGVudE9iamVjdCB9IGZyb20gJ21pbmlkYic7XG5pbXBvcnQgeyBEYXRlVXRpbHMgfSBmcm9tICdmdWxjcnVtLWNvcmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWRlbyB7XG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xuICAgIHJldHVybiAndmlkZW9zJztcbiAgfVxuXG4gIHN0YXRpYyBnZXQgY29sdW1ucygpIHtcbiAgICByZXR1cm4gW1xuICAgICAgeyBuYW1lOiAnYWNjb3VudFJvd0lEJywgY29sdW1uOiAnYWNjb3VudF9pZCcsIHR5cGU6ICdpbnRlZ2VyJywgbnVsbDogZmFsc2UgfSxcbiAgICAgIHsgbmFtZTogJ2lkJywgY29sdW1uOiAncmVzb3VyY2VfaWQnLCB0eXBlOiAnc3RyaW5nJywgbnVsbDogZmFsc2UgfSxcbiAgICAgIHsgbmFtZTogJ21ldGFkYXRhJywgY29sdW1uOiAnbWV0YWRhdGEnLCB0eXBlOiAnanNvbicgfSxcbiAgICAgIHsgbmFtZTogJ2ZpbGVQYXRoJywgY29sdW1uOiAnZmlsZV9wYXRoJywgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgIHsgbmFtZTogJ2ZpbGVTaXplJywgY29sdW1uOiAnZmlsZV9zaXplJywgdHlwZTogJ2ludGVnZXInIH0sXG4gICAgICB7IG5hbWU6ICdjb250ZW50VHlwZScsIGNvbHVtbjogJ2NvbnRlbnRfdHlwZScsIHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICB7IG5hbWU6ICdpc0Rvd25sb2FkZWQnLCBjb2x1bW46ICdpc19kb3dubG9hZGVkJywgdHlwZTogJ2Jvb2xlYW4nLCBudWxsOiBmYWxzZSB9LFxuICAgICAgeyBuYW1lOiAnaXNVcGxvYWRlZCcsIGNvbHVtbjogJ2lzX3VwbG9hZGVkJywgdHlwZTogJ2Jvb2xlYW4nLCBudWxsOiBmYWxzZSB9LFxuICAgICAgeyBuYW1lOiAnaXNTdG9yZWQnLCBjb2x1bW46ICdpc19zdG9yZWQnLCB0eXBlOiAnYm9vbGVhbicsIG51bGw6IGZhbHNlIH0sXG4gICAgICB7IG5hbWU6ICdpc1Byb2Nlc3NlZCcsIGNvbHVtbjogJ2lzX3Byb2Nlc3NlZCcsIHR5cGU6ICdib29sZWFuJywgbnVsbDogZmFsc2UgfSxcbiAgICAgIHsgbmFtZTogJ2Zvcm1Sb3dJRCcsIGNvbHVtbjogJ2Zvcm1faWQnLCB0eXBlOiAnaW50ZWdlcicgfSxcbiAgICAgIHsgbmFtZTogJ2Zvcm1JRCcsIGNvbHVtbjogJ2Zvcm1fcmVzb3VyY2VfaWQnLCB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgeyBuYW1lOiAncmVjb3JkUm93SUQnLCBjb2x1bW46ICdyZWNvcmRfaWQnLCB0eXBlOiAnaW50ZWdlcicgfSxcbiAgICAgIHsgbmFtZTogJ3JlY29yZElEJywgY29sdW1uOiAncmVjb3JkX3Jlc291cmNlX2lkJywgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgIHsgbmFtZTogJ3VwZGF0ZWRCeVJvd0lEJywgY29sdW1uOiAndXBkYXRlZF9ieV9pZCcsIHR5cGU6ICdpbnRlZ2VyJyB9LFxuICAgICAgeyBuYW1lOiAndXBkYXRlZEJ5SUQnLCBjb2x1bW46ICd1cGRhdGVkX2J5X3Jlc291cmNlX2lkJywgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgIHsgbmFtZTogJ2NyZWF0ZWRCeVJvd0lEJywgY29sdW1uOiAnY3JlYXRlZF9ieV9pZCcsIHR5cGU6ICdpbnRlZ2VyJyB9LFxuICAgICAgeyBuYW1lOiAnY3JlYXRlZEJ5SUQnLCBjb2x1bW46ICdjcmVhdGVkX2J5X3Jlc291cmNlX2lkJywgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgIHsgbmFtZTogJ2hhc1RyYWNrJywgY29sdW1uOiAnaGFzX3RyYWNrJywgdHlwZTogJ2Jvb2xlYW4nIH0sXG4gICAgICB7IG5hbWU6ICd0cmFja0pTT04nLCBjb2x1bW46ICd0cmFjaycsIHR5cGU6ICdqc29uJyB9LFxuICAgICAgeyBuYW1lOiAnd2lkdGgnLCBjb2x1bW46ICd3aWR0aCcsIHR5cGU6ICdpbnRlZ2VyJyB9LFxuICAgICAgeyBuYW1lOiAnaGVpZ2h0JywgY29sdW1uOiAnaGVpZ2h0JywgdHlwZTogJ2ludGVnZXInIH0sXG4gICAgICB7IG5hbWU6ICdkdXJhdGlvbicsIGNvbHVtbjogJ2R1cmF0aW9uJywgdHlwZTogJ2RvdWJsZScgfSxcbiAgICAgIHsgbmFtZTogJ2JpdFJhdGUnLCBjb2x1bW46ICdiaXRfcmF0ZScsIHR5cGU6ICdkb3VibGUnIH0sXG4gICAgICB7IG5hbWU6ICdjcmVhdGVkQXQnLCBjb2x1bW46ICdzZXJ2ZXJfY3JlYXRlZF9hdCcsIHR5cGU6ICdkYXRldGltZScgfSxcbiAgICAgIHsgbmFtZTogJ3VwZGF0ZWRBdCcsIGNvbHVtbjogJ3NlcnZlcl91cGRhdGVkX2F0JywgdHlwZTogJ2RhdGV0aW1lJyB9XG4gICAgXTtcbiAgfVxuXG4gIGdldCBpZCgpIHtcbiAgICByZXR1cm4gdGhpcy5faWQ7XG4gIH1cblxuICB1cGRhdGVGcm9tQVBJQXR0cmlidXRlcyhhdHRyaWJ1dGVzKSB7XG4gICAgdGhpcy5faWQgPSBhdHRyaWJ1dGVzLmFjY2Vzc19rZXk7XG4gICAgdGhpcy5fbWV0YWRhdGEgPSBhdHRyaWJ1dGVzLm1ldGFkYXRhO1xuICAgIHRoaXMuX2ZpbGVTaXplID0gYXR0cmlidXRlcy5maWxlX3NpemU7XG4gICAgdGhpcy5faXNVcGxvYWRlZCA9IGF0dHJpYnV0ZXMudXBsb2FkZWQ7XG4gICAgdGhpcy5faXNTdG9yZWQgPSBhdHRyaWJ1dGVzLnN0b3JlZDtcbiAgICB0aGlzLl9pc1Byb2Nlc3NlZCA9IGF0dHJpYnV0ZXMucHJvY2Vzc2VkO1xuICAgIHRoaXMuX2NvbnRlbnRUeXBlID0gYXR0cmlidXRlcy5jb250ZW50X3R5cGU7XG4gICAgdGhpcy5faGFzVHJhY2sgPSAhIWF0dHJpYnV0ZXMudHJhY2s7XG4gICAgdGhpcy5fdHJhY2tKU09OID0gYXR0cmlidXRlcy50cmFjaztcbiAgICB0aGlzLl9jcmVhdGVkQnlJRCA9IGF0dHJpYnV0ZXMuY3JlYXRlZF9ieV9pZDtcbiAgICB0aGlzLl91cGRhdGVkQnlJRCA9IGF0dHJpYnV0ZXMudXBkYXRlZF9ieV9pZDtcbiAgICB0aGlzLl9jcmVhdGVkQXQgPSBEYXRlVXRpbHMucGFyc2VJU09UaW1lc3RhbXAoYXR0cmlidXRlcy5jcmVhdGVkX2F0KTtcbiAgICB0aGlzLl91cGRhdGVkQXQgPSBEYXRlVXRpbHMucGFyc2VJU09UaW1lc3RhbXAoYXR0cmlidXRlcy51cGRhdGVkX2F0KTtcbiAgICB0aGlzLl9mb3JtSUQgPSBhdHRyaWJ1dGVzLmZvcm1faWQ7XG4gICAgdGhpcy5fcmVjb3JkSUQgPSBhdHRyaWJ1dGVzLnJlY29yZF9pZDtcblxuICAgIHRoaXMuX3dpZHRoID0gbnVsbDtcbiAgICB0aGlzLl9oZWlnaHQgPSBudWxsO1xuICAgIHRoaXMuX2JpdFJhdGUgPSBudWxsO1xuXG4gICAgaWYgKGF0dHJpYnV0ZXMubWV0YWRhdGEpIHtcbiAgICAgIGNvbnN0IHZpZGVvID0gYXR0cmlidXRlcy5tZXRhZGF0YSAmJiBhdHRyaWJ1dGVzLm1ldGFkYXRhLnN0cmVhbXMgJiYgYXR0cmlidXRlcy5tZXRhZGF0YS5zdHJlYW1zLmZpbmQocyA9PiBzLmNvZGVjX3R5cGUgPT09ICd2aWRlbycpO1xuXG4gICAgICBpZiAodmlkZW8pIHtcbiAgICAgICAgdGhpcy5fd2lkdGggPSB2aWRlby53aWR0aDtcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gdmlkZW8uaGVpZ2h0O1xuICAgICAgfVxuXG4gICAgICBpZiAoYXR0cmlidXRlcy5tZXRhZGF0YSAmJiBhdHRyaWJ1dGVzLm1ldGFkYXRhLmZvcm1hdCkge1xuICAgICAgICBpZiAoYXR0cmlidXRlcy5tZXRhZGF0YS5mb3JtYXQuZHVyYXRpb24gIT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuX2R1cmF0aW9uID0gK2F0dHJpYnV0ZXMubWV0YWRhdGEuZm9ybWF0LmR1cmF0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMubWV0YWRhdGEuZm9ybWF0LmJpdF9yYXRlICE9IG51bGwpIHtcbiAgICAgICAgICB0aGlzLl9iaXRSYXRlID0gK2F0dHJpYnV0ZXMubWV0YWRhdGEuZm9ybWF0LmJpdF9yYXRlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0IGlzRG93bmxvYWRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5faXNEb3dubG9hZGVkO1xuICB9XG5cbiAgc2V0IGlzRG93bmxvYWRlZCh2YWx1ZSkge1xuICAgIHRoaXMuX2lzRG93bmxvYWRlZCA9ICEhdmFsdWU7XG4gIH1cblxuICBnZXQgY3JlYXRlZEF0KCkge1xuICAgIHJldHVybiB0aGlzLl9jcmVhdGVkQXQ7XG4gIH1cblxuICBnZXQgdXBkYXRlZEF0KCkge1xuICAgIHJldHVybiB0aGlzLl91cGRhdGVkQXQ7XG4gIH1cbn1cblxuUGVyc2lzdGVudE9iamVjdC5yZWdpc3RlcihWaWRlbyk7XG4iXX0=