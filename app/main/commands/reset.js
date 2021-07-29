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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL3Jlc2V0LmpzIl0sIm5hbWVzIjpbImFwcCIsImFjdGl2YXRlUGx1Z2lucyIsImFjY291bnQiLCJmdWxjcnVtIiwiZmV0Y2hBY2NvdW50IiwiYXJncyIsIm9yZyIsImxvZ2dlciIsImVycm9yIiwicmVzZXQiLCJ0YXNrIiwiY2xpIiwiY29tbWFuZCIsImRlc2MiLCJidWlsZGVyIiwicmVxdWlyZWQiLCJ0eXBlIiwiaGFuZGxlciIsInJ1bkNvbW1hbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFlLGVBQU07QUFBQTtBQUFBLHdDQWdCTixZQUFZO0FBQ3ZCLFlBQU0sS0FBS0EsR0FBTCxDQUFTQyxlQUFULEVBQU47QUFFQSxZQUFNQyxPQUFPLEdBQUcsTUFBTUMsT0FBTyxDQUFDQyxZQUFSLENBQXFCRCxPQUFPLENBQUNFLElBQVIsQ0FBYUMsR0FBbEMsQ0FBdEI7O0FBRUEsVUFBSUosT0FBTyxJQUFJLElBQWYsRUFBcUI7QUFDbkJDLFFBQUFBLE9BQU8sQ0FBQ0ksTUFBUixDQUFlQyxLQUFmLENBQXFCLDhCQUFyQixFQUFxREwsT0FBTyxDQUFDRSxJQUFSLENBQWFDLEdBQWxFO0FBQ0E7QUFDRDs7QUFFRCxZQUFNSixPQUFPLENBQUNPLEtBQVIsRUFBTjtBQUNELEtBM0JrQjtBQUFBOztBQUNULFFBQUpDLElBQUksQ0FBQ0MsR0FBRCxFQUFNO0FBQ2QsV0FBT0EsR0FBRyxDQUFDQyxPQUFKLENBQVk7QUFDakJBLE1BQUFBLE9BQU8sRUFBRSxPQURRO0FBRWpCQyxNQUFBQSxJQUFJLEVBQUUsdUJBRlc7QUFHakJDLE1BQUFBLE9BQU8sRUFBRTtBQUNQUixRQUFBQSxHQUFHLEVBQUU7QUFDSE8sVUFBQUEsSUFBSSxFQUFFLG1CQURIO0FBRUhFLFVBQUFBLFFBQVEsRUFBRSxJQUZQO0FBR0hDLFVBQUFBLElBQUksRUFBRTtBQUhIO0FBREUsT0FIUTtBQVVqQkMsTUFBQUEsT0FBTyxFQUFFLEtBQUtDO0FBVkcsS0FBWixDQUFQO0FBWUQ7O0FBZGtCIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICBhc3luYyB0YXNrKGNsaSkge1xuICAgIHJldHVybiBjbGkuY29tbWFuZCh7XG4gICAgICBjb21tYW5kOiAncmVzZXQnLFxuICAgICAgZGVzYzogJ3Jlc2V0IGFuIG9yZ2FuaXphdGlvbicsXG4gICAgICBidWlsZGVyOiB7XG4gICAgICAgIG9yZzoge1xuICAgICAgICAgIGRlc2M6ICdvcmdhbml6YXRpb24gbmFtZScsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGhhbmRsZXI6IHRoaXMucnVuQ29tbWFuZFxuICAgIH0pO1xuICB9XG5cbiAgcnVuQ29tbWFuZCA9IGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCB0aGlzLmFwcC5hY3RpdmF0ZVBsdWdpbnMoKTtcblxuICAgIGNvbnN0IGFjY291bnQgPSBhd2FpdCBmdWxjcnVtLmZldGNoQWNjb3VudChmdWxjcnVtLmFyZ3Mub3JnKTtcblxuICAgIGlmIChhY2NvdW50ID09IG51bGwpIHtcbiAgICAgIGZ1bGNydW0ubG9nZ2VyLmVycm9yKCdVbmFibGUgdG8gZmluZCBvcmdhbml6YXRpb246JywgZnVsY3J1bS5hcmdzLm9yZyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYXdhaXQgYWNjb3VudC5yZXNldCgpO1xuICB9XG59XG4iXX0=