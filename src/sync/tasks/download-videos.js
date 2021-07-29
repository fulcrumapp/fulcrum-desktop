import DownloadQuerySequence from './download-query-sequence';
import Video from '../../models/video';
import { DateUtils } from 'fulcrum-core';

export default class DownloadVideos extends DownloadQuerySequence {
  get resourceName() {
    return 'videos';
  }

  get typeName() {
    return 'video';
  }

  get lastSync() {
    return this.account._lastSyncVideos;
  }

  get useRestAPI() {
    return false;
  }

  findOrCreate(database, attributes) {
    return Video.findOrCreate(database, {account_id: this.account.rowID, resource_id: attributes.access_key});
  }

  async process(object, attributes) {
    const isChanged = !object.isPersisted ||
                      DateUtils.parseISOTimestamp(attributes.updated_at).getTime() !== object.updatedAt.getTime();

    object.updateFromAPIAttributes(attributes);

    if (object.isDownloaded == null) {
      object.isDownloaded = false;
    }

    await this.lookup(object, attributes.form_id, '_formRowID', 'getForm');
    await this.lookup(object, attributes.created_by_id, '_createdByRowID', 'getUser');
    await this.lookup(object, attributes.updated_by_id, '_updatedByRowID', 'getUser');

    if (object._formRowID) {
      const record = await this.account.findFirstRecord({resource_id: attributes.record_id});

      if (record) {
        object._recordRowID = record.rowID;
      }
    }

    this.account._lastSyncVideos = object._updatedAt;

    await object.save();

    if (isChanged) {
      await this.trigger('video:save', {video: object});
    }
  }

  convertTrack(track) {
    // convert a V1 style track to a V2 style track
    if (Array.isArray(track)) {
      return { tracks: [ { track } ] };
    }

    return track;
  }

  attributesForQueryRow(row) {
    return {
      access_key: row[0],
      created_at: row[1],
      updated_at: row[2],
      uploaded: row[3],
      stored: row[4],
      processed: row[5],
      created_by_id: row[6],
      updated_by_id: row[7],
      form_id: row[8],
      record_id: row[9],
      content_type: row[10],
      file_size: row[11],
      metadata: row[12] && JSON.parse(row[12]),
      created_by: row[13],
      updated_by: row[14],
      track: row[15] && this.convertTrack(JSON.parse(row[15]))
    };
  }

  generateQuery(sequence, limit) {
    const sequenceString = new Date(+sequence).toISOString();

    return `
SELECT
  "video_id" AS "access_key",
  to_char(pg_catalog.timezone('UTC', "records"."created_at"), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "created_at",
  to_char(pg_catalog.timezone('UTC', "records"."updated_at"), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "updated_at",
  "uploaded_at" IS NOT NULL AS uploaded,
  "stored_at" IS NOT NULL AS stored,
  "processed_at" IS NOT NULL AS processed,
  "created_by_id" AS "created_by_id",
  "updated_by_id" AS "updated_by_id",
  "form_id" AS "form_id",
  "record_id" AS "record_id",
  "content_type" AS "content_type",
  "file_size" AS "file_size",
  "metadata" AS "metadata",
  NULL AS "created_by",
  NULL AS "updated_by",
  "track" AS "track"
FROM "videos" AS "records"
WHERE
  "records".updated_at > '${sequenceString}'
ORDER BY
  "records".updated_at ASC
LIMIT ${limit} OFFSET 0
`;
  }
}
