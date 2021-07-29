"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _minidb = require("minidb");

class SyncState {
  static get tableName() {
    return 'sync_state';
  }

  static get columns() {
    return [{
      name: 'accountRowID',
      column: 'account_id',
      type: 'integer',
      null: false
    }, {
      name: 'resource',
      column: 'resource',
      type: 'string',
      null: false
    }, {
      name: 'scope',
      column: 'scope',
      type: 'string'
    }, {
      name: 'hash',
      column: 'hash',
      type: 'string'
    }];
  }

  get hash() {
    return this._hash;
  }

  set hash(hash) {
    this._hash = hash;
  }

  get scope() {
    return this._scope;
  }

  set scope(scope) {
    this._scope = scope;
  }

}

exports.default = SyncState;

_minidb.PersistentObject.register(SyncState);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvc3luYy1zdGF0ZS5qcyJdLCJuYW1lcyI6WyJTeW5jU3RhdGUiLCJ0YWJsZU5hbWUiLCJjb2x1bW5zIiwibmFtZSIsImNvbHVtbiIsInR5cGUiLCJudWxsIiwiaGFzaCIsIl9oYXNoIiwic2NvcGUiLCJfc2NvcGUiLCJQZXJzaXN0ZW50T2JqZWN0IiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFFZSxNQUFNQSxTQUFOLENBQWdCO0FBQ1QsYUFBVEMsU0FBUyxHQUFHO0FBQ3JCLFdBQU8sWUFBUDtBQUNEOztBQUVpQixhQUFQQyxPQUFPLEdBQUc7QUFDbkIsV0FBTyxDQUNMO0FBQUVDLE1BQUFBLElBQUksRUFBRSxjQUFSO0FBQXdCQyxNQUFBQSxNQUFNLEVBQUUsWUFBaEM7QUFBOENDLE1BQUFBLElBQUksRUFBRSxTQUFwRDtBQUErREMsTUFBQUEsSUFBSSxFQUFFO0FBQXJFLEtBREssRUFFTDtBQUFFSCxNQUFBQSxJQUFJLEVBQUUsVUFBUjtBQUFvQkMsTUFBQUEsTUFBTSxFQUFFLFVBQTVCO0FBQXdDQyxNQUFBQSxJQUFJLEVBQUUsUUFBOUM7QUFBd0RDLE1BQUFBLElBQUksRUFBRTtBQUE5RCxLQUZLLEVBR0w7QUFBRUgsTUFBQUEsSUFBSSxFQUFFLE9BQVI7QUFBaUJDLE1BQUFBLE1BQU0sRUFBRSxPQUF6QjtBQUFrQ0MsTUFBQUEsSUFBSSxFQUFFO0FBQXhDLEtBSEssRUFJTDtBQUFFRixNQUFBQSxJQUFJLEVBQUUsTUFBUjtBQUFnQkMsTUFBQUEsTUFBTSxFQUFFLE1BQXhCO0FBQWdDQyxNQUFBQSxJQUFJLEVBQUU7QUFBdEMsS0FKSyxDQUFQO0FBTUQ7O0FBRU8sTUFBSkUsSUFBSSxHQUFHO0FBQ1QsV0FBTyxLQUFLQyxLQUFaO0FBQ0Q7O0FBRU8sTUFBSkQsSUFBSSxDQUFDQSxJQUFELEVBQU87QUFDYixTQUFLQyxLQUFMLEdBQWFELElBQWI7QUFDRDs7QUFFUSxNQUFMRSxLQUFLLEdBQUc7QUFDVixXQUFPLEtBQUtDLE1BQVo7QUFDRDs7QUFFUSxNQUFMRCxLQUFLLENBQUNBLEtBQUQsRUFBUTtBQUNmLFNBQUtDLE1BQUwsR0FBY0QsS0FBZDtBQUNEOztBQTVCNEI7Ozs7QUErQi9CRSx5QkFBaUJDLFFBQWpCLENBQTBCWixTQUExQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBlcnNpc3RlbnRPYmplY3QgfSBmcm9tICdtaW5pZGInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTeW5jU3RhdGUge1xuICBzdGF0aWMgZ2V0IHRhYmxlTmFtZSgpIHtcbiAgICByZXR1cm4gJ3N5bmNfc3RhdGUnO1xuICB9XG5cbiAgc3RhdGljIGdldCBjb2x1bW5zKCkge1xuICAgIHJldHVybiBbXG4gICAgICB7IG5hbWU6ICdhY2NvdW50Um93SUQnLCBjb2x1bW46ICdhY2NvdW50X2lkJywgdHlwZTogJ2ludGVnZXInLCBudWxsOiBmYWxzZSB9LFxuICAgICAgeyBuYW1lOiAncmVzb3VyY2UnLCBjb2x1bW46ICdyZXNvdXJjZScsIHR5cGU6ICdzdHJpbmcnLCBudWxsOiBmYWxzZSB9LFxuICAgICAgeyBuYW1lOiAnc2NvcGUnLCBjb2x1bW46ICdzY29wZScsIHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICB7IG5hbWU6ICdoYXNoJywgY29sdW1uOiAnaGFzaCcsIHR5cGU6ICdzdHJpbmcnIH1cbiAgICBdO1xuICB9XG5cbiAgZ2V0IGhhc2goKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hhc2g7XG4gIH1cblxuICBzZXQgaGFzaChoYXNoKSB7XG4gICAgdGhpcy5faGFzaCA9IGhhc2g7XG4gIH1cblxuICBnZXQgc2NvcGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Njb3BlO1xuICB9XG5cbiAgc2V0IHNjb3BlKHNjb3BlKSB7XG4gICAgdGhpcy5fc2NvcGUgPSBzY29wZTtcbiAgfVxufVxuXG5QZXJzaXN0ZW50T2JqZWN0LnJlZ2lzdGVyKFN5bmNTdGF0ZSk7XG4iXX0=