"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = require("util");

var _lodash = _interopRequireDefault(require("lodash"));

var _fulcrumCore = require("fulcrum-core");

var _pgFormat = _interopRequireDefault(require("pg-format"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RecordValues {
  static updateForRecordStatements(db, record, options = {}) {
    const statements = [];
    statements.push.apply(statements, this.deleteForRecordStatements(db, record, record.form, options));
    statements.push.apply(statements, this.insertForRecordStatements(db, record, record.form, options));
    return statements;
  }

  static insertForRecordStatements(db, record, form, options = {}) {
    const statements = [];
    statements.push(this.insertRowForFeatureStatement(db, form, record, null, record, options));
    statements.push.apply(statements, this.insertChildFeaturesForFeatureStatements(db, form, record, record, options));
    statements.push.apply(statements, this.insertMultipleValuesForFeatureStatements(db, form, record, record, options));
    statements.push.apply(statements, this.insertChildMultipleValuesForFeatureStatements(db, form, record, record, options));
    return statements;
  }

  static insertRowForFeatureStatement(db, form, feature, parentFeature, record, options = {}) {
    const values = this.columnValuesForFeature(feature, options);
    const systemValues = this.systemColumnValuesForFeature(feature, parentFeature, record, options);
    Object.assign(values, systemValues);
    let tableName = null;

    if (feature instanceof _fulcrumCore.RepeatableItemValue) {
      // TODO(zhm) add public interface for accessing _element, like `get repeatableElement()`
      tableName = this.tableNameWithFormAndSchema(form, feature._element, options);
    } else {
      tableName = this.tableNameWithFormAndSchema(form, null, options);
    }

    if (options.valuesTransformer) {
      options.valuesTransformer({
        db,
        form,
        feature,
        parentFeature,
        record,
        values
      });
    }

    return db.insertStatement(tableName, values, {
      pk: 'id'
    });
  }

  static insertChildFeaturesForFeatureStatements(db, form, feature, record, options = {}) {
    const statements = [];

    for (const formValue of feature.formValues.all) {
      if (formValue.element.isRepeatableElement) {
        // TODO(zhm) add public interface for _items
        for (const repeatableItem of formValue._items) {
          statements.push(this.insertRowForFeatureStatement(db, form, repeatableItem, feature, record, options));
          statements.push.apply(statements, this.insertChildFeaturesForFeatureStatements(db, form, repeatableItem, record, options));
        }
      }
    }

    return statements;
  }

  static maybeAssignArray(values, key, value, disableArrays, disableComplexTypes) {
    if (value == null) {
      return;
    }

    const disabledArrayValue = _lodash.default.isArray(value) && disableArrays ? value.join(',') : value;

    const isSimple = _lodash.default.isNumber(value) || _lodash.default.isString(value) || _lodash.default.isDate(value) || _lodash.default.isBoolean(value);

    values[key] = !isSimple && disableComplexTypes === true ? JSON.stringify(value) : value;
  }

  static columnValuesForFeature(feature, options = {}) {
    const values = {};

    for (const formValue of feature.formValues.all) {
      if (formValue.isEmpty) {
        continue;
      }

      const element = formValue.element;
      let columnValue = formValue.columnValue;

      if (_lodash.default.isNumber(columnValue) || _lodash.default.isString(columnValue) || _lodash.default.isArray(columnValue) || _lodash.default.isDate(columnValue)) {
        if (options.calculatedFieldDateFormat === 'date' && element.isCalculatedElement && element.display.isDate) {
          columnValue = _fulcrumCore.DateUtils.parseDate(formValue.textValue);
        } // don't allow dates greater than 9999, yes - they exist in the wild


        if (_lodash.default.isDate(columnValue)) {
          columnValue = columnValue.getFullYear() > 9999 ? null : formValue.textValue;
        }

        this.maybeAssignArray(values, 'f' + formValue.element.key.toLowerCase(), columnValue, options.disableArrays, options.disableComplexTypes);
      } else if (columnValue) {
        if (element && options.mediaURLFormatter) {
          if (element.isPhotoElement || element.isVideoElement || element.isAudioElement) {
            const prefix = 'f' + formValue.element.key.toLowerCase();
            columnValue[prefix + '_urls'] = options.mediaURLFormatter(formValue);

            if (options.mediaViewURLFormatter) {
              columnValue[prefix + '_view_url'] = options.mediaViewURLFormatter(formValue);
            }
          }
        } // if array types are disabled, convert all the props to delimited values


        for (const key of Object.keys(columnValue)) {
          this.maybeAssignArray(columnValue, key, columnValue[key], options.disableArrays, options.disableComplexTypes);
        }

        Object.assign(values, columnValue);
      }
    }

    return values;
  }

  static insertMultipleValuesForFeatureStatements(db, form, feature, record, options = {}) {
    const statements = [];
    const values = this.multipleValuesForFeature(feature, record);
    const tableName = this.multipleValueTableNameWithForm(form, options);
    let parentResourceId = null;

    if (feature instanceof _fulcrumCore.RepeatableItemValue) {
      parentResourceId = feature.id;
    }

    for (const multipleValueItem of values) {
      const insertValues = Object.assign({}, {
        key: multipleValueItem.element.key,
        text_value: multipleValueItem.value
      }, {
        record_id: record.rowID,
        record_resource_id: record.id,
        parent_resource_id: parentResourceId
      });
      statements.push(db.insertStatement(tableName, insertValues, {
        pk: 'id'
      }));
    }

    return statements;
  }

  static insertChildMultipleValuesForFeatureStatements(db, form, feature, record, options = {}) {
    const statements = [];

    for (const formValue of feature.formValues.all) {
      if (formValue.isRepeatableElement) {
        for (const repeatableItem of formValue._items) {
          statements.push.apply(statements, this.insertMultipleValuesForFeatureStatements(db, form, repeatableItem, record, options));
          statements.push.apply(statements, this.insertChildMultipleValuesForFeatureStatements(db, form, repeatableItem, record, options));
        }
      }
    }

    return statements;
  }

  static multipleValuesForFeature(feature, record) {
    const values = [];

    for (const formValue of feature.formValues.all) {
      if (formValue.isEmpty) {
        continue;
      }

      const featureValues = formValue.multipleValues;

      if (featureValues) {
        values.push.apply(values, featureValues);
      }
    }

    return values;
  }

  static systemColumnValuesForFeature(feature, parentFeature, record, options = {}) {
    const values = {};
    values.record_id = record.rowID;
    values.record_resource_id = record.id;

    if (options.reportURLFormatter) {
      values.report_url = options.reportURLFormatter(feature);
    }

    if (feature instanceof _fulcrumCore.Record) {
      if (record._projectRowID) {
        values.project_id = record._projectRowID;
      }

      if (record.projectID) {
        values.project_resource_id = record.projectID;
      }

      if (record._assignedToRowID) {
        values.assigned_to_id = record._assignedToRowID;
      }

      if (record.assignedToID) {
        values.assigned_to_resource_id = record.assignedToID;
      }

      if (record._createdByRowID) {
        values.created_by_id = record._createdByRowID;
      }

      if (record.createdByID) {
        values.created_by_resource_id = record.createdByID;
      }

      if (record._updatedByRowID) {
        values.updated_by_id = record._updatedByRowID;
      }

      if (record.updatedByID) {
        values.updated_by_resource_id = record.updatedByID;
      }

      if (record._changesetRowID) {
        values.changeset_id = record._changesetRowID;
      }

      if (record.changesetID) {
        values.changeset_resource_id = record.changesetID;
      }

      if (record.status) {
        values.status = record.status;
      }

      if (record.latitude != null) {
        values.latitude = record.latitude;
      }

      if (record.longitude != null) {
        values.longitude = record.longitude;
      }

      values.altitude = record.altitude;
      values.speed = record.speed;
      values.course = record.course;
      values.vertical_accuracy = record.verticalAccuracy;
      values.horizontal_accuracy = record.horizontalAccuracy;
    } else if (feature instanceof _fulcrumCore.RepeatableItemValue) {
      values.resource_id = feature.id;
      values.index = feature.index;
      values.parent_resource_id = parentFeature.id;

      if (feature.hasCoordinate) {
        values.latitude = feature.latitude;
        values.longitude = feature.longitude;
      } // record values


      if (record.status) {
        values.record_status = record.status;
      }

      if (record._projectRowID) {
        values.record_project_id = record._projectRowID;
      }

      if (record.projectID) {
        values.record_project_resource_id = record.projectID;
      }

      if (record._assignedToRowID) {
        values.record_assigned_to_id = record._assignedToRowID;
      }

      if (record.assignedToID) {
        values.record_assigned_to_resource_id = record.assignedToID;
      } // linked fields


      if (feature.createdBy) {
        values.created_by_id = feature.createdBy.rowID;
      }

      if (feature.createdByID) {
        values.created_by_resource_id = feature.createdByID;
      }

      if (feature.updatedBy) {
        values.updated_by_id = feature.updatedBy.rowID;
      }

      if (feature.updatedByID) {
        values.updated_by_resource_id = feature.updatedByID;
      }

      if (feature.changeset) {
        values.changeset_id = feature.changeset.rowID;
        values.changeset_resource_id = feature.changesetID;
      } else if (record._changesetRowID) {
        values.changeset_id = record._changesetRowID;
        values.changeset_resource_id = record.changesetID;
      }
    }

    values.title = feature.displayValue;
    values.form_values = JSON.stringify(feature.formValues.toJSON());
    this.setupSearch(values, feature, options);

    if (feature.hasCoordinate) {
      values.geometry = this.setupPoint(values, feature.latitude, feature.longitude, options);
    } else {
      values.geometry = null;
    }

    values.created_at = feature.clientCreatedAt || feature.createdAt;
    values.updated_at = feature.clientUpdatedAt || feature.updatedAt;
    values.version = feature.version;

    if (values.created_by_id == null) {
      values.created_by_id = -1;
    }

    if (values.updated_by_id == null) {
      values.updated_by_id = -1;
    }

    values.server_created_at = feature.createdAt;
    values.server_updated_at = feature.updatedAt;
    values.created_duration = feature.createdDuration;
    values.updated_duration = feature.updatedDuration;
    values.edited_duration = feature.editedDuration;
    values.created_latitude = feature.createdLatitude;
    values.created_longitude = feature.createdLongitude;
    values.created_altitude = feature.createdAltitude;
    values.created_horizontal_accuracy = feature.createdAccuracy;

    if (feature.hasCreatedCoordinate) {
      values.created_geometry = this.setupPoint(values, feature.createdLatitude, feature.createdLongitude, options);
    }

    values.updated_latitude = feature.updatedLatitude;
    values.updated_longitude = feature.updatedLongitude;
    values.updated_altitude = feature.updatedAltitude;
    values.updated_horizontal_accuracy = feature.updatedAccuracy;

    if (feature.hasUpdatedCoordinate) {
      values.updated_geometry = this.setupPoint(values, feature.updatedLatitude, feature.updatedLongitude, options);
    }

    return values;
  }

  static deleteRowsForRecordStatement(db, record, tableName) {
    return db.deleteStatement(tableName, {
      record_resource_id: record.id
    });
  }

  static deleteRowsStatement(db, tableName) {
    return db.deleteStatement(tableName, {});
  }

  static deleteForRecordStatements(db, record, form, options) {
    const repeatables = form.elementsOfType('Repeatable');
    const statements = [];
    let tableName = this.tableNameWithFormAndSchema(form, null, options);
    statements.push(this.deleteRowsForRecordStatement(db, record, tableName));

    for (const repeatable of repeatables) {
      tableName = this.tableNameWithFormAndSchema(form, repeatable, options);
      statements.push(this.deleteRowsForRecordStatement(db, record, tableName));
    }

    tableName = this.multipleValueTableNameWithForm(form, options);
    statements.push(this.deleteRowsForRecordStatement(db, record, tableName));
    return statements;
  }

  static deleteForFormStatements(db, form, options) {
    const repeatables = form.elementsOfType('Repeatable');
    const statements = [];
    let tableName = this.tableNameWithFormAndSchema(form, null, options);
    statements.push(this.deleteRowsStatement(db, tableName));

    for (const repeatable of repeatables) {
      tableName = this.tableNameWithFormAndSchema(form, repeatable, options);
      statements.push(this.deleteRowsStatement(db, tableName));
    }

    tableName = this.multipleValueTableNameWithForm(form, options);
    statements.push(this.deleteRowsStatement(db, tableName));
    return statements;
  }

  static multipleValueTableNameWithForm(form, options) {
    return this.tableNameWithFormAndSchema(form, null, options, '_values');
  }

  static tableNameWithFormAndSchema(form, repeatable, options, suffix) {
    const tableName = this.tableNameWithForm(form, repeatable, options);
    suffix = suffix || '';

    if (options.schema) {
      return options.escapeIdentifier(options.schema) + '.' + options.escapeIdentifier(tableName + suffix);
    }

    return options.escapeIdentifier(tableName + suffix);
  }

  static tableNameWithForm(form, repeatable, options) {
    if (repeatable == null) {
      return (0, _util.format)('%sform_%s', this.accountPrefix(form, options), this.formIdentifier(form, options));
    }

    return (0, _util.format)('%sform_%s_%s', this.accountPrefix(form, options), this.formIdentifier(form, options), repeatable.key);
  }

  static accountPrefix(form, options) {
    return options.accountPrefix != null ? 'account_' + form._accountRowID + '_' : '';
  }

  static formIdentifier(form, options) {
    return options.persistentTableNames ? form.id : form.rowID;
  }

  static setupSearch(values, feature) {
    const searchableValue = feature.searchableValue;
    values.record_index_text = searchableValue;
    values.record_index = {
      raw: `to_tsvector(${(0, _pgFormat.default)('%L', searchableValue)})`
    };
    return values;
  }

  static setupPoint(values, latitude, longitude) {
    const wkt = (0, _pgFormat.default)('POINT(%s %s)', longitude, latitude);
    return {
      raw: `ST_Force2D(ST_SetSRID(ST_GeomFromText('${wkt}'), 4326))`
    };
  }

}

exports.default = RecordValues;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2RlbHMvcmVjb3JkLXZhbHVlcy9yZWNvcmQtdmFsdWVzLmpzIl0sIm5hbWVzIjpbIlJlY29yZFZhbHVlcyIsInVwZGF0ZUZvclJlY29yZFN0YXRlbWVudHMiLCJkYiIsInJlY29yZCIsIm9wdGlvbnMiLCJzdGF0ZW1lbnRzIiwicHVzaCIsImFwcGx5IiwiZGVsZXRlRm9yUmVjb3JkU3RhdGVtZW50cyIsImZvcm0iLCJpbnNlcnRGb3JSZWNvcmRTdGF0ZW1lbnRzIiwiaW5zZXJ0Um93Rm9yRmVhdHVyZVN0YXRlbWVudCIsImluc2VydENoaWxkRmVhdHVyZXNGb3JGZWF0dXJlU3RhdGVtZW50cyIsImluc2VydE11bHRpcGxlVmFsdWVzRm9yRmVhdHVyZVN0YXRlbWVudHMiLCJpbnNlcnRDaGlsZE11bHRpcGxlVmFsdWVzRm9yRmVhdHVyZVN0YXRlbWVudHMiLCJmZWF0dXJlIiwicGFyZW50RmVhdHVyZSIsInZhbHVlcyIsImNvbHVtblZhbHVlc0ZvckZlYXR1cmUiLCJzeXN0ZW1WYWx1ZXMiLCJzeXN0ZW1Db2x1bW5WYWx1ZXNGb3JGZWF0dXJlIiwiT2JqZWN0IiwiYXNzaWduIiwidGFibGVOYW1lIiwiUmVwZWF0YWJsZUl0ZW1WYWx1ZSIsInRhYmxlTmFtZVdpdGhGb3JtQW5kU2NoZW1hIiwiX2VsZW1lbnQiLCJ2YWx1ZXNUcmFuc2Zvcm1lciIsImluc2VydFN0YXRlbWVudCIsInBrIiwiZm9ybVZhbHVlIiwiZm9ybVZhbHVlcyIsImFsbCIsImVsZW1lbnQiLCJpc1JlcGVhdGFibGVFbGVtZW50IiwicmVwZWF0YWJsZUl0ZW0iLCJfaXRlbXMiLCJtYXliZUFzc2lnbkFycmF5Iiwia2V5IiwidmFsdWUiLCJkaXNhYmxlQXJyYXlzIiwiZGlzYWJsZUNvbXBsZXhUeXBlcyIsImRpc2FibGVkQXJyYXlWYWx1ZSIsIl8iLCJpc0FycmF5Iiwiam9pbiIsImlzU2ltcGxlIiwiaXNOdW1iZXIiLCJpc1N0cmluZyIsImlzRGF0ZSIsImlzQm9vbGVhbiIsIkpTT04iLCJzdHJpbmdpZnkiLCJpc0VtcHR5IiwiY29sdW1uVmFsdWUiLCJjYWxjdWxhdGVkRmllbGREYXRlRm9ybWF0IiwiaXNDYWxjdWxhdGVkRWxlbWVudCIsImRpc3BsYXkiLCJEYXRlVXRpbHMiLCJwYXJzZURhdGUiLCJ0ZXh0VmFsdWUiLCJnZXRGdWxsWWVhciIsInRvTG93ZXJDYXNlIiwibWVkaWFVUkxGb3JtYXR0ZXIiLCJpc1Bob3RvRWxlbWVudCIsImlzVmlkZW9FbGVtZW50IiwiaXNBdWRpb0VsZW1lbnQiLCJwcmVmaXgiLCJtZWRpYVZpZXdVUkxGb3JtYXR0ZXIiLCJrZXlzIiwibXVsdGlwbGVWYWx1ZXNGb3JGZWF0dXJlIiwibXVsdGlwbGVWYWx1ZVRhYmxlTmFtZVdpdGhGb3JtIiwicGFyZW50UmVzb3VyY2VJZCIsImlkIiwibXVsdGlwbGVWYWx1ZUl0ZW0iLCJpbnNlcnRWYWx1ZXMiLCJ0ZXh0X3ZhbHVlIiwicmVjb3JkX2lkIiwicm93SUQiLCJyZWNvcmRfcmVzb3VyY2VfaWQiLCJwYXJlbnRfcmVzb3VyY2VfaWQiLCJmZWF0dXJlVmFsdWVzIiwibXVsdGlwbGVWYWx1ZXMiLCJyZXBvcnRVUkxGb3JtYXR0ZXIiLCJyZXBvcnRfdXJsIiwiUmVjb3JkIiwiX3Byb2plY3RSb3dJRCIsInByb2plY3RfaWQiLCJwcm9qZWN0SUQiLCJwcm9qZWN0X3Jlc291cmNlX2lkIiwiX2Fzc2lnbmVkVG9Sb3dJRCIsImFzc2lnbmVkX3RvX2lkIiwiYXNzaWduZWRUb0lEIiwiYXNzaWduZWRfdG9fcmVzb3VyY2VfaWQiLCJfY3JlYXRlZEJ5Um93SUQiLCJjcmVhdGVkX2J5X2lkIiwiY3JlYXRlZEJ5SUQiLCJjcmVhdGVkX2J5X3Jlc291cmNlX2lkIiwiX3VwZGF0ZWRCeVJvd0lEIiwidXBkYXRlZF9ieV9pZCIsInVwZGF0ZWRCeUlEIiwidXBkYXRlZF9ieV9yZXNvdXJjZV9pZCIsIl9jaGFuZ2VzZXRSb3dJRCIsImNoYW5nZXNldF9pZCIsImNoYW5nZXNldElEIiwiY2hhbmdlc2V0X3Jlc291cmNlX2lkIiwic3RhdHVzIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJhbHRpdHVkZSIsInNwZWVkIiwiY291cnNlIiwidmVydGljYWxfYWNjdXJhY3kiLCJ2ZXJ0aWNhbEFjY3VyYWN5IiwiaG9yaXpvbnRhbF9hY2N1cmFjeSIsImhvcml6b250YWxBY2N1cmFjeSIsInJlc291cmNlX2lkIiwiaW5kZXgiLCJoYXNDb29yZGluYXRlIiwicmVjb3JkX3N0YXR1cyIsInJlY29yZF9wcm9qZWN0X2lkIiwicmVjb3JkX3Byb2plY3RfcmVzb3VyY2VfaWQiLCJyZWNvcmRfYXNzaWduZWRfdG9faWQiLCJyZWNvcmRfYXNzaWduZWRfdG9fcmVzb3VyY2VfaWQiLCJjcmVhdGVkQnkiLCJ1cGRhdGVkQnkiLCJjaGFuZ2VzZXQiLCJ0aXRsZSIsImRpc3BsYXlWYWx1ZSIsImZvcm1fdmFsdWVzIiwidG9KU09OIiwic2V0dXBTZWFyY2giLCJnZW9tZXRyeSIsInNldHVwUG9pbnQiLCJjcmVhdGVkX2F0IiwiY2xpZW50Q3JlYXRlZEF0IiwiY3JlYXRlZEF0IiwidXBkYXRlZF9hdCIsImNsaWVudFVwZGF0ZWRBdCIsInVwZGF0ZWRBdCIsInZlcnNpb24iLCJzZXJ2ZXJfY3JlYXRlZF9hdCIsInNlcnZlcl91cGRhdGVkX2F0IiwiY3JlYXRlZF9kdXJhdGlvbiIsImNyZWF0ZWREdXJhdGlvbiIsInVwZGF0ZWRfZHVyYXRpb24iLCJ1cGRhdGVkRHVyYXRpb24iLCJlZGl0ZWRfZHVyYXRpb24iLCJlZGl0ZWREdXJhdGlvbiIsImNyZWF0ZWRfbGF0aXR1ZGUiLCJjcmVhdGVkTGF0aXR1ZGUiLCJjcmVhdGVkX2xvbmdpdHVkZSIsImNyZWF0ZWRMb25naXR1ZGUiLCJjcmVhdGVkX2FsdGl0dWRlIiwiY3JlYXRlZEFsdGl0dWRlIiwiY3JlYXRlZF9ob3Jpem9udGFsX2FjY3VyYWN5IiwiY3JlYXRlZEFjY3VyYWN5IiwiaGFzQ3JlYXRlZENvb3JkaW5hdGUiLCJjcmVhdGVkX2dlb21ldHJ5IiwidXBkYXRlZF9sYXRpdHVkZSIsInVwZGF0ZWRMYXRpdHVkZSIsInVwZGF0ZWRfbG9uZ2l0dWRlIiwidXBkYXRlZExvbmdpdHVkZSIsInVwZGF0ZWRfYWx0aXR1ZGUiLCJ1cGRhdGVkQWx0aXR1ZGUiLCJ1cGRhdGVkX2hvcml6b250YWxfYWNjdXJhY3kiLCJ1cGRhdGVkQWNjdXJhY3kiLCJoYXNVcGRhdGVkQ29vcmRpbmF0ZSIsInVwZGF0ZWRfZ2VvbWV0cnkiLCJkZWxldGVSb3dzRm9yUmVjb3JkU3RhdGVtZW50IiwiZGVsZXRlU3RhdGVtZW50IiwiZGVsZXRlUm93c1N0YXRlbWVudCIsInJlcGVhdGFibGVzIiwiZWxlbWVudHNPZlR5cGUiLCJyZXBlYXRhYmxlIiwiZGVsZXRlRm9yRm9ybVN0YXRlbWVudHMiLCJzdWZmaXgiLCJ0YWJsZU5hbWVXaXRoRm9ybSIsInNjaGVtYSIsImVzY2FwZUlkZW50aWZpZXIiLCJhY2NvdW50UHJlZml4IiwiZm9ybUlkZW50aWZpZXIiLCJfYWNjb3VudFJvd0lEIiwicGVyc2lzdGVudFRhYmxlTmFtZXMiLCJzZWFyY2hhYmxlVmFsdWUiLCJyZWNvcmRfaW5kZXhfdGV4dCIsInJlY29yZF9pbmRleCIsInJhdyIsIndrdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRWUsTUFBTUEsWUFBTixDQUFtQjtBQUNBLFNBQXpCQyx5QkFBeUIsQ0FBQ0MsRUFBRCxFQUFLQyxNQUFMLEVBQWFDLE9BQU8sR0FBRyxFQUF2QixFQUEyQjtBQUN6RCxVQUFNQyxVQUFVLEdBQUcsRUFBbkI7QUFFQUEsSUFBQUEsVUFBVSxDQUFDQyxJQUFYLENBQWdCQyxLQUFoQixDQUFzQkYsVUFBdEIsRUFBa0MsS0FBS0cseUJBQUwsQ0FBK0JOLEVBQS9CLEVBQW1DQyxNQUFuQyxFQUEyQ0EsTUFBTSxDQUFDTSxJQUFsRCxFQUF3REwsT0FBeEQsQ0FBbEM7QUFDQUMsSUFBQUEsVUFBVSxDQUFDQyxJQUFYLENBQWdCQyxLQUFoQixDQUFzQkYsVUFBdEIsRUFBa0MsS0FBS0sseUJBQUwsQ0FB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QXpCLEVBQW9DRCxRQUFwQyxDQUFaO0FBRUEsV0FBTztBQUFDZ0YsTUFBQUEsR0FBRyxFQUFHLDBDQUEwQ0MsR0FBSztBQUF0RCxLQUFQO0FBQ0Q7O0FBbmMrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZvcm1hdCB9IGZyb20gJ3V0aWwnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IFJlY29yZCwgUmVwZWF0YWJsZUl0ZW1WYWx1ZSwgRGF0ZVV0aWxzIH0gZnJvbSAnZnVsY3J1bS1jb3JlJztcbmltcG9ydCBwZ2Zvcm1hdCBmcm9tICdwZy1mb3JtYXQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWNvcmRWYWx1ZXMge1xuICBzdGF0aWMgdXBkYXRlRm9yUmVjb3JkU3RhdGVtZW50cyhkYiwgcmVjb3JkLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBzdGF0ZW1lbnRzID0gW107XG5cbiAgICBzdGF0ZW1lbnRzLnB1c2guYXBwbHkoc3RhdGVtZW50cywgdGhpcy5kZWxldGVGb3JSZWNvcmRTdGF0ZW1lbnRzKGRiLCByZWNvcmQsIHJlY29yZC5mb3JtLCBvcHRpb25zKSk7XG4gICAgc3RhdGVtZW50cy5wdXNoLmFwcGx5KHN0YXRlbWVudHMsIHRoaXMuaW5zZXJ0Rm9yUmVjb3JkU3RhdGVtZW50cyhkYiwgcmVjb3JkLCByZWNvcmQuZm9ybSwgb3B0aW9ucykpO1xuXG4gICAgcmV0dXJuIHN0YXRlbWVudHM7XG4gIH1cblxuICBzdGF0aWMgaW5zZXJ0Rm9yUmVjb3JkU3RhdGVtZW50cyhkYiwgcmVjb3JkLCBmb3JtLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBzdGF0ZW1lbnRzID0gW107XG5cbiAgICBzdGF0ZW1lbnRzLnB1c2godGhpcy5pbnNlcnRSb3dGb3JGZWF0dXJlU3RhdGVtZW50KGRiLCBmb3JtLCByZWNvcmQsIG51bGwsIHJlY29yZCwgb3B0aW9ucykpO1xuICAgIHN0YXRlbWVudHMucHVzaC5hcHBseShzdGF0ZW1lbnRzLCB0aGlzLmluc2VydENoaWxkRmVhdHVyZXNGb3JGZWF0dXJlU3RhdGVtZW50cyhkYiwgZm9ybSwgcmVjb3JkLCByZWNvcmQsIG9wdGlvbnMpKTtcbiAgICBzdGF0ZW1lbnRzLnB1c2guYXBwbHkoc3RhdGVtZW50cywgdGhpcy5pbnNlcnRNdWx0aXBsZVZhbHVlc0ZvckZlYXR1cmVTdGF0ZW1lbnRzKGRiLCBmb3JtLCByZWNvcmQsIHJlY29yZCwgb3B0aW9ucykpO1xuICAgIHN0YXRlbWVudHMucHVzaC5hcHBseShzdGF0ZW1lbnRzLCB0aGlzLmluc2VydENoaWxkTXVsdGlwbGVWYWx1ZXNGb3JGZWF0dXJlU3RhdGVtZW50cyhkYiwgZm9ybSwgcmVjb3JkLCByZWNvcmQsIG9wdGlvbnMpKTtcblxuICAgIHJldHVybiBzdGF0ZW1lbnRzO1xuICB9XG5cbiAgc3RhdGljIGluc2VydFJvd0ZvckZlYXR1cmVTdGF0ZW1lbnQoZGIsIGZvcm0sIGZlYXR1cmUsIHBhcmVudEZlYXR1cmUsIHJlY29yZCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgdmFsdWVzID0gdGhpcy5jb2x1bW5WYWx1ZXNGb3JGZWF0dXJlKGZlYXR1cmUsIG9wdGlvbnMpO1xuICAgIGNvbnN0IHN5c3RlbVZhbHVlcyA9IHRoaXMuc3lzdGVtQ29sdW1uVmFsdWVzRm9yRmVhdHVyZShmZWF0dXJlLCBwYXJlbnRGZWF0dXJlLCByZWNvcmQsIG9wdGlvbnMpO1xuXG4gICAgT2JqZWN0LmFzc2lnbih2YWx1ZXMsIHN5c3RlbVZhbHVlcyk7XG5cbiAgICBsZXQgdGFibGVOYW1lID0gbnVsbDtcblxuICAgIGlmIChmZWF0dXJlIGluc3RhbmNlb2YgUmVwZWF0YWJsZUl0ZW1WYWx1ZSkge1xuICAgICAgLy8gVE9ETyh6aG0pIGFkZCBwdWJsaWMgaW50ZXJmYWNlIGZvciBhY2Nlc3NpbmcgX2VsZW1lbnQsIGxpa2UgYGdldCByZXBlYXRhYmxlRWxlbWVudCgpYFxuICAgICAgdGFibGVOYW1lID0gdGhpcy50YWJsZU5hbWVXaXRoRm9ybUFuZFNjaGVtYShmb3JtLCBmZWF0dXJlLl9lbGVtZW50LCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFibGVOYW1lID0gdGhpcy50YWJsZU5hbWVXaXRoRm9ybUFuZFNjaGVtYShmb3JtLCBudWxsLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy52YWx1ZXNUcmFuc2Zvcm1lcikge1xuICAgICAgb3B0aW9ucy52YWx1ZXNUcmFuc2Zvcm1lcih7ZGIsIGZvcm0sIGZlYXR1cmUsIHBhcmVudEZlYXR1cmUsIHJlY29yZCwgdmFsdWVzfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRiLmluc2VydFN0YXRlbWVudCh0YWJsZU5hbWUsIHZhbHVlcywge3BrOiAnaWQnfSk7XG4gIH1cblxuICBzdGF0aWMgaW5zZXJ0Q2hpbGRGZWF0dXJlc0ZvckZlYXR1cmVTdGF0ZW1lbnRzKGRiLCBmb3JtLCBmZWF0dXJlLCByZWNvcmQsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHN0YXRlbWVudHMgPSBbXTtcblxuICAgIGZvciAoY29uc3QgZm9ybVZhbHVlIG9mIGZlYXR1cmUuZm9ybVZhbHVlcy5hbGwpIHtcbiAgICAgIGlmIChmb3JtVmFsdWUuZWxlbWVudC5pc1JlcGVhdGFibGVFbGVtZW50KSB7XG4gICAgICAgIC8vIFRPRE8oemhtKSBhZGQgcHVibGljIGludGVyZmFjZSBmb3IgX2l0ZW1zXG4gICAgICAgIGZvciAoY29uc3QgcmVwZWF0YWJsZUl0ZW0gb2YgZm9ybVZhbHVlLl9pdGVtcykge1xuICAgICAgICAgIHN0YXRlbWVudHMucHVzaCh0aGlzLmluc2VydFJvd0ZvckZlYXR1cmVTdGF0ZW1lbnQoZGIsIGZvcm0sIHJlcGVhdGFibGVJdGVtLCBmZWF0dXJlLCByZWNvcmQsIG9wdGlvbnMpKTtcbiAgICAgICAgICBzdGF0ZW1lbnRzLnB1c2guYXBwbHkoc3RhdGVtZW50cywgdGhpcy5pbnNlcnRDaGlsZEZlYXR1cmVzRm9yRmVhdHVyZVN0YXRlbWVudHMoZGIsIGZvcm0sIHJlcGVhdGFibGVJdGVtLCByZWNvcmQsIG9wdGlvbnMpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdGF0ZW1lbnRzO1xuICB9XG5cbiAgc3RhdGljIG1heWJlQXNzaWduQXJyYXkodmFsdWVzLCBrZXksIHZhbHVlLCBkaXNhYmxlQXJyYXlzLCBkaXNhYmxlQ29tcGxleFR5cGVzKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBkaXNhYmxlZEFycmF5VmFsdWUgPSAoXy5pc0FycmF5KHZhbHVlKSAmJiBkaXNhYmxlQXJyYXlzKSA/IHZhbHVlLmpvaW4oJywnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogdmFsdWU7XG5cbiAgICBjb25zdCBpc1NpbXBsZSA9IF8uaXNOdW1iZXIodmFsdWUpIHx8IF8uaXNTdHJpbmcodmFsdWUpIHx8IF8uaXNEYXRlKHZhbHVlKSB8fCBfLmlzQm9vbGVhbih2YWx1ZSk7XG5cbiAgICB2YWx1ZXNba2V5XSA9ICFpc1NpbXBsZSAmJiBkaXNhYmxlQ29tcGxleFR5cGVzID09PSB0cnVlID8gSlNPTi5zdHJpbmdpZnkodmFsdWUpIDogdmFsdWU7XG4gIH1cblxuICBzdGF0aWMgY29sdW1uVmFsdWVzRm9yRmVhdHVyZShmZWF0dXJlLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB2YWx1ZXMgPSB7fTtcblxuICAgIGZvciAoY29uc3QgZm9ybVZhbHVlIG9mIGZlYXR1cmUuZm9ybVZhbHVlcy5hbGwpIHtcbiAgICAgIGlmIChmb3JtVmFsdWUuaXNFbXB0eSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZWxlbWVudCA9IGZvcm1WYWx1ZS5lbGVtZW50O1xuXG4gICAgICBsZXQgY29sdW1uVmFsdWUgPSBmb3JtVmFsdWUuY29sdW1uVmFsdWU7XG5cbiAgICAgIGlmIChfLmlzTnVtYmVyKGNvbHVtblZhbHVlKSB8fCBfLmlzU3RyaW5nKGNvbHVtblZhbHVlKSB8fCBfLmlzQXJyYXkoY29sdW1uVmFsdWUpIHx8IF8uaXNEYXRlKGNvbHVtblZhbHVlKSkge1xuICAgICAgICBpZiAob3B0aW9ucy5jYWxjdWxhdGVkRmllbGREYXRlRm9ybWF0ID09PSAnZGF0ZScgJiYgZWxlbWVudC5pc0NhbGN1bGF0ZWRFbGVtZW50ICYmIGVsZW1lbnQuZGlzcGxheS5pc0RhdGUpIHtcbiAgICAgICAgICBjb2x1bW5WYWx1ZSA9IERhdGVVdGlscy5wYXJzZURhdGUoZm9ybVZhbHVlLnRleHRWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkb24ndCBhbGxvdyBkYXRlcyBncmVhdGVyIHRoYW4gOTk5OSwgeWVzIC0gdGhleSBleGlzdCBpbiB0aGUgd2lsZFxuICAgICAgICBpZiAoXy5pc0RhdGUoY29sdW1uVmFsdWUpKSB7XG4gICAgICAgICAgY29sdW1uVmFsdWUgPSBjb2x1bW5WYWx1ZS5nZXRGdWxsWWVhcigpID4gOTk5OSA/IG51bGwgOiBmb3JtVmFsdWUudGV4dFZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tYXliZUFzc2lnbkFycmF5KHZhbHVlcywgJ2YnICsgZm9ybVZhbHVlLmVsZW1lbnQua2V5LnRvTG93ZXJDYXNlKCksIGNvbHVtblZhbHVlLCBvcHRpb25zLmRpc2FibGVBcnJheXMsIG9wdGlvbnMuZGlzYWJsZUNvbXBsZXhUeXBlcyk7XG4gICAgICB9IGVsc2UgaWYgKGNvbHVtblZhbHVlKSB7XG5cbiAgICAgICAgaWYgKGVsZW1lbnQgJiYgb3B0aW9ucy5tZWRpYVVSTEZvcm1hdHRlcikge1xuICAgICAgICAgIGlmIChlbGVtZW50LmlzUGhvdG9FbGVtZW50IHx8IGVsZW1lbnQuaXNWaWRlb0VsZW1lbnQgfHwgZWxlbWVudC5pc0F1ZGlvRWxlbWVudCkge1xuICAgICAgICAgICAgY29uc3QgcHJlZml4ID0gJ2YnICsgZm9ybVZhbHVlLmVsZW1lbnQua2V5LnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgIGNvbHVtblZhbHVlW3ByZWZpeCArICdfdXJscyddID0gb3B0aW9ucy5tZWRpYVVSTEZvcm1hdHRlcihmb3JtVmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5tZWRpYVZpZXdVUkxGb3JtYXR0ZXIpIHtcbiAgICAgICAgICAgICAgY29sdW1uVmFsdWVbcHJlZml4ICsgJ192aWV3X3VybCddID0gb3B0aW9ucy5tZWRpYVZpZXdVUkxGb3JtYXR0ZXIoZm9ybVZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiBhcnJheSB0eXBlcyBhcmUgZGlzYWJsZWQsIGNvbnZlcnQgYWxsIHRoZSBwcm9wcyB0byBkZWxpbWl0ZWQgdmFsdWVzXG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGNvbHVtblZhbHVlKSkge1xuICAgICAgICAgIHRoaXMubWF5YmVBc3NpZ25BcnJheShjb2x1bW5WYWx1ZSwga2V5LCBjb2x1bW5WYWx1ZVtrZXldLCBvcHRpb25zLmRpc2FibGVBcnJheXMsIG9wdGlvbnMuZGlzYWJsZUNvbXBsZXhUeXBlcyk7XG4gICAgICAgIH1cblxuICAgICAgICBPYmplY3QuYXNzaWduKHZhbHVlcywgY29sdW1uVmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZXM7XG4gIH1cblxuICBzdGF0aWMgaW5zZXJ0TXVsdGlwbGVWYWx1ZXNGb3JGZWF0dXJlU3RhdGVtZW50cyhkYiwgZm9ybSwgZmVhdHVyZSwgcmVjb3JkLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBzdGF0ZW1lbnRzID0gW107XG5cbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLm11bHRpcGxlVmFsdWVzRm9yRmVhdHVyZShmZWF0dXJlLCByZWNvcmQpO1xuXG4gICAgY29uc3QgdGFibGVOYW1lID0gdGhpcy5tdWx0aXBsZVZhbHVlVGFibGVOYW1lV2l0aEZvcm0oZm9ybSwgb3B0aW9ucyk7XG5cbiAgICBsZXQgcGFyZW50UmVzb3VyY2VJZCA9IG51bGw7XG5cbiAgICBpZiAoZmVhdHVyZSBpbnN0YW5jZW9mIFJlcGVhdGFibGVJdGVtVmFsdWUpIHtcbiAgICAgIHBhcmVudFJlc291cmNlSWQgPSBmZWF0dXJlLmlkO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgbXVsdGlwbGVWYWx1ZUl0ZW0gb2YgdmFsdWVzKSB7XG4gICAgICBjb25zdCBpbnNlcnRWYWx1ZXMgPSBPYmplY3QuYXNzaWduKHt9LCB7a2V5OiBtdWx0aXBsZVZhbHVlSXRlbS5lbGVtZW50LmtleSwgdGV4dF92YWx1ZTogbXVsdGlwbGVWYWx1ZUl0ZW0udmFsdWV9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cmVjb3JkX2lkOiByZWNvcmQucm93SUQsIHJlY29yZF9yZXNvdXJjZV9pZDogcmVjb3JkLmlkLCBwYXJlbnRfcmVzb3VyY2VfaWQ6IHBhcmVudFJlc291cmNlSWR9KTtcblxuICAgICAgc3RhdGVtZW50cy5wdXNoKGRiLmluc2VydFN0YXRlbWVudCh0YWJsZU5hbWUsIGluc2VydFZhbHVlcywge3BrOiAnaWQnfSkpO1xuICAgIH1cblxuICAgIHJldHVybiBzdGF0ZW1lbnRzO1xuICB9XG5cbiAgc3RhdGljIGluc2VydENoaWxkTXVsdGlwbGVWYWx1ZXNGb3JGZWF0dXJlU3RhdGVtZW50cyhkYiwgZm9ybSwgZmVhdHVyZSwgcmVjb3JkLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBzdGF0ZW1lbnRzID0gW107XG5cbiAgICBmb3IgKGNvbnN0IGZvcm1WYWx1ZSBvZiBmZWF0dXJlLmZvcm1WYWx1ZXMuYWxsKSB7XG4gICAgICBpZiAoZm9ybVZhbHVlLmlzUmVwZWF0YWJsZUVsZW1lbnQpIHtcbiAgICAgICAgZm9yIChjb25zdCByZXBlYXRhYmxlSXRlbSBvZiBmb3JtVmFsdWUuX2l0ZW1zKSB7XG4gICAgICAgICAgc3RhdGVtZW50cy5wdXNoLmFwcGx5KHN0YXRlbWVudHMsIHRoaXMuaW5zZXJ0TXVsdGlwbGVWYWx1ZXNGb3JGZWF0dXJlU3RhdGVtZW50cyhkYiwgZm9ybSwgcmVwZWF0YWJsZUl0ZW0sIHJlY29yZCwgb3B0aW9ucykpO1xuICAgICAgICAgIHN0YXRlbWVudHMucHVzaC5hcHBseShzdGF0ZW1lbnRzLCB0aGlzLmluc2VydENoaWxkTXVsdGlwbGVWYWx1ZXNGb3JGZWF0dXJlU3RhdGVtZW50cyhkYiwgZm9ybSwgcmVwZWF0YWJsZUl0ZW0sIHJlY29yZCwgb3B0aW9ucykpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXRlbWVudHM7XG4gIH1cblxuICBzdGF0aWMgbXVsdGlwbGVWYWx1ZXNGb3JGZWF0dXJlKGZlYXR1cmUsIHJlY29yZCkge1xuICAgIGNvbnN0IHZhbHVlcyA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBmb3JtVmFsdWUgb2YgZmVhdHVyZS5mb3JtVmFsdWVzLmFsbCkge1xuICAgICAgaWYgKGZvcm1WYWx1ZS5pc0VtcHR5KSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmZWF0dXJlVmFsdWVzID0gZm9ybVZhbHVlLm11bHRpcGxlVmFsdWVzO1xuXG4gICAgICBpZiAoZmVhdHVyZVZhbHVlcykge1xuICAgICAgICB2YWx1ZXMucHVzaC5hcHBseSh2YWx1ZXMsIGZlYXR1cmVWYWx1ZXMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZXM7XG4gIH1cblxuICBzdGF0aWMgc3lzdGVtQ29sdW1uVmFsdWVzRm9yRmVhdHVyZShmZWF0dXJlLCBwYXJlbnRGZWF0dXJlLCByZWNvcmQsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHZhbHVlcyA9IHt9O1xuXG4gICAgdmFsdWVzLnJlY29yZF9pZCA9IHJlY29yZC5yb3dJRDtcbiAgICB2YWx1ZXMucmVjb3JkX3Jlc291cmNlX2lkID0gcmVjb3JkLmlkO1xuXG4gICAgaWYgKG9wdGlvbnMucmVwb3J0VVJMRm9ybWF0dGVyKSB7XG4gICAgICB2YWx1ZXMucmVwb3J0X3VybCA9IG9wdGlvbnMucmVwb3J0VVJMRm9ybWF0dGVyKGZlYXR1cmUpO1xuICAgIH1cblxuICAgIGlmIChmZWF0dXJlIGluc3RhbmNlb2YgUmVjb3JkKSB7XG4gICAgICBpZiAocmVjb3JkLl9wcm9qZWN0Um93SUQpIHtcbiAgICAgICAgdmFsdWVzLnByb2plY3RfaWQgPSByZWNvcmQuX3Byb2plY3RSb3dJRDtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC5wcm9qZWN0SUQpIHtcbiAgICAgICAgdmFsdWVzLnByb2plY3RfcmVzb3VyY2VfaWQgPSByZWNvcmQucHJvamVjdElEO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLl9hc3NpZ25lZFRvUm93SUQpIHtcbiAgICAgICAgdmFsdWVzLmFzc2lnbmVkX3RvX2lkID0gcmVjb3JkLl9hc3NpZ25lZFRvUm93SUQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQuYXNzaWduZWRUb0lEKSB7XG4gICAgICAgIHZhbHVlcy5hc3NpZ25lZF90b19yZXNvdXJjZV9pZCA9IHJlY29yZC5hc3NpZ25lZFRvSUQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQuX2NyZWF0ZWRCeVJvd0lEKSB7XG4gICAgICAgIHZhbHVlcy5jcmVhdGVkX2J5X2lkID0gcmVjb3JkLl9jcmVhdGVkQnlSb3dJRDtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC5jcmVhdGVkQnlJRCkge1xuICAgICAgICB2YWx1ZXMuY3JlYXRlZF9ieV9yZXNvdXJjZV9pZCA9IHJlY29yZC5jcmVhdGVkQnlJRDtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC5fdXBkYXRlZEJ5Um93SUQpIHtcbiAgICAgICAgdmFsdWVzLnVwZGF0ZWRfYnlfaWQgPSByZWNvcmQuX3VwZGF0ZWRCeVJvd0lEO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnVwZGF0ZWRCeUlEKSB7XG4gICAgICAgIHZhbHVlcy51cGRhdGVkX2J5X3Jlc291cmNlX2lkID0gcmVjb3JkLnVwZGF0ZWRCeUlEO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLl9jaGFuZ2VzZXRSb3dJRCkge1xuICAgICAgICB2YWx1ZXMuY2hhbmdlc2V0X2lkID0gcmVjb3JkLl9jaGFuZ2VzZXRSb3dJRDtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC5jaGFuZ2VzZXRJRCkge1xuICAgICAgICB2YWx1ZXMuY2hhbmdlc2V0X3Jlc291cmNlX2lkID0gcmVjb3JkLmNoYW5nZXNldElEO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnN0YXR1cykge1xuICAgICAgICB2YWx1ZXMuc3RhdHVzID0gcmVjb3JkLnN0YXR1cztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC5sYXRpdHVkZSAhPSBudWxsKSB7XG4gICAgICAgIHZhbHVlcy5sYXRpdHVkZSA9IHJlY29yZC5sYXRpdHVkZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC5sb25naXR1ZGUgIT0gbnVsbCkge1xuICAgICAgICB2YWx1ZXMubG9uZ2l0dWRlID0gcmVjb3JkLmxvbmdpdHVkZTtcbiAgICAgIH1cblxuICAgICAgdmFsdWVzLmFsdGl0dWRlID0gcmVjb3JkLmFsdGl0dWRlO1xuICAgICAgdmFsdWVzLnNwZWVkID0gcmVjb3JkLnNwZWVkO1xuICAgICAgdmFsdWVzLmNvdXJzZSA9IHJlY29yZC5jb3Vyc2U7XG4gICAgICB2YWx1ZXMudmVydGljYWxfYWNjdXJhY3kgPSByZWNvcmQudmVydGljYWxBY2N1cmFjeTtcbiAgICAgIHZhbHVlcy5ob3Jpem9udGFsX2FjY3VyYWN5ID0gcmVjb3JkLmhvcml6b250YWxBY2N1cmFjeTtcbiAgICB9IGVsc2UgaWYgKGZlYXR1cmUgaW5zdGFuY2VvZiBSZXBlYXRhYmxlSXRlbVZhbHVlKSB7XG4gICAgICB2YWx1ZXMucmVzb3VyY2VfaWQgPSBmZWF0dXJlLmlkO1xuICAgICAgdmFsdWVzLmluZGV4ID0gZmVhdHVyZS5pbmRleDtcbiAgICAgIHZhbHVlcy5wYXJlbnRfcmVzb3VyY2VfaWQgPSBwYXJlbnRGZWF0dXJlLmlkO1xuXG4gICAgICBpZiAoZmVhdHVyZS5oYXNDb29yZGluYXRlKSB7XG4gICAgICAgIHZhbHVlcy5sYXRpdHVkZSA9IGZlYXR1cmUubGF0aXR1ZGU7XG4gICAgICAgIHZhbHVlcy5sb25naXR1ZGUgPSBmZWF0dXJlLmxvbmdpdHVkZTtcbiAgICAgIH1cblxuICAgICAgLy8gcmVjb3JkIHZhbHVlc1xuICAgICAgaWYgKHJlY29yZC5zdGF0dXMpIHtcbiAgICAgICAgdmFsdWVzLnJlY29yZF9zdGF0dXMgPSByZWNvcmQuc3RhdHVzO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLl9wcm9qZWN0Um93SUQpIHtcbiAgICAgICAgdmFsdWVzLnJlY29yZF9wcm9qZWN0X2lkID0gcmVjb3JkLl9wcm9qZWN0Um93SUQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQucHJvamVjdElEKSB7XG4gICAgICAgIHZhbHVlcy5yZWNvcmRfcHJvamVjdF9yZXNvdXJjZV9pZCA9IHJlY29yZC5wcm9qZWN0SUQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQuX2Fzc2lnbmVkVG9Sb3dJRCkge1xuICAgICAgICB2YWx1ZXMucmVjb3JkX2Fzc2lnbmVkX3RvX2lkID0gcmVjb3JkLl9hc3NpZ25lZFRvUm93SUQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQuYXNzaWduZWRUb0lEKSB7XG4gICAgICAgIHZhbHVlcy5yZWNvcmRfYXNzaWduZWRfdG9fcmVzb3VyY2VfaWQgPSByZWNvcmQuYXNzaWduZWRUb0lEO1xuICAgICAgfVxuXG4gICAgICAvLyBsaW5rZWQgZmllbGRzXG4gICAgICBpZiAoZmVhdHVyZS5jcmVhdGVkQnkpIHtcbiAgICAgICAgdmFsdWVzLmNyZWF0ZWRfYnlfaWQgPSBmZWF0dXJlLmNyZWF0ZWRCeS5yb3dJRDtcbiAgICAgIH1cblxuICAgICAgaWYgKGZlYXR1cmUuY3JlYXRlZEJ5SUQpIHtcbiAgICAgICAgdmFsdWVzLmNyZWF0ZWRfYnlfcmVzb3VyY2VfaWQgPSBmZWF0dXJlLmNyZWF0ZWRCeUlEO1xuICAgICAgfVxuXG4gICAgICBpZiAoZmVhdHVyZS51cGRhdGVkQnkpIHtcbiAgICAgICAgdmFsdWVzLnVwZGF0ZWRfYnlfaWQgPSBmZWF0dXJlLnVwZGF0ZWRCeS5yb3dJRDtcbiAgICAgIH1cblxuICAgICAgaWYgKGZlYXR1cmUudXBkYXRlZEJ5SUQpIHtcbiAgICAgICAgdmFsdWVzLnVwZGF0ZWRfYnlfcmVzb3VyY2VfaWQgPSBmZWF0dXJlLnVwZGF0ZWRCeUlEO1xuICAgICAgfVxuXG4gICAgICBpZiAoZmVhdHVyZS5jaGFuZ2VzZXQpIHtcbiAgICAgICAgdmFsdWVzLmNoYW5nZXNldF9pZCA9IGZlYXR1cmUuY2hhbmdlc2V0LnJvd0lEO1xuICAgICAgICB2YWx1ZXMuY2hhbmdlc2V0X3Jlc291cmNlX2lkID0gZmVhdHVyZS5jaGFuZ2VzZXRJRDtcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLl9jaGFuZ2VzZXRSb3dJRCkge1xuICAgICAgICB2YWx1ZXMuY2hhbmdlc2V0X2lkID0gcmVjb3JkLl9jaGFuZ2VzZXRSb3dJRDtcbiAgICAgICAgdmFsdWVzLmNoYW5nZXNldF9yZXNvdXJjZV9pZCA9IHJlY29yZC5jaGFuZ2VzZXRJRDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YWx1ZXMudGl0bGUgPSBmZWF0dXJlLmRpc3BsYXlWYWx1ZTtcblxuICAgIHZhbHVlcy5mb3JtX3ZhbHVlcyA9IEpTT04uc3RyaW5naWZ5KGZlYXR1cmUuZm9ybVZhbHVlcy50b0pTT04oKSk7XG5cbiAgICB0aGlzLnNldHVwU2VhcmNoKHZhbHVlcywgZmVhdHVyZSwgb3B0aW9ucyk7XG5cbiAgICBpZiAoZmVhdHVyZS5oYXNDb29yZGluYXRlKSB7XG4gICAgICB2YWx1ZXMuZ2VvbWV0cnkgPSB0aGlzLnNldHVwUG9pbnQodmFsdWVzLCBmZWF0dXJlLmxhdGl0dWRlLCBmZWF0dXJlLmxvbmdpdHVkZSwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlcy5nZW9tZXRyeSA9IG51bGw7XG4gICAgfVxuXG4gICAgdmFsdWVzLmNyZWF0ZWRfYXQgPSBmZWF0dXJlLmNsaWVudENyZWF0ZWRBdCB8fCBmZWF0dXJlLmNyZWF0ZWRBdDtcbiAgICB2YWx1ZXMudXBkYXRlZF9hdCA9IGZlYXR1cmUuY2xpZW50VXBkYXRlZEF0IHx8IGZlYXR1cmUudXBkYXRlZEF0O1xuICAgIHZhbHVlcy52ZXJzaW9uID0gZmVhdHVyZS52ZXJzaW9uO1xuXG4gICAgaWYgKHZhbHVlcy5jcmVhdGVkX2J5X2lkID09IG51bGwpIHtcbiAgICAgIHZhbHVlcy5jcmVhdGVkX2J5X2lkID0gLTE7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlcy51cGRhdGVkX2J5X2lkID09IG51bGwpIHtcbiAgICAgIHZhbHVlcy51cGRhdGVkX2J5X2lkID0gLTE7XG4gICAgfVxuXG4gICAgdmFsdWVzLnNlcnZlcl9jcmVhdGVkX2F0ID0gZmVhdHVyZS5jcmVhdGVkQXQ7XG4gICAgdmFsdWVzLnNlcnZlcl91cGRhdGVkX2F0ID0gZmVhdHVyZS51cGRhdGVkQXQ7XG5cbiAgICB2YWx1ZXMuY3JlYXRlZF9kdXJhdGlvbiA9IGZlYXR1cmUuY3JlYXRlZER1cmF0aW9uO1xuICAgIHZhbHVlcy51cGRhdGVkX2R1cmF0aW9uID0gZmVhdHVyZS51cGRhdGVkRHVyYXRpb247XG4gICAgdmFsdWVzLmVkaXRlZF9kdXJhdGlvbiA9IGZlYXR1cmUuZWRpdGVkRHVyYXRpb247XG5cbiAgICB2YWx1ZXMuY3JlYXRlZF9sYXRpdHVkZSA9IGZlYXR1cmUuY3JlYXRlZExhdGl0dWRlO1xuICAgIHZhbHVlcy5jcmVhdGVkX2xvbmdpdHVkZSA9IGZlYXR1cmUuY3JlYXRlZExvbmdpdHVkZTtcbiAgICB2YWx1ZXMuY3JlYXRlZF9hbHRpdHVkZSA9IGZlYXR1cmUuY3JlYXRlZEFsdGl0dWRlO1xuICAgIHZhbHVlcy5jcmVhdGVkX2hvcml6b250YWxfYWNjdXJhY3kgPSBmZWF0dXJlLmNyZWF0ZWRBY2N1cmFjeTtcblxuICAgIGlmIChmZWF0dXJlLmhhc0NyZWF0ZWRDb29yZGluYXRlKSB7XG4gICAgICB2YWx1ZXMuY3JlYXRlZF9nZW9tZXRyeSA9IHRoaXMuc2V0dXBQb2ludCh2YWx1ZXMsIGZlYXR1cmUuY3JlYXRlZExhdGl0dWRlLCBmZWF0dXJlLmNyZWF0ZWRMb25naXR1ZGUsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHZhbHVlcy51cGRhdGVkX2xhdGl0dWRlID0gZmVhdHVyZS51cGRhdGVkTGF0aXR1ZGU7XG4gICAgdmFsdWVzLnVwZGF0ZWRfbG9uZ2l0dWRlID0gZmVhdHVyZS51cGRhdGVkTG9uZ2l0dWRlO1xuICAgIHZhbHVlcy51cGRhdGVkX2FsdGl0dWRlID0gZmVhdHVyZS51cGRhdGVkQWx0aXR1ZGU7XG4gICAgdmFsdWVzLnVwZGF0ZWRfaG9yaXpvbnRhbF9hY2N1cmFjeSA9IGZlYXR1cmUudXBkYXRlZEFjY3VyYWN5O1xuXG4gICAgaWYgKGZlYXR1cmUuaGFzVXBkYXRlZENvb3JkaW5hdGUpIHtcbiAgICAgIHZhbHVlcy51cGRhdGVkX2dlb21ldHJ5ID0gdGhpcy5zZXR1cFBvaW50KHZhbHVlcywgZmVhdHVyZS51cGRhdGVkTGF0aXR1ZGUsIGZlYXR1cmUudXBkYXRlZExvbmdpdHVkZSwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfVxuXG4gIHN0YXRpYyBkZWxldGVSb3dzRm9yUmVjb3JkU3RhdGVtZW50KGRiLCByZWNvcmQsIHRhYmxlTmFtZSkge1xuICAgIHJldHVybiBkYi5kZWxldGVTdGF0ZW1lbnQodGFibGVOYW1lLCB7cmVjb3JkX3Jlc291cmNlX2lkOiByZWNvcmQuaWR9KTtcbiAgfVxuXG4gIHN0YXRpYyBkZWxldGVSb3dzU3RhdGVtZW50KGRiLCB0YWJsZU5hbWUpIHtcbiAgICByZXR1cm4gZGIuZGVsZXRlU3RhdGVtZW50KHRhYmxlTmFtZSwge30pO1xuICB9XG5cbiAgc3RhdGljIGRlbGV0ZUZvclJlY29yZFN0YXRlbWVudHMoZGIsIHJlY29yZCwgZm9ybSwgb3B0aW9ucykge1xuICAgIGNvbnN0IHJlcGVhdGFibGVzID0gZm9ybS5lbGVtZW50c09mVHlwZSgnUmVwZWF0YWJsZScpO1xuXG4gICAgY29uc3Qgc3RhdGVtZW50cyA9IFtdO1xuXG4gICAgbGV0IHRhYmxlTmFtZSA9IHRoaXMudGFibGVOYW1lV2l0aEZvcm1BbmRTY2hlbWEoZm9ybSwgbnVsbCwgb3B0aW9ucyk7XG5cbiAgICBzdGF0ZW1lbnRzLnB1c2godGhpcy5kZWxldGVSb3dzRm9yUmVjb3JkU3RhdGVtZW50KGRiLCByZWNvcmQsIHRhYmxlTmFtZSkpO1xuXG4gICAgZm9yIChjb25zdCByZXBlYXRhYmxlIG9mIHJlcGVhdGFibGVzKSB7XG4gICAgICB0YWJsZU5hbWUgPSB0aGlzLnRhYmxlTmFtZVdpdGhGb3JtQW5kU2NoZW1hKGZvcm0sIHJlcGVhdGFibGUsIG9wdGlvbnMpO1xuXG4gICAgICBzdGF0ZW1lbnRzLnB1c2godGhpcy5kZWxldGVSb3dzRm9yUmVjb3JkU3RhdGVtZW50KGRiLCByZWNvcmQsIHRhYmxlTmFtZSkpO1xuICAgIH1cblxuICAgIHRhYmxlTmFtZSA9IHRoaXMubXVsdGlwbGVWYWx1ZVRhYmxlTmFtZVdpdGhGb3JtKGZvcm0sIG9wdGlvbnMpO1xuXG4gICAgc3RhdGVtZW50cy5wdXNoKHRoaXMuZGVsZXRlUm93c0ZvclJlY29yZFN0YXRlbWVudChkYiwgcmVjb3JkLCB0YWJsZU5hbWUpKTtcblxuICAgIHJldHVybiBzdGF0ZW1lbnRzO1xuICB9XG5cbiAgc3RhdGljIGRlbGV0ZUZvckZvcm1TdGF0ZW1lbnRzKGRiLCBmb3JtLCBvcHRpb25zKSB7XG4gICAgY29uc3QgcmVwZWF0YWJsZXMgPSBmb3JtLmVsZW1lbnRzT2ZUeXBlKCdSZXBlYXRhYmxlJyk7XG5cbiAgICBjb25zdCBzdGF0ZW1lbnRzID0gW107XG5cbiAgICBsZXQgdGFibGVOYW1lID0gdGhpcy50YWJsZU5hbWVXaXRoRm9ybUFuZFNjaGVtYShmb3JtLCBudWxsLCBvcHRpb25zKTtcblxuICAgIHN0YXRlbWVudHMucHVzaCh0aGlzLmRlbGV0ZVJvd3NTdGF0ZW1lbnQoZGIsIHRhYmxlTmFtZSkpO1xuXG4gICAgZm9yIChjb25zdCByZXBlYXRhYmxlIG9mIHJlcGVhdGFibGVzKSB7XG4gICAgICB0YWJsZU5hbWUgPSB0aGlzLnRhYmxlTmFtZVdpdGhGb3JtQW5kU2NoZW1hKGZvcm0sIHJlcGVhdGFibGUsIG9wdGlvbnMpO1xuXG4gICAgICBzdGF0ZW1lbnRzLnB1c2godGhpcy5kZWxldGVSb3dzU3RhdGVtZW50KGRiLCB0YWJsZU5hbWUpKTtcbiAgICB9XG5cbiAgICB0YWJsZU5hbWUgPSB0aGlzLm11bHRpcGxlVmFsdWVUYWJsZU5hbWVXaXRoRm9ybShmb3JtLCBvcHRpb25zKTtcblxuICAgIHN0YXRlbWVudHMucHVzaCh0aGlzLmRlbGV0ZVJvd3NTdGF0ZW1lbnQoZGIsIHRhYmxlTmFtZSkpO1xuXG4gICAgcmV0dXJuIHN0YXRlbWVudHM7XG4gIH1cblxuICBzdGF0aWMgbXVsdGlwbGVWYWx1ZVRhYmxlTmFtZVdpdGhGb3JtKGZvcm0sIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy50YWJsZU5hbWVXaXRoRm9ybUFuZFNjaGVtYShmb3JtLCBudWxsLCBvcHRpb25zLCAnX3ZhbHVlcycpO1xuICB9XG5cbiAgc3RhdGljIHRhYmxlTmFtZVdpdGhGb3JtQW5kU2NoZW1hKGZvcm0sIHJlcGVhdGFibGUsIG9wdGlvbnMsIHN1ZmZpeCkge1xuICAgIGNvbnN0IHRhYmxlTmFtZSA9IHRoaXMudGFibGVOYW1lV2l0aEZvcm0oZm9ybSwgcmVwZWF0YWJsZSwgb3B0aW9ucyk7XG5cbiAgICBzdWZmaXggPSBzdWZmaXggfHwgJyc7XG5cbiAgICBpZiAob3B0aW9ucy5zY2hlbWEpIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmVzY2FwZUlkZW50aWZpZXIob3B0aW9ucy5zY2hlbWEpICsgJy4nICsgb3B0aW9ucy5lc2NhcGVJZGVudGlmaWVyKHRhYmxlTmFtZSArIHN1ZmZpeCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGlvbnMuZXNjYXBlSWRlbnRpZmllcih0YWJsZU5hbWUgKyBzdWZmaXgpO1xuICB9XG5cbiAgc3RhdGljIHRhYmxlTmFtZVdpdGhGb3JtKGZvcm0sIHJlcGVhdGFibGUsIG9wdGlvbnMpIHtcbiAgICBpZiAocmVwZWF0YWJsZSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gZm9ybWF0KCclc2Zvcm1fJXMnLCB0aGlzLmFjY291bnRQcmVmaXgoZm9ybSwgb3B0aW9ucyksIHRoaXMuZm9ybUlkZW50aWZpZXIoZm9ybSwgb3B0aW9ucykpO1xuICAgIH1cblxuICAgIHJldHVybiBmb3JtYXQoJyVzZm9ybV8lc18lcycsIHRoaXMuYWNjb3VudFByZWZpeChmb3JtLCBvcHRpb25zKSwgdGhpcy5mb3JtSWRlbnRpZmllcihmb3JtLCBvcHRpb25zKSwgcmVwZWF0YWJsZS5rZXkpO1xuICB9XG5cbiAgc3RhdGljIGFjY291bnRQcmVmaXgoZm9ybSwgb3B0aW9ucykge1xuICAgIHJldHVybiBvcHRpb25zLmFjY291bnRQcmVmaXggIT0gbnVsbCA/ICdhY2NvdW50XycgKyBmb3JtLl9hY2NvdW50Um93SUQgKyAnXycgOiAnJztcbiAgfVxuXG4gIHN0YXRpYyBmb3JtSWRlbnRpZmllcihmb3JtLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMucGVyc2lzdGVudFRhYmxlTmFtZXMgPyBmb3JtLmlkIDogZm9ybS5yb3dJRDtcbiAgfVxuXG4gIHN0YXRpYyBzZXR1cFNlYXJjaCh2YWx1ZXMsIGZlYXR1cmUpIHtcbiAgICBjb25zdCBzZWFyY2hhYmxlVmFsdWUgPSBmZWF0dXJlLnNlYXJjaGFibGVWYWx1ZTtcblxuICAgIHZhbHVlcy5yZWNvcmRfaW5kZXhfdGV4dCA9IHNlYXJjaGFibGVWYWx1ZTtcbiAgICB2YWx1ZXMucmVjb3JkX2luZGV4ID0ge3JhdzogYHRvX3RzdmVjdG9yKCR7IHBnZm9ybWF0KCclTCcsIHNlYXJjaGFibGVWYWx1ZSkgfSlgfTtcblxuICAgIHJldHVybiB2YWx1ZXM7XG4gIH1cblxuICBzdGF0aWMgc2V0dXBQb2ludCh2YWx1ZXMsIGxhdGl0dWRlLCBsb25naXR1ZGUpIHtcbiAgICBjb25zdCB3a3QgPSBwZ2Zvcm1hdCgnUE9JTlQoJXMgJXMpJywgbG9uZ2l0dWRlLCBsYXRpdHVkZSk7XG5cbiAgICByZXR1cm4ge3JhdzogYFNUX0ZvcmNlMkQoU1RfU2V0U1JJRChTVF9HZW9tRnJvbVRleHQoJyR7IHdrdCB9JyksIDQzMjYpKWB9O1xuICB9XG59XG4iXX0=