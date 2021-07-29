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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL3F1ZXJ5LmpzIl0sIm5hbWVzIjpbImhlYWRlcnMiLCJpc0pTT04iLCJmdWxjcnVtIiwiYXJncyIsImZvcm1hdCIsImlzQ1NWIiwicHJvY2VzcyIsInN0ZG91dCIsIndyaXRlIiwibGFzdEpTT05PYmplY3QiLCJkYiIsImVhY2giLCJzcWwiLCJjb2x1bW5zIiwidmFsdWVzIiwiaW5kZXgiLCJsZW5ndGgiLCJDU1YiLCJzdHJpbmdpZnkiLCJtYXAiLCJjIiwibmFtZSIsIkpTT04iLCJ0YXNrIiwiY2xpIiwiY29tbWFuZCIsImRlc2MiLCJidWlsZGVyIiwidHlwZSIsInJlcXVpcmVkIiwiZGVmYXVsdCIsImhhbmRsZXIiLCJydW5Db21tYW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7OztBQUVlLGVBQU07QUFBQTtBQUFBLHdDQXFCTixZQUFZO0FBQ3ZCLFVBQUlBLE9BQU8sR0FBRyxLQUFkO0FBQ0EsWUFBTUMsTUFBTSxHQUFHQyxPQUFPLENBQUNDLElBQVIsQ0FBYUMsTUFBYixLQUF3QixNQUF2QztBQUNBLFlBQU1DLEtBQUssR0FBR0gsT0FBTyxDQUFDQyxJQUFSLENBQWFDLE1BQWIsS0FBd0IsS0FBdEM7O0FBRUEsVUFBSUgsTUFBSixFQUFZO0FBQ1ZLLFFBQUFBLE9BQU8sQ0FBQ0MsTUFBUixDQUFlQyxLQUFmLENBQXFCLEdBQXJCO0FBQ0Q7O0FBRUQsVUFBSUMsY0FBYyxHQUFHLElBQXJCO0FBRUEsWUFBTVAsT0FBTyxDQUFDUSxFQUFSLENBQVdDLElBQVgsQ0FBZ0JULE9BQU8sQ0FBQ0MsSUFBUixDQUFhUyxHQUE3QixFQUFrQyxFQUFsQyxFQUFzQyxDQUFDO0FBQUNDLFFBQUFBLE9BQUQ7QUFBVUMsUUFBQUEsTUFBVjtBQUFrQkMsUUFBQUE7QUFBbEIsT0FBRCxLQUE4QjtBQUN4RSxZQUFJLENBQUNmLE9BQUQsSUFBWUssS0FBWixJQUFxQlEsT0FBTyxDQUFDRyxNQUFqQyxFQUF5QztBQUN2Q2hCLFVBQUFBLE9BQU8sR0FBRyxJQUFWO0FBQ0FNLFVBQUFBLE9BQU8sQ0FBQ0MsTUFBUixDQUFlQyxLQUFmLENBQXFCUyxtQkFBSUMsU0FBSixDQUFjTCxPQUFPLENBQUNNLEdBQVIsQ0FBWUMsQ0FBQyxJQUFJQSxDQUFDLENBQUNDLElBQW5CLENBQWQsQ0FBckI7QUFDRDs7QUFFRCxZQUFJUCxNQUFKLEVBQVk7QUFDVixjQUFJYixNQUFKLEVBQVk7QUFDVixnQkFBSVEsY0FBSixFQUFvQjtBQUNsQkgsY0FBQUEsT0FBTyxDQUFDQyxNQUFSLENBQWVDLEtBQWYsQ0FBcUJjLElBQUksQ0FBQ0osU0FBTCxDQUFlVCxjQUFmLElBQWlDLEdBQXREO0FBQ0Q7O0FBRURBLFlBQUFBLGNBQWMsR0FBR0ssTUFBakI7QUFDRCxXQU5ELE1BTU87QUFDTFIsWUFBQUEsT0FBTyxDQUFDQyxNQUFSLENBQWVDLEtBQWYsQ0FBcUJTLG1CQUFJQyxTQUFKLENBQWNKLE1BQWQsQ0FBckI7QUFDRDtBQUNGO0FBQ0YsT0FqQkssQ0FBTjs7QUFtQkEsVUFBSWIsTUFBSixFQUFZO0FBQ1YsWUFBSVEsY0FBSixFQUFvQjtBQUNsQkgsVUFBQUEsT0FBTyxDQUFDQyxNQUFSLENBQWVDLEtBQWYsQ0FBcUJjLElBQUksQ0FBQ0osU0FBTCxDQUFlVCxjQUFmLENBQXJCO0FBQ0Q7O0FBRURILFFBQUFBLE9BQU8sQ0FBQ0MsTUFBUixDQUFlQyxLQUFmLENBQXFCLEdBQXJCO0FBQ0Q7QUFDRixLQTFEa0I7QUFBQTs7QUFDVCxRQUFKZSxJQUFJLENBQUNDLEdBQUQsRUFBTTtBQUNkLFdBQU9BLEdBQUcsQ0FBQ0MsT0FBSixDQUFZO0FBQ2pCQSxNQUFBQSxPQUFPLEVBQUUsT0FEUTtBQUVqQkMsTUFBQUEsSUFBSSxFQUFFLG1DQUZXO0FBR2pCQyxNQUFBQSxPQUFPLEVBQUU7QUFDUGYsUUFBQUEsR0FBRyxFQUFFO0FBQ0hnQixVQUFBQSxJQUFJLEVBQUUsUUFESDtBQUVIRixVQUFBQSxJQUFJLEVBQUUsV0FGSDtBQUdIRyxVQUFBQSxRQUFRLEVBQUU7QUFIUCxTQURFO0FBTVB6QixRQUFBQSxNQUFNLEVBQUU7QUFDTndCLFVBQUFBLElBQUksRUFBRSxRQURBO0FBRU5GLFVBQUFBLElBQUksRUFBRSxvQkFGQTtBQUdOSSxVQUFBQSxPQUFPLEVBQUU7QUFISDtBQU5ELE9BSFE7QUFlakJDLE1BQUFBLE9BQU8sRUFBRSxLQUFLQztBQWZHLEtBQVosQ0FBUDtBQWlCRDs7QUFuQmtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENTViBmcm9tICdjc3Ytc3RyaW5nJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICBhc3luYyB0YXNrKGNsaSkge1xuICAgIHJldHVybiBjbGkuY29tbWFuZCh7XG4gICAgICBjb21tYW5kOiAncXVlcnknLFxuICAgICAgZGVzYzogJ3J1biBhIHF1ZXJ5IGluIHRoZSBsb2NhbCBkYXRhYmFzZScsXG4gICAgICBidWlsZGVyOiB7XG4gICAgICAgIHNxbDoge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlc2M6ICdzcWwgcXVlcnknLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIGZvcm1hdDoge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlc2M6ICdmb3JtYXQgKGNzdiwganNvbiknLFxuICAgICAgICAgIGRlZmF1bHQ6ICdjc3YnXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBoYW5kbGVyOiB0aGlzLnJ1bkNvbW1hbmRcbiAgICB9KTtcbiAgfVxuXG4gIHJ1bkNvbW1hbmQgPSBhc3luYyAoKSA9PiB7XG4gICAgbGV0IGhlYWRlcnMgPSBmYWxzZTtcbiAgICBjb25zdCBpc0pTT04gPSBmdWxjcnVtLmFyZ3MuZm9ybWF0ID09PSAnanNvbic7XG4gICAgY29uc3QgaXNDU1YgPSBmdWxjcnVtLmFyZ3MuZm9ybWF0ID09PSAnY3N2JztcblxuICAgIGlmIChpc0pTT04pIHtcbiAgICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKCdbJyk7XG4gICAgfVxuXG4gICAgbGV0IGxhc3RKU09OT2JqZWN0ID0gbnVsbDtcblxuICAgIGF3YWl0IGZ1bGNydW0uZGIuZWFjaChmdWxjcnVtLmFyZ3Muc3FsLCB7fSwgKHtjb2x1bW5zLCB2YWx1ZXMsIGluZGV4fSkgPT4ge1xuICAgICAgaWYgKCFoZWFkZXJzICYmIGlzQ1NWICYmIGNvbHVtbnMubGVuZ3RoKSB7XG4gICAgICAgIGhlYWRlcnMgPSB0cnVlO1xuICAgICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShDU1Yuc3RyaW5naWZ5KGNvbHVtbnMubWFwKGMgPT4gYy5uYW1lKSkpO1xuICAgICAgfVxuXG4gICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgIGlmIChpc0pTT04pIHtcbiAgICAgICAgICBpZiAobGFzdEpTT05PYmplY3QpIHtcbiAgICAgICAgICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKEpTT04uc3RyaW5naWZ5KGxhc3RKU09OT2JqZWN0KSArICcsJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGFzdEpTT05PYmplY3QgPSB2YWx1ZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoQ1NWLnN0cmluZ2lmeSh2YWx1ZXMpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGlzSlNPTikge1xuICAgICAgaWYgKGxhc3RKU09OT2JqZWN0KSB7XG4gICAgICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKEpTT04uc3RyaW5naWZ5KGxhc3RKU09OT2JqZWN0KSk7XG4gICAgICB9XG5cbiAgICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKCddJyk7XG4gICAgfVxuICB9XG59XG4iXX0=