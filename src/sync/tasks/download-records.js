import DownloadQuerySequence from './download-query-sequence';
import Client from '../../api/client';
import Record from '../../models/record';

export default class DownloadRecords extends DownloadQuerySequence {
  constructor({form, ...args}) {
    super(args);

    this.form = form;
  }

  get syncResourceScope() {
    return this.form.id;
  }

  get syncLabel() {
    return this.form.name;
  }

  get resourceName() {
    return 'records';
  }

  get typeName() {
    return 'record';
  }

  get lastSync() {
    return this.form._lastSync;
  }

  async fetchObjects(lastSync, sequence) {
    return lastSync == null ? (await Client.getRecords(this.account, this.form, sequence, this.pageSize))
                            : (await Client.getRecordsHistory(this.account, this.form, sequence, this.pageSize));
  }

  findOrCreate(database, attributes) {
    return Record.findOrCreate(database, {account_id: this.account.rowID, resource_id: attributes.id});
  }

  async process(object, attributes) {
    if (attributes.history_change_type === 'd') {
      if (object) {
        object._form = this.form;
        object._formRowID = this.form.rowID;

        await object.delete();

        this._hasChanges = true;

        await this.trigger('record:delete', {record: object});
      }
    } else {
      const isChanged = !object.isPersisted || attributes.version !== object.version;

      object.updateFromAPIAttributes(attributes);
      object._form = this.form;
      object._formRowID = this.form.rowID;

      this.form._lastSync = object.updatedAt;

      await this.lookup(object, attributes.project_id, '_projectRowID', 'getProject');
      await this.lookup(object, attributes.assigned_to_id, '_assignedToRowID', 'getUser');
      await this.lookup(object, attributes.created_by_id, '_createdByRowID', 'getUser');
      await this.lookup(object, attributes.updated_by_id, '_updatedByRowID', 'getUser');
      await this.lookup(object, attributes.changeset_id, '_changesetRowID', 'getChangeset');

      await object.save();

      if (isChanged) {
        this._hasChanges = true;
        this.synchronizer.incrementRecordCount();
        await this.trigger('record:save', {record: object});
      }
    }
  }

  async finish() {
    // update the lastSync date
    await this.form.save();

    if (this._hasChanges) {
      await this.trigger('records:finish', {form: this.form});
    }
  }

  attributesForQueryRow(row) {
    const hasCreatedLocation =
      row[28] != null ||
      row[29] != null ||
      row[30] != null ||
      row[31] != null;

    const hasUpdatedLocation =
      row[32] != null ||
      row[33] != null ||
      row[34] != null ||
      row[35] != null;

    return {
      status: row[0],
      version: row[1],
      id: row[2],
      created_at: row[3],
      updated_at: row[4],
      client_created_at: row[5],
      client_updated_at: row[6],
      created_by_id: row[7],
      updated_by_id: row[8],
      form_id: row[9],
      project_id: row[10],
      assigned_to_id: row[11],
      form_values: JSON.parse(row[12]),
      latitude: row[13],
      longitude: row[14],
      altitude: row[15],
      speed: row[16],
      course: row[17],
      horizontal_accuracy: row[18],
      vertical_accuracy: row[19],
      edited_duration: row[20],
      updated_duration: row[21],
      created_duration: row[22],
      created_by: row[23],
      updated_by: row[24],
      assigned_to: row[25],
      project: row[26],
      changeset_id: row[27],
      created_location: hasCreatedLocation && {
        latitude: row[28],
        longitude: row[29],
        altitude: row[30],
        horizontal_accuracy: row[31]
      },
      updated_location: hasUpdatedLocation && {
        latitude: row[32],
        longitude: row[33],
        altitude: row[34],
        horizontal_accuracy: row[35]
      }
    };
  }

  generateQuery(sequence, limit) {
    const sequenceString = new Date(+sequence).toISOString();

    return `
SELECT
  "_status" AS "status",
  "_version" AS "version",
  "_record_id" AS "id",
  to_char(pg_catalog.timezone('UTC', "_server_created_at"), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "created_at",
  to_char(pg_catalog.timezone('UTC', "_server_updated_at"), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "updated_at",
  to_char(pg_catalog.timezone('UTC', "_created_at"), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "client_created_at",
  to_char(pg_catalog.timezone('UTC', "_updated_at"), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "client_updated_at",
  "_created_by_id" AS "created_by_id",
  "_updated_by_id" AS "updated_by_id",
  '${ this.form.id }'::text AS "form_id",
  "_project_id" AS "project_id",
  "_assigned_to_id" AS "assigned_to_id",
  "_form_values" AS "form_values",
  "_latitude" AS "latitude",
  "_longitude" AS "longitude",
  "_altitude" AS "altitude",
  "_speed" AS "speed",
  "_course" AS "course",
  "_horizontal_accuracy" AS "horizontal_accuracy",
  "_vertical_accuracy" AS "vertical_accuracy",
  "_edited_duration" AS "edited_duration",
  "_updated_duration" AS "updated_duration",
  "_created_duration" AS "created_duration",
  NULL AS "created_by",
  NULL AS "updated_by",
  NULL AS "assigned_to",
  NULL AS "project",
  "_changeset_id" AS "changeset_id",
  "_created_latitude" AS "created_latitude",
  "_created_longitude" AS "created_longitude",
  "_created_altitude" AS "created_altitude",
  "_created_horizontal_accuracy" AS "created_horizontal_accuracy",
  "_updated_latitude" AS "updated_latitude",
  "_updated_longitude" AS "updated_longitude",
  "_updated_altitude" AS "updated_altitude",
  "_updated_horizontal_accuracy" AS "updated_horizontal_accuracy"
FROM "${ this.form.id }/_full" AS "records"
WHERE
  _server_updated_at > '${sequenceString}'
ORDER BY
  _server_updated_at ASC
LIMIT ${limit} OFFSET 0
`;
  }
}
