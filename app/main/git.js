"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _nodegit = _interopRequireDefault(require("nodegit"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Git {
  static async clone(url, path) {
    return await _nodegit.default.Clone(url, path);
  }

  static async init(path) {
    return await _nodegit.default.Repository.init(path, 0);
  }

  static async pull(path) {
    const repo = await _nodegit.default.Repository.open(path);
    await repo.fetchAll({
      callbacks: {
        credentials: function (url, userName) {
          return _nodegit.default.Cred.sshKeyFromAgent(userName);
        },
        certificateCheck: function () {
          return 1;
        }
      }
    });
    await repo.mergeBranches('master', 'origin/master');
  }

}

exports.default = Git;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluL2dpdC5qcyJdLCJuYW1lcyI6WyJHaXQiLCJjbG9uZSIsInVybCIsInBhdGgiLCJnaXQiLCJDbG9uZSIsImluaXQiLCJSZXBvc2l0b3J5IiwicHVsbCIsInJlcG8iLCJvcGVuIiwiZmV0Y2hBbGwiLCJjYWxsYmFja3MiLCJjcmVkZW50aWFscyIsInVzZXJOYW1lIiwiQ3JlZCIsInNzaEtleUZyb21BZ2VudCIsImNlcnRpZmljYXRlQ2hlY2siLCJtZXJnZUJyYW5jaGVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7QUFFZSxNQUFNQSxHQUFOLENBQVU7QUFDTCxlQUFMQyxLQUFLLENBQUNDLEdBQUQsRUFBTUMsSUFBTixFQUFZO0FBQzVCLFdBQU8sTUFBTUMsaUJBQUlDLEtBQUosQ0FBVUgsR0FBVixFQUFlQyxJQUFmLENBQWI7QUFDRDs7QUFFZ0IsZUFBSkcsSUFBSSxDQUFDSCxJQUFELEVBQU87QUFDdEIsV0FBTyxNQUFNQyxpQkFBSUcsVUFBSixDQUFlRCxJQUFmLENBQW9CSCxJQUFwQixFQUEwQixDQUExQixDQUFiO0FBQ0Q7O0FBRWdCLGVBQUpLLElBQUksQ0FBQ0wsSUFBRCxFQUFPO0FBQ3RCLFVBQU1NLElBQUksR0FBRyxNQUFNTCxpQkFBSUcsVUFBSixDQUFlRyxJQUFmLENBQW9CUCxJQUFwQixDQUFuQjtBQUVBLFVBQU1NLElBQUksQ0FBQ0UsUUFBTCxDQUFjO0FBQ2xCQyxNQUFBQSxTQUFTLEVBQUU7QUFDVEMsUUFBQUEsV0FBVyxFQUFFLFVBQVNYLEdBQVQsRUFBY1ksUUFBZCxFQUF3QjtBQUNuQyxpQkFBT1YsaUJBQUlXLElBQUosQ0FBU0MsZUFBVCxDQUF5QkYsUUFBekIsQ0FBUDtBQUNELFNBSFE7QUFJVEcsUUFBQUEsZ0JBQWdCLEVBQUUsWUFBVztBQUMzQixpQkFBTyxDQUFQO0FBQ0Q7QUFOUTtBQURPLEtBQWQsQ0FBTjtBQVdBLFVBQU1SLElBQUksQ0FBQ1MsYUFBTCxDQUFtQixRQUFuQixFQUE2QixlQUE3QixDQUFOO0FBQ0Q7O0FBeEJzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBnaXQgZnJvbSAnbm9kZWdpdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdCB7XG4gIHN0YXRpYyBhc3luYyBjbG9uZSh1cmwsIHBhdGgpIHtcbiAgICByZXR1cm4gYXdhaXQgZ2l0LkNsb25lKHVybCwgcGF0aCk7XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgaW5pdChwYXRoKSB7XG4gICAgcmV0dXJuIGF3YWl0IGdpdC5SZXBvc2l0b3J5LmluaXQocGF0aCwgMCk7XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgcHVsbChwYXRoKSB7XG4gICAgY29uc3QgcmVwbyA9IGF3YWl0IGdpdC5SZXBvc2l0b3J5Lm9wZW4ocGF0aCk7XG5cbiAgICBhd2FpdCByZXBvLmZldGNoQWxsKHtcbiAgICAgIGNhbGxiYWNrczoge1xuICAgICAgICBjcmVkZW50aWFsczogZnVuY3Rpb24odXJsLCB1c2VyTmFtZSkge1xuICAgICAgICAgIHJldHVybiBnaXQuQ3JlZC5zc2hLZXlGcm9tQWdlbnQodXNlck5hbWUpO1xuICAgICAgICB9LFxuICAgICAgICBjZXJ0aWZpY2F0ZUNoZWNrOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgYXdhaXQgcmVwby5tZXJnZUJyYW5jaGVzKCdtYXN0ZXInLCAnb3JpZ2luL21hc3RlcicpO1xuICB9XG59XG4iXX0=