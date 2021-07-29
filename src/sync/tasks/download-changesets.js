import DownloadQuerySequence from './download-query-sequence';
import Changeset from '../../models/changeset';

export default class DownloadChangesets extends DownloadQuerySequence {
  get resourceName() {
    return 'changesets';
  }

  get typeName() {
    return 'changeset';
  }

  get lastSync() {
    return this.account._lastSyncChangesets;
  }

  get useRestAPI() {
    return false;
  }

  findOrCreate(database, attributes) {
    return Changeset.findOrCreate(database, {account_id: this.account.rowID, resource_id: attributes.id});
  }

  async loadObject(object, attributes) {
    await this.lookup(object, attributes.form_id, '_formRowID', 'getForm');
    await this.lookup(object, attributes.closed_by_id, '_closedByRowID', 'getUser');
    await this.lookup(object, attributes.created_by_id, '_createdByRowID', 'getUser');

    this.account._lastSyncChangesets = object._updatedAt;
  }

  attributesForQueryRow(row) {
    return {
      id: row[0],
      created_at: row[1],
      updated_at: row[2],
      closed_at: row[3],
      metadata: row[4] && JSON.parse(row[4]),
      min_lat: row[5],
      max_lat: row[6],
      min_lon: row[7],
      max_lon: row[8],
      number_of_changes: row[9],
      number_created: row[10],
      number_updated: row[11],
      number_deleted: row[12],
      form_id: row[13],
      created_by_id: row[14],
      updated_by_id: row[15],
      closed_by_id: row[16],
      created_by: row[17],
      updated_by: row[18],
      closed_by: row[19]
    };
  }

  generateQuery(sequence, limit) {
    const sequenceString = new Date(+sequence).toISOString();

    return `
SELECT
  "changeset_id" AS "id",
  to_char(pg_catalog.timezone('UTC', "records"."created_at"), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "created_at",
  to_char(pg_catalog.timezone('UTC', "records"."updated_at"), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "updated_at",
  to_char(pg_catalog.timezone('UTC', "records"."closed_at"), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "closed_at",
  "metadata" AS "metadata",
  "min_lat" AS min_lat,
  "max_lat" AS max_lat,
  "min_lon" AS min_lon,
  "max_lon" AS max_lon,
  "number_of_changes" AS number_of_changes,
  "number_of_creates" AS number_created,
  "number_of_updates" AS number_updated,
  "number_of_deletes" AS number_deleted,
  "form_id" AS form_id,
  "created_by_id" AS "created_by_id",
  "updated_by_id" AS "updated_by_id",
  "closed_by_id" AS "closed_by_id",
  NULL AS "created_by",
  NULL AS "updated_by",
  NULL AS "closed_by"
FROM "changesets" AS "records"
WHERE
  "records".updated_at > '${sequenceString}'
ORDER BY
  "records".updated_at ASC
LIMIT ${limit} OFFSET 0
`;
  }
}
