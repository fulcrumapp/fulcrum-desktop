"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _downloadQuerySequence = _interopRequireDefault(require("./download-query-sequence"));

var _video = _interopRequireDefault(require("../../models/video"));

var _fulcrumCore = require("fulcrum-core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DownloadVideos extends _downloadQuerySequence.default {
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
    return _video.default.findOrCreate(database, {
      account_id: this.account.rowID,
      resource_id: attributes.access_key
    });
  }

  async process(object, attributes) {
    const isChanged = !object.isPersisted || _fulcrumCore.DateUtils.parseISOTimestamp(attributes.updated_at).getTime() !== object.updatedAt.getTime();
    object.updateFromAPIAttributes(attributes);

    if (object.isDownloaded == null) {
      object.isDownloaded = false;
    }

    await this.lookup(object, attributes.form_id, '_formRowID', 'getForm');
    await this.lookup(object, attributes.created_by_id, '_createdByRowID', 'getUser');
    await this.lookup(object, attributes.updated_by_id, '_updatedByRowID', 'getUser');

    if (object._formRowID) {
      const record = await this.account.findFirstRecord({
        resource_id: attributes.record_id
      });

      if (record) {
        object._recordRowID = record.rowID;
      }
    }

    this.account._lastSyncVideos = object._updatedAt;
    await object.save();

    if (isChanged) {
      await this.trigger('video:save', {
        video: object
      });
    }
  }

  convertTrack(track) {
    // convert a V1 style track to a V2 style track
    if (Array.isArray(track)) {
      return {
        tracks: [{
          track
        }]
      };
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

exports.default = DownloadVideos;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtdmlkZW9zLmpzIl0sIm5hbWVzIjpbIkRvd25sb2FkVmlkZW9zIiwiRG93bmxvYWRRdWVyeVNlcXVlbmNlIiwicmVzb3VyY2VOYW1lIiwidHlwZU5hbWUiLCJsYXN0U3luYyIsImFjY291bnQiLCJfbGFzdFN5bmNWaWRlb3MiLCJ1c2VSZXN0QVBJIiwiZmluZE9yQ3JlYXRlIiwiZGF0YWJhc2UiLCJhdHRyaWJ1dGVzIiwiVmlkZW8iLCJhY2NvdW50X2lkIiwicm93SUQiLCJyZXNvdXJjZV9pZCIsImFjY2Vzc19rZXkiLCJwcm9jZXNzIiwib2JqZWN0IiwiaXNDaGFuZ2VkIiwiaXNQZXJzaXN0ZWQiLCJEYXRlVXRpbHMiLCJwYXJzZUlTT1RpbWVzdGFtcCIsInVwZGF0ZWRfYXQiLCJnZXRUaW1lIiwidXBkYXRlZEF0IiwidXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMiLCJpc0Rvd25sb2FkZWQiLCJsb29rdXAiLCJmb3JtX2lkIiwiY3JlYXRlZF9ieV9pZCIsInVwZGF0ZWRfYnlfaWQiLCJfZm9ybVJvd0lEIiwicmVjb3JkIiwiZmluZEZpcnN0UmVjb3JkIiwicmVjb3JkX2lkIiwiX3JlY29yZFJvd0lEIiwiX3VwZGF0ZWRBdCIsInNhdmUiLCJ0cmlnZ2VyIiwidmlkZW8iLCJjb252ZXJ0VHJhY2siLCJ0cmFjayIsIkFycmF5IiwiaXNBcnJheSIsInRyYWNrcyIsImF0dHJpYnV0ZXNGb3JRdWVyeVJvdyIsInJvdyIsImNyZWF0ZWRfYXQiLCJ1cGxvYWRlZCIsInN0b3JlZCIsInByb2Nlc3NlZCIsImNvbnRlbnRfdHlwZSIsImZpbGVfc2l6ZSIsIm1ldGFkYXRhIiwiSlNPTiIsInBhcnNlIiwiY3JlYXRlZF9ieSIsInVwZGF0ZWRfYnkiLCJnZW5lcmF0ZVF1ZXJ5Iiwic2VxdWVuY2UiLCJsaW1pdCIsInNlcXVlbmNlU3RyaW5nIiwiRGF0ZSIsInRvSVNPU3RyaW5nIl0sIm1hcHBpbmdzIjoi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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEJGLGNBQWU7QUFDM0M7QUFDQTtBQUNBLFFBQVFELEtBQU07QUFDZCxDQXhCSTtBQXlCRDs7QUE5RytEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERvd25sb2FkUXVlcnlTZXF1ZW5jZSBmcm9tICcuL2Rvd25sb2FkLXF1ZXJ5LXNlcXVlbmNlJztcbmltcG9ydCBWaWRlbyBmcm9tICcuLi8uLi9tb2RlbHMvdmlkZW8nO1xuaW1wb3J0IHsgRGF0ZVV0aWxzIH0gZnJvbSAnZnVsY3J1bS1jb3JlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG93bmxvYWRWaWRlb3MgZXh0ZW5kcyBEb3dubG9hZFF1ZXJ5U2VxdWVuY2Uge1xuICBnZXQgcmVzb3VyY2VOYW1lKCkge1xuICAgIHJldHVybiAndmlkZW9zJztcbiAgfVxuXG4gIGdldCB0eXBlTmFtZSgpIHtcbiAgICByZXR1cm4gJ3ZpZGVvJztcbiAgfVxuXG4gIGdldCBsYXN0U3luYygpIHtcbiAgICByZXR1cm4gdGhpcy5hY2NvdW50Ll9sYXN0U3luY1ZpZGVvcztcbiAgfVxuXG4gIGdldCB1c2VSZXN0QVBJKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZpbmRPckNyZWF0ZShkYXRhYmFzZSwgYXR0cmlidXRlcykge1xuICAgIHJldHVybiBWaWRlby5maW5kT3JDcmVhdGUoZGF0YWJhc2UsIHthY2NvdW50X2lkOiB0aGlzLmFjY291bnQucm93SUQsIHJlc291cmNlX2lkOiBhdHRyaWJ1dGVzLmFjY2Vzc19rZXl9KTtcbiAgfVxuXG4gIGFzeW5jIHByb2Nlc3Mob2JqZWN0LCBhdHRyaWJ1dGVzKSB7XG4gICAgY29uc3QgaXNDaGFuZ2VkID0gIW9iamVjdC5pc1BlcnNpc3RlZCB8fFxuICAgICAgICAgICAgICAgICAgICAgIERhdGVVdGlscy5wYXJzZUlTT1RpbWVzdGFtcChhdHRyaWJ1dGVzLnVwZGF0ZWRfYXQpLmdldFRpbWUoKSAhPT0gb2JqZWN0LnVwZGF0ZWRBdC5nZXRUaW1lKCk7XG5cbiAgICBvYmplY3QudXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMoYXR0cmlidXRlcyk7XG5cbiAgICBpZiAob2JqZWN0LmlzRG93bmxvYWRlZCA9PSBudWxsKSB7XG4gICAgICBvYmplY3QuaXNEb3dubG9hZGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLmZvcm1faWQsICdfZm9ybVJvd0lEJywgJ2dldEZvcm0nKTtcbiAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMuY3JlYXRlZF9ieV9pZCwgJ19jcmVhdGVkQnlSb3dJRCcsICdnZXRVc2VyJyk7XG4gICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLnVwZGF0ZWRfYnlfaWQsICdfdXBkYXRlZEJ5Um93SUQnLCAnZ2V0VXNlcicpO1xuXG4gICAgaWYgKG9iamVjdC5fZm9ybVJvd0lEKSB7XG4gICAgICBjb25zdCByZWNvcmQgPSBhd2FpdCB0aGlzLmFjY291bnQuZmluZEZpcnN0UmVjb3JkKHtyZXNvdXJjZV9pZDogYXR0cmlidXRlcy5yZWNvcmRfaWR9KTtcblxuICAgICAgaWYgKHJlY29yZCkge1xuICAgICAgICBvYmplY3QuX3JlY29yZFJvd0lEID0gcmVjb3JkLnJvd0lEO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYWNjb3VudC5fbGFzdFN5bmNWaWRlb3MgPSBvYmplY3QuX3VwZGF0ZWRBdDtcblxuICAgIGF3YWl0IG9iamVjdC5zYXZlKCk7XG5cbiAgICBpZiAoaXNDaGFuZ2VkKSB7XG4gICAgICBhd2FpdCB0aGlzLnRyaWdnZXIoJ3ZpZGVvOnNhdmUnLCB7dmlkZW86IG9iamVjdH0pO1xuICAgIH1cbiAgfVxuXG4gIGNvbnZlcnRUcmFjayh0cmFjaykge1xuICAgIC8vIGNvbnZlcnQgYSBWMSBzdHlsZSB0cmFjayB0byBhIFYyIHN0eWxlIHRyYWNrXG4gICAgaWYgKEFycmF5LmlzQXJyYXkodHJhY2spKSB7XG4gICAgICByZXR1cm4geyB0cmFja3M6IFsgeyB0cmFjayB9IF0gfTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJhY2s7XG4gIH1cblxuICBhdHRyaWJ1dGVzRm9yUXVlcnlSb3cocm93KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjY2Vzc19rZXk6IHJvd1swXSxcbiAgICAgIGNyZWF0ZWRfYXQ6IHJvd1sxXSxcbiAgICAgIHVwZGF0ZWRfYXQ6IHJvd1syXSxcbiAgICAgIHVwbG9hZGVkOiByb3dbM10sXG4gICAgICBzdG9yZWQ6IHJvd1s0XSxcbiAgICAgIHByb2Nlc3NlZDogcm93WzVdLFxuICAgICAgY3JlYXRlZF9ieV9pZDogcm93WzZdLFxuICAgICAgdXBkYXRlZF9ieV9pZDogcm93WzddLFxuICAgICAgZm9ybV9pZDogcm93WzhdLFxuICAgICAgcmVjb3JkX2lkOiByb3dbOV0sXG4gICAgICBjb250ZW50X3R5cGU6IHJvd1sxMF0sXG4gICAgICBmaWxlX3NpemU6IHJvd1sxMV0sXG4gICAgICBtZXRhZGF0YTogcm93WzEyXSAmJiBKU09OLnBhcnNlKHJvd1sxMl0pLFxuICAgICAgY3JlYXRlZF9ieTogcm93WzEzXSxcbiAgICAgIHVwZGF0ZWRfYnk6IHJvd1sxNF0sXG4gICAgICB0cmFjazogcm93WzE1XSAmJiB0aGlzLmNvbnZlcnRUcmFjayhKU09OLnBhcnNlKHJvd1sxNV0pKVxuICAgIH07XG4gIH1cblxuICBnZW5lcmF0ZVF1ZXJ5KHNlcXVlbmNlLCBsaW1pdCkge1xuICAgIGNvbnN0IHNlcXVlbmNlU3RyaW5nID0gbmV3IERhdGUoK3NlcXVlbmNlKS50b0lTT1N0cmluZygpO1xuXG4gICAgcmV0dXJuIGBcblNFTEVDVFxuICBcInZpZGVvX2lkXCIgQVMgXCJhY2Nlc3Nfa2V5XCIsXG4gIHRvX2NoYXIocGdfY2F0YWxvZy50aW1lem9uZSgnVVRDJywgXCJyZWNvcmRzXCIuXCJjcmVhdGVkX2F0XCIpLCAnWVlZWS1NTS1ERFwiVFwiSEgyNDpNSTpTU1wiWlwiJykgQVMgXCJjcmVhdGVkX2F0XCIsXG4gIHRvX2NoYXIocGdfY2F0YWxvZy50aW1lem9uZSgnVVRDJywgXCJyZWNvcmRzXCIuXCJ1cGRhdGVkX2F0XCIpLCAnWVlZWS1NTS1ERFwiVFwiSEgyNDpNSTpTU1wiWlwiJykgQVMgXCJ1cGRhdGVkX2F0XCIsXG4gIFwidXBsb2FkZWRfYXRcIiBJUyBOT1QgTlVMTCBBUyB1cGxvYWRlZCxcbiAgXCJzdG9yZWRfYXRcIiBJUyBOT1QgTlVMTCBBUyBzdG9yZWQsXG4gIFwicHJvY2Vzc2VkX2F0XCIgSVMgTk9UIE5VTEwgQVMgcHJvY2Vzc2VkLFxuICBcImNyZWF0ZWRfYnlfaWRcIiBBUyBcImNyZWF0ZWRfYnlfaWRcIixcbiAgXCJ1cGRhdGVkX2J5X2lkXCIgQVMgXCJ1cGRhdGVkX2J5X2lkXCIsXG4gIFwiZm9ybV9pZFwiIEFTIFwiZm9ybV9pZFwiLFxuICBcInJlY29yZF9pZFwiIEFTIFwicmVjb3JkX2lkXCIsXG4gIFwiY29udGVudF90eXBlXCIgQVMgXCJjb250ZW50X3R5cGVcIixcbiAgXCJmaWxlX3NpemVcIiBBUyBcImZpbGVfc2l6ZVwiLFxuICBcIm1ldGFkYXRhXCIgQVMgXCJtZXRhZGF0YVwiLFxuICBOVUxMIEFTIFwiY3JlYXRlZF9ieVwiLFxuICBOVUxMIEFTIFwidXBkYXRlZF9ieVwiLFxuICBcInRyYWNrXCIgQVMgXCJ0cmFja1wiXG5GUk9NIFwidmlkZW9zXCIgQVMgXCJyZWNvcmRzXCJcbldIRVJFXG4gIFwicmVjb3Jkc1wiLnVwZGF0ZWRfYXQgPiAnJHtzZXF1ZW5jZVN0cmluZ30nXG5PUkRFUiBCWVxuICBcInJlY29yZHNcIi51cGRhdGVkX2F0IEFTQ1xuTElNSVQgJHtsaW1pdH0gT0ZGU0VUIDBcbmA7XG4gIH1cbn1cbiJdfQ==