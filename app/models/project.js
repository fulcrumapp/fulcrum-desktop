"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _minidb = require("minidb");

var _fulcrumCore = require("fulcrum-core");

class Project extends _fulcrumCore.Project {
  static get tableName() {
    return 'projects';
  }

  static get columns() {
    return [{
      name: 'accountRowID',
      column: 'account_id',
      type: 'integer',
      null: false
    }, {
      name: 'id',
      column: 'resource_id',
      type: 'string',
      null: false
    }, {
      name: 'name',
      column: 'name',
      type: 'string',
      null: false
    }, {
      name: 'description',
      column: 'description',
      type: 'string'
    }, {
      name: 'createdAt',
      column: 'server_created_at',
      type: 'datetime'
    }, {
      name: 'updatedAt',
      column: 'server_updated_at',
      type: 'datetime'
    }, {
      name: 'deletedAt',
      column: 'deleted_at',
      type: 'datetime'
    }];
  }

}

exports.default = Project;

_minidb.PersistentObject.register(Project);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvcHJvamVjdC5qcyJdLCJuYW1lcyI6WyJQcm9qZWN0IiwiUHJvamVjdEJhc2UiLCJ0YWJsZU5hbWUiLCJjb2x1bW5zIiwibmFtZSIsImNvbHVtbiIsInR5cGUiLCJudWxsIiwiUGVyc2lzdGVudE9iamVjdCIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBRWUsTUFBTUEsT0FBTixTQUFzQkMsb0JBQXRCLENBQWtDO0FBQzNCLGFBQVRDLFNBQVMsR0FBRztBQUNyQixXQUFPLFVBQVA7QUFDRDs7QUFFaUIsYUFBUEMsT0FBTyxHQUFHO0FBQ25CLFdBQU8sQ0FDTDtBQUFFQyxNQUFBQSxJQUFJLEVBQUUsY0FBUjtBQUF3QkMsTUFBQUEsTUFBTSxFQUFFLFlBQWhDO0FBQThDQyxNQUFBQSxJQUFJLEVBQUUsU0FBcEQ7QUFBK0RDLE1BQUFBLElBQUksRUFBRTtBQUFyRSxLQURLLEVBRUw7QUFBRUgsTUFBQUEsSUFBSSxFQUFFLElBQVI7QUFBY0MsTUFBQUEsTUFBTSxFQUFFLGFBQXRCO0FBQXFDQyxNQUFBQSxJQUFJLEVBQUUsUUFBM0M7QUFBcURDLE1BQUFBLElBQUksRUFBRTtBQUEzRCxLQUZLLEVBR0w7QUFBRUgsTUFBQUEsSUFBSSxFQUFFLE1BQVI7QUFBZ0JDLE1BQUFBLE1BQU0sRUFBRSxNQUF4QjtBQUFnQ0MsTUFBQUEsSUFBSSxFQUFFLFFBQXRDO0FBQWdEQyxNQUFBQSxJQUFJLEVBQUU7QUFBdEQsS0FISyxFQUlMO0FBQUVILE1BQUFBLElBQUksRUFBRSxhQUFSO0FBQXVCQyxNQUFBQSxNQUFNLEVBQUUsYUFBL0I7QUFBOENDLE1BQUFBLElBQUksRUFBRTtBQUFwRCxLQUpLLEVBS0w7QUFBRUYsTUFBQUEsSUFBSSxFQUFFLFdBQVI7QUFBcUJDLE1BQUFBLE1BQU0sRUFBRSxtQkFBN0I7QUFBa0RDLE1BQUFBLElBQUksRUFBRTtBQUF4RCxLQUxLLEVBTUw7QUFBRUYsTUFBQUEsSUFBSSxFQUFFLFdBQVI7QUFBcUJDLE1BQUFBLE1BQU0sRUFBRSxtQkFBN0I7QUFBa0RDLE1BQUFBLElBQUksRUFBRTtBQUF4RCxLQU5LLEVBT0w7QUFBRUYsTUFBQUEsSUFBSSxFQUFFLFdBQVI7QUFBcUJDLE1BQUFBLE1BQU0sRUFBRSxZQUE3QjtBQUEyQ0MsTUFBQUEsSUFBSSxFQUFFO0FBQWpELEtBUEssQ0FBUDtBQVNEOztBQWY4Qzs7OztBQWtCakRFLHlCQUFpQkMsUUFBakIsQ0FBMEJULE9BQTFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGVyc2lzdGVudE9iamVjdCB9IGZyb20gJ21pbmlkYic7XG5pbXBvcnQgeyBQcm9qZWN0IGFzIFByb2plY3RCYXNlIH0gZnJvbSAnZnVsY3J1bS1jb3JlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvamVjdCBleHRlbmRzIFByb2plY3RCYXNlIHtcbiAgc3RhdGljIGdldCB0YWJsZU5hbWUoKSB7XG4gICAgcmV0dXJuICdwcm9qZWN0cyc7XG4gIH1cblxuICBzdGF0aWMgZ2V0IGNvbHVtbnMoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHsgbmFtZTogJ2FjY291bnRSb3dJRCcsIGNvbHVtbjogJ2FjY291bnRfaWQnLCB0eXBlOiAnaW50ZWdlcicsIG51bGw6IGZhbHNlIH0sXG4gICAgICB7IG5hbWU6ICdpZCcsIGNvbHVtbjogJ3Jlc291cmNlX2lkJywgdHlwZTogJ3N0cmluZycsIG51bGw6IGZhbHNlIH0sXG4gICAgICB7IG5hbWU6ICduYW1lJywgY29sdW1uOiAnbmFtZScsIHR5cGU6ICdzdHJpbmcnLCBudWxsOiBmYWxzZSB9LFxuICAgICAgeyBuYW1lOiAnZGVzY3JpcHRpb24nLCBjb2x1bW46ICdkZXNjcmlwdGlvbicsIHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICB7IG5hbWU6ICdjcmVhdGVkQXQnLCBjb2x1bW46ICdzZXJ2ZXJfY3JlYXRlZF9hdCcsIHR5cGU6ICdkYXRldGltZScgfSxcbiAgICAgIHsgbmFtZTogJ3VwZGF0ZWRBdCcsIGNvbHVtbjogJ3NlcnZlcl91cGRhdGVkX2F0JywgdHlwZTogJ2RhdGV0aW1lJyB9LFxuICAgICAgeyBuYW1lOiAnZGVsZXRlZEF0JywgY29sdW1uOiAnZGVsZXRlZF9hdCcsIHR5cGU6ICdkYXRldGltZScgfVxuICAgIF07XG4gIH1cbn1cblxuUGVyc2lzdGVudE9iamVjdC5yZWdpc3RlcihQcm9qZWN0KTtcbiJdfQ==