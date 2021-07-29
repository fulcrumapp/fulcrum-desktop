"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _downloadQuerySequence = _interopRequireDefault(require("./download-query-sequence"));

var _signature = _interopRequireDefault(require("../../models/signature"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DownloadSignatures extends _downloadQuerySequence.default {
  get resourceName() {
    return 'signatures';
  }

  get typeName() {
    return 'signature';
  }

  get lastSync() {
    return this.account._lastSyncSignatures;
  }

  get useRestAPI() {
    return false;
  }

  findOrCreate(database, attributes) {
    return _signature.default.findOrCreate(database, {
      account_id: this.account.rowID,
      resource_id: attributes.access_key
    });
  }

  async loadObject(object, attributes) {
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

    this.account._lastSyncSignatures = object._updatedAt;
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
      created_by: row[12],
      updated_by: row[13]
    };
  }

  generateQuery(sequence, limit) {
    const sequenceString = new Date(+sequence).toISOString();
    return `
SELECT
  "signature_id" AS "access_key",
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
  NULL AS "created_by",
  NULL AS "updated_by"
FROM "signatures" AS "records"
WHERE
  "records".updated_at > '${sequenceString}'
ORDER BY
  "records".updated_at ASC
LIMIT ${limit} OFFSET 0
`;
  }

}

exports.default = DownloadSignatures;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zeW5jL3Rhc2tzL2Rvd25sb2FkLXNpZ25hdHVyZXMuanMiXSwibmFtZXMiOlsiRG93bmxvYWRTaWduYXR1cmVzIiwiRG93bmxvYWRRdWVyeVNlcXVlbmNlIiwicmVzb3VyY2VOYW1lIiwidHlwZU5hbWUiLCJsYXN0U3luYyIsImFjY291bnQiLCJfbGFzdFN5bmNTaWduYXR1cmVzIiwidXNlUmVzdEFQSSIsImZpbmRPckNyZWF0ZSIsImRhdGFiYXNlIiwiYXR0cmlidXRlcyIsIlNpZ25hdHVyZSIsImFjY291bnRfaWQiLCJyb3dJRCIsInJlc291cmNlX2lkIiwiYWNjZXNzX2tleSIsImxvYWRPYmplY3QiLCJvYmplY3QiLCJpc0Rvd25sb2FkZWQiLCJsb29rdXAiLCJmb3JtX2lkIiwiY3JlYXRlZF9ieV9pZCIsInVwZGF0ZWRfYnlfaWQiLCJfZm9ybVJvd0lEIiwicmVjb3JkIiwiZmluZEZpcnN0UmVjb3JkIiwicmVjb3JkX2lkIiwiX3JlY29yZFJvd0lEIiwiX3VwZGF0ZWRBdCIsImF0dHJpYnV0ZXNGb3JRdWVyeVJvdyIsInJvdyIsImNyZWF0ZWRfYXQiLCJ1cGRhdGVkX2F0IiwidXBsb2FkZWQiLCJzdG9yZWQiLCJwcm9jZXNzZWQiLCJjb250ZW50X3R5cGUiLCJmaWxlX3NpemUiLCJjcmVhdGVkX2J5IiwidXBkYXRlZF9ieSIsImdlbmVyYXRlUXVlcnkiLCJzZXF1ZW5jZSIsImxpbWl0Iiwic2VxdWVuY2VTdHJpbmciLCJEYXRlIiwidG9JU09TdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUVlLE1BQU1BLGtCQUFOLFNBQWlDQyw4QkFBakMsQ0FBdUQ7QUFDcEQsTUFBWkMsWUFBWSxHQUFHO0FBQ2pCLFdBQU8sWUFBUDtBQUNEOztBQUVXLE1BQVJDLFFBQVEsR0FBRztBQUNiLFdBQU8sV0FBUDtBQUNEOztBQUVXLE1BQVJDLFFBQVEsR0FBRztBQUNiLFdBQU8sS0FBS0MsT0FBTCxDQUFhQyxtQkFB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NEJGLGNBQWU7QUFDM0M7QUFDQTtBQUNBLFFBQVFELEtBQU07QUFDZCxDQXRCSTtBQXVCRDs7QUF0Rm1FIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERvd25sb2FkUXVlcnlTZXF1ZW5jZSBmcm9tICcuL2Rvd25sb2FkLXF1ZXJ5LXNlcXVlbmNlJztcbmltcG9ydCBTaWduYXR1cmUgZnJvbSAnLi4vLi4vbW9kZWxzL3NpZ25hdHVyZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvd25sb2FkU2lnbmF0dXJlcyBleHRlbmRzIERvd25sb2FkUXVlcnlTZXF1ZW5jZSB7XG4gIGdldCByZXNvdXJjZU5hbWUoKSB7XG4gICAgcmV0dXJuICdzaWduYXR1cmVzJztcbiAgfVxuXG4gIGdldCB0eXBlTmFtZSgpIHtcbiAgICByZXR1cm4gJ3NpZ25hdHVyZSc7XG4gIH1cblxuICBnZXQgbGFzdFN5bmMoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWNjb3VudC5fbGFzdFN5bmNTaWduYXR1cmVzO1xuICB9XG5cbiAgZ2V0IHVzZVJlc3RBUEkoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCBhdHRyaWJ1dGVzKSB7XG4gICAgcmV0dXJuIFNpZ25hdHVyZS5maW5kT3JDcmVhdGUoZGF0YWJhc2UsIHthY2NvdW50X2lkOiB0aGlzLmFjY291bnQucm93SUQsIHJlc291cmNlX2lkOiBhdHRyaWJ1dGVzLmFjY2Vzc19rZXl9KTtcbiAgfVxuXG4gIGFzeW5jIGxvYWRPYmplY3Qob2JqZWN0LCBhdHRyaWJ1dGVzKSB7XG4gICAgaWYgKG9iamVjdC5pc0Rvd25sb2FkZWQgPT0gbnVsbCkge1xuICAgICAgb2JqZWN0LmlzRG93bmxvYWRlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy5mb3JtX2lkLCAnX2Zvcm1Sb3dJRCcsICdnZXRGb3JtJyk7XG4gICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLmNyZWF0ZWRfYnlfaWQsICdfY3JlYXRlZEJ5Um93SUQnLCAnZ2V0VXNlcicpO1xuICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy51cGRhdGVkX2J5X2lkLCAnX3VwZGF0ZWRCeVJvd0lEJywgJ2dldFVzZXInKTtcblxuICAgIGlmIChvYmplY3QuX2Zvcm1Sb3dJRCkge1xuICAgICAgY29uc3QgcmVjb3JkID0gYXdhaXQgdGhpcy5hY2NvdW50LmZpbmRGaXJzdFJlY29yZCh7cmVzb3VyY2VfaWQ6IGF0dHJpYnV0ZXMucmVjb3JkX2lkfSk7XG5cbiAgICAgIGlmIChyZWNvcmQpIHtcbiAgICAgICAgb2JqZWN0Ll9yZWNvcmRSb3dJRCA9IHJlY29yZC5yb3dJRDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmFjY291bnQuX2xhc3RTeW5jU2lnbmF0dXJlcyA9IG9iamVjdC5fdXBkYXRlZEF0O1xuICB9XG5cbiAgYXR0cmlidXRlc0ZvclF1ZXJ5Um93KHJvdykge1xuICAgIHJldHVybiB7XG4gICAgICBhY2Nlc3Nfa2V5OiByb3dbMF0sXG4gICAgICBjcmVhdGVkX2F0OiByb3dbMV0sXG4gICAgICB1cGRhdGVkX2F0OiByb3dbMl0sXG4gICAgICB1cGxvYWRlZDogcm93WzNdLFxuICAgICAgc3RvcmVkOiByb3dbNF0sXG4gICAgICBwcm9jZXNzZWQ6IHJvd1s1XSxcbiAgICAgIGNyZWF0ZWRfYnlfaWQ6IHJvd1s2XSxcbiAgICAgIHVwZGF0ZWRfYnlfaWQ6IHJvd1s3XSxcbiAgICAgIGZvcm1faWQ6IHJvd1s4XSxcbiAgICAgIHJlY29yZF9pZDogcm93WzldLFxuICAgICAgY29udGVudF90eXBlOiByb3dbMTBdLFxuICAgICAgZmlsZV9zaXplOiByb3dbMTFdLFxuICAgICAgY3JlYXRlZF9ieTogcm93WzEyXSxcbiAgICAgIHVwZGF0ZWRfYnk6IHJvd1sxM11cbiAgICB9O1xuICB9XG5cbiAgZ2VuZXJhdGVRdWVyeShzZXF1ZW5jZSwgbGltaXQpIHtcbiAgICBjb25zdCBzZXF1ZW5jZVN0cmluZyA9IG5ldyBEYXRlKCtzZXF1ZW5jZSkudG9JU09TdHJpbmcoKTtcblxuICAgIHJldHVybiBgXG5TRUxFQ1RcbiAgXCJzaWduYXR1cmVfaWRcIiBBUyBcImFjY2Vzc19rZXlcIixcbiAgdG9fY2hhcihwZ19jYXRhbG9nLnRpbWV6b25lKCdVVEMnLCBcInJlY29yZHNcIi5cImNyZWF0ZWRfYXRcIiksICdZWVlZLU1NLUREXCJUXCJISDI0Ok1JOlNTXCJaXCInKSBBUyBcImNyZWF0ZWRfYXRcIixcbiAgdG9fY2hhcihwZ19jYXRhbG9nLnRpbWV6b25lKCdVVEMnLCBcInJlY29yZHNcIi5cInVwZGF0ZWRfYXRcIiksICdZWVlZLU1NLUREXCJUXCJISDI0Ok1JOlNTXCJaXCInKSBBUyBcInVwZGF0ZWRfYXRcIixcbiAgXCJ1cGxvYWRlZF9hdFwiIElTIE5PVCBOVUxMIEFTIHVwbG9hZGVkLFxuICBcInN0b3JlZF9hdFwiIElTIE5PVCBOVUxMIEFTIHN0b3JlZCxcbiAgXCJwcm9jZXNzZWRfYXRcIiBJUyBOT1QgTlVMTCBBUyBwcm9jZXNzZWQsXG4gIFwiY3JlYXRlZF9ieV9pZFwiIEFTIFwiY3JlYXRlZF9ieV9pZFwiLFxuICBcInVwZGF0ZWRfYnlfaWRcIiBBUyBcInVwZGF0ZWRfYnlfaWRcIixcbiAgXCJmb3JtX2lkXCIgQVMgXCJmb3JtX2lkXCIsXG4gIFwicmVjb3JkX2lkXCIgQVMgXCJyZWNvcmRfaWRcIixcbiAgXCJjb250ZW50X3R5cGVcIiBBUyBcImNvbnRlbnRfdHlwZVwiLFxuICBcImZpbGVfc2l6ZVwiIEFTIFwiZmlsZV9zaXplXCIsXG4gIE5VTEwgQVMgXCJjcmVhdGVkX2J5XCIsXG4gIE5VTEwgQVMgXCJ1cGRhdGVkX2J5XCJcbkZST00gXCJzaWduYXR1cmVzXCIgQVMgXCJyZWNvcmRzXCJcbldIRVJFXG4gIFwicmVjb3Jkc1wiLnVwZGF0ZWRfYXQgPiAnJHtzZXF1ZW5jZVN0cmluZ30nXG5PUkRFUiBCWVxuICBcInJlY29yZHNcIi51cGRhdGVkX2F0IEFTQ1xuTElNSVQgJHtsaW1pdH0gT0ZGU0VUIDBcbmA7XG4gIH1cbn1cbiJdfQ==