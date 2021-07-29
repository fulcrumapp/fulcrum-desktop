"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class _default {
  constructor() {
    _defineProperty(this, "runCommand", async () => {
      await this.app.activatePlugins();
      const account = await fulcrum.fetchAccount(fulcrum.args.org);

      if (account == null) {
        fulcrum.logger.error('Unable to find organization:', fulcrum.args.org);
        return;
      }

      await account.reset();
    });
  }

  async task(cli) {
    return cli.command({
      command: 'reset',
      desc: 'reset an organization',
      builder: {
        org: {
          desc: 'organization name',
          required: true,
          type: 'string'
        }
      },
      handler: this.runCommand
    });
  }

}

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9yZXNldC5qcyJdLCJuYW1lcyI6WyJhcHAiLCJhY3RpdmF0ZVBsdWdpbnMiLCJhY2NvdW50IiwiZnVsY3J1bSIsImZldGNoQWNjb3VudCIsImFyZ3MiLCJvcmciLCJsb2dnZXIiLCJlcnJvciIsInJlc2V0IiwidGFzayIsImNsaSIsImNvbW1hbmQiLCJkZXNjIiwiYnVpbGRlciIsInJlcXVpcmVkIiwidHlwZSIsImhhbmRsZXIiLCJydW5Db21tYW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBZSxlQUFNO0FBQUE7QUFBQSx3Q0FnQk4sWUFBWTtBQUN2QixZQUFNLEtBQUtBLEdBQUwsQ0FBU0MsZUFBVCxFQUFOO0FBRUEsWUFBTUMsT0FBTyxHQUFHLE1BQU1DLE9BQU8sQ0FBQ0MsWUFBUixDQUFxQkQsT0FBTyxDQUFDRSxJQUFSLENBQWFDLEdBQWxDLENBQXRCOztBQUVBLFVBQUlKLE9BQU8sSUFBSSxJQUFmLEVBQXFCO0FBQ25CQyxRQUFBQSxPQUFPLENBQUNJLE1BQVIsQ0FBZUMsS0FBZixDQUFxQiw4QkFBckIsRUFBcURMLE9BQU8sQ0FBQ0UsSUFBUixDQUFhQyxHQUFsRTtBQUNBO0FBQ0Q7O0FBRUQsWUFBTUosT0FBTyxDQUFDTyxLQUFSLEVBQU47QUFDRCxLQTNCa0I7QUFBQTs7QUFDVCxRQUFKQyxJQUFJLENBQUNDLEdBQUQsRUFBTTtBQUNkLFdBQU9BLEdBQUcsQ0FBQ0MsT0FBSixDQUFZO0FBQ2pCQSxNQUFBQSxPQUFPLEVBQUUsT0FEUTtBQUVqQkMsTUFBQUEsSUFBSSxFQUFFLHVCQUZXO0FBR2pCQyxNQUFBQSxPQUFPLEVBQUU7QUFDUFIsUUFBQUEsR0FBRyxFQUFFO0FBQ0hPLFVBQUFBLElBQUksRUFBRSxtQkFESDtBQUVIRSxVQUFBQSxRQUFRLEVBQUUsSUFGUDtBQUdIQyxVQUFBQSxJQUFJLEVBQUU7QUFISDtBQURFLE9BSFE7QUFVakJDLE1BQUFBLE9BQU8sRUFBRSxLQUFLQztBQVZHLEtBQVosQ0FBUDtBQVlEOztBQWRrQiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgYXN5bmMgdGFzayhjbGkpIHtcbiAgICByZXR1cm4gY2xpLmNvbW1hbmQoe1xuICAgICAgY29tbWFuZDogJ3Jlc2V0JyxcbiAgICAgIGRlc2M6ICdyZXNldCBhbiBvcmdhbml6YXRpb24nLFxuICAgICAgYnVpbGRlcjoge1xuICAgICAgICBvcmc6IHtcbiAgICAgICAgICBkZXNjOiAnb3JnYW5pemF0aW9uIG5hbWUnLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBoYW5kbGVyOiB0aGlzLnJ1bkNvbW1hbmRcbiAgICB9KTtcbiAgfVxuXG4gIHJ1bkNvbW1hbmQgPSBhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgdGhpcy5hcHAuYWN0aXZhdGVQbHVnaW5zKCk7XG5cbiAgICBjb25zdCBhY2NvdW50ID0gYXdhaXQgZnVsY3J1bS5mZXRjaEFjY291bnQoZnVsY3J1bS5hcmdzLm9yZyk7XG5cbiAgICBpZiAoYWNjb3VudCA9PSBudWxsKSB7XG4gICAgICBmdWxjcnVtLmxvZ2dlci5lcnJvcignVW5hYmxlIHRvIGZpbmQgb3JnYW5pemF0aW9uOicsIGZ1bGNydW0uYXJncy5vcmcpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGF3YWl0IGFjY291bnQucmVzZXQoKTtcbiAgfVxufVxuIl19