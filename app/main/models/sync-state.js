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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL21vZGVscy9zeW5jLXN0YXRlLmpzIl0sIm5hbWVzIjpbIlN5bmNTdGF0ZSIsInRhYmxlTmFtZSIsImNvbHVtbnMiLCJuYW1lIiwiY29sdW1uIiwidHlwZSIsIm51bGwiLCJoYXNoIiwiX2hhc2giLCJzY29wZSIsIl9zY29wZSIsIlBlcnNpc3RlbnRPYmplY3QiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUVlLE1BQU1BLFNBQU4sQ0FBZ0I7QUFDVCxhQUFUQyxTQUFTLEdBQUc7QUFDckIsV0FBTyxZQUFQO0FBQ0Q7O0FBRWlCLGFBQVBDLE9BQU8sR0FBRztBQUNuQixXQUFPLENBQ0w7QUFBRUMsTUFBQUEsSUFBSSxFQUFFLGNBQVI7QUFBd0JDLE1BQUFBLE1BQU0sRUFBRSxZQUFoQztBQUE4Q0MsTUFBQUEsSUFBSSxFQUFFLFNBQXBEO0FBQStEQyxNQUFBQSxJQUFJLEVBQUU7QUFBckUsS0FESyxFQUVMO0FBQUVILE1BQUFBLElBQUksRUFBRSxVQUFSO0FBQW9CQyxNQUFBQSxNQUFNLEVBQUUsVUFBNUI7QUFBd0NDLE1BQUFBLElBQUksRUFBRSxRQUE5QztBQUF3REMsTUFBQUEsSUFBSSxFQUFFO0FBQTlELEtBRkssRUFHTDtBQUFFSCxNQUFBQSxJQUFJLEVBQUUsT0FBUjtBQUFpQkMsTUFBQUEsTUFBTSxFQUFFLE9BQXpCO0FBQWtDQyxNQUFBQSxJQUFJLEVBQUU7QUFBeEMsS0FISyxFQUlMO0FBQUVGLE1BQUFBLElBQUksRUFBRSxNQUFSO0FBQWdCQyxNQUFBQSxNQUFNLEVBQUUsTUFBeEI7QUFBZ0NDLE1BQUFBLElBQUksRUFBRTtBQUF0QyxLQUpLLENBQVA7QUFNRDs7QUFFTyxNQUFKRSxJQUFJLEdBQUc7QUFDVCxXQUFPLEtBQUtDLEtBQVo7QUFDRDs7QUFFTyxNQUFKRCxJQUFJLENBQUNBLElBQUQsRUFBTztBQUNiLFNBQUtDLEtBQUwsR0FBYUQsSUFBYjtBQUNEOztBQUVRLE1BQUxFLEtBQUssR0FBRztBQUNWLFdBQU8sS0FBS0MsTUFBWjtBQUNEOztBQUVRLE1BQUxELEtBQUssQ0FBQ0EsS0FBRCxFQUFRO0FBQ2YsU0FBS0MsTUFBTCxHQUFjRCxLQUFkO0FBQ0Q7O0FBNUI0Qjs7OztBQStCL0JFLHlCQUFpQkMsUUFBakIsQ0FBMEJaLFNBQTFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGVyc2lzdGVudE9iamVjdCB9IGZyb20gJ21pbmlkYic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN5bmNTdGF0ZSB7XG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xuICAgIHJldHVybiAnc3luY19zdGF0ZSc7XG4gIH1cblxuICBzdGF0aWMgZ2V0IGNvbHVtbnMoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHsgbmFtZTogJ2FjY291bnRSb3dJRCcsIGNvbHVtbjogJ2FjY291bnRfaWQnLCB0eXBlOiAnaW50ZWdlcicsIG51bGw6IGZhbHNlIH0sXG4gICAgICB7IG5hbWU6ICdyZXNvdXJjZScsIGNvbHVtbjogJ3Jlc291cmNlJywgdHlwZTogJ3N0cmluZycsIG51bGw6IGZhbHNlIH0sXG4gICAgICB7IG5hbWU6ICdzY29wZScsIGNvbHVtbjogJ3Njb3BlJywgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgIHsgbmFtZTogJ2hhc2gnLCBjb2x1bW46ICdoYXNoJywgdHlwZTogJ3N0cmluZycgfVxuICAgIF07XG4gIH1cblxuICBnZXQgaGFzaCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGFzaDtcbiAgfVxuXG4gIHNldCBoYXNoKGhhc2gpIHtcbiAgICB0aGlzLl9oYXNoID0gaGFzaDtcbiAgfVxuXG4gIGdldCBzY29wZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc2NvcGU7XG4gIH1cblxuICBzZXQgc2NvcGUoc2NvcGUpIHtcbiAgICB0aGlzLl9zY29wZSA9IHNjb3BlO1xuICB9XG59XG5cblBlcnNpc3RlbnRPYmplY3QucmVnaXN0ZXIoU3luY1N0YXRlKTtcbiJdfQ==