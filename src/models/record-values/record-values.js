import { format } from 'util';
import _ from 'lodash';
import { Record, RepeatableItemValue, DateUtils } from 'fulcrum-core';
import pgformat from 'pg-format';

export default class RecordValues {
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

    if (feature instanceof RepeatableItemValue) {
      // TODO(zhm) add public interface for accessing _element, like `get repeatableElement()`
      tableName = this.tableNameWithFormAndSchema(form, feature._element, options);
    } else {
      tableName = this.tableNameWithFormAndSchema(form, null, options);
    }

    if (options.valuesTransformer) {
      options.valuesTransformer({db, form, feature, parentFeature, record, values});
    }

    return db.insertStatement(tableName, values, {pk: 'id'});
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

    const disabledArrayValue = (_.isArray(value) && disableArrays) ? value.join(',')
                                                                   : value;

    const isSimple = _.isNumber(value) || _.isString(value) || _.isDate(value) || _.isBoolean(value);

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

      if (_.isNumber(columnValue) || _.isString(columnValue) || _.isArray(columnValue) || _.isDate(columnValue)) {
        if (options.calculatedFieldDateFormat === 'date' && element.isCalculatedElement && element.display.isDate) {
          columnValue = DateUtils.parseDate(formValue.textValue);
        }

        // don't allow dates greater than 9999, yes - they exist in the wild
        if (_.isDate(columnValue)) {
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
        }

        // TODO(zhm) fulcrum-core needs to be fixed to not emit a caption field for attachments
        if (element.isAttachmentElement) {
          delete columnValue[`f${ element.key }_captions`];
        }

        // if array types are disabled, convert all the props to delimited values
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

    if (feature instanceof RepeatableItemValue) {
      parentResourceId = feature.id;
    }

    for (const multipleValueItem of values) {
      const insertValues = Object.assign({}, {key: multipleValueItem.element.key, text_value: multipleValueItem.value},
                                         {record_id: record.rowID, record_resource_id: record.id, parent_resource_id: parentResourceId});

      statements.push(db.insertStatement(tableName, insertValues, {pk: 'id'}));
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

    if (feature instanceof Record) {
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
    } else if (feature instanceof RepeatableItemValue) {
      values.resource_id = feature.id;
      values.index = feature.index;
      values.parent_resource_id = parentFeature.id;

      if (feature.hasCoordinate) {
        values.latitude = feature.latitude;
        values.longitude = feature.longitude;
      }

      // record values
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
      }

      // linked fields
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
    return db.deleteStatement(tableName, {record_resource_id: record.id});
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
      return format('%sform_%s', this.accountPrefix(form, options), this.formIdentifier(form, options));
    }

    return format('%sform_%s_%s', this.accountPrefix(form, options), this.formIdentifier(form, options), repeatable.key);
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
    values.record_index = {raw: `to_tsvector(${ pgformat('%L', searchableValue) })`};

    return values;
  }

  static setupPoint(values, latitude, longitude) {
    const wkt = pgformat('POINT(%s %s)', longitude, latitude);

    return {raw: `ST_Force2D(ST_SetSRID(ST_GeomFromText('${ wkt }'), 4326))`};
  }
}
