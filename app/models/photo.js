"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _minidb = require("minidb");

var _fulcrumCore = require("fulcrum-core");

class Photo {
  static get tableName() {
    return 'photos';
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
      name: 'exif',
      column: 'exif',
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
      name: 'latitude',
      column: 'latitude',
      type: 'double'
    }, {
      name: 'longitude',
      column: 'longitude',
      type: 'double'
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
      name: 'altitude',
      column: 'altitude',
      type: 'double'
    }, {
      name: 'accuracy',
      column: 'accuracy',
      type: 'double'
    }, {
      name: 'direction',
      column: 'direction',
      type: 'double'
    }, {
      name: 'width',
      column: 'width',
      type: 'integer'
    }, {
      name: 'height',
      column: 'height',
      type: 'integer'
    }, {
      name: 'make',
      column: 'make',
      type: 'string'
    }, {
      name: 'model',
      column: 'model',
      type: 'string'
    }, {
      name: 'software',
      column: 'software',
      type: 'string'
    }, {
      name: 'dateTime',
      column: 'date_time',
      type: 'string'
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

  integerValue(value) {
    return Array.isArray(value) ? value[0] : value;
  }

  updateFromAPIAttributes(attributes) {
    this._id = attributes.access_key;
    this._exif = attributes.exif;
    this._fileSize = attributes.file_size;
    this._latitude = attributes.latitude;
    this._longitude = attributes.longitude;
    this._isUploaded = attributes.uploaded;
    this._isStored = attributes.stored;
    this._isProcessed = attributes.processed;
    this._contentType = attributes.content_type;
    this._createdByID = attributes.created_by_id;
    this._updatedByID = attributes.updated_by_id;
    this._createdAt = _fulcrumCore.DateUtils.parseISOTimestamp(attributes.created_at);
    this._updatedAt = _fulcrumCore.DateUtils.parseISOTimestamp(attributes.updated_at);
    this._formID = attributes.form_id;
    this._recordID = attributes.record_id;

    if (attributes.exif) {
      const {
        exif
      } = attributes;
      this._altitude = exif.gps_altitude;
      this._direction = exif.gps_img_direction;
      this._accuracy = exif.gps_dop;
      this._width = this.integerValue(exif.pixel_x_dimension);
      this._height = this.integerValue(exif.pixel_y_dimension);
      this._make = exif.make;
      this._model = exif.model;
      this._software = exif.software;
      this._dateTime = exif.date_time_original || exif.date_time;
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

exports.default = Photo;

_minidb.PersistentObject.register(Photo);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvcGhvdG8uanMiXSwibmFtZXMiOlsiUGhvdG8iLCJ0YWJsZU5hbWUiLCJjb2x1bW5zIiwibmFtZSIsImNvbHVtbiIsInR5cGUiLCJudWxsIiwiaWQiLCJfaWQiLCJpbnRlZ2VyVmFsdWUiLCJ2YWx1ZSIsIkFycmF5IiwiaXNBcnJheSIsInVwZGF0ZUZyb21BUElBdHRyaWJ1dGVzIiwiYXR0cmlidXRlcyIsImFjY2Vzc19rZXkiLCJfZXhpZiIsImV4aWYiLCJfZmlsZVNpemUiLCJmaWxlX3NpemUiLCJfbGF0aXR1ZGUiLCJsYXRpdHVkZSIsIl9sb25naXR1ZGUiLCJsb25naXR1ZGUiLCJfaXNVcGxvYWRlZCIsInVwbG9hZGVkIiwiX2lzU3RvcmVkIiwic3RvcmVkIiwiX2lzUHJvY2Vzc2VkIiwicHJvY2Vzc2VkIiwiX2NvbnRlbnRUeXBlIiwiY29udGVudF90eXBlIiwiX2NyZWF0ZWRCeUlEIiwiY3JlYXRlZF9ieV9pZCIsIl91cGRhdGVkQnlJRCIsInVwZGF0ZWRfYnlfaWQiLCJfY3JlYXRlZEF0IiwiRGF0ZVV0aWxzIiwicGFyc2VJU09UaW1lc3RhbXAiLCJjcmVhdGVkX2F0IiwiX3VwZGF0ZWRBdCIsInVwZGF0ZWRfYXQiLCJfZm9ybUlEIiwiZm9ybV9pZCIsIl9yZWNvcmRJRCIsInJlY29yZF9pZCIsIl9hbHRpdHVkZSIsImdwc19hbHRpdHVkZSIsIl9kaXJlY3Rpb24iLCJncHNfaW1nX2RpcmVjdGlvbiIsIl9hY2N1cmFjeSIsImdwc19kb3AiLCJfd2lkdGgiLCJwaXhlbF94X2RpbWVuc2lvbiIsIl9oZWlnaHQiLCJwaXhlbF95X2RpbWVuc2lvbiIsIl9tYWtlIiwibWFrZSIsIl9tb2RlbCIsIm1vZGVsIiwiX3NvZnR3YXJlIiwic29mdHdhcmUiLCJfZGF0ZVRpbWUiLCJkYXRlX3RpbWVfb3JpZ2luYWwiLCJkYXRlX3RpbWUiLCJpc0Rvd25sb2FkZWQiLCJfaXNEb3dubG9hZGVkIiwiY3JlYXRlZEF0IiwidXBkYXRlZEF0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QlEsSUFBSSxDQUFDc0MsaUJBQXZCLENBQWY7QUFDQSxXQUFLQyxLQUFMLEdBQWF2QyxJQUFJLENBQUN3QyxJQUFsQjtBQUNBLFdBQUtDLE1BQUwsR0FBY3pDLElBQUksQ0FBQzBDLEtBQW5CO0FBQ0EsV0FBS0MsU0FBTCxHQUFpQjNDLElBQUksQ0FBQzRDLFFBQXRCO0FBQ0EsV0FBS0MsU0FBTCxHQUFpQjdDLElBQUksQ0FBQzhDLGtCQUFMLElBQTJCOUMsSUFBSSxDQUFDK0MsU0FBakQ7QUFDRDtBQUNGOztBQUVlLE1BQVpDLFlBQVksR0FBRztBQUNqQixXQUFPLEtBQUtDLGFBQVo7QUFDRDs7QUFFZSxNQUFaRCxZQUFZLENBQUN2RCxLQUFELEVBQVE7QUFDdEIsU0FBS3dELGFBQUwsR0FBcUIsQ0FBQyxDQUFDeEQsS0FBdkI7QUFDRDs7QUFFWSxNQUFUeUQsU0FBUyxHQUFHO0FBQ2QsV0FBTyxLQUFLL0IsVUFBWjtBQUNEOztBQUVZLE1BQVRnQyxTQUFTLEdBQUc7QUFDZCxXQUFPLEtBQUs1QixVQUFaO0FBQ0Q7O0FBL0Z3Qjs7OztBQWtHM0I2Qix5QkFBaUJDLFFBQWpCLENBQTBCdEUsS0FBMUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQZXJzaXN0ZW50T2JqZWN0IH0gZnJvbSAnbWluaWRiJztcbmltcG9ydCB7IERhdGVVdGlscyB9IGZyb20gJ2Z1bGNydW0tY29yZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBob3RvIHtcbiAgc3RhdGljIGdldCB0YWJsZU5hbWUoKSB7XG4gICAgcmV0dXJuICdwaG90b3MnO1xuICB9XG5cbiAgc3RhdGljIGdldCBjb2x1bW5zKCkge1xuICAgIHJldHVybiBbXG4gICAgICB7IG5hbWU6ICdhY2NvdW50Um93SUQnLCBjb2x1bW46ICdhY2NvdW50X2lkJywgdHlwZTogJ2ludGVnZXInLCBudWxsOiBmYWxzZSB9LFxuICAgICAgeyBuYW1lOiAnaWQnLCBjb2x1bW46ICdyZXNvdXJjZV9pZCcsIHR5cGU6ICdzdHJpbmcnLCBudWxsOiBmYWxzZSB9LFxuICAgICAgeyBuYW1lOiAnZXhpZicsIGNvbHVtbjogJ2V4aWYnLCB0eXBlOiAnanNvbicgfSxcbiAgICAgIHsgbmFtZTogJ2ZpbGVQYXRoJywgY29sdW1uOiAnZmlsZV9wYXRoJywgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgIHsgbmFtZTogJ2ZpbGVTaXplJywgY29sdW1uOiAnZmlsZV9zaXplJywgdHlwZTogJ2ludGVnZXInIH0sXG4gICAgICB7IG5hbWU6ICdjb250ZW50VHlwZScsIGNvbHVtbjogJ2NvbnRlbnRfdHlwZScsIHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICB7IG5hbWU6ICdpc0Rvd25sb2FkZWQnLCBjb2x1bW46ICdpc19kb3dubG9hZGVkJywgdHlwZTogJ2Jvb2xlYW4nLCBudWxsOiBmYWxzZSB9LFxuICAgICAgeyBuYW1lOiAnaXNVcGxvYWRlZCcsIGNvbHVtbjogJ2lzX3VwbG9hZGVkJywgdHlwZTogJ2Jvb2xlYW4nLCBudWxsOiBmYWxzZSB9LFxuICAgICAgeyBuYW1lOiAnaXNTdG9yZWQnLCBjb2x1bW46ICdpc19zdG9yZWQnLCB0eXBlOiAnYm9vbGVhbicsIG51bGw6IGZhbHNlIH0sXG4gICAgICB7IG5hbWU6ICdpc1Byb2Nlc3NlZCcsIGNvbHVtbjogJ2lzX3Byb2Nlc3NlZCcsIHR5cGU6ICdib29sZWFuJywgbnVsbDogZmFsc2UgfSxcbiAgICAgIHsgbmFtZTogJ2xhdGl0dWRlJywgY29sdW1uOiAnbGF0aXR1ZGUnLCB0eXBlOiAnZG91YmxlJyB9LFxuICAgICAgeyBuYW1lOiAnbG9uZ2l0dWRlJywgY29sdW1uOiAnbG9uZ2l0dWRlJywgdHlwZTogJ2RvdWJsZScgfSxcbiAgICAgIHsgbmFtZTogJ2Zvcm1Sb3dJRCcsIGNvbHVtbjogJ2Zvcm1faWQnLCB0eXBlOiAnaW50ZWdlcicgfSxcbiAgICAgIHsgbmFtZTogJ2Zvcm1JRCcsIGNvbHVtbjogJ2Zvcm1fcmVzb3VyY2VfaWQnLCB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgeyBuYW1lOiAncmVjb3JkUm93SUQnLCBjb2x1bW46ICdyZWNvcmRfaWQnLCB0eXBlOiAnaW50ZWdlcicgfSxcbiAgICAgIHsgbmFtZTogJ3JlY29yZElEJywgY29sdW1uOiAncmVjb3JkX3Jlc291cmNlX2lkJywgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgIHsgbmFtZTogJ3VwZGF0ZWRCeVJvd0lEJywgY29sdW1uOiAndXBkYXRlZF9ieV9pZCcsIHR5cGU6ICdpbnRlZ2VyJyB9LFxuICAgICAgeyBuYW1lOiAndXBkYXRlZEJ5SUQnLCBjb2x1bW46ICd1cGRhdGVkX2J5X3Jlc291cmNlX2lkJywgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgIHsgbmFtZTogJ2NyZWF0ZWRCeVJvd0lEJywgY29sdW1uOiAnY3JlYXRlZF9ieV9pZCcsIHR5cGU6ICdpbnRlZ2VyJyB9LFxuICAgICAgeyBuYW1lOiAnY3JlYXRlZEJ5SUQnLCBjb2x1bW46ICdjcmVhdGVkX2J5X3Jlc291cmNlX2lkJywgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgIHsgbmFtZTogJ2FsdGl0dWRlJywgY29sdW1uOiAnYWx0aXR1ZGUnLCB0eXBlOiAnZG91YmxlJyB9LFxuICAgICAgeyBuYW1lOiAnYWNjdXJhY3knLCBjb2x1bW46ICdhY2N1cmFjeScsIHR5cGU6ICdkb3VibGUnIH0sXG4gICAgICB7IG5hbWU6ICdkaXJlY3Rpb24nLCBjb2x1bW46ICdkaXJlY3Rpb24nLCB0eXBlOiAnZG91YmxlJyB9LFxuICAgICAgeyBuYW1lOiAnd2lkdGgnLCBjb2x1bW46ICd3aWR0aCcsIHR5cGU6ICdpbnRlZ2VyJyB9LFxuICAgICAgeyBuYW1lOiAnaGVpZ2h0JywgY29sdW1uOiAnaGVpZ2h0JywgdHlwZTogJ2ludGVnZXInIH0sXG4gICAgICB7IG5hbWU6ICdtYWtlJywgY29sdW1uOiAnbWFrZScsIHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICB7IG5hbWU6ICdtb2RlbCcsIGNvbHVtbjogJ21vZGVsJywgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgIHsgbmFtZTogJ3NvZnR3YXJlJywgY29sdW1uOiAnc29mdHdhcmUnLCB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgeyBuYW1lOiAnZGF0ZVRpbWUnLCBjb2x1bW46ICdkYXRlX3RpbWUnLCB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgeyBuYW1lOiAnY3JlYXRlZEF0JywgY29sdW1uOiAnc2VydmVyX2NyZWF0ZWRfYXQnLCB0eXBlOiAnZGF0ZXRpbWUnIH0sXG4gICAgICB7IG5hbWU6ICd1cGRhdGVkQXQnLCBjb2x1bW46ICdzZXJ2ZXJfdXBkYXRlZF9hdCcsIHR5cGU6ICdkYXRldGltZScgfVxuICAgIF07XG4gIH1cblxuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lkO1xuICB9XG5cbiAgaW50ZWdlclZhbHVlKHZhbHVlKSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpID8gdmFsdWVbMF0gOiB2YWx1ZTtcbiAgfVxuXG4gIHVwZGF0ZUZyb21BUElBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpIHtcbiAgICB0aGlzLl9pZCA9IGF0dHJpYnV0ZXMuYWNjZXNzX2tleTtcbiAgICB0aGlzLl9leGlmID0gYXR0cmlidXRlcy5leGlmO1xuICAgIHRoaXMuX2ZpbGVTaXplID0gYXR0cmlidXRlcy5maWxlX3NpemU7XG4gICAgdGhpcy5fbGF0aXR1ZGUgPSBhdHRyaWJ1dGVzLmxhdGl0dWRlO1xuICAgIHRoaXMuX2xvbmdpdHVkZSA9IGF0dHJpYnV0ZXMubG9uZ2l0dWRlO1xuICAgIHRoaXMuX2lzVXBsb2FkZWQgPSBhdHRyaWJ1dGVzLnVwbG9hZGVkO1xuICAgIHRoaXMuX2lzU3RvcmVkID0gYXR0cmlidXRlcy5zdG9yZWQ7XG4gICAgdGhpcy5faXNQcm9jZXNzZWQgPSBhdHRyaWJ1dGVzLnByb2Nlc3NlZDtcbiAgICB0aGlzLl9jb250ZW50VHlwZSA9IGF0dHJpYnV0ZXMuY29udGVudF90eXBlO1xuICAgIHRoaXMuX2NyZWF0ZWRCeUlEID0gYXR0cmlidXRlcy5jcmVhdGVkX2J5X2lkO1xuICAgIHRoaXMuX3VwZGF0ZWRCeUlEID0gYXR0cmlidXRlcy51cGRhdGVkX2J5X2lkO1xuICAgIHRoaXMuX2NyZWF0ZWRBdCA9IERhdGVVdGlscy5wYXJzZUlTT1RpbWVzdGFtcChhdHRyaWJ1dGVzLmNyZWF0ZWRfYXQpO1xuICAgIHRoaXMuX3VwZGF0ZWRBdCA9IERhdGVVdGlscy5wYXJzZUlTT1RpbWVzdGFtcChhdHRyaWJ1dGVzLnVwZGF0ZWRfYXQpO1xuICAgIHRoaXMuX2Zvcm1JRCA9IGF0dHJpYnV0ZXMuZm9ybV9pZDtcbiAgICB0aGlzLl9yZWNvcmRJRCA9IGF0dHJpYnV0ZXMucmVjb3JkX2lkO1xuXG4gICAgaWYgKGF0dHJpYnV0ZXMuZXhpZikge1xuICAgICAgY29uc3Qge2V4aWZ9ID0gYXR0cmlidXRlcztcblxuICAgICAgdGhpcy5fYWx0aXR1ZGUgPSBleGlmLmdwc19hbHRpdHVkZTtcbiAgICAgIHRoaXMuX2RpcmVjdGlvbiA9IGV4aWYuZ3BzX2ltZ19kaXJlY3Rpb247XG4gICAgICB0aGlzLl9hY2N1cmFjeSA9IGV4aWYuZ3BzX2RvcDtcbiAgICAgIHRoaXMuX3dpZHRoID0gdGhpcy5pbnRlZ2VyVmFsdWUoZXhpZi5waXhlbF94X2RpbWVuc2lvbik7XG4gICAgICB0aGlzLl9oZWlnaHQgPSB0aGlzLmludGVnZXJWYWx1ZShleGlmLnBpeGVsX3lfZGltZW5zaW9uKTtcbiAgICAgIHRoaXMuX21ha2UgPSBleGlmLm1ha2U7XG4gICAgICB0aGlzLl9tb2RlbCA9IGV4aWYubW9kZWw7XG4gICAgICB0aGlzLl9zb2Z0d2FyZSA9IGV4aWYuc29mdHdhcmU7XG4gICAgICB0aGlzLl9kYXRlVGltZSA9IGV4aWYuZGF0ZV90aW1lX29yaWdpbmFsIHx8IGV4aWYuZGF0ZV90aW1lO1xuICAgIH1cbiAgfVxuXG4gIGdldCBpc0Rvd25sb2FkZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lzRG93bmxvYWRlZDtcbiAgfVxuXG4gIHNldCBpc0Rvd25sb2FkZWQodmFsdWUpIHtcbiAgICB0aGlzLl9pc0Rvd25sb2FkZWQgPSAhIXZhbHVlO1xuICB9XG5cbiAgZ2V0IGNyZWF0ZWRBdCgpIHtcbiAgICByZXR1cm4gdGhpcy5fY3JlYXRlZEF0O1xuICB9XG5cbiAgZ2V0IHVwZGF0ZWRBdCgpIHtcbiAgICByZXR1cm4gdGhpcy5fdXBkYXRlZEF0O1xuICB9XG59XG5cblBlcnNpc3RlbnRPYmplY3QucmVnaXN0ZXIoUGhvdG8pO1xuIl19