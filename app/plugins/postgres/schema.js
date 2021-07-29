"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _schema = _interopRequireDefault(require("fulcrum-schema/dist/schema"));

var _metadata = _interopRequireDefault(require("fulcrum-schema/dist/metadata"));

var _sqldiff = _interopRequireDefault(require("sqldiff"));

var _postgresSchema = _interopRequireDefault(require("./postgres-schema"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  SchemaDiffer,
  Postgres
} = _sqldiff.default;

class PostgresSchema {
  static async generateSchemaStatements(account, oldForm, newForm, {
    disableArrays,
    disableComplexTypes,
    userModule,
    tableSchema,
    calculatedFieldDateFormat,
    metadata,
    useResourceID,
    accountPrefix
  }) {
    let oldSchema = null;
    let newSchema = null;
    _postgresSchema.default.disableArrays = disableArrays;
    _postgresSchema.default.disableComplexTypes = disableComplexTypes;
    _postgresSchema.default.calculatedFieldDateFormat = calculatedFieldDateFormat;

    if (userModule && userModule.updateSchema && !_postgresSchema.default._modified) {
      userModule.updateSchema(_postgresSchema.default);
      _postgresSchema.default._modified = true;
    }

    if (useResourceID) {
      if (oldForm) {
        oldForm = { ...oldForm,
          row_id: oldForm.id
        };
      }

      if (newForm) {
        newForm = { ...newForm,
          row_id: newForm.id
        };
      }
    }

    if (oldForm) {
      oldSchema = new _schema.default(oldForm, _postgresSchema.default, userModule && userModule.schemaOptions);
    }

    if (newForm) {
      newSchema = new _schema.default(newForm, _postgresSchema.default, userModule && userModule.schemaOptions);
    }

    const differ = new SchemaDiffer(oldSchema, newSchema);
    const meta = new _metadata.default(differ, {
      quote: '"',
      schema: tableSchema,
      prefix: 'system_',
      useAliases: false
    });
    const generator = new Postgres(differ, {
      afterTransform: metadata && meta.build.bind(meta)
    });
    generator.tablePrefix = accountPrefix != null ? accountPrefix + '_' : '';

    if (tableSchema) {
      generator.tableSchema = tableSchema;
    }

    const statements = generator.generate();
    return {
      statements,
      oldSchema,
      newSchema
    };
  }

}

exports.default = PostgresSchema;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wbHVnaW5zL3Bvc3RncmVzL3NjaGVtYS5qcyJdLCJuYW1lcyI6WyJTY2hlbWFEaWZmZXIiLCJQb3N0Z3JlcyIsInNxbGRpZmYiLCJQb3N0Z3Jlc1NjaGVtYSIsImdlbmVyYXRlU2NoZW1hU3RhdGVtZW50cyIsImFjY291bnQiLCJvbGRGb3JtIiwibmV3Rm9ybSIsImRpc2FibGVBcnJheXMiLCJkaXNhYmxlQ29tcGxleFR5cGVzIiwidXNlck1vZHVsZSIsInRhYmxlU2NoZW1hIiwiY2FsY3VsYXRlZEZpZWxkRGF0ZUZvcm1hdCIsIm1ldGFkYXRhIiwidXNlUmVzb3VyY2VJRCIsImFjY291bnRQcmVmaXgiLCJvbGRTY2hlbWEiLCJuZXdTY2hlbWEiLCJQR1NjaGVtYSIsInVwZGF0ZVNjaGVtYSIsIl9tb2RpZmllZCIsInJvd19pZCIsImlkIiwiU2NoZW1hIiwic2NoZW1hT3B0aW9ucyIsImRpZmZlciIsIm1ldGEiLCJNZXRhZGF0YSIsInF1b3RlIiwic2NoZW1hIiwicHJlZml4IiwidXNlQWxpYXNlcyIsImdlbmVyYXRvciIsImFmdGVyVHJhbnNmb3JtIiwiYnVpbGQiLCJiaW5kIiwidGFibGVQcmVmaXgiLCJzdGF0ZW1lbnRzIiwiZ2VuZXJhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUVBLE1BQU07QUFBQ0EsRUFBQUEsWUFBRDtBQUFlQyxFQUFBQTtBQUFmLElBQTJCQyxnQkFBakM7O0FBRWUsTUFBTUMsY0FBTixDQUFxQjtBQUNHLGVBQXhCQyx3QkFBd0IsQ0FBQ0MsT0FBRCxFQUFVQyxPQUFWLEVBQW1CQyxPQUFuQixFQUE0QjtBQUFDQyxJQUFBQSxhQUFEO0FBQWdCQyxJQUFBQSxtQkFBaEI7QUFBcUNDLElBQUFBLFVBQXJDO0FBQWlEQyxJQUFBQSxXQUFqRDtBQUE4REMsSUFBQUEseUJBQTlEO0FBQXlGQyxJQUFBQSxRQUF6RjtBQUFtR0MsSUFBQUEsYUFBbkc7QUFBa0hDLElBQUFBO0FBQWxILEdBQTVCLEVBQThKO0FBQ2pNLFFBQUlDLFNBQVMsR0FBRyxJQUFoQjtBQUNBLFFBQUlDLFNBQVMsR0FBRyxJQUFoQjtBQUVBQyw0QkFBU1YsYUFBVCxHQUF5QkEsYUFBekI7QUFDQVUsNEJBQVNULG1CQUFULEdBQStCQSxtQkFBL0I7QUFDQVMsNEJBQVNOLHlCQUFULEdBQXFDQSx5QkFBckM7O0FBRUEsUUFBSUYsVUFBVSxJQUFJQSxVQUFVLENBQUNTLFlBQXpCLElBQXlDLENBQUNELHdCQUFTRSxTQUF2RCxFQUFrRTtBQUNoRVYsTUFBQUEsVUFBVSxDQUFDUyxZQUFYLENBQXdCRCx1QkFBeEI7QUFFQUEsOEJBQVNFLFNBQVQsR0FBcUIsSUFBckI7QUFDRDs7QUFFRCxRQUFJTixhQUFKLEVBQW1CO0FBQ2pCLFVBQUlSLE9BQUosRUFBYTtBQUNYQSxRQUFBQSxPQUFPLEdBQUcsRUFBQyxHQUFHQSxPQUFKO0FBQWFlLFVBQUFBLE1BQU0sRUFBRWYsT0FBTyxDQUFDZ0I7QUFBN0IsU0FBVjtBQUNEOztBQUNELFVBQUlmLE9BQUosRUFBYTtBQUNYQSxRQUFBQSxPQUFPLEdBQUcsRUFBQyxHQUFHQSxPQUFKO0FBQWFjLFVBQUFBLE1BQU0sRUFBRWQsT0FBTyxDQUFDZTtBQUE3QixTQUFWO0FBQ0Q7QUFDRjs7QUFFRCxRQUFJaEIsT0FBSixFQUFhO0FBQ1hVLE1BQUFBLFNBQVMsR0FBRyxJQUFJTyxlQUFKLENBQVdqQixPQUFYLEVBQW9CWSx1QkFBcEIsRUFBOEJSLFVBQVUsSUFBSUEsVUFBVSxDQUFDYyxhQUF2RCxDQUFaO0FBQ0Q7O0FBRUQsUUFBSWpCLE9BQUosRUFBYTtBQUNYVSxNQUFBQSxTQUFTLEdBQUcsSUFBSU0sZUFBSixDQUFXaEIsT0FBWCxFQUFvQlcsdUJBQXBCLEVBQThCUixVQUFVLElBQUlBLFVBQVUsQ0FBQ2MsYUFBdkQsQ0FBWjtBQUNEOztBQUVELFVBQU1DLE1BQU0sR0FBRyxJQUFJekIsWUFBSixDQUFpQmdCLFNBQWpCLEVBQTRCQyxTQUE1QixDQUFmO0FBRUEsVUFBTVMsSUFBSSxHQUFHLElBQUlDLGlCQUFKLENBQWFGLE1BQWIsRUFBcUI7QUFBQ0csTUFBQUEsS0FBSyxFQUFFLEdBQVI7QUFBYUMsTUFBQUEsTUFBTSxFQUFFbEIsV0FBckI7QUFBa0NtQixNQUFBQSxNQUFNLEVBQUUsU0FBMUM7QUFBcURDLE1BQUFBLFVBQVUsRUFBRTtBQUFqRSxLQUFyQixDQUFiO0FBQ0EsVUFBTUMsU0FBUyxHQUFHLElBQUkvQixRQUFKLENBQWF3QixNQUFiLEVBQXFCO0FBQUNRLE1BQUFBLGNBQWMsRUFBRXBCLFFBQVEsSUFBSWEsSUFBSSxDQUFDUSxLQUFMLENBQVdDLElBQVgsQ0FBZ0JULElBQWhCO0FBQTdCLEtBQXJCLENBQWxCO0FBRUFNLElBQUFBLFNBQVMsQ0FBQ0ksV0FBVixHQUF3QnJCLGFBQWEsSUFBSSxJQUFqQixHQUF3QkEsYUFBYSxHQUFHLEdBQXhDLEdBQThDLEVBQXRFOztBQUVBLFFBQUlKLFdBQUosRUFBaUI7QUFDZnFCLE1BQUFBLFNBQVMsQ0FBQ3JCLFdBQVYsR0FBd0JBLFdBQXhCO0FBQ0Q7O0FBRUQsVUFBTTBCLFVBQVUsR0FBR0wsU0FBUyxDQUFDTSxRQUFWLEVBQW5CO0FBRUEsV0FBTztBQUFDRCxNQUFBQSxVQUFEO0FBQWFyQixNQUFBQSxTQUFiO0FBQXdCQyxNQUFBQTtBQUF4QixLQUFQO0FBQ0Q7O0FBOUNpQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTY2hlbWEgZnJvbSAnZnVsY3J1bS1zY2hlbWEvZGlzdC9zY2hlbWEnO1xuaW1wb3J0IE1ldGFkYXRhIGZyb20gJ2Z1bGNydW0tc2NoZW1hL2Rpc3QvbWV0YWRhdGEnO1xuaW1wb3J0IHNxbGRpZmYgZnJvbSAnc3FsZGlmZic7XG5pbXBvcnQgUEdTY2hlbWEgZnJvbSAnLi9wb3N0Z3Jlcy1zY2hlbWEnO1xuXG5jb25zdCB7U2NoZW1hRGlmZmVyLCBQb3N0Z3Jlc30gPSBzcWxkaWZmO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb3N0Z3Jlc1NjaGVtYSB7XG4gIHN0YXRpYyBhc3luYyBnZW5lcmF0ZVNjaGVtYVN0YXRlbWVudHMoYWNjb3VudCwgb2xkRm9ybSwgbmV3Rm9ybSwge2Rpc2FibGVBcnJheXMsIGRpc2FibGVDb21wbGV4VHlwZXMsIHVzZXJNb2R1bGUsIHRhYmxlU2NoZW1hLCBjYWxjdWxhdGVkRmllbGREYXRlRm9ybWF0LCBtZXRhZGF0YSwgdXNlUmVzb3VyY2VJRCwgYWNjb3VudFByZWZpeH0pIHtcbiAgICBsZXQgb2xkU2NoZW1hID0gbnVsbDtcbiAgICBsZXQgbmV3U2NoZW1hID0gbnVsbDtcblxuICAgIFBHU2NoZW1hLmRpc2FibGVBcnJheXMgPSBkaXNhYmxlQXJyYXlzO1xuICAgIFBHU2NoZW1hLmRpc2FibGVDb21wbGV4VHlwZXMgPSBkaXNhYmxlQ29tcGxleFR5cGVzO1xuICAgIFBHU2NoZW1hLmNhbGN1bGF0ZWRGaWVsZERhdGVGb3JtYXQgPSBjYWxjdWxhdGVkRmllbGREYXRlRm9ybWF0O1xuXG4gICAgaWYgKHVzZXJNb2R1bGUgJiYgdXNlck1vZHVsZS51cGRhdGVTY2hlbWEgJiYgIVBHU2NoZW1hLl9tb2RpZmllZCkge1xuICAgICAgdXNlck1vZHVsZS51cGRhdGVTY2hlbWEoUEdTY2hlbWEpO1xuXG4gICAgICBQR1NjaGVtYS5fbW9kaWZpZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICh1c2VSZXNvdXJjZUlEKSB7XG4gICAgICBpZiAob2xkRm9ybSkge1xuICAgICAgICBvbGRGb3JtID0gey4uLm9sZEZvcm0sIHJvd19pZDogb2xkRm9ybS5pZH07XG4gICAgICB9XG4gICAgICBpZiAobmV3Rm9ybSkge1xuICAgICAgICBuZXdGb3JtID0gey4uLm5ld0Zvcm0sIHJvd19pZDogbmV3Rm9ybS5pZH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9sZEZvcm0pIHtcbiAgICAgIG9sZFNjaGVtYSA9IG5ldyBTY2hlbWEob2xkRm9ybSwgUEdTY2hlbWEsIHVzZXJNb2R1bGUgJiYgdXNlck1vZHVsZS5zY2hlbWFPcHRpb25zKTtcbiAgICB9XG5cbiAgICBpZiAobmV3Rm9ybSkge1xuICAgICAgbmV3U2NoZW1hID0gbmV3IFNjaGVtYShuZXdGb3JtLCBQR1NjaGVtYSwgdXNlck1vZHVsZSAmJiB1c2VyTW9kdWxlLnNjaGVtYU9wdGlvbnMpO1xuICAgIH1cblxuICAgIGNvbnN0IGRpZmZlciA9IG5ldyBTY2hlbWFEaWZmZXIob2xkU2NoZW1hLCBuZXdTY2hlbWEpO1xuXG4gICAgY29uc3QgbWV0YSA9IG5ldyBNZXRhZGF0YShkaWZmZXIsIHtxdW90ZTogJ1wiJywgc2NoZW1hOiB0YWJsZVNjaGVtYSwgcHJlZml4OiAnc3lzdGVtXycsIHVzZUFsaWFzZXM6IGZhbHNlfSk7XG4gICAgY29uc3QgZ2VuZXJhdG9yID0gbmV3IFBvc3RncmVzKGRpZmZlciwge2FmdGVyVHJhbnNmb3JtOiBtZXRhZGF0YSAmJiBtZXRhLmJ1aWxkLmJpbmQobWV0YSl9KTtcblxuICAgIGdlbmVyYXRvci50YWJsZVByZWZpeCA9IGFjY291bnRQcmVmaXggIT0gbnVsbCA/IGFjY291bnRQcmVmaXggKyAnXycgOiAnJztcblxuICAgIGlmICh0YWJsZVNjaGVtYSkge1xuICAgICAgZ2VuZXJhdG9yLnRhYmxlU2NoZW1hID0gdGFibGVTY2hlbWE7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RhdGVtZW50cyA9IGdlbmVyYXRvci5nZW5lcmF0ZSgpO1xuXG4gICAgcmV0dXJuIHtzdGF0ZW1lbnRzLCBvbGRTY2hlbWEsIG5ld1NjaGVtYX07XG4gIH1cbn1cbiJdfQ==