"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _csvString = _interopRequireDefault(require("csv-string"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class _default {
  constructor() {
    _defineProperty(this, "runCommand", async () => {
      let headers = false;
      const isJSON = fulcrum.args.format === 'json';
      const isCSV = fulcrum.args.format === 'csv';

      if (isJSON) {
        process.stdout.write('[');
      }

      let lastJSONObject = null;
      await fulcrum.db.each(fulcrum.args.sql, {}, ({
        columns,
        values,
        index
      }) => {
        if (!headers && isCSV && columns.length) {
          headers = true;
          process.stdout.write(_csvString.default.stringify(columns.map(c => c.name)));
        }

        if (values) {
          if (isJSON) {
            if (lastJSONObject) {
              process.stdout.write(JSON.stringify(lastJSONObject) + ',');
            }

            lastJSONObject = values;
          } else {
            process.stdout.write(_csvString.default.stringify(values));
          }
        }
      });

      if (isJSON) {
        if (lastJSONObject) {
          process.stdout.write(JSON.stringify(lastJSONObject));
        }

        process.stdout.write(']');
      }
    });
  }

  async task(cli) {
    return cli.command({
      command: 'query',
      desc: 'run a query in the local database',
      builder: {
        sql: {
          type: 'string',
          desc: 'sql query',
          required: true
        },
        format: {
          type: 'string',
          desc: 'format (csv, json)',
          default: 'csv'
        }
      },
      handler: this.runCommand
    });
  }

}

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9xdWVyeS5qcyJdLCJuYW1lcyI6WyJoZWFkZXJzIiwiaXNKU09OIiwiZnVsY3J1bSIsImFyZ3MiLCJmb3JtYXQiLCJpc0NTViIsInByb2Nlc3MiLCJzdGRvdXQiLCJ3cml0ZSIsImxhc3RKU09OT2JqZWN0IiwiZGIiLCJlYWNoIiwic3FsIiwiY29sdW1ucyIsInZhbHVlcyIsImluZGV4IiwibGVuZ3RoIiwiQ1NWIiwic3RyaW5naWZ5IiwibWFwIiwiYyIsIm5hbWUiLCJKU09OIiwidGFzayIsImNsaSIsImNvbW1hbmQiLCJkZXNjIiwiYnVpbGRlciIsInR5cGUiLCJyZXF1aXJlZCIsImRlZmF1bHQiLCJoYW5kbGVyIiwicnVuQ29tbWFuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7Ozs7QUFFZSxlQUFNO0FBQUE7QUFBQSx3Q0FxQk4sWUFBWTtBQUN2QixVQUFJQSxPQUFPLEdBQUcsS0FBZDtBQUNBLFlBQU1DLE1BQU0sR0FBR0MsT0FBTyxDQUFDQyxJQUFSLENBQWFDLE1BQWIsS0FBd0IsTUFBdkM7QUFDQSxZQUFNQyxLQUFLLEdBQUdILE9BQU8sQ0FBQ0MsSUFBUixDQUFhQyxNQUFiLEtBQXdCLEtBQXRDOztBQUVBLFVBQUlILE1BQUosRUFBWTtBQUNWSyxRQUFBQSxPQUFPLENBQUNDLE1BQVIsQ0FBZUMsS0FBZixDQUFxQixHQUFyQjtBQUNEOztBQUVELFVBQUlDLGNBQWMsR0FBRyxJQUFyQjtBQUVBLFlBQU1QLE9BQU8sQ0FBQ1EsRUFBUixDQUFXQyxJQUFYLENBQWdCVCxPQUFPLENBQUNDLElBQVIsQ0FBYVMsR0FBN0IsRUFBa0MsRUFBbEMsRUFBc0MsQ0FBQztBQUFDQyxRQUFBQSxPQUFEO0FBQVVDLFFBQUFBLE1BQVY7QUFBa0JDLFFBQUFBO0FBQWxCLE9BQUQsS0FBOEI7QUFDeEUsWUFBSSxDQUFDZixPQUFELElBQVlLLEtBQVosSUFBcUJRLE9BQU8sQ0FBQ0csTUFBakMsRUFBeUM7QUFDdkNoQixVQUFBQSxPQUFPLEdBQUcsSUFBVjtBQUNBTSxVQUFBQSxPQUFPLENBQUNDLE1BQVIsQ0FBZUMsS0FBZixDQUFxQlMsbUJBQUlDLFNBQUosQ0FBY0wsT0FBTyxDQUFDTSxHQUFSLENBQVlDLENBQUMsSUFBSUEsQ0FBQyxDQUFDQyxJQUFuQixDQUFkLENBQXJCO0FBQ0Q7O0FBRUQsWUFBSVAsTUFBSixFQUFZO0FBQ1YsY0FBSWIsTUFBSixFQUFZO0FBQ1YsZ0JBQUlRLGNBQUosRUFBb0I7QUFDbEJILGNBQUFBLE9BQU8sQ0FBQ0MsTUFBUixDQUFlQyxLQUFmLENBQXFCYyxJQUFJLENBQUNKLFNBQUwsQ0FBZVQsY0FBZixJQUFpQyxHQUF0RDtBQUNEOztBQUVEQSxZQUFBQSxjQUFjLEdBQUdLLE1BQWpCO0FBQ0QsV0FORCxNQU1PO0FBQ0xSLFlBQUFBLE9BQU8sQ0FBQ0MsTUFBUixDQUFlQyxLQUFmLENBQXFCUyxtQkFBSUMsU0FBSixDQUFjSixNQUFkLENBQXJCO0FBQ0Q7QUFDRjtBQUNGLE9BakJLLENBQU47O0FBbUJBLFVBQUliLE1BQUosRUFBWTtBQUNWLFlBQUlRLGNBQUosRUFBb0I7QUFDbEJILFVBQUFBLE9BQU8sQ0FBQ0MsTUFBUixDQUFlQyxLQUFmLENBQXFCYyxJQUFJLENBQUNKLFNBQUwsQ0FBZVQsY0FBZixDQUFyQjtBQUNEOztBQUVESCxRQUFBQSxPQUFPLENBQUNDLE1BQVIsQ0FBZUMsS0FBZixDQUFxQixHQUFyQjtBQUNEO0FBQ0YsS0ExRGtCO0FBQUE7O0FBQ1QsUUFBSmUsSUFBSSxDQUFDQyxHQUFELEVBQU07QUFDZCxXQUFPQSxHQUFHLENBQUNDLE9BQUosQ0FBWTtBQUNqQkEsTUFBQUEsT0FBTyxFQUFFLE9BRFE7QUFFakJDLE1BQUFBLElBQUksRUFBRSxtQ0FGVztBQUdqQkMsTUFBQUEsT0FBTyxFQUFFO0FBQ1BmLFFBQUFBLEdBQUcsRUFBRTtBQUNIZ0IsVUFBQUEsSUFBSSxFQUFFLFFBREg7QUFFSEYsVUFBQUEsSUFBSSxFQUFFLFdBRkg7QUFHSEcsVUFBQUEsUUFBUSxFQUFFO0FBSFAsU0FERTtBQU1QekIsUUFBQUEsTUFBTSxFQUFFO0FBQ053QixVQUFBQSxJQUFJLEVBQUUsUUFEQTtBQUVORixVQUFBQSxJQUFJLEVBQUUsb0JBRkE7QUFHTkksVUFBQUEsT0FBTyxFQUFFO0FBSEg7QUFORCxPQUhRO0FBZWpCQyxNQUFBQSxPQUFPLEVBQUUsS0FBS0M7QUFmRyxLQUFaLENBQVA7QUFpQkQ7O0FBbkJrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDU1YgZnJvbSAnY3N2LXN0cmluZyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgYXN5bmMgdGFzayhjbGkpIHtcbiAgICByZXR1cm4gY2xpLmNvbW1hbmQoe1xuICAgICAgY29tbWFuZDogJ3F1ZXJ5JyxcbiAgICAgIGRlc2M6ICdydW4gYSBxdWVyeSBpbiB0aGUgbG9jYWwgZGF0YWJhc2UnLFxuICAgICAgYnVpbGRlcjoge1xuICAgICAgICBzcWw6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZXNjOiAnc3FsIHF1ZXJ5JyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBmb3JtYXQ6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZXNjOiAnZm9ybWF0IChjc3YsIGpzb24pJyxcbiAgICAgICAgICBkZWZhdWx0OiAnY3N2J1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaGFuZGxlcjogdGhpcy5ydW5Db21tYW5kXG4gICAgfSk7XG4gIH1cblxuICBydW5Db21tYW5kID0gYXN5bmMgKCkgPT4ge1xuICAgIGxldCBoZWFkZXJzID0gZmFsc2U7XG4gICAgY29uc3QgaXNKU09OID0gZnVsY3J1bS5hcmdzLmZvcm1hdCA9PT0gJ2pzb24nO1xuICAgIGNvbnN0IGlzQ1NWID0gZnVsY3J1bS5hcmdzLmZvcm1hdCA9PT0gJ2Nzdic7XG5cbiAgICBpZiAoaXNKU09OKSB7XG4gICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSgnWycpO1xuICAgIH1cblxuICAgIGxldCBsYXN0SlNPTk9iamVjdCA9IG51bGw7XG5cbiAgICBhd2FpdCBmdWxjcnVtLmRiLmVhY2goZnVsY3J1bS5hcmdzLnNxbCwge30sICh7Y29sdW1ucywgdmFsdWVzLCBpbmRleH0pID0+IHtcbiAgICAgIGlmICghaGVhZGVycyAmJiBpc0NTViAmJiBjb2x1bW5zLmxlbmd0aCkge1xuICAgICAgICBoZWFkZXJzID0gdHJ1ZTtcbiAgICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoQ1NWLnN0cmluZ2lmeShjb2x1bW5zLm1hcChjID0+IGMubmFtZSkpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHZhbHVlcykge1xuICAgICAgICBpZiAoaXNKU09OKSB7XG4gICAgICAgICAgaWYgKGxhc3RKU09OT2JqZWN0KSB7XG4gICAgICAgICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShKU09OLnN0cmluZ2lmeShsYXN0SlNPTk9iamVjdCkgKyAnLCcpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxhc3RKU09OT2JqZWN0ID0gdmFsdWVzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKENTVi5zdHJpbmdpZnkodmFsdWVzKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChpc0pTT04pIHtcbiAgICAgIGlmIChsYXN0SlNPTk9iamVjdCkge1xuICAgICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShKU09OLnN0cmluZ2lmeShsYXN0SlNPTk9iamVjdCkpO1xuICAgICAgfVxuXG4gICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSgnXScpO1xuICAgIH1cbiAgfVxufVxuIl19