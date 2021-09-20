'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _minidb = require('minidb');

var _fulcrumCore = require('fulcrum-core');

class Project extends _fulcrumCore.Project {
  static get tableName() {
    return 'projects';
  }

  static get columns() {
    return [{ name: 'accountRowID', column: 'account_id', type: 'integer', null: false }, { name: 'id', column: 'resource_id', type: 'string', null: false }, { name: 'name', column: 'name', type: 'string', null: false }, { name: 'description', column: 'description', type: 'string' }, { name: 'createdAt', column: 'server_created_at', type: 'datetime' }, { name: 'updatedAt', column: 'server_updated_at', type: 'datetime' }, { name: 'deletedAt', column: 'deleted_at', type: 'datetime' }];
  }
}

exports.default = Project;
_minidb.PersistentObject.register(Project);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL21vZGVscy9wcm9qZWN0LmpzIl0sIm5hbWVzIjpbIlByb2plY3QiLCJ0YWJsZU5hbWUiLCJjb2x1bW5zIiwibmFtZSIsImNvbHVtbiIsInR5cGUiLCJudWxsIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztBQUNBOztBQUVlLE1BQU1BLE9BQU4sOEJBQWtDO0FBQy9DLGFBQVdDLFNBQVgsR0FBdUI7QUFDckIsV0FBTyxVQUFQO0FBQ0Q7O0FBRUQsYUFBV0MsT0FBWCxHQUFxQjtBQUNuQixXQUFPLENBQ0wsRUFBRUMsTUFBTSxjQUFSLEVBQXdCQyxRQUFRLFlBQWhDLEVBQThDQyxNQUFNLFNBQXBELEVBQStEQyxNQUFNLEtBQXJFLEVBREssRUFFTCxFQUFFSCxNQUFNLElBQVIsRUFBY0MsUUFBUSxhQUF0QixFQUFxQ0MsTUFBTSxRQUEzQyxFQUFxREMsTUFBTSxLQUEzRCxFQUZLLEVBR0wsRUFBRUgsTUFBTSxNQUFSLEVBQWdCQyxRQUFRLE1BQXhCLEVBQWdDQyxNQUFNLFFBQXRDLEVBQWdEQyxNQUFNLEtBQXRELEVBSEssRUFJTCxFQUFFSCxNQUFNLGFBQVIsRUFBdUJDLFFBQVEsYUFBL0IsRUFBOENDLE1BQU0sUUFBcEQsRUFKSyxFQUtMLEVBQUVGLE1BQU0sV0FBUixFQUFxQkMsUUFBUSxtQkFBN0IsRUFBa0RDLE1BQU0sVUFBeEQsRUFMSyxFQU1MLEVBQUVGLE1BQU0sV0FBUixFQUFxQkMsUUFBUSxtQkFBN0IsRUFBa0RDLE1BQU0sVUFBeEQsRUFOSyxFQU9MLEVBQUVGLE1BQU0sV0FBUixFQUFxQkMsUUFBUSxZQUE3QixFQUEyQ0MsTUFBTSxVQUFqRCxFQVBLLENBQVA7QUFTRDtBQWY4Qzs7a0JBQTVCTCxPO0FBa0JyQix5QkFBaUJPLFFBQWpCLENBQTBCUCxPQUExQiIsImZpbGUiOiJwcm9qZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGVyc2lzdGVudE9iamVjdCB9IGZyb20gJ21pbmlkYic7XG5pbXBvcnQgeyBQcm9qZWN0IGFzIFByb2plY3RCYXNlIH0gZnJvbSAnZnVsY3J1bS1jb3JlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvamVjdCBleHRlbmRzIFByb2plY3RCYXNlIHtcbiAgc3RhdGljIGdldCB0YWJsZU5hbWUoKSB7XG4gICAgcmV0dXJuICdwcm9qZWN0cyc7XG4gIH1cblxuICBzdGF0aWMgZ2V0IGNvbHVtbnMoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHsgbmFtZTogJ2FjY291bnRSb3dJRCcsIGNvbHVtbjogJ2FjY291bnRfaWQnLCB0eXBlOiAnaW50ZWdlcicsIG51bGw6IGZhbHNlIH0sXG4gICAgICB7IG5hbWU6ICdpZCcsIGNvbHVtbjogJ3Jlc291cmNlX2lkJywgdHlwZTogJ3N0cmluZycsIG51bGw6IGZhbHNlIH0sXG4gICAgICB7IG5hbWU6ICduYW1lJywgY29sdW1uOiAnbmFtZScsIHR5cGU6ICdzdHJpbmcnLCBudWxsOiBmYWxzZSB9LFxuICAgICAgeyBuYW1lOiAnZGVzY3JpcHRpb24nLCBjb2x1bW46ICdkZXNjcmlwdGlvbicsIHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICB7IG5hbWU6ICdjcmVhdGVkQXQnLCBjb2x1bW46ICdzZXJ2ZXJfY3JlYXRlZF9hdCcsIHR5cGU6ICdkYXRldGltZScgfSxcbiAgICAgIHsgbmFtZTogJ3VwZGF0ZWRBdCcsIGNvbHVtbjogJ3NlcnZlcl91cGRhdGVkX2F0JywgdHlwZTogJ2RhdGV0aW1lJyB9LFxuICAgICAgeyBuYW1lOiAnZGVsZXRlZEF0JywgY29sdW1uOiAnZGVsZXRlZF9hdCcsIHR5cGU6ICdkYXRldGltZScgfVxuICAgIF07XG4gIH1cbn1cblxuUGVyc2lzdGVudE9iamVjdC5yZWdpc3RlcihQcm9qZWN0KTtcbiJdfQ==