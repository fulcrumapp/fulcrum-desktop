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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL21vZGVscy9wcm9qZWN0LmpzIl0sIm5hbWVzIjpbIlByb2plY3QiLCJQcm9qZWN0QmFzZSIsInRhYmxlTmFtZSIsImNvbHVtbnMiLCJuYW1lIiwiY29sdW1uIiwidHlwZSIsIm51bGwiLCJQZXJzaXN0ZW50T2JqZWN0IiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFFZSxNQUFNQSxPQUFOLFNBQXNCQyxvQkFBdEIsQ0FBa0M7QUFDM0IsYUFBVEMsU0FBUyxHQUFHO0FBQ3JCLFdBQU8sVUFBUDtBQUNEOztBQUVpQixhQUFQQyxPQUFPLEdBQUc7QUFDbkIsV0FBTyxDQUNMO0FBQUVDLE1BQUFBLElBQUksRUFBRSxjQUFSO0FBQXdCQyxNQUFBQSxNQUFNLEVBQUUsWUFBaEM7QUFBOENDLE1BQUFBLElBQUksRUFBRSxTQUFwRDtBQUErREMsTUFBQUEsSUFBSSxFQUFFO0FBQXJFLEtBREssRUFFTDtBQUFFSCxNQUFBQSxJQUFJLEVBQUUsSUFBUjtBQUFjQyxNQUFBQSxNQUFNLEVBQUUsYUFBdEI7QUFBcUNDLE1BQUFBLElBQUksRUFBRSxRQUEzQztBQUFxREMsTUFBQUEsSUFBSSxFQUFFO0FBQTNELEtBRkssRUFHTDtBQUFFSCxNQUFBQSxJQUFJLEVBQUUsTUFBUjtBQUFnQkMsTUFBQUEsTUFBTSxFQUFFLE1BQXhCO0FBQWdDQyxNQUFBQSxJQUFJLEVBQUUsUUFBdEM7QUFBZ0RDLE1BQUFBLElBQUksRUFBRTtBQUF0RCxLQUhLLEVBSUw7QUFBRUgsTUFBQUEsSUFBSSxFQUFFLGFBQVI7QUFBdUJDLE1BQUFBLE1BQU0sRUFBRSxhQUEvQjtBQUE4Q0MsTUFBQUEsSUFBSSxFQUFFO0FBQXBELEtBSkssRUFLTDtBQUFFRixNQUFBQSxJQUFJLEVBQUUsV0FBUjtBQUFxQkMsTUFBQUEsTUFBTSxFQUFFLG1CQUE3QjtBQUFrREMsTUFBQUEsSUFBSSxFQUFFO0FBQXhELEtBTEssRUFNTDtBQUFFRixNQUFBQSxJQUFJLEVBQUUsV0FBUjtBQUFxQkMsTUFBQUEsTUFBTSxFQUFFLG1CQUE3QjtBQUFrREMsTUFBQUEsSUFBSSxFQUFFO0FBQXhELEtBTkssRUFPTDtBQUFFRixNQUFBQSxJQUFJLEVBQUUsV0FBUjtBQUFxQkMsTUFBQUEsTUFBTSxFQUFFLFlBQTdCO0FBQTJDQyxNQUFBQSxJQUFJLEVBQUU7QUFBakQsS0FQSyxDQUFQO0FBU0Q7O0FBZjhDOzs7O0FBa0JqREUseUJBQWlCQyxRQUFqQixDQUEwQlQsT0FBMUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQZXJzaXN0ZW50T2JqZWN0IH0gZnJvbSAnbWluaWRiJztcbmltcG9ydCB7IFByb2plY3QgYXMgUHJvamVjdEJhc2UgfSBmcm9tICdmdWxjcnVtLWNvcmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcm9qZWN0IGV4dGVuZHMgUHJvamVjdEJhc2Uge1xuICBzdGF0aWMgZ2V0IHRhYmxlTmFtZSgpIHtcbiAgICByZXR1cm4gJ3Byb2plY3RzJztcbiAgfVxuXG4gIHN0YXRpYyBnZXQgY29sdW1ucygpIHtcbiAgICByZXR1cm4gW1xuICAgICAgeyBuYW1lOiAnYWNjb3VudFJvd0lEJywgY29sdW1uOiAnYWNjb3VudF9pZCcsIHR5cGU6ICdpbnRlZ2VyJywgbnVsbDogZmFsc2UgfSxcbiAgICAgIHsgbmFtZTogJ2lkJywgY29sdW1uOiAncmVzb3VyY2VfaWQnLCB0eXBlOiAnc3RyaW5nJywgbnVsbDogZmFsc2UgfSxcbiAgICAgIHsgbmFtZTogJ25hbWUnLCBjb2x1bW46ICduYW1lJywgdHlwZTogJ3N0cmluZycsIG51bGw6IGZhbHNlIH0sXG4gICAgICB7IG5hbWU6ICdkZXNjcmlwdGlvbicsIGNvbHVtbjogJ2Rlc2NyaXB0aW9uJywgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgIHsgbmFtZTogJ2NyZWF0ZWRBdCcsIGNvbHVtbjogJ3NlcnZlcl9jcmVhdGVkX2F0JywgdHlwZTogJ2RhdGV0aW1lJyB9LFxuICAgICAgeyBuYW1lOiAndXBkYXRlZEF0JywgY29sdW1uOiAnc2VydmVyX3VwZGF0ZWRfYXQnLCB0eXBlOiAnZGF0ZXRpbWUnIH0sXG4gICAgICB7IG5hbWU6ICdkZWxldGVkQXQnLCBjb2x1bW46ICdkZWxldGVkX2F0JywgdHlwZTogJ2RhdGV0aW1lJyB9XG4gICAgXTtcbiAgfVxufVxuXG5QZXJzaXN0ZW50T2JqZWN0LnJlZ2lzdGVyKFByb2plY3QpO1xuIl19