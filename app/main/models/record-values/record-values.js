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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL21vZGVscy9yZWNvcmQtdmFsdWVzL3JlY29yZC12YWx1ZXMuanMiXSwibmFtZXMiOlsiUmVjb3JkVmFsdWVzIiwidXBkYXRlRm9yUmVjb3JkU3RhdGVtZW50cyIsImRiIiwicmVjb3JkIiwib3B0aW9ucyIsInN0YXRlbWVudHMiLCJwdXNoIiwiYXBwbHkiLCJkZWxldGVGb3JSZWNvcmRTdGF0ZW1lbnRzIiwiZm9ybSIsImluc2VydEZvclJlY29yZFN0YXRlbWVudHMiLCJpbnNlcnRSb3dGb3JGZWF0dXJlU3RhdGVtZW50IiwiaW5zZXJ0Q2hpbGRGZWF0dXJlc0ZvckZlYXR1cmVTdGF0ZW1lbnRzIiwiaW5zZXJ0TXVsdGlwbGVWYWx1ZXNGb3JGZWF0dXJlU3RhdGVtZW50cyIsImluc2VydENoaWxkTXVsdGlwbGVWYWx1ZXNGb3JGZWF0dXJlU3RhdGVtZW50cyIsImZlYXR1cmUiLCJwYXJlbnRGZWF0dXJlIiwidmFsdWVzIiwiY29sdW1uVmFsdWVzRm9yRmVhdHVyZSIsInN5c3RlbVZhbHVlcyIsInN5c3RlbUNvbHVtblZhbHVlc0ZvckZlYXR1cmUiLCJPYmplY3QiLCJhc3NpZ24iLCJ0YWJsZU5hbWUiLCJSZXBlYXRhYmxlSXRlbVZhbHVlIiwidGFibGVOYW1lV2l0aEZvcm1BbmRTY2hlbWEiLCJfZWxlbWVudCIsInZhbHVlc1RyYW5zZm9ybWVyIiwiaW5zZXJ0U3RhdGVtZW50IiwicGsiLCJmb3JtVmFsdWUiLCJmb3JtVmFsdWVzIiwiYWxsIiwiZWxlbWVudCIsImlzUmVwZWF0YWJsZUVsZW1lbnQiLCJyZXBlYXRhYmxlSXRlbSIsIl9pdGVtcyIsIm1heWJlQXNzaWduQXJyYXkiLCJrZXkiLCJ2YWx1ZSIsImRpc2FibGVBcnJheXMiLCJkaXNhYmxlQ29tcGxleFR5cGVzIiwiZGlzYWJsZWRBcnJheVZhbHVlIiwiXyIsImlzQXJyYXkiLCJqb2luIiwiaXNTaW1wbGUiLCJpc051bWJlciIsImlzU3RyaW5nIiwiaXNEYXRlIiwiaXNCb29sZWFuIiwiSlNPTiIsInN0cmluZ2lmeSIsImlzRW1wdHkiLCJjb2x1bW5WYWx1ZSIsImNhbGN1bGF0ZWRGaWVsZERhdGVGb3JtYXQiLCJpc0NhbGN1bGF0ZWRFbGVtZW50IiwiZGlzcGxheSIsIkRhdGVVdGlscyIsInBhcnNlRGF0ZSIsInRleHRWYWx1ZSIsImdldEZ1bGxZZWFyIiwidG9Mb3dlckNhc2UiLCJtZWRpYVVSTEZvcm1hdHRlciIsImlzUGhvdG9FbGVtZW50IiwiaXNWaWRlb0VsZW1lbnQiLCJpc0F1ZGlvRWxlbWVudCIsInByZWZpeCIsIm1lZGlhVmlld1VSTEZvcm1hdHRlciIsImtleXMiLCJtdWx0aXBsZVZhbHVlc0ZvckZlYXR1cmUiLCJtdWx0aXBsZVZhbHVlVGFibGVOYW1lV2l0aEZvcm0iLCJwYXJlbnRSZXNvdXJjZUlkIiwiaWQiLCJtdWx0aXBsZVZhbHVlSXRlbSIsImluc2VydFZhbHVlcyIsInRleHRfdmFsdWUiLCJyZWNvcmRfaWQiLCJyb3dJRCIsInJlY29yZF9yZXNvdXJjZV9pZCIsInBhcmVudF9yZXNvdXJjZV9pZCIsImZlYXR1cmVWYWx1ZXMiLCJtdWx0aXBsZVZhbHVlcyIsInJlcG9ydFVSTEZvcm1hdHRlciIsInJlcG9ydF91cmwiLCJSZWNvcmQiLCJfcHJvamVjdFJvd0lEIiwicHJvamVjdF9pZCIsInByb2plY3RJRCIsInByb2plY3RfcmVzb3VyY2VfaWQiLCJfYXNzaWduZWRUb1Jvd0lEIiwiYXNzaWduZWRfdG9faWQiLCJhc3NpZ25lZFRvSUQiLCJhc3NpZ25lZF90b19yZXNvdXJjZV9pZCIsIl9jcmVhdGVkQnlSb3dJRCIsImNyZWF0ZWRfYnlfaWQiLCJjcmVhdGVkQnlJRCIsImNyZWF0ZWRfYnlfcmVzb3VyY2VfaWQiLCJfdXBkYXRlZEJ5Um93SUQiLCJ1cGRhdGVkX2J5X2lkIiwidXBkYXRlZEJ5SUQiLCJ1cGRhdGVkX2J5X3Jlc291cmNlX2lkIiwiX2NoYW5nZXNldFJvd0lEIiwiY2hhbmdlc2V0X2lkIiwiY2hhbmdlc2V0SUQiLCJjaGFuZ2VzZXRfcmVzb3VyY2VfaWQiLCJzdGF0dXMiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsImFsdGl0dWRlIiwic3BlZWQiLCJjb3Vyc2UiLCJ2ZXJ0aWNhbF9hY2N1cmFjeSIsInZlcnRpY2FsQWNjdXJhY3kiLCJob3Jpem9udGFsX2FjY3VyYWN5IiwiaG9yaXpvbnRhbEFjY3VyYWN5IiwicmVzb3VyY2VfaWQiLCJpbmRleCIsImhhc0Nvb3JkaW5hdGUiLCJyZWNvcmRfc3RhdHVzIiwicmVjb3JkX3Byb2plY3RfaWQiLCJyZWNvcmRfcHJvamVjdF9yZXNvdXJjZV9pZCIsInJlY29yZF9hc3NpZ25lZF90b19pZCIsInJlY29yZF9hc3NpZ25lZF90b19yZXNvdXJjZV9pZCIsImNyZWF0ZWRCeSIsInVwZGF0ZWRCeSIsImNoYW5nZXNldCIsInRpdGxlIiwiZGlzcGxheVZhbHVlIiwiZm9ybV92YWx1ZXMiLCJ0b0pTT04iLCJzZXR1cFNlYXJjaCIsImdlb21ldHJ5Iiwic2V0dXBQb2ludCIsImNyZWF0ZWRfYXQiLCJjbGllbnRDcmVhdGVkQXQiLCJjcmVhdGVkQXQiLCJ1cGRhdGVkX2F0IiwiY2xpZW50VXBkYXRlZEF0IiwidXBkYXRlZEF0IiwidmVyc2lvbiIsInNlcnZlcl9jcmVhdGVkX2F0Iiwic2VydmVyX3VwZGF0ZWRfYXQiLCJjcmVhdGVkX2R1cmF0aW9uIiwiY3JlYXRlZER1cmF0aW9uIiwidXBkYXRlZF9kdXJhdGlvbiIsInVwZGF0ZWREdXJhdGlvbiIsImVkaXRlZF9kdXJhdGlvbiIsImVkaXRlZER1cmF0aW9uIiwiY3JlYXRlZF9sYXRpdHVkZSIsImNyZWF0ZWRMYXRpdHVkZSIsImNyZWF0ZWRfbG9uZ2l0dWRlIiwiY3JlYXRlZExvbmdpdHVkZSIsImNyZWF0ZWRfYWx0aXR1ZGUiLCJjcmVhdGVkQWx0aXR1ZGUiLCJjcmVhdGVkX2hvcml6b250YWxfYWNjdXJhY3kiLCJjcmVhdGVkQWNjdXJhY3kiLCJoYXNDcmVhdGVkQ29vcmRpbmF0ZSIsImNyZWF0ZWRfZ2VvbWV0cnkiLCJ1cGRhdGVkX2xhdGl0dWRlIiwidXBkYXRlZExhdGl0dWRlIiwidXBkYXRlZF9sb25naXR1ZGUiLCJ1cGRhdGVkTG9uZ2l0dWRlIiwidXBkYXRlZF9hbHRpdHVkZSIsInVwZGF0ZWRBbHRpdHVkZSIsInVwZGF0ZWRfaG9yaXpvbnRhbF9hY2N1cmFjeSIsInVwZGF0ZWRBY2N1cmFjeSIsImhhc1VwZGF0ZWRDb29yZGluYXRlIiwidXBkYXRlZF9nZW9tZXRyeSIsImRlbGV0ZVJvd3NGb3JSZWNvcmRTdGF0ZW1lbnQiLCJkZWxldGVTdGF0ZW1lbnQiLCJkZWxldGVSb3dzU3RhdGVtZW50IiwicmVwZWF0YWJsZXMiLCJlbGVtZW50c09mVHlwZSIsInJlcGVhdGFibGUiLCJkZWxldGVGb3JGb3JtU3RhdGVtZW50cyIsInN1ZmZpeCIsInRhYmxlTmFtZVdpdGhGb3JtIiwic2NoZW1hIiwiZXNjYXBlSWRlbnRpZmllciIsImFjY291bnRQcmVmaXgiLCJmb3JtSWRlbnRpZmllciIsIl9hY2NvdW50Um93SUQiLCJwZXJzaXN0ZW50VGFibGVOYW1lcyIsInNlYXJjaGFibGVWYWx1ZSIsInJlY29yZF9pbmRleF90ZXh0IiwicmVjb3JkX2luZGV4IiwicmF3Iiwid2t0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFZSxNQUFNQSxZQUFOLENBQW1CO0FBQ0EsU0FBekJDLHlCQUF5QixDQUFDQyxFQUFELEVBQUtDLE1BQUwsRUFBYUMsT0FBTyxHQUFHLEVBQXZCLEVBQTJCO0FBQ3pELFVBQU1DLFVBQVUsR0FBRyxFQUFuQjtBQUVBQSxJQUFBQSxVQUFVLENBQUNDLElBQVgsQ0FBZ0JDLEtBQWhCLENBQXNCRixVQUF0QixFQUFrQyxLQUFLRyx5QkFBTCxDQUErQk4sRUFBL0IsRUFBbUNDLE1BQW5DLEVBQTJDQSxNQUFNLENBQUNNLElBQWxELEVBQXdETCxPQUF4RCxDQUFsQztBQUNBQyxJQUFBQSxVQUFVLENBQUNDLElBQVgsQ0FBZ0JDLEtBQWhCLENBQXNCRixVQUF0QixFQUFrQyxLQUFLSyx5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QXlCaEYsU0FBekIsRUFBb0NELFFBQXBDLENBQVo7QUFFQSxXQUFPO0FBQUNnRixNQUFBQSxHQUFHLEVBQUcsMENBQTBDQyxHQUFLO0FBQXRELEtBQVA7QUFDRDs7QUFuYytCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZm9ybWF0IH0gZnJvbSAndXRpbCc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgUmVjb3JkLCBSZXBlYXRhYmxlSXRlbVZhbHVlLCBEYXRlVXRpbHMgfSBmcm9tICdmdWxjcnVtLWNvcmUnO1xuaW1wb3J0IHBnZm9ybWF0IGZyb20gJ3BnLWZvcm1hdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY29yZFZhbHVlcyB7XG4gIHN0YXRpYyB1cGRhdGVGb3JSZWNvcmRTdGF0ZW1lbnRzKGRiLCByZWNvcmQsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHN0YXRlbWVudHMgPSBbXTtcblxuICAgIHN0YXRlbWVudHMucHVzaC5hcHBseShzdGF0ZW1lbnRzLCB0aGlzLmRlbGV0ZUZvclJlY29yZFN0YXRlbWVudHMoZGIsIHJlY29yZCwgcmVjb3JkLmZvcm0sIG9wdGlvbnMpKTtcbiAgICBzdGF0ZW1lbnRzLnB1c2guYXBwbHkoc3RhdGVtZW50cywgdGhpcy5pbnNlcnRGb3JSZWNvcmRTdGF0ZW1lbnRzKGRiLCByZWNvcmQsIHJlY29yZC5mb3JtLCBvcHRpb25zKSk7XG5cbiAgICByZXR1cm4gc3RhdGVtZW50cztcbiAgfVxuXG4gIHN0YXRpYyBpbnNlcnRGb3JSZWNvcmRTdGF0ZW1lbnRzKGRiLCByZWNvcmQsIGZvcm0sIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHN0YXRlbWVudHMgPSBbXTtcblxuICAgIHN0YXRlbWVudHMucHVzaCh0aGlzLmluc2VydFJvd0ZvckZlYXR1cmVTdGF0ZW1lbnQoZGIsIGZvcm0sIHJlY29yZCwgbnVsbCwgcmVjb3JkLCBvcHRpb25zKSk7XG4gICAgc3RhdGVtZW50cy5wdXNoLmFwcGx5KHN0YXRlbWVudHMsIHRoaXMuaW5zZXJ0Q2hpbGRGZWF0dXJlc0ZvckZlYXR1cmVTdGF0ZW1lbnRzKGRiLCBmb3JtLCByZWNvcmQsIHJlY29yZCwgb3B0aW9ucykpO1xuICAgIHN0YXRlbWVudHMucHVzaC5hcHBseShzdGF0ZW1lbnRzLCB0aGlzLmluc2VydE11bHRpcGxlVmFsdWVzRm9yRmVhdHVyZVN0YXRlbWVudHMoZGIsIGZvcm0sIHJlY29yZCwgcmVjb3JkLCBvcHRpb25zKSk7XG4gICAgc3RhdGVtZW50cy5wdXNoLmFwcGx5KHN0YXRlbWVudHMsIHRoaXMuaW5zZXJ0Q2hpbGRNdWx0aXBsZVZhbHVlc0ZvckZlYXR1cmVTdGF0ZW1lbnRzKGRiLCBmb3JtLCByZWNvcmQsIHJlY29yZCwgb3B0aW9ucykpO1xuXG4gICAgcmV0dXJuIHN0YXRlbWVudHM7XG4gIH1cblxuICBzdGF0aWMgaW5zZXJ0Um93Rm9yRmVhdHVyZVN0YXRlbWVudChkYiwgZm9ybSwgZmVhdHVyZSwgcGFyZW50RmVhdHVyZSwgcmVjb3JkLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLmNvbHVtblZhbHVlc0ZvckZlYXR1cmUoZmVhdHVyZSwgb3B0aW9ucyk7XG4gICAgY29uc3Qgc3lzdGVtVmFsdWVzID0gdGhpcy5zeXN0ZW1Db2x1bW5WYWx1ZXNGb3JGZWF0dXJlKGZlYXR1cmUsIHBhcmVudEZlYXR1cmUsIHJlY29yZCwgb3B0aW9ucyk7XG5cbiAgICBPYmplY3QuYXNzaWduKHZhbHVlcywgc3lzdGVtVmFsdWVzKTtcblxuICAgIGxldCB0YWJsZU5hbWUgPSBudWxsO1xuXG4gICAgaWYgKGZlYXR1cmUgaW5zdGFuY2VvZiBSZXBlYXRhYmxlSXRlbVZhbHVlKSB7XG4gICAgICAvLyBUT0RPKHpobSkgYWRkIHB1YmxpYyBpbnRlcmZhY2UgZm9yIGFjY2Vzc2luZyBfZWxlbWVudCwgbGlrZSBgZ2V0IHJlcGVhdGFibGVFbGVtZW50KClgXG4gICAgICB0YWJsZU5hbWUgPSB0aGlzLnRhYmxlTmFtZVdpdGhGb3JtQW5kU2NoZW1hKGZvcm0sIGZlYXR1cmUuX2VsZW1lbnQsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YWJsZU5hbWUgPSB0aGlzLnRhYmxlTmFtZVdpdGhGb3JtQW5kU2NoZW1hKGZvcm0sIG51bGwsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnZhbHVlc1RyYW5zZm9ybWVyKSB7XG4gICAgICBvcHRpb25zLnZhbHVlc1RyYW5zZm9ybWVyKHtkYiwgZm9ybSwgZmVhdHVyZSwgcGFyZW50RmVhdHVyZSwgcmVjb3JkLCB2YWx1ZXN9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGIuaW5zZXJ0U3RhdGVtZW50KHRhYmxlTmFtZSwgdmFsdWVzLCB7cGs6ICdpZCd9KTtcbiAgfVxuXG4gIHN0YXRpYyBpbnNlcnRDaGlsZEZlYXR1cmVzRm9yRmVhdHVyZVN0YXRlbWVudHMoZGIsIGZvcm0sIGZlYXR1cmUsIHJlY29yZCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qgc3RhdGVtZW50cyA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBmb3JtVmFsdWUgb2YgZmVhdHVyZS5mb3JtVmFsdWVzLmFsbCkge1xuICAgICAgaWYgKGZvcm1WYWx1ZS5lbGVtZW50LmlzUmVwZWF0YWJsZUVsZW1lbnQpIHtcbiAgICAgICAgLy8gVE9ETyh6aG0pIGFkZCBwdWJsaWMgaW50ZXJmYWNlIGZvciBfaXRlbXNcbiAgICAgICAgZm9yIChjb25zdCByZXBlYXRhYmxlSXRlbSBvZiBmb3JtVmFsdWUuX2l0ZW1zKSB7XG4gICAgICAgICAgc3RhdGVtZW50cy5wdXNoKHRoaXMuaW5zZXJ0Um93Rm9yRmVhdHVyZVN0YXRlbWVudChkYiwgZm9ybSwgcmVwZWF0YWJsZUl0ZW0sIGZlYXR1cmUsIHJlY29yZCwgb3B0aW9ucykpO1xuICAgICAgICAgIHN0YXRlbWVudHMucHVzaC5hcHBseShzdGF0ZW1lbnRzLCB0aGlzLmluc2VydENoaWxkRmVhdHVyZXNGb3JGZWF0dXJlU3RhdGVtZW50cyhkYiwgZm9ybSwgcmVwZWF0YWJsZUl0ZW0sIHJlY29yZCwgb3B0aW9ucykpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXRlbWVudHM7XG4gIH1cblxuICBzdGF0aWMgbWF5YmVBc3NpZ25BcnJheSh2YWx1ZXMsIGtleSwgdmFsdWUsIGRpc2FibGVBcnJheXMsIGRpc2FibGVDb21wbGV4VHlwZXMpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGRpc2FibGVkQXJyYXlWYWx1ZSA9IChfLmlzQXJyYXkodmFsdWUpICYmIGRpc2FibGVBcnJheXMpID8gdmFsdWUuam9pbignLCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB2YWx1ZTtcblxuICAgIGNvbnN0IGlzU2ltcGxlID0gXy5pc051bWJlcih2YWx1ZSkgfHwgXy5pc1N0cmluZyh2YWx1ZSkgfHwgXy5pc0RhdGUodmFsdWUpIHx8IF8uaXNCb29sZWFuKHZhbHVlKTtcblxuICAgIHZhbHVlc1trZXldID0gIWlzU2ltcGxlICYmIGRpc2FibGVDb21wbGV4VHlwZXMgPT09IHRydWUgPyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkgOiB2YWx1ZTtcbiAgfVxuXG4gIHN0YXRpYyBjb2x1bW5WYWx1ZXNGb3JGZWF0dXJlKGZlYXR1cmUsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHZhbHVlcyA9IHt9O1xuXG4gICAgZm9yIChjb25zdCBmb3JtVmFsdWUgb2YgZmVhdHVyZS5mb3JtVmFsdWVzLmFsbCkge1xuICAgICAgaWYgKGZvcm1WYWx1ZS5pc0VtcHR5KSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBlbGVtZW50ID0gZm9ybVZhbHVlLmVsZW1lbnQ7XG5cbiAgICAgIGxldCBjb2x1bW5WYWx1ZSA9IGZvcm1WYWx1ZS5jb2x1bW5WYWx1ZTtcblxuICAgICAgaWYgKF8uaXNOdW1iZXIoY29sdW1uVmFsdWUpIHx8IF8uaXNTdHJpbmcoY29sdW1uVmFsdWUpIHx8IF8uaXNBcnJheShjb2x1bW5WYWx1ZSkgfHwgXy5pc0RhdGUoY29sdW1uVmFsdWUpKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmNhbGN1bGF0ZWRGaWVsZERhdGVGb3JtYXQgPT09ICdkYXRlJyAmJiBlbGVtZW50LmlzQ2FsY3VsYXRlZEVsZW1lbnQgJiYgZWxlbWVudC5kaXNwbGF5LmlzRGF0ZSkge1xuICAgICAgICAgIGNvbHVtblZhbHVlID0gRGF0ZVV0aWxzLnBhcnNlRGF0ZShmb3JtVmFsdWUudGV4dFZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGRvbid0IGFsbG93IGRhdGVzIGdyZWF0ZXIgdGhhbiA5OTk5LCB5ZXMgLSB0aGV5IGV4aXN0IGluIHRoZSB3aWxkXG4gICAgICAgIGlmIChfLmlzRGF0ZShjb2x1bW5WYWx1ZSkpIHtcbiAgICAgICAgICBjb2x1bW5WYWx1ZSA9IGNvbHVtblZhbHVlLmdldEZ1bGxZZWFyKCkgPiA5OTk5ID8gbnVsbCA6IGZvcm1WYWx1ZS50ZXh0VmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1heWJlQXNzaWduQXJyYXkodmFsdWVzLCAnZicgKyBmb3JtVmFsdWUuZWxlbWVudC5rZXkudG9Mb3dlckNhc2UoKSwgY29sdW1uVmFsdWUsIG9wdGlvbnMuZGlzYWJsZUFycmF5cywgb3B0aW9ucy5kaXNhYmxlQ29tcGxleFR5cGVzKTtcbiAgICAgIH0gZWxzZSBpZiAoY29sdW1uVmFsdWUpIHtcblxuICAgICAgICBpZiAoZWxlbWVudCAmJiBvcHRpb25zLm1lZGlhVVJMRm9ybWF0dGVyKSB7XG4gICAgICAgICAgaWYgKGVsZW1lbnQuaXNQaG90b0VsZW1lbnQgfHwgZWxlbWVudC5pc1ZpZGVvRWxlbWVudCB8fCBlbGVtZW50LmlzQXVkaW9FbGVtZW50KSB7XG4gICAgICAgICAgICBjb25zdCBwcmVmaXggPSAnZicgKyBmb3JtVmFsdWUuZWxlbWVudC5rZXkudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAgICAgY29sdW1uVmFsdWVbcHJlZml4ICsgJ191cmxzJ10gPSBvcHRpb25zLm1lZGlhVVJMRm9ybWF0dGVyKGZvcm1WYWx1ZSk7XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLm1lZGlhVmlld1VSTEZvcm1hdHRlcikge1xuICAgICAgICAgICAgICBjb2x1bW5WYWx1ZVtwcmVmaXggKyAnX3ZpZXdfdXJsJ10gPSBvcHRpb25zLm1lZGlhVmlld1VSTEZvcm1hdHRlcihmb3JtVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIGFycmF5IHR5cGVzIGFyZSBkaXNhYmxlZCwgY29udmVydCBhbGwgdGhlIHByb3BzIHRvIGRlbGltaXRlZCB2YWx1ZXNcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoY29sdW1uVmFsdWUpKSB7XG4gICAgICAgICAgdGhpcy5tYXliZUFzc2lnbkFycmF5KGNvbHVtblZhbHVlLCBrZXksIGNvbHVtblZhbHVlW2tleV0sIG9wdGlvbnMuZGlzYWJsZUFycmF5cywgb3B0aW9ucy5kaXNhYmxlQ29tcGxleFR5cGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIE9iamVjdC5hc3NpZ24odmFsdWVzLCBjb2x1bW5WYWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfVxuXG4gIHN0YXRpYyBpbnNlcnRNdWx0aXBsZVZhbHVlc0ZvckZlYXR1cmVTdGF0ZW1lbnRzKGRiLCBmb3JtLCBmZWF0dXJlLCByZWNvcmQsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHN0YXRlbWVudHMgPSBbXTtcblxuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMubXVsdGlwbGVWYWx1ZXNGb3JGZWF0dXJlKGZlYXR1cmUsIHJlY29yZCk7XG5cbiAgICBjb25zdCB0YWJsZU5hbWUgPSB0aGlzLm11bHRpcGxlVmFsdWVUYWJsZU5hbWVXaXRoRm9ybShmb3JtLCBvcHRpb25zKTtcblxuICAgIGxldCBwYXJlbnRSZXNvdXJjZUlkID0gbnVsbDtcblxuICAgIGlmIChmZWF0dXJlIGluc3RhbmNlb2YgUmVwZWF0YWJsZUl0ZW1WYWx1ZSkge1xuICAgICAgcGFyZW50UmVzb3VyY2VJZCA9IGZlYXR1cmUuaWQ7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBtdWx0aXBsZVZhbHVlSXRlbSBvZiB2YWx1ZXMpIHtcbiAgICAgIGNvbnN0IGluc2VydFZhbHVlcyA9IE9iamVjdC5hc3NpZ24oe30sIHtrZXk6IG11bHRpcGxlVmFsdWVJdGVtLmVsZW1lbnQua2V5LCB0ZXh0X3ZhbHVlOiBtdWx0aXBsZVZhbHVlSXRlbS52YWx1ZX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtyZWNvcmRfaWQ6IHJlY29yZC5yb3dJRCwgcmVjb3JkX3Jlc291cmNlX2lkOiByZWNvcmQuaWQsIHBhcmVudF9yZXNvdXJjZV9pZDogcGFyZW50UmVzb3VyY2VJZH0pO1xuXG4gICAgICBzdGF0ZW1lbnRzLnB1c2goZGIuaW5zZXJ0U3RhdGVtZW50KHRhYmxlTmFtZSwgaW5zZXJ0VmFsdWVzLCB7cGs6ICdpZCd9KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXRlbWVudHM7XG4gIH1cblxuICBzdGF0aWMgaW5zZXJ0Q2hpbGRNdWx0aXBsZVZhbHVlc0ZvckZlYXR1cmVTdGF0ZW1lbnRzKGRiLCBmb3JtLCBmZWF0dXJlLCByZWNvcmQsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHN0YXRlbWVudHMgPSBbXTtcblxuICAgIGZvciAoY29uc3QgZm9ybVZhbHVlIG9mIGZlYXR1cmUuZm9ybVZhbHVlcy5hbGwpIHtcbiAgICAgIGlmIChmb3JtVmFsdWUuaXNSZXBlYXRhYmxlRWxlbWVudCkge1xuICAgICAgICBmb3IgKGNvbnN0IHJlcGVhdGFibGVJdGVtIG9mIGZvcm1WYWx1ZS5faXRlbXMpIHtcbiAgICAgICAgICBzdGF0ZW1lbnRzLnB1c2guYXBwbHkoc3RhdGVtZW50cywgdGhpcy5pbnNlcnRNdWx0aXBsZVZhbHVlc0ZvckZlYXR1cmVTdGF0ZW1lbnRzKGRiLCBmb3JtLCByZXBlYXRhYmxlSXRlbSwgcmVjb3JkLCBvcHRpb25zKSk7XG4gICAgICAgICAgc3RhdGVtZW50cy5wdXNoLmFwcGx5KHN0YXRlbWVudHMsIHRoaXMuaW5zZXJ0Q2hpbGRNdWx0aXBsZVZhbHVlc0ZvckZlYXR1cmVTdGF0ZW1lbnRzKGRiLCBmb3JtLCByZXBlYXRhYmxlSXRlbSwgcmVjb3JkLCBvcHRpb25zKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGVtZW50cztcbiAgfVxuXG4gIHN0YXRpYyBtdWx0aXBsZVZhbHVlc0ZvckZlYXR1cmUoZmVhdHVyZSwgcmVjb3JkKSB7XG4gICAgY29uc3QgdmFsdWVzID0gW107XG5cbiAgICBmb3IgKGNvbnN0IGZvcm1WYWx1ZSBvZiBmZWF0dXJlLmZvcm1WYWx1ZXMuYWxsKSB7XG4gICAgICBpZiAoZm9ybVZhbHVlLmlzRW1wdHkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZlYXR1cmVWYWx1ZXMgPSBmb3JtVmFsdWUubXVsdGlwbGVWYWx1ZXM7XG5cbiAgICAgIGlmIChmZWF0dXJlVmFsdWVzKSB7XG4gICAgICAgIHZhbHVlcy5wdXNoLmFwcGx5KHZhbHVlcywgZmVhdHVyZVZhbHVlcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfVxuXG4gIHN0YXRpYyBzeXN0ZW1Db2x1bW5WYWx1ZXNGb3JGZWF0dXJlKGZlYXR1cmUsIHBhcmVudEZlYXR1cmUsIHJlY29yZCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgdmFsdWVzID0ge307XG5cbiAgICB2YWx1ZXMucmVjb3JkX2lkID0gcmVjb3JkLnJvd0lEO1xuICAgIHZhbHVlcy5yZWNvcmRfcmVzb3VyY2VfaWQgPSByZWNvcmQuaWQ7XG5cbiAgICBpZiAob3B0aW9ucy5yZXBvcnRVUkxGb3JtYXR0ZXIpIHtcbiAgICAgIHZhbHVlcy5yZXBvcnRfdXJsID0gb3B0aW9ucy5yZXBvcnRVUkxGb3JtYXR0ZXIoZmVhdHVyZSk7XG4gICAgfVxuXG4gICAgaWYgKGZlYXR1cmUgaW5zdGFuY2VvZiBSZWNvcmQpIHtcbiAgICAgIGlmIChyZWNvcmQuX3Byb2plY3RSb3dJRCkge1xuICAgICAgICB2YWx1ZXMucHJvamVjdF9pZCA9IHJlY29yZC5fcHJvamVjdFJvd0lEO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnByb2plY3RJRCkge1xuICAgICAgICB2YWx1ZXMucHJvamVjdF9yZXNvdXJjZV9pZCA9IHJlY29yZC5wcm9qZWN0SUQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQuX2Fzc2lnbmVkVG9Sb3dJRCkge1xuICAgICAgICB2YWx1ZXMuYXNzaWduZWRfdG9faWQgPSByZWNvcmQuX2Fzc2lnbmVkVG9Sb3dJRDtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC5hc3NpZ25lZFRvSUQpIHtcbiAgICAgICAgdmFsdWVzLmFzc2lnbmVkX3RvX3Jlc291cmNlX2lkID0gcmVjb3JkLmFzc2lnbmVkVG9JRDtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC5fY3JlYXRlZEJ5Um93SUQpIHtcbiAgICAgICAgdmFsdWVzLmNyZWF0ZWRfYnlfaWQgPSByZWNvcmQuX2NyZWF0ZWRCeVJvd0lEO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLmNyZWF0ZWRCeUlEKSB7XG4gICAgICAgIHZhbHVlcy5jcmVhdGVkX2J5X3Jlc291cmNlX2lkID0gcmVjb3JkLmNyZWF0ZWRCeUlEO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLl91cGRhdGVkQnlSb3dJRCkge1xuICAgICAgICB2YWx1ZXMudXBkYXRlZF9ieV9pZCA9IHJlY29yZC5fdXBkYXRlZEJ5Um93SUQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudXBkYXRlZEJ5SUQpIHtcbiAgICAgICAgdmFsdWVzLnVwZGF0ZWRfYnlfcmVzb3VyY2VfaWQgPSByZWNvcmQudXBkYXRlZEJ5SUQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQuX2NoYW5nZXNldFJvd0lEKSB7XG4gICAgICAgIHZhbHVlcy5jaGFuZ2VzZXRfaWQgPSByZWNvcmQuX2NoYW5nZXNldFJvd0lEO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLmNoYW5nZXNldElEKSB7XG4gICAgICAgIHZhbHVlcy5jaGFuZ2VzZXRfcmVzb3VyY2VfaWQgPSByZWNvcmQuY2hhbmdlc2V0SUQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQuc3RhdHVzKSB7XG4gICAgICAgIHZhbHVlcy5zdGF0dXMgPSByZWNvcmQuc3RhdHVzO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLmxhdGl0dWRlICE9IG51bGwpIHtcbiAgICAgICAgdmFsdWVzLmxhdGl0dWRlID0gcmVjb3JkLmxhdGl0dWRlO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLmxvbmdpdHVkZSAhPSBudWxsKSB7XG4gICAgICAgIHZhbHVlcy5sb25naXR1ZGUgPSByZWNvcmQubG9uZ2l0dWRlO1xuICAgICAgfVxuXG4gICAgICB2YWx1ZXMuYWx0aXR1ZGUgPSByZWNvcmQuYWx0aXR1ZGU7XG4gICAgICB2YWx1ZXMuc3BlZWQgPSByZWNvcmQuc3BlZWQ7XG4gICAgICB2YWx1ZXMuY291cnNlID0gcmVjb3JkLmNvdXJzZTtcbiAgICAgIHZhbHVlcy52ZXJ0aWNhbF9hY2N1cmFjeSA9IHJlY29yZC52ZXJ0aWNhbEFjY3VyYWN5O1xuICAgICAgdmFsdWVzLmhvcml6b250YWxfYWNjdXJhY3kgPSByZWNvcmQuaG9yaXpvbnRhbEFjY3VyYWN5O1xuICAgIH0gZWxzZSBpZiAoZmVhdHVyZSBpbnN0YW5jZW9mIFJlcGVhdGFibGVJdGVtVmFsdWUpIHtcbiAgICAgIHZhbHVlcy5yZXNvdXJjZV9pZCA9IGZlYXR1cmUuaWQ7XG4gICAgICB2YWx1ZXMuaW5kZXggPSBmZWF0dXJlLmluZGV4O1xuICAgICAgdmFsdWVzLnBhcmVudF9yZXNvdXJjZV9pZCA9IHBhcmVudEZlYXR1cmUuaWQ7XG5cbiAgICAgIGlmIChmZWF0dXJlLmhhc0Nvb3JkaW5hdGUpIHtcbiAgICAgICAgdmFsdWVzLmxhdGl0dWRlID0gZmVhdHVyZS5sYXRpdHVkZTtcbiAgICAgICAgdmFsdWVzLmxvbmdpdHVkZSA9IGZlYXR1cmUubG9uZ2l0dWRlO1xuICAgICAgfVxuXG4gICAgICAvLyByZWNvcmQgdmFsdWVzXG4gICAgICBpZiAocmVjb3JkLnN0YXR1cykge1xuICAgICAgICB2YWx1ZXMucmVjb3JkX3N0YXR1cyA9IHJlY29yZC5zdGF0dXM7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQuX3Byb2plY3RSb3dJRCkge1xuICAgICAgICB2YWx1ZXMucmVjb3JkX3Byb2plY3RfaWQgPSByZWNvcmQuX3Byb2plY3RSb3dJRDtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC5wcm9qZWN0SUQpIHtcbiAgICAgICAgdmFsdWVzLnJlY29yZF9wcm9qZWN0X3Jlc291cmNlX2lkID0gcmVjb3JkLnByb2plY3RJRDtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC5fYXNzaWduZWRUb1Jvd0lEKSB7XG4gICAgICAgIHZhbHVlcy5yZWNvcmRfYXNzaWduZWRfdG9faWQgPSByZWNvcmQuX2Fzc2lnbmVkVG9Sb3dJRDtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC5hc3NpZ25lZFRvSUQpIHtcbiAgICAgICAgdmFsdWVzLnJlY29yZF9hc3NpZ25lZF90b19yZXNvdXJjZV9pZCA9IHJlY29yZC5hc3NpZ25lZFRvSUQ7XG4gICAgICB9XG5cbiAgICAgIC8vIGxpbmtlZCBmaWVsZHNcbiAgICAgIGlmIChmZWF0dXJlLmNyZWF0ZWRCeSkge1xuICAgICAgICB2YWx1ZXMuY3JlYXRlZF9ieV9pZCA9IGZlYXR1cmUuY3JlYXRlZEJ5LnJvd0lEO1xuICAgICAgfVxuXG4gICAgICBpZiAoZmVhdHVyZS5jcmVhdGVkQnlJRCkge1xuICAgICAgICB2YWx1ZXMuY3JlYXRlZF9ieV9yZXNvdXJjZV9pZCA9IGZlYXR1cmUuY3JlYXRlZEJ5SUQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChmZWF0dXJlLnVwZGF0ZWRCeSkge1xuICAgICAgICB2YWx1ZXMudXBkYXRlZF9ieV9pZCA9IGZlYXR1cmUudXBkYXRlZEJ5LnJvd0lEO1xuICAgICAgfVxuXG4gICAgICBpZiAoZmVhdHVyZS51cGRhdGVkQnlJRCkge1xuICAgICAgICB2YWx1ZXMudXBkYXRlZF9ieV9yZXNvdXJjZV9pZCA9IGZlYXR1cmUudXBkYXRlZEJ5SUQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChmZWF0dXJlLmNoYW5nZXNldCkge1xuICAgICAgICB2YWx1ZXMuY2hhbmdlc2V0X2lkID0gZmVhdHVyZS5jaGFuZ2VzZXQucm93SUQ7XG4gICAgICAgIHZhbHVlcy5jaGFuZ2VzZXRfcmVzb3VyY2VfaWQgPSBmZWF0dXJlLmNoYW5nZXNldElEO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQuX2NoYW5nZXNldFJvd0lEKSB7XG4gICAgICAgIHZhbHVlcy5jaGFuZ2VzZXRfaWQgPSByZWNvcmQuX2NoYW5nZXNldFJvd0lEO1xuICAgICAgICB2YWx1ZXMuY2hhbmdlc2V0X3Jlc291cmNlX2lkID0gcmVjb3JkLmNoYW5nZXNldElEO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhbHVlcy50aXRsZSA9IGZlYXR1cmUuZGlzcGxheVZhbHVlO1xuXG4gICAgdmFsdWVzLmZvcm1fdmFsdWVzID0gSlNPTi5zdHJpbmdpZnkoZmVhdHVyZS5mb3JtVmFsdWVzLnRvSlNPTigpKTtcblxuICAgIHRoaXMuc2V0dXBTZWFyY2godmFsdWVzLCBmZWF0dXJlLCBvcHRpb25zKTtcblxuICAgIGlmIChmZWF0dXJlLmhhc0Nvb3JkaW5hdGUpIHtcbiAgICAgIHZhbHVlcy5nZW9tZXRyeSA9IHRoaXMuc2V0dXBQb2ludCh2YWx1ZXMsIGZlYXR1cmUubGF0aXR1ZGUsIGZlYXR1cmUubG9uZ2l0dWRlLCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWVzLmdlb21ldHJ5ID0gbnVsbDtcbiAgICB9XG5cbiAgICB2YWx1ZXMuY3JlYXRlZF9hdCA9IGZlYXR1cmUuY2xpZW50Q3JlYXRlZEF0IHx8IGZlYXR1cmUuY3JlYXRlZEF0O1xuICAgIHZhbHVlcy51cGRhdGVkX2F0ID0gZmVhdHVyZS5jbGllbnRVcGRhdGVkQXQgfHwgZmVhdHVyZS51cGRhdGVkQXQ7XG4gICAgdmFsdWVzLnZlcnNpb24gPSBmZWF0dXJlLnZlcnNpb247XG5cbiAgICBpZiAodmFsdWVzLmNyZWF0ZWRfYnlfaWQgPT0gbnVsbCkge1xuICAgICAgdmFsdWVzLmNyZWF0ZWRfYnlfaWQgPSAtMTtcbiAgICB9XG5cbiAgICBpZiAodmFsdWVzLnVwZGF0ZWRfYnlfaWQgPT0gbnVsbCkge1xuICAgICAgdmFsdWVzLnVwZGF0ZWRfYnlfaWQgPSAtMTtcbiAgICB9XG5cbiAgICB2YWx1ZXMuc2VydmVyX2NyZWF0ZWRfYXQgPSBmZWF0dXJlLmNyZWF0ZWRBdDtcbiAgICB2YWx1ZXMuc2VydmVyX3VwZGF0ZWRfYXQgPSBmZWF0dXJlLnVwZGF0ZWRBdDtcblxuICAgIHZhbHVlcy5jcmVhdGVkX2R1cmF0aW9uID0gZmVhdHVyZS5jcmVhdGVkRHVyYXRpb247XG4gICAgdmFsdWVzLnVwZGF0ZWRfZHVyYXRpb24gPSBmZWF0dXJlLnVwZGF0ZWREdXJhdGlvbjtcbiAgICB2YWx1ZXMuZWRpdGVkX2R1cmF0aW9uID0gZmVhdHVyZS5lZGl0ZWREdXJhdGlvbjtcblxuICAgIHZhbHVlcy5jcmVhdGVkX2xhdGl0dWRlID0gZmVhdHVyZS5jcmVhdGVkTGF0aXR1ZGU7XG4gICAgdmFsdWVzLmNyZWF0ZWRfbG9uZ2l0dWRlID0gZmVhdHVyZS5jcmVhdGVkTG9uZ2l0dWRlO1xuICAgIHZhbHVlcy5jcmVhdGVkX2FsdGl0dWRlID0gZmVhdHVyZS5jcmVhdGVkQWx0aXR1ZGU7XG4gICAgdmFsdWVzLmNyZWF0ZWRfaG9yaXpvbnRhbF9hY2N1cmFjeSA9IGZlYXR1cmUuY3JlYXRlZEFjY3VyYWN5O1xuXG4gICAgaWYgKGZlYXR1cmUuaGFzQ3JlYXRlZENvb3JkaW5hdGUpIHtcbiAgICAgIHZhbHVlcy5jcmVhdGVkX2dlb21ldHJ5ID0gdGhpcy5zZXR1cFBvaW50KHZhbHVlcywgZmVhdHVyZS5jcmVhdGVkTGF0aXR1ZGUsIGZlYXR1cmUuY3JlYXRlZExvbmdpdHVkZSwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgdmFsdWVzLnVwZGF0ZWRfbGF0aXR1ZGUgPSBmZWF0dXJlLnVwZGF0ZWRMYXRpdHVkZTtcbiAgICB2YWx1ZXMudXBkYXRlZF9sb25naXR1ZGUgPSBmZWF0dXJlLnVwZGF0ZWRMb25naXR1ZGU7XG4gICAgdmFsdWVzLnVwZGF0ZWRfYWx0aXR1ZGUgPSBmZWF0dXJlLnVwZGF0ZWRBbHRpdHVkZTtcbiAgICB2YWx1ZXMudXBkYXRlZF9ob3Jpem9udGFsX2FjY3VyYWN5ID0gZmVhdHVyZS51cGRhdGVkQWNjdXJhY3k7XG5cbiAgICBpZiAoZmVhdHVyZS5oYXNVcGRhdGVkQ29vcmRpbmF0ZSkge1xuICAgICAgdmFsdWVzLnVwZGF0ZWRfZ2VvbWV0cnkgPSB0aGlzLnNldHVwUG9pbnQodmFsdWVzLCBmZWF0dXJlLnVwZGF0ZWRMYXRpdHVkZSwgZmVhdHVyZS51cGRhdGVkTG9uZ2l0dWRlLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9XG5cbiAgc3RhdGljIGRlbGV0ZVJvd3NGb3JSZWNvcmRTdGF0ZW1lbnQoZGIsIHJlY29yZCwgdGFibGVOYW1lKSB7XG4gICAgcmV0dXJuIGRiLmRlbGV0ZVN0YXRlbWVudCh0YWJsZU5hbWUsIHtyZWNvcmRfcmVzb3VyY2VfaWQ6IHJlY29yZC5pZH0pO1xuICB9XG5cbiAgc3RhdGljIGRlbGV0ZVJvd3NTdGF0ZW1lbnQoZGIsIHRhYmxlTmFtZSkge1xuICAgIHJldHVybiBkYi5kZWxldGVTdGF0ZW1lbnQodGFibGVOYW1lLCB7fSk7XG4gIH1cblxuICBzdGF0aWMgZGVsZXRlRm9yUmVjb3JkU3RhdGVtZW50cyhkYiwgcmVjb3JkLCBmb3JtLCBvcHRpb25zKSB7XG4gICAgY29uc3QgcmVwZWF0YWJsZXMgPSBmb3JtLmVsZW1lbnRzT2ZUeXBlKCdSZXBlYXRhYmxlJyk7XG5cbiAgICBjb25zdCBzdGF0ZW1lbnRzID0gW107XG5cbiAgICBsZXQgdGFibGVOYW1lID0gdGhpcy50YWJsZU5hbWVXaXRoRm9ybUFuZFNjaGVtYShmb3JtLCBudWxsLCBvcHRpb25zKTtcblxuICAgIHN0YXRlbWVudHMucHVzaCh0aGlzLmRlbGV0ZVJvd3NGb3JSZWNvcmRTdGF0ZW1lbnQoZGIsIHJlY29yZCwgdGFibGVOYW1lKSk7XG5cbiAgICBmb3IgKGNvbnN0IHJlcGVhdGFibGUgb2YgcmVwZWF0YWJsZXMpIHtcbiAgICAgIHRhYmxlTmFtZSA9IHRoaXMudGFibGVOYW1lV2l0aEZvcm1BbmRTY2hlbWEoZm9ybSwgcmVwZWF0YWJsZSwgb3B0aW9ucyk7XG5cbiAgICAgIHN0YXRlbWVudHMucHVzaCh0aGlzLmRlbGV0ZVJvd3NGb3JSZWNvcmRTdGF0ZW1lbnQoZGIsIHJlY29yZCwgdGFibGVOYW1lKSk7XG4gICAgfVxuXG4gICAgdGFibGVOYW1lID0gdGhpcy5tdWx0aXBsZVZhbHVlVGFibGVOYW1lV2l0aEZvcm0oZm9ybSwgb3B0aW9ucyk7XG5cbiAgICBzdGF0ZW1lbnRzLnB1c2godGhpcy5kZWxldGVSb3dzRm9yUmVjb3JkU3RhdGVtZW50KGRiLCByZWNvcmQsIHRhYmxlTmFtZSkpO1xuXG4gICAgcmV0dXJuIHN0YXRlbWVudHM7XG4gIH1cblxuICBzdGF0aWMgZGVsZXRlRm9yRm9ybVN0YXRlbWVudHMoZGIsIGZvcm0sIG9wdGlvbnMpIHtcbiAgICBjb25zdCByZXBlYXRhYmxlcyA9IGZvcm0uZWxlbWVudHNPZlR5cGUoJ1JlcGVhdGFibGUnKTtcblxuICAgIGNvbnN0IHN0YXRlbWVudHMgPSBbXTtcblxuICAgIGxldCB0YWJsZU5hbWUgPSB0aGlzLnRhYmxlTmFtZVdpdGhGb3JtQW5kU2NoZW1hKGZvcm0sIG51bGwsIG9wdGlvbnMpO1xuXG4gICAgc3RhdGVtZW50cy5wdXNoKHRoaXMuZGVsZXRlUm93c1N0YXRlbWVudChkYiwgdGFibGVOYW1lKSk7XG5cbiAgICBmb3IgKGNvbnN0IHJlcGVhdGFibGUgb2YgcmVwZWF0YWJsZXMpIHtcbiAgICAgIHRhYmxlTmFtZSA9IHRoaXMudGFibGVOYW1lV2l0aEZvcm1BbmRTY2hlbWEoZm9ybSwgcmVwZWF0YWJsZSwgb3B0aW9ucyk7XG5cbiAgICAgIHN0YXRlbWVudHMucHVzaCh0aGlzLmRlbGV0ZVJvd3NTdGF0ZW1lbnQoZGIsIHRhYmxlTmFtZSkpO1xuICAgIH1cblxuICAgIHRhYmxlTmFtZSA9IHRoaXMubXVsdGlwbGVWYWx1ZVRhYmxlTmFtZVdpdGhGb3JtKGZvcm0sIG9wdGlvbnMpO1xuXG4gICAgc3RhdGVtZW50cy5wdXNoKHRoaXMuZGVsZXRlUm93c1N0YXRlbWVudChkYiwgdGFibGVOYW1lKSk7XG5cbiAgICByZXR1cm4gc3RhdGVtZW50cztcbiAgfVxuXG4gIHN0YXRpYyBtdWx0aXBsZVZhbHVlVGFibGVOYW1lV2l0aEZvcm0oZm9ybSwgb3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLnRhYmxlTmFtZVdpdGhGb3JtQW5kU2NoZW1hKGZvcm0sIG51bGwsIG9wdGlvbnMsICdfdmFsdWVzJyk7XG4gIH1cblxuICBzdGF0aWMgdGFibGVOYW1lV2l0aEZvcm1BbmRTY2hlbWEoZm9ybSwgcmVwZWF0YWJsZSwgb3B0aW9ucywgc3VmZml4KSB7XG4gICAgY29uc3QgdGFibGVOYW1lID0gdGhpcy50YWJsZU5hbWVXaXRoRm9ybShmb3JtLCByZXBlYXRhYmxlLCBvcHRpb25zKTtcblxuICAgIHN1ZmZpeCA9IHN1ZmZpeCB8fCAnJztcblxuICAgIGlmIChvcHRpb25zLnNjaGVtYSkge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuZXNjYXBlSWRlbnRpZmllcihvcHRpb25zLnNjaGVtYSkgKyAnLicgKyBvcHRpb25zLmVzY2FwZUlkZW50aWZpZXIodGFibGVOYW1lICsgc3VmZml4KTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9ucy5lc2NhcGVJZGVudGlmaWVyKHRhYmxlTmFtZSArIHN1ZmZpeCk7XG4gIH1cblxuICBzdGF0aWMgdGFibGVOYW1lV2l0aEZvcm0oZm9ybSwgcmVwZWF0YWJsZSwgb3B0aW9ucykge1xuICAgIGlmIChyZXBlYXRhYmxlID09IG51bGwpIHtcbiAgICAgIHJldHVybiBmb3JtYXQoJyVzZm9ybV8lcycsIHRoaXMuYWNjb3VudFByZWZpeChmb3JtLCBvcHRpb25zKSwgdGhpcy5mb3JtSWRlbnRpZmllcihmb3JtLCBvcHRpb25zKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZvcm1hdCgnJXNmb3JtXyVzXyVzJywgdGhpcy5hY2NvdW50UHJlZml4KGZvcm0sIG9wdGlvbnMpLCB0aGlzLmZvcm1JZGVudGlmaWVyKGZvcm0sIG9wdGlvbnMpLCByZXBlYXRhYmxlLmtleSk7XG4gIH1cblxuICBzdGF0aWMgYWNjb3VudFByZWZpeChmb3JtLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMuYWNjb3VudFByZWZpeCAhPSBudWxsID8gJ2FjY291bnRfJyArIGZvcm0uX2FjY291bnRSb3dJRCArICdfJyA6ICcnO1xuICB9XG5cbiAgc3RhdGljIGZvcm1JZGVudGlmaWVyKGZvcm0sIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gb3B0aW9ucy5wZXJzaXN0ZW50VGFibGVOYW1lcyA/IGZvcm0uaWQgOiBmb3JtLnJvd0lEO1xuICB9XG5cbiAgc3RhdGljIHNldHVwU2VhcmNoKHZhbHVlcywgZmVhdHVyZSkge1xuICAgIGNvbnN0IHNlYXJjaGFibGVWYWx1ZSA9IGZlYXR1cmUuc2VhcmNoYWJsZVZhbHVlO1xuXG4gICAgdmFsdWVzLnJlY29yZF9pbmRleF90ZXh0ID0gc2VhcmNoYWJsZVZhbHVlO1xuICAgIHZhbHVlcy5yZWNvcmRfaW5kZXggPSB7cmF3OiBgdG9fdHN2ZWN0b3IoJHsgcGdmb3JtYXQoJyVMJywgc2VhcmNoYWJsZVZhbHVlKSB9KWB9O1xuXG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfVxuXG4gIHN0YXRpYyBzZXR1cFBvaW50KHZhbHVlcywgbGF0aXR1ZGUsIGxvbmdpdHVkZSkge1xuICAgIGNvbnN0IHdrdCA9IHBnZm9ybWF0KCdQT0lOVCglcyAlcyknLCBsb25naXR1ZGUsIGxhdGl0dWRlKTtcblxuICAgIHJldHVybiB7cmF3OiBgU1RfRm9yY2UyRChTVF9TZXRTUklEKFNUX0dlb21Gcm9tVGV4dCgnJHsgd2t0IH0nKSwgNDMyNikpYH07XG4gIH1cbn1cbiJdfQ==