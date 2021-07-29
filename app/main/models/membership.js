"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _minidb = require("minidb");

var _role = _interopRequireDefault(require("./role"));

var _fulcrumCore = require("fulcrum-core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Membership {
  constructor(attributes) {
    this.updateFromAPIAttributes(attributes);
  }

  updateFromAPIAttributes(attrs) {
    const attributes = attrs || {};
    this._id = attributes.id;
    this._firstName = attributes.first_name;
    this._lastName = attributes.last_name;
    this._userID = attributes.user_id;
    this._email = attributes.email;
    this._roleID = attributes.role_id;
    this._createdAt = _fulcrumCore.DateUtils.parseISOTimestamp(attributes.created_at);
    this._updatedAt = _fulcrumCore.DateUtils.parseISOTimestamp(attributes.updated_at);
  }

  get id() {
    return this._id;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  static get tableName() {
    return 'memberships';
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
      name: 'userID',
      column: 'user_resource_id',
      type: 'string',
      null: false
    }, {
      name: 'roleID',
      column: 'role_resource_id',
      type: 'string',
      null: false
    }, {
      name: 'roleRowID',
      column: 'role_id',
      type: 'integer',
      null: false
    }, {
      name: 'email',
      column: 'email',
      type: 'string',
      null: false
    }, {
      name: 'firstName',
      column: 'first_name',
      type: 'string',
      null: false
    }, {
      name: 'lastName',
      column: 'last_name',
      type: 'string',
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

  async getLocalRole() {
    this._role = await _role.default.findFirst(this.db, {
      resource_id: this._roleID
    });
    this._roleRowID = this._role ? this._role.rowID : null;
    return this._role;
  } // role


  getRole() {
    return this.loadOne('role', _role.default);
  }

  get role() {
    return this._role;
  }

  set role(role) {
    this.setOne('role', role);
  }

}

exports.default = Membership;

_minidb.PersistentObject.register(Membership);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL21vZGVscy9tZW1iZXJzaGlwLmpzIl0sIm5hbWVzIjpbIk1lbWJlcnNoaXAiLCJjb25zdHJ1Y3RvciIsImF0dHJpYnV0ZXMiLCJ1cGRhdGVGcm9tQVBJQXR0cmlidXRlcyIsImF0dHJzIiwiX2lkIiwiaWQiLCJfZmlyc3ROYW1lIiwiZmlyc3RfbmFtZSIsIl9sYXN0TmFtZSIsImxhc3RfbmFtZSIsIl91c2VySUQiLCJ1c2VyX2lkIiwiX2VtYWlsIiwiZW1haWwiLCJfcm9sZUlEIiwicm9sZV9pZCIsIl9jcmVhdGVkQXQiLCJEYXRlVXRpbHMiLCJwYXJzZUlTT1RpbWVzdGFtcCIsImNyZWF0ZWRfYXQiLCJfdXBkYXRlZEF0IiwidXBkYXRlZF9hdCIsInVwZGF0ZWRBdCIsInRhYmxlTmFtZSIsImNvbHVtbnMiLCJuYW1lIiwiY29sdW1uIiwidHlwZSIsIm51bGwiLCJnZXRMb2NhbFJvbGUiLCJfcm9sZSIsIlJvbGUiLCJmaW5kRmlyc3QiLCJkYiIsInJlc291cmNlX2lkIiwiX3JvbGVSb3dJRCIsInJvd0lEIiwiZ2V0Um9sZSIsImxvYWRPbmUiLCJyb2xlIiwic2V0T25lIiwiUGVyc2lzdGVudE9iamVjdCIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7QUFFZSxNQUFNQSxVQUFOLENBQWlCO0FBQzlCQyxFQUFBQSxXQUFXLENBQUNDLFVBQUQsRUFBYTtBQUN0QixTQUFLQyx1QkFBTCxDQUE2QkQsVUFBN0I7QUFDRDs7QUFFREMsRUFBQUEsdUJBQXVCLENBQUNDLEtBQUQsRUFBUTtBQUM3QixVQUFNRixVQUFVLEdBQUdFLEtBQUssSUFBSSxFQUE1QjtBQUVBLFNBQUtDLEdBQUwsR0FBV0gsVUFBVSxDQUFDSSxFQUF0QjtBQUNBLFNBQUtDLFVBQUwsR0FBa0JMLFVBQVUsQ0FBQ00sVUFBN0I7QUFDQSxTQUFLQyxTQUFMLEdBQWlCUCxVQUFVLENBQUNRLFNBQTVCO0FBQ0EsU0FBS0Ms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QUNDLE1BQUFBLFdBQVcsRUFBRSxLQUFLcEI7QUFBbkIsS0FBeEIsQ0FBbkI7QUFDQSxTQUFLcUIsVUFBTCxHQUFrQixLQUFLTCxLQUFMLEdBQWEsS0FBS0EsS0FBTCxDQUFXTSxLQUF4QixHQUFnQyxJQUFsRDtBQUNBLFdBQU8sS0FBS04sS0FBWjtBQUNELEdBbEQ2QixDQW9EOUI7OztBQUNBTyxFQUFBQSxPQUFPLEdBQUc7QUFDUixXQUFPLEtBQUtDLE9BQUwsQ0FBYSxNQUFiLEVBQXFCUCxhQUFyQixDQUFQO0FBQ0Q7O0FBRU8sTUFBSlEsSUFBSSxHQUFHO0FBQ1QsV0FBTyxLQUFLVCxLQUFaO0FBQ0Q7O0FBRU8sTUFBSlMsSUFBSSxDQUFDQSxJQUFELEVBQU87QUFDYixTQUFLQyxNQUFMLENBQVksTUFBWixFQUFvQkQsSUFBcEI7QUFDRDs7QUEvRDZCOzs7O0FBa0VoQ0UseUJBQWlCQyxRQUFqQixDQUEwQjNDLFVBQTFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGVyc2lzdGVudE9iamVjdCB9IGZyb20gJ21pbmlkYic7XG5pbXBvcnQgUm9sZSBmcm9tICcuL3JvbGUnO1xuaW1wb3J0IHsgRGF0ZVV0aWxzIH0gZnJvbSAnZnVsY3J1bS1jb3JlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVtYmVyc2hpcCB7XG4gIGNvbnN0cnVjdG9yKGF0dHJpYnV0ZXMpIHtcbiAgICB0aGlzLnVwZGF0ZUZyb21BUElBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpO1xuICB9XG5cbiAgdXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMoYXR0cnMpIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gYXR0cnMgfHwge307XG5cbiAgICB0aGlzLl9pZCA9IGF0dHJpYnV0ZXMuaWQ7XG4gICAgdGhpcy5fZmlyc3ROYW1lID0gYXR0cmlidXRlcy5maXJzdF9uYW1lO1xuICAgIHRoaXMuX2xhc3ROYW1lID0gYXR0cmlidXRlcy5sYXN0X25hbWU7XG4gICAgdGhpcy5fdXNlcklEID0gYXR0cmlidXRlcy51c2VyX2lkO1xuICAgIHRoaXMuX2VtYWlsID0gYXR0cmlidXRlcy5lbWFpbDtcbiAgICB0aGlzLl9yb2xlSUQgPSBhdHRyaWJ1dGVzLnJvbGVfaWQ7XG4gICAgdGhpcy5fY3JlYXRlZEF0ID0gRGF0ZVV0aWxzLnBhcnNlSVNPVGltZXN0YW1wKGF0dHJpYnV0ZXMuY3JlYXRlZF9hdCk7XG4gICAgdGhpcy5fdXBkYXRlZEF0ID0gRGF0ZVV0aWxzLnBhcnNlSVNPVGltZXN0YW1wKGF0dHJpYnV0ZXMudXBkYXRlZF9hdCk7XG4gIH1cblxuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lkO1xuICB9XG5cbiAgZ2V0IHVwZGF0ZWRBdCgpIHtcbiAgICByZXR1cm4gdGhpcy5fdXBkYXRlZEF0O1xuICB9XG5cbiAgc3RhdGljIGdldCB0YWJsZU5hbWUoKSB7XG4gICAgcmV0dXJuICdtZW1iZXJzaGlwcyc7XG4gIH1cblxuICBzdGF0aWMgZ2V0IGNvbHVtbnMoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHsgbmFtZTogJ2FjY291bnRSb3dJRCcsIGNvbHVtbjogJ2FjY291bnRfaWQnLCB0eXBlOiAnaW50ZWdlcicsIG51bGw6IGZhbHNlIH0sXG4gICAgICB7IG5hbWU6ICdpZCcsIGNvbHVtbjogJ3Jlc291cmNlX2lkJywgdHlwZTogJ3N0cmluZycsIG51bGw6IGZhbHNlIH0sXG4gICAgICB7IG5hbWU6ICd1c2VySUQnLCBjb2x1bW46ICd1c2VyX3Jlc291cmNlX2lkJywgdHlwZTogJ3N0cmluZycsIG51bGw6IGZhbHNlIH0sXG4gICAgICB7IG5hbWU6ICdyb2xlSUQnLCBjb2x1bW46ICdyb2xlX3Jlc291cmNlX2lkJywgdHlwZTogJ3N0cmluZycsIG51bGw6IGZhbHNlIH0sXG4gICAgICB7IG5hbWU6ICdyb2xlUm93SUQnLCBjb2x1bW46ICdyb2xlX2lkJywgdHlwZTogJ2ludGVnZXInLCBudWxsOiBmYWxzZSB9LFxuICAgICAgeyBuYW1lOiAnZW1haWwnLCBjb2x1bW46ICdlbWFpbCcsIHR5cGU6ICdzdHJpbmcnLCBudWxsOiBmYWxzZSB9LFxuICAgICAgeyBuYW1lOiAnZmlyc3ROYW1lJywgY29sdW1uOiAnZmlyc3RfbmFtZScsIHR5cGU6ICdzdHJpbmcnLCBudWxsOiBmYWxzZSB9LFxuICAgICAgeyBuYW1lOiAnbGFzdE5hbWUnLCBjb2x1bW46ICdsYXN0X25hbWUnLCB0eXBlOiAnc3RyaW5nJywgbnVsbDogZmFsc2UgfSxcbiAgICAgIHsgbmFtZTogJ2NyZWF0ZWRBdCcsIGNvbHVtbjogJ3NlcnZlcl9jcmVhdGVkX2F0JywgdHlwZTogJ2RhdGV0aW1lJyB9LFxuICAgICAgeyBuYW1lOiAndXBkYXRlZEF0JywgY29sdW1uOiAnc2VydmVyX3VwZGF0ZWRfYXQnLCB0eXBlOiAnZGF0ZXRpbWUnIH0sXG4gICAgICB7IG5hbWU6ICdkZWxldGVkQXQnLCBjb2x1bW46ICdkZWxldGVkX2F0JywgdHlwZTogJ2RhdGV0aW1lJyB9XG4gICAgXTtcbiAgfVxuXG4gIGFzeW5jIGdldExvY2FsUm9sZSgpIHtcbiAgICB0aGlzLl9yb2xlID0gYXdhaXQgUm9sZS5maW5kRmlyc3QodGhpcy5kYiwge3Jlc291cmNlX2lkOiB0aGlzLl9yb2xlSUR9KTtcbiAgICB0aGlzLl9yb2xlUm93SUQgPSB0aGlzLl9yb2xlID8gdGhpcy5fcm9sZS5yb3dJRCA6IG51bGw7XG4gICAgcmV0dXJuIHRoaXMuX3JvbGU7XG4gIH1cblxuICAvLyByb2xlXG4gIGdldFJvbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMubG9hZE9uZSgncm9sZScsIFJvbGUpO1xuICB9XG5cbiAgZ2V0IHJvbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JvbGU7XG4gIH1cblxuICBzZXQgcm9sZShyb2xlKSB7XG4gICAgdGhpcy5zZXRPbmUoJ3JvbGUnLCByb2xlKTtcbiAgfVxufVxuXG5QZXJzaXN0ZW50T2JqZWN0LnJlZ2lzdGVyKE1lbWJlcnNoaXApO1xuIl19