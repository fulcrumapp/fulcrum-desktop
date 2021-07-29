"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _client = _interopRequireDefault(require("../../api/client"));

var _form = _interopRequireDefault(require("../../models/form"));

var _schema = _interopRequireDefault(require("fulcrum-schema/dist/schema"));

var _metadata = _interopRequireDefault(require("fulcrum-schema/dist/metadata"));

var _postgresQueryV = _interopRequireDefault(require("fulcrum-schema/dist/schemas/postgres-query-v2"));

var _sqldiff = _interopRequireDefault(require("sqldiff"));

var _downloadResource = _interopRequireDefault(require("./download-resource"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  SchemaDiffer,
  Sqlite
} = _sqldiff.default;

class DownloadForms extends _downloadResource.default {
  get resourceName() {
    return 'forms';
  }

  get typeName() {
    return 'form';
  }

  fetchObjects(lastSync, sequence) {
    return _client.default.getForms(this.account);
  }

  fetchLocalObjects() {
    return this.account.findForms();
  }

  findOrCreate(database, attributes) {
    return _form.default.findOrCreate(database, {
      resource_id: attributes.id,
      account_id: this.account.rowID
    });
  }

  async process(object, attributes) {
    const isChanged = !object.isPersisted || attributes.version !== object.version;
    let oldForm = null;

    if (object.isPersisted) {
      oldForm = {
        id: object._id,
        row_id: object.rowID,
        name: object._name,
        elements: object._elementsJSON
      };
    }

    object.updateFromAPIAttributes(attributes);
    object._deletedAt = null;
    await this.db.transaction(async db => {
      await object.save({
        db
      });
      const newForm = {
        id: object.id,
        row_id: object.rowID,
        name: object._name,
        elements: object._elementsJSON
      };
      const statements = await this.updateFormTables(db, oldForm, newForm);

      if (isChanged) {
        await this.triggerEvent('save', {
          form: object,
          account: this.account,
          statements,
          oldForm,
          newForm
        });
      }
    });
  }

  async updateFormTables(db, oldForm, newForm) {
    let oldSchema = null;
    let newSchema = null;

    if (oldForm) {
      oldSchema = new _schema.default(oldForm, _postgresQueryV.default, null);
    }

    if (newForm) {
      newSchema = new _schema.default(newForm, _postgresQueryV.default, null);
    }

    const tablePrefix = 'account_' + this.account.rowID + '_';
    const differ = new SchemaDiffer(oldSchema, newSchema);
    const meta = new _metadata.default(differ, {
      tablePrefix,
      quote: '`',
      includeColumns: true
    });
    const generator = new Sqlite(differ, {
      afterTransform: meta.build.bind(meta)
    });
    generator.tablePrefix = tablePrefix;
    const statements = generator.generate();

    for (const statement of statements) {
      await db.execute(statement);
    }

    return statements;
  }

}

exports.default = DownloadForms;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zeW5jL3Rhc2tzL2Rvd25sb2FkLWZvcm1zLmpzIl0sIm5hbWVzIjpbIlNjaGVtYURpZmZlciIsIlNxbGl0ZSIsInNxbGRpZmYiLCJEb3dubG9hZEZvcm1zIiwiRG93bmxvYWRSZXNvdXJjZSIsInJlc291cmNlTmFtZSIsInR5cGVOYW1lIiwiZmV0Y2hPYmplY3RzIiwibGFzdFN5bmMiLCJzZXF1ZW5jZSIsIkNsaWVudCIsImdldEZvcm1zIiwiYWNjb3VudCIsImZldGNoTG9jYWxPYmplY3RzIiwiZmluZEZvcm1zIiwiZmluZE9yQ3JlYXRlIiwiZGF0YWJhc2UiLCJhdHRyaWJ1dGVzIiwiRm9ybSIsInJlc291cmNlX2lkIiwiaWQiLCJhY2NvdW50X2lkIiwicm93SUQiLCJwcm9jZXNzIiwib2JqZWN0IiwiaXNDaGFuZ2VkIiwiaXNQZXJzaXN0ZWQiLCJ2ZXJzaW9uIiwib2xkRm9ybSIsIl9pZCIsInJvd19pZCIsIm5hbWUiLCJfbmFtZSIsImVsZW1lbnRzIiwiX2VsZW1lbnRzSlNPTiIsInVwZGF0ZUZyb21BUElBdHRyaWJ1dGVzIiwiX2RlbGV0ZWRBdCIsImRiIiwidHJhbnNhY3Rpb24iLCJzYXZlIiwibmV3Rm9ybSIsInN0YXRlbWVudHMiLCJ1cGRhdGVGb3JtVGFibGVzIiwidHJpZ2dlckV2ZW50IiwiZm9ybSIsIm9sZFNjaGVtYSIsIm5ld1NjaGVtYSIsIlNjaGVtYSIsIlYyIiwidGFibGVQcmVmaXgiLCJkaWZmZXIiLCJtZXRhIiwiTWV0YWRhdGEiLCJxdW90ZSIsImluY2x1ZGVDb2x1bW5zIiwiZ2VuZXJhdG9yIiwiYWZ0ZXJUcmFuc2Zvcm0iLCJidWlsZCIsImJpbmQiLCJnZW5lcmF0ZSIsInN0YXRlbWVudCIsImV4ZWN1dGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUVBLE1BQU07QUFBQ0EsRUFBQUEsWUFBRDtBQUFlQyxFQUFBQTtBQUFmLElB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QWE7QUFDWE0sTUFBQUEsU0FBUyxHQUFHLElBQUlDLGVBQUosQ0FBV1AsT0FBWCxFQUFvQlEsdUJBQXBCLEVBQXdCLElBQXhCLENBQVo7QUFDRDs7QUFFRCxVQUFNQyxXQUFXLEdBQUcsYUFBYSxLQUFLckMsT0FBTCxDQUFhVSxLQUExQixHQUFrQyxHQUF0RDtBQUVBLFVBQU00QixNQUFNLEdBQUcsSUFBSWxELFlBQUosQ0FBaUI2QyxTQUFqQixFQUE0QkMsU0FBNUIsQ0FBZjtBQUVBLFVBQU1LLElBQUksR0FBRyxJQUFJQyxpQkFBSixDQUFhRixNQUFiLEVBQXFCO0FBQUNELE1BQUFBLFdBQUQ7QUFBY0ksTUFBQUEsS0FBSyxFQUFFLEdBQXJCO0FBQTBCQyxNQUFBQSxjQUFjLEVBQUU7QUFBMUMsS0FBckIsQ0FBYjtBQUVBLFVBQU1DLFNBQVMsR0FBRyxJQUFJdEQsTUFBSixDQUFXaUQsTUFBWCxFQUFtQjtBQUFDTSxNQUFBQSxjQUFjLEVBQUVMLElBQUksQ0FBQ00sS0FBTCxDQUFXQyxJQUFYLENBQWdCUCxJQUFoQjtBQUFqQixLQUFuQixDQUFsQjtBQUVBSSxJQUFBQSxTQUFTLENBQUNOLFdBQVYsR0FBd0JBLFdBQXhCO0FBRUEsVUFBTVIsVUFBVSxHQUFHYyxTQUFTLENBQUNJLFFBQVYsRUFBbkI7O0FBRUEsU0FBSyxNQUFNQyxTQUFYLElBQXdCbkIsVUFBeEIsRUFBb0M7QUFDbEMsWUFBTUosRUFBRSxDQUFDd0IsT0FBSCxDQUFXRCxTQUFYLENBQU47QUFDRDs7QUFFRCxXQUFPbkIsVUFBUDtBQUNEOztBQXJGeUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2xpZW50IGZyb20gJy4uLy4uL2FwaS9jbGllbnQnO1xuaW1wb3J0IEZvcm0gZnJvbSAnLi4vLi4vbW9kZWxzL2Zvcm0nO1xuaW1wb3J0IFNjaGVtYSBmcm9tICdmdWxjcnVtLXNjaGVtYS9kaXN0L3NjaGVtYSc7XG5pbXBvcnQgTWV0YWRhdGEgZnJvbSAnZnVsY3J1bS1zY2hlbWEvZGlzdC9tZXRhZGF0YSc7XG5pbXBvcnQgVjIgZnJvbSAnZnVsY3J1bS1zY2hlbWEvZGlzdC9zY2hlbWFzL3Bvc3RncmVzLXF1ZXJ5LXYyJztcbmltcG9ydCBzcWxkaWZmIGZyb20gJ3NxbGRpZmYnO1xuaW1wb3J0IERvd25sb2FkUmVzb3VyY2UgZnJvbSAnLi9kb3dubG9hZC1yZXNvdXJjZSc7XG5cbmNvbnN0IHtTY2hlbWFEaWZmZXIsIFNxbGl0ZX0gPSBzcWxkaWZmO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3dubG9hZEZvcm1zIGV4dGVuZHMgRG93bmxvYWRSZXNvdXJjZSB7XG4gIGdldCByZXNvdXJjZU5hbWUoKSB7XG4gICAgcmV0dXJuICdmb3Jtcyc7XG4gIH1cblxuICBnZXQgdHlwZU5hbWUoKSB7XG4gICAgcmV0dXJuICdmb3JtJztcbiAgfVxuXG4gIGZldGNoT2JqZWN0cyhsYXN0U3luYywgc2VxdWVuY2UpIHtcbiAgICByZXR1cm4gQ2xpZW50LmdldEZvcm1zKHRoaXMuYWNjb3VudCk7XG4gIH1cblxuICBmZXRjaExvY2FsT2JqZWN0cygpIHtcbiAgICByZXR1cm4gdGhpcy5hY2NvdW50LmZpbmRGb3JtcygpO1xuICB9XG5cbiAgZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCBhdHRyaWJ1dGVzKSB7XG4gICAgcmV0dXJuIEZvcm0uZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCB7cmVzb3VyY2VfaWQ6IGF0dHJpYnV0ZXMuaWQsIGFjY291bnRfaWQ6IHRoaXMuYWNjb3VudC5yb3dJRH0pO1xuICB9XG5cbiAgYXN5bmMgcHJvY2VzcyhvYmplY3QsIGF0dHJpYnV0ZXMpIHtcbiAgICBjb25zdCBpc0NoYW5nZWQgPSAhb2JqZWN0LmlzUGVyc2lzdGVkIHx8IGF0dHJpYnV0ZXMudmVyc2lvbiAhPT0gb2JqZWN0LnZlcnNpb247XG5cbiAgICBsZXQgb2xkRm9ybSA9IG51bGw7XG5cbiAgICBpZiAob2JqZWN0LmlzUGVyc2lzdGVkKSB7XG4gICAgICBvbGRGb3JtID0ge1xuICAgICAgICBpZDogb2JqZWN0Ll9pZCxcbiAgICAgICAgcm93X2lkOiBvYmplY3Qucm93SUQsXG4gICAgICAgIG5hbWU6IG9iamVjdC5fbmFtZSxcbiAgICAgICAgZWxlbWVudHM6IG9iamVjdC5fZWxlbWVudHNKU09OXG4gICAgICB9O1xuICAgIH1cblxuICAgIG9iamVjdC51cGRhdGVGcm9tQVBJQXR0cmlidXRlcyhhdHRyaWJ1dGVzKTtcbiAgICBvYmplY3QuX2RlbGV0ZWRBdCA9IG51bGw7XG5cbiAgICBhd2FpdCB0aGlzLmRiLnRyYW5zYWN0aW9uKGFzeW5jIChkYikgPT4ge1xuICAgICAgYXdhaXQgb2JqZWN0LnNhdmUoe2RifSk7XG5cbiAgICAgIGNvbnN0IG5ld0Zvcm0gPSB7XG4gICAgICAgIGlkOiBvYmplY3QuaWQsXG4gICAgICAgIHJvd19pZDogb2JqZWN0LnJvd0lELFxuICAgICAgICBuYW1lOiBvYmplY3QuX25hbWUsXG4gICAgICAgIGVsZW1lbnRzOiBvYmplY3QuX2VsZW1lbnRzSlNPTlxuICAgICAgfTtcblxuICAgICAgY29uc3Qgc3RhdGVtZW50cyA9IGF3YWl0IHRoaXMudXBkYXRlRm9ybVRhYmxlcyhkYiwgb2xkRm9ybSwgbmV3Rm9ybSk7XG5cbiAgICAgIGlmIChpc0NoYW5nZWQpIHtcbiAgICAgICAgYXdhaXQgdGhpcy50cmlnZ2VyRXZlbnQoJ3NhdmUnLCB7Zm9ybTogb2JqZWN0LCBhY2NvdW50OiB0aGlzLmFjY291bnQsIHN0YXRlbWVudHMsIG9sZEZvcm0sIG5ld0Zvcm19KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVwZGF0ZUZvcm1UYWJsZXMoZGIsIG9sZEZvcm0sIG5ld0Zvcm0pIHtcbiAgICBsZXQgb2xkU2NoZW1hID0gbnVsbDtcbiAgICBsZXQgbmV3U2NoZW1hID0gbnVsbDtcblxuICAgIGlmIChvbGRGb3JtKSB7XG4gICAgICBvbGRTY2hlbWEgPSBuZXcgU2NoZW1hKG9sZEZvcm0sIFYyLCBudWxsKTtcbiAgICB9XG5cbiAgICBpZiAobmV3Rm9ybSkge1xuICAgICAgbmV3U2NoZW1hID0gbmV3IFNjaGVtYShuZXdGb3JtLCBWMiwgbnVsbCk7XG4gICAgfVxuXG4gICAgY29uc3QgdGFibGVQcmVmaXggPSAnYWNjb3VudF8nICsgdGhpcy5hY2NvdW50LnJvd0lEICsgJ18nO1xuXG4gICAgY29uc3QgZGlmZmVyID0gbmV3IFNjaGVtYURpZmZlcihvbGRTY2hlbWEsIG5ld1NjaGVtYSk7XG5cbiAgICBjb25zdCBtZXRhID0gbmV3IE1ldGFkYXRhKGRpZmZlciwge3RhYmxlUHJlZml4LCBxdW90ZTogJ2AnLCBpbmNsdWRlQ29sdW1uczogdHJ1ZX0pO1xuXG4gICAgY29uc3QgZ2VuZXJhdG9yID0gbmV3IFNxbGl0ZShkaWZmZXIsIHthZnRlclRyYW5zZm9ybTogbWV0YS5idWlsZC5iaW5kKG1ldGEpfSk7XG5cbiAgICBnZW5lcmF0b3IudGFibGVQcmVmaXggPSB0YWJsZVByZWZpeDtcblxuICAgIGNvbnN0IHN0YXRlbWVudHMgPSBnZW5lcmF0b3IuZ2VuZXJhdGUoKTtcblxuICAgIGZvciAoY29uc3Qgc3RhdGVtZW50IG9mIHN0YXRlbWVudHMpIHtcbiAgICAgIGF3YWl0IGRiLmV4ZWN1dGUoc3RhdGVtZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGVtZW50cztcbiAgfVxufVxuIl19