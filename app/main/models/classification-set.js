"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _minidb = require("minidb");

var _fulcrumCore = require("fulcrum-core");

class ClassificationSet extends _fulcrumCore.ClassificationSet {
  static get tableName() {
    return 'classification_sets';
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
      name: 'version',
      column: 'version',
      type: 'integer',
      null: false
    }, {
      name: 'itemsJSON',
      column: 'items',
      type: 'json',
      null: false
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

exports.default = ClassificationSet;

_minidb.PersistentObject.register(ClassificationSet);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL21vZGVscy9jbGFzc2lmaWNhdGlvbi1zZXQuanMiXSwibmFtZXMiOlsiQ2xhc3NpZmljYXRpb25TZXQiLCJDbGFzc2lmaWNhdGlvblNldEJhc2UiLCJ0YWJsZU5hbWUiLCJjb2x1bW5zIiwibmFtZSIsImNvbHVtbiIsInR5cGUiLCJudWxsIiwiUGVyc2lzdGVudE9iamVjdCIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBRWUsTUFBTUEsaUJBQU4sU0FBZ0NDLDhCQUFoQyxDQUFzRDtBQUMvQyxhQUFUQyxTQUFTLEdBQUc7QUFDckIsV0FBTyxxQkFBUDtBQUNEOztBQUVpQixhQUFQQyxPQUFPLEdBQUc7QUFDbkIsV0FBTyxDQUNMO0FBQUVDLE1BQUFBLElBQUksRUFBRSxjQUFSO0FBQXdCQyxNQUFBQSxNQUFNLEVBQUUsWUFBaEM7QUFBOENDLE1BQUFBLElBQUksRUFBRSxTQUFwRDtBQUErREMsTUFBQUEsSUFBSSxFQUFFO0FBQXJFLEtBREssRUFFTDtBQUFFSCxNQUFBQSxJQUFJLEVBQUUsSUFBUjtBQUFjQyxNQUFBQSxNQUFNLEVBQUUsYUFBdEI7QUFBcUNDLE1BQUFBLElBQUksRUFBRSxRQUEzQztBQUFxREMsTUFBQUEsSUFBSSxFQUFFO0FBQTNELEtBRkssRUFHTDtBQUFFSCxNQUFBQSxJQUFJLEVBQUUsTUFBUjtBQUFnQkMsTUFBQUEsTUFBTSxFQUFFLE1BQXhCO0FBQWdDQyxNQUFBQSxJQUFJLEVBQUUsUUFBdEM7QUFBZ0RDLE1BQUFBLElBQUksRUFBRTtBQUF0RCxLQUhLLEVBSUw7QUFBRUgsTUFBQUEsSUFBSSxFQUFFLGFBQVI7QUFBdUJDLE1BQUFBLE1BQU0sRUFBRSxhQUEvQjtBQUE4Q0MsTUFBQUEsSUFBSSxFQUFFO0FBQXBELEtBSkssRUFLTDtBQUFFRixNQUFBQSxJQUFJLEVBQUUsU0FBUjtBQUFtQkMsTUFBQUEsTUFBTSxFQUFFLFNBQTNCO0FBQXNDQyxNQUFBQSxJQUFJLEVBQUUsU0FBNUM7QUFBdURDLE1BQUFBLElBQUksRUFBRTtBQUE3RCxLQUxLLEVBTUw7QUFBRUgsTUFBQUEsSUFBSSxFQUFFLFdBQVI7QUFBcUJDLE1BQUFBLE1BQU0sRUFBRSxPQUE3QjtBQUFzQ0MsTUFBQUEsSUFBSSxFQUFFLE1BQTVDO0FBQW9EQyxNQUFBQSxJQUFJLEVBQUU7QUFBMUQsS0FOSyxFQU9MO0FBQUVILE1BQUFBLElBQUksRUFBRSxXQUFSO0FBQXFCQyxNQUFBQSxNQUFNLEVBQUUsbUJBQTdCO0FBQWtEQyxNQUFBQSxJQUFJLEVBQUU7QUFBeEQsS0FQSyxFQVFMO0FBQUVGLE1BQUFBLElBQUksRUFBRSxXQUFSO0FBQXFCQyxNQUFBQSxNQUFNLEVBQUUsbUJBQTdCO0FBQWtEQyxNQUFBQSxJQUFJLEVBQUU7QUFBeEQsS0FSSyxFQVNMO0FBQUVGLE1BQUFBLElBQUksRUFBRSxXQUFSO0FBQXFCQyxNQUFBQSxNQUFNLEVBQUUsWUFBN0I7QUFBMkNDLE1BQUFBLElBQUksRUFBRTtBQUFqRCxLQVRLLENBQVA7QUFXRDs7QUFqQmtFOzs7O0FBb0JyRUUseUJBQWlCQyxRQUFqQixDQUEwQlQsaUJBQTFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGVyc2lzdGVudE9iamVjdCB9IGZyb20gJ21pbmlkYic7XG5pbXBvcnQgeyBDbGFzc2lmaWNhdGlvblNldCBhcyBDbGFzc2lmaWNhdGlvblNldEJhc2UgfSBmcm9tICdmdWxjcnVtLWNvcmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGFzc2lmaWNhdGlvblNldCBleHRlbmRzIENsYXNzaWZpY2F0aW9uU2V0QmFzZSB7XG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xuICAgIHJldHVybiAnY2xhc3NpZmljYXRpb25fc2V0cyc7XG4gIH1cblxuICBzdGF0aWMgZ2V0IGNvbHVtbnMoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHsgbmFtZTogJ2FjY291bnRSb3dJRCcsIGNvbHVtbjogJ2FjY291bnRfaWQnLCB0eXBlOiAnaW50ZWdlcicsIG51bGw6IGZhbHNlIH0sXG4gICAgICB7IG5hbWU6ICdpZCcsIGNvbHVtbjogJ3Jlc291cmNlX2lkJywgdHlwZTogJ3N0cmluZycsIG51bGw6IGZhbHNlIH0sXG4gICAgICB7IG5hbWU6ICduYW1lJywgY29sdW1uOiAnbmFtZScsIHR5cGU6ICdzdHJpbmcnLCBudWxsOiBmYWxzZSB9LFxuICAgICAgeyBuYW1lOiAnZGVzY3JpcHRpb24nLCBjb2x1bW46ICdkZXNjcmlwdGlvbicsIHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICB7IG5hbWU6ICd2ZXJzaW9uJywgY29sdW1uOiAndmVyc2lvbicsIHR5cGU6ICdpbnRlZ2VyJywgbnVsbDogZmFsc2UgfSxcbiAgICAgIHsgbmFtZTogJ2l0ZW1zSlNPTicsIGNvbHVtbjogJ2l0ZW1zJywgdHlwZTogJ2pzb24nLCBudWxsOiBmYWxzZSB9LFxuICAgICAgeyBuYW1lOiAnY3JlYXRlZEF0JywgY29sdW1uOiAnc2VydmVyX2NyZWF0ZWRfYXQnLCB0eXBlOiAnZGF0ZXRpbWUnIH0sXG4gICAgICB7IG5hbWU6ICd1cGRhdGVkQXQnLCBjb2x1bW46ICdzZXJ2ZXJfdXBkYXRlZF9hdCcsIHR5cGU6ICdkYXRldGltZScgfSxcbiAgICAgIHsgbmFtZTogJ2RlbGV0ZWRBdCcsIGNvbHVtbjogJ2RlbGV0ZWRfYXQnLCB0eXBlOiAnZGF0ZXRpbWUnIH1cbiAgICBdO1xuICB9XG59XG5cblBlcnNpc3RlbnRPYmplY3QucmVnaXN0ZXIoQ2xhc3NpZmljYXRpb25TZXQpO1xuIl19