import { PersistentObject } from 'minidb';
import { Record as RecordBase } from 'fulcrum-core';
import SQLiteRecordValues from './record-values/sqlite-record-values';
import Form from './form';

export default class Record extends RecordBase {
  static get tableName() {
    return 'records';
  }

  static get columns() {
    return [
      { name: 'accountRowID', column: 'account_id', type: 'integer', null: false },
      { name: 'id', column: 'resource_id', type: 'string', null: false },
      { name: 'formValuesJSON', column: 'form_values', type: 'json', null: false },
      { name: 'clientCreatedAt', column: 'client_created_at', type: 'datetime' },
      { name: 'clientUpdatedAt', column: 'client_updated_at', type: 'datetime' },
      { name: 'createdAt', column: 'server_created_at', type: 'datetime' },
      { name: 'updatedAt', column: 'server_updated_at', type: 'datetime' },
      { name: 'status', column: 'status', type: 'string' },
      { name: 'latitude', column: 'latitude', type: 'double' },
      { name: 'longitude', column: 'longitude', type: 'double' },
      { name: 'altitude', column: 'altitude', type: 'double' },
      { name: 'speed', column: 'speed', type: 'double' },
      { name: 'course', column: 'course', type: 'double' },
      { name: 'horizontalAccuracy', column: 'horizontal_accuracy', type: 'double' },
      { name: 'verticalAccuracy', column: 'vertical_accuracy', type: 'double' },
      { name: 'formRowID', column: 'form_id', type: 'integer' },
      { name: 'projectRowID', column: 'project_id', type: 'integer' },
      { name: 'projectID', column: 'project_resource_id', type: 'string' },
      { name: 'assignedToRowID', column: 'assigned_to_id', type: 'integer' },
      { name: 'assignedToID', column: 'assigned_to_resource_id', type: 'string' },
      { name: 'updatedByRowID', column: 'updated_by_id', type: 'integer' },
      { name: 'updatedByID', column: 'updated_by_resource_id', type: 'string' },
      { name: 'createdByRowID', column: 'created_by_id', type: 'integer' },
      { name: 'createdByID', column: 'created_by_resource_id', type: 'string' },
      { name: 'changesetRowID', column: 'changeset_id', type: 'integer' },
      { name: 'changesetID', column: 'changeset_resource_id', type: 'string' },
      { name: 'version', column: 'version', type: 'integer', null: false },
      { name: 'hasChanges', column: 'has_changes', type: 'boolean' },
      { name: 'draft', column: 'draft', type: 'boolean', null: false },
      { name: 'isNew', column: 'is_new', type: 'boolean', null: false },
      { name: 'lastError', column: 'last_error', type: 'string' },
      { name: 'indexText', column: 'index_text', type: 'string' },
      { name: 'title', column: 'title', type: 'string' },
      { name: 'createdDuration', column: 'created_duration', type: 'integer' },
      { name: 'updatedDuration', column: 'updated_duration', type: 'integer' },
      { name: 'editedDuration', column: 'edited_duration', type: 'integer' },
      { name: 'updatedLatitude', column: 'updated_latitude', type: 'double' },
      { name: 'updatedLongitude', column: 'updated_longitude', type: 'double' },
      { name: 'updatedAltitude', column: 'updated_altitude', type: 'double' },
      { name: 'updatedAccuracy', column: 'updated_accuracy', type: 'double' },
      { name: 'createdLatitude', column: 'created_latitude', type: 'double' },
      { name: 'createdLongitude', column: 'created_longitude', type: 'double' },
      { name: 'createdAltitude', column: 'created_altitude', type: 'double' },
      { name: 'createdAccuracy', column: 'created_accuracy', type: 'double' }
    ];
  }

  databaseValues(db) {
    const values = PersistentObject.prototype.databaseValues.call(this);

    if (values.has_changes == null) {
      values.has_changes = false;
    }

    if (values.draft == null) {
      values.draft = false;
    }

    if (values.is_new == null) {
      values.is_new = false;
    }

    values.title = this.displayValue;

    return values;
  }

  get recordValueOptions() {
    return {
      escapeIdentifier: (value) => this.db.ident(value),
      accountPrefix: 'account_' + this.accountRowID
    };
  }

  async afterSave(options) {
    const statements = SQLiteRecordValues.updateForRecordStatements(this.db, this, this.recordValueOptions);

    await this.db.execute(statements.map(o => o.sql).join('\n'));
  }

  async beforeSave(options) {
    this._indexText = this.formValues.searchableValue;
  }

  async beforeDelete(options) {
    const statements = SQLiteRecordValues.deleteForRecordStatements(this.db, this, this.form, this.recordValueOptions);

    await this.db.execute(statements.map(o => o.sql).join('\n'));
  }

  getForm() {
    return this.loadOne('form', Form);
  }

  get form() {
    return this._form;
  }

  set form(form) {
    this.setOne('form', form);
  }

  static queryRowToAttributes(row) {
    const attributes = {
      id: row._record_id,
      project_id: row._project_id,
      assigned_to_id: row._assigned_to_id,
      status: row._status,
      latitude: row._latitude,
      longitude: row._longitude,
      client_created_at: new Date(row._created_at),
      client_updated_at: new Date(row._updated_at),
      version: row._version,
      created_by_id: row._created_by_id,
      updated_by_id: row._updated_by_id,
      created_at: new Date(row._server_created_at),
      updated_at: new Date(row._server_updated_at),
      altitude: row._altitude,
      speed: row._speed,
      course: row._course,
      horizontal_accuracy: row._horizontal_accuracy,
      vertical_accuracy: row._vertical_accuracy,
      form_values: JSON.parse(row._form_values),
      changeset_id: row._changeset_id,
      created_latitude: row._created_latitude,
      created_longitude: row._created_longitude,
      created_geometry: row._created_geometry,
      created_altitude: row._created_altitude,
      created_horizontal_accuracy: row._created_horizontal_accuracy,
      updated_latitude: row._updated_latitude,
      updated_longitude: row._updated_longitude,
      updated_geometry: row._updated_geometry,
      updated_altitude: row._updated_altitude,
      updated_horizontal_accuracy: row._updated_horizontal_accuracy,
      created_duration: row._created_duration,
      updated_duration: row._updated_duration,
      edited_duration: row._edited_duration
    };

    return attributes;
  }
}

PersistentObject.register(Record);
