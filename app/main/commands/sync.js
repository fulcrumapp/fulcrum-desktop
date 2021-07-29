"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _synchronizer = _interopRequireDefault(require("../sync/synchronizer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

      if (fulcrum.args.clean) {
        await account.reset();
      }

      await this.syncLoop(account, fulcrum.args.full);
    });
  }

  async task(cli) {
    return cli.command({
      command: 'sync',
      desc: 'sync an organization',
      builder: {
        org: {
          desc: 'organization name',
          required: true,
          type: 'string'
        },
        forever: {
          default: false,
          type: 'boolean',
          describe: 'keep the sync running forever'
        },
        clean: {
          default: false,
          type: 'boolean',
          describe: 'start a clean sync, all data will be deleted before starting'
        }
      },
      handler: this.runCommand
    });
  }

  async syncLoop(account, fullSync) {
    const sync = true;
    const dataSource = await fulcrum.createDataSource(account);

    while (sync) {
      const synchronizer = new _synchronizer.default();

      try {
        await synchronizer.run(account, fulcrum.args.form, dataSource, {
          fullSync
        });
      } catch (ex) {
        fulcrum.logger.error(ex);
      }

      fullSync = false;

      if (!fulcrum.args.forever) {
        break;
      }

      const interval = fulcrum.args.interval ? +fulcrum.args.interval * 1000 : 15000;
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }

}

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL3N5bmMuanMiXSwibmFtZXMiOlsiYXBwIiwiYWN0aXZhdGVQbHVnaW5zIiwiYWNjb3VudCIsImZ1bGNydW0iLCJmZXRjaEFjY291bnQiLCJhcmdzIiwib3JnIiwibG9nZ2VyIiwiZXJyb3IiLCJjbGVhbiIsInJlc2V0Iiwic3luY0xvb3AiLCJmdWxsIiwidGFzayIsImNsaSIsImNvbW1hbmQiLCJkZXNjIiwiYnVpbGRlciIsInJlcXVpcmVkIiwidHlwZSIsImZvcmV2ZXIiLCJkZWZhdWx0IiwiZGVzY3JpYmUiLCJoYW5kbGVyIiwicnVuQ29tbWFuZCIsImZ1bGxTeW5jIiwic3luYyIsImRhdGFTb3VyY2UiLCJjcmVhdGVEYXRhU291cmNlIiwic3luY2hyb25pemVyIiwiU3luY2hyb25pemVyIiwicnVuIiwiZm9ybSIsImV4IiwiaW50ZXJ2YWwiLCJQcm9taXNlIiwicmVzb2x2ZSIsInNldFRpbWVvdXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7Ozs7O0FBRWUsZUFBTTtBQUFBO0FBQUEsd0NBMEJOLFlBQVk7QUFDdkIsWUFBTSxLQUFLQSxHQUFMLENBQVNDLGVBQVQsRUFBTjtBQUVBLFlBQU1DLE9BQU8sR0FBRyxNQUFNQyxPQUFPLENBQUNDLFlBQVIsQ0FBcUJELE9BQU8sQ0FBQ0UsSUFBUixDQUFhQyxHQUFsQyxDQUF0Qjs7QUFFQSxVQUFJSixPQUFPLElBQUksSUFBZixFQUFxQjtBQUNuQkMsUUFBQUEsT0FBTyxDQUFDSSxNQUFSLENBQWVDLEtBQWYsQ0FBcUIsOEJBQXJCLEVBQXFETCxPQUFPLENBQUNFLElBQVIsQ0FBYUMsR0FBbEU7QUFDQTtBQUNEOztBQUVELFVBQUlILE9BQU8sQ0FBQ0UsSUFBUixDQUFhSSxLQUFqQixFQUF3QjtBQUN0QixjQUFNUCxPQUFPLENBQUNRLEtBQVIsRUFBTjtBQUNEOztBQUVELFlBQU0sS0FBS0MsUUFBTCxDQUFjVCxPQUFkLEVBQXVCQyxPQUFPLENBQUNFLElBQVIsQ0FBYU8sSUFBcEMsQ0FBTjtBQUNELEtBekNrQjtBQUFBOztBQUNULFFBQUpDLElBQUksQ0FBQ0MsR0FBRCxFQUFNO0FBQ2QsV0FBT0EsR0FBRyxDQUFDQyxPQUFKLENBQVk7QUFDakJBLE1BQUFBLE9BQU8sRUFBRSxNQURRO0FBRWpCQyxNQUFBQSxJQUFJLEVBQUUsc0JBRlc7QUFHakJDLE1BQUFBLE9BQU8sRUFBRTtBQUNQWCxRQUFBQSxHQUFHLEVBQUU7QUFDSFUsVUFBQUEsSUFBSSxFQUFFLG1CQURIO0FBRUhFLFVBQUFBLFFBQVEsRUFBRSxJQUZQO0FBR0hDLFVBQUFBLElBQUksRUFBRTtBQUhILFNBREU7QUFNUEMsUUFBQUEsT0FBTyxFQUFFO0FBQ1BDLFVBQUFBLE9BQU8sRUFBRSxLQURGO0FBRVBGLFVBQUFBLElBQUksRUFBRSxTQUZDO0FBR1BHLFVBQUFBLFFBQVEsRUFBRTtBQUhILFNBTkY7QUFXUGIsUUFBQUEsS0FBSyxFQUFFO0FBQ0xZLFVBQUFBLE9BQU8sRUFBRSxLQURKO0FBRUxGLFVBQUFBLElBQUksRUFBRSxTQUZEO0FBR0xHLFVBQUFBLFFBQVEsRUFBRTtBQUhMO0FBWEEsT0FIUTtBQW9CakJDLE1BQUFBLE9BQU8sRUFBRSxLQUFLQztBQXBCRyxLQUFaLENBQVA7QUFzQkQ7O0FBbUJhLFFBQVJiLFFBQVEsQ0FBQ1QsT0FBRCxFQUFVdUIsUUFBVixFQUFvQjtBQUNoQyxVQUFNQyxJQUFJLEdBQUcsSUFBYjtBQUVBLFVBQU1DLFVBQVUsR0FBRyxNQUFNeEIsT0FBTyxDQUFDeUIsZ0JBQVIsQ0FBeUIxQixPQUF6QixDQUF6Qjs7QUFFQSxXQUFPd0IsSUFBUCxFQUFhO0FBQ1gsWUFBTUcsWUFBWSxHQUFHLElBQUlDLHFCQUFKLEVBQXJCOztBQUVBLFVBQUk7QUFDRixjQUFNRCxZQUFZLENBQUNFLEdBQWIsQ0FBaUI3QixPQUFqQixFQUEwQkMsT0FBTyxDQUFDRSxJQUFSLENBQWEyQixJQUF2QyxFQUE2Q0wsVUFBN0MsRUFBeUQ7QUFBQ0YsVUFBQUE7QUFBRCxTQUF6RCxDQUFOO0FBQ0QsT0FGRCxDQUVFLE9BQU9RLEVBQVAsRUFBVztBQUNYOUIsUUFBQUEsT0FBTyxDQUFDSSxNQUFSLENBQWVDLEtBQWYsQ0FBcUJ5QixFQUFyQjtBQUNEOztBQUVEUixNQUFBQSxRQUFRLEdBQUcsS0FBWDs7QUFFQSxVQUFJLENBQUN0QixPQUFPLENBQUNFLElBQVIsQ0FBYWUsT0FBbEIsRUFBMkI7QUFDekI7QUFDRDs7QUFFRCxZQUFNYyxRQUFRLEdBQUcvQixPQUFPLENBQUNFLElBQVIsQ0FBYTZCLFFBQWIsR0FBeUIsQ0FBQy9CLE9BQU8sQ0FBQ0UsSUFBUixDQUFhNkIsUUFBZCxHQUF5QixJQUFsRCxHQUEwRCxLQUEzRTtBQUVBLFlBQU0sSUFBSUMsT0FBSixDQUFhQyxPQUFELElBQWFDLFVBQVUsQ0FBQ0QsT0FBRCxFQUFVRixRQUFWLENBQW5DLENBQU47QUFDRDtBQUNGOztBQW5Fa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3luY2hyb25pemVyIGZyb20gJy4uL3N5bmMvc3luY2hyb25pemVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICBhc3luYyB0YXNrKGNsaSkge1xuICAgIHJldHVybiBjbGkuY29tbWFuZCh7XG4gICAgICBjb21tYW5kOiAnc3luYycsXG4gICAgICBkZXNjOiAnc3luYyBhbiBvcmdhbml6YXRpb24nLFxuICAgICAgYnVpbGRlcjoge1xuICAgICAgICBvcmc6IHtcbiAgICAgICAgICBkZXNjOiAnb3JnYW5pemF0aW9uIG5hbWUnLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIH0sXG4gICAgICAgIGZvcmV2ZXI6IHtcbiAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgZGVzY3JpYmU6ICdrZWVwIHRoZSBzeW5jIHJ1bm5pbmcgZm9yZXZlcidcbiAgICAgICAgfSxcbiAgICAgICAgY2xlYW46IHtcbiAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgZGVzY3JpYmU6ICdzdGFydCBhIGNsZWFuIHN5bmMsIGFsbCBkYXRhIHdpbGwgYmUgZGVsZXRlZCBiZWZvcmUgc3RhcnRpbmcnXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBoYW5kbGVyOiB0aGlzLnJ1bkNvbW1hbmRcbiAgICB9KTtcbiAgfVxuXG4gIHJ1bkNvbW1hbmQgPSBhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgdGhpcy5hcHAuYWN0aXZhdGVQbHVnaW5zKCk7XG5cbiAgICBjb25zdCBhY2NvdW50ID0gYXdhaXQgZnVsY3J1bS5mZXRjaEFjY291bnQoZnVsY3J1bS5hcmdzLm9yZyk7XG5cbiAgICBpZiAoYWNjb3VudCA9PSBudWxsKSB7XG4gICAgICBmdWxjcnVtLmxvZ2dlci5lcnJvcignVW5hYmxlIHRvIGZpbmQgb3JnYW5pemF0aW9uOicsIGZ1bGNydW0uYXJncy5vcmcpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChmdWxjcnVtLmFyZ3MuY2xlYW4pIHtcbiAgICAgIGF3YWl0IGFjY291bnQucmVzZXQoKTtcbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLnN5bmNMb29wKGFjY291bnQsIGZ1bGNydW0uYXJncy5mdWxsKTtcbiAgfVxuXG4gIGFzeW5jIHN5bmNMb29wKGFjY291bnQsIGZ1bGxTeW5jKSB7XG4gICAgY29uc3Qgc3luYyA9IHRydWU7XG5cbiAgICBjb25zdCBkYXRhU291cmNlID0gYXdhaXQgZnVsY3J1bS5jcmVhdGVEYXRhU291cmNlKGFjY291bnQpO1xuXG4gICAgd2hpbGUgKHN5bmMpIHtcbiAgICAgIGNvbnN0IHN5bmNocm9uaXplciA9IG5ldyBTeW5jaHJvbml6ZXIoKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgc3luY2hyb25pemVyLnJ1bihhY2NvdW50LCBmdWxjcnVtLmFyZ3MuZm9ybSwgZGF0YVNvdXJjZSwge2Z1bGxTeW5jfSk7XG4gICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICBmdWxjcnVtLmxvZ2dlci5lcnJvcihleCk7XG4gICAgICB9XG5cbiAgICAgIGZ1bGxTeW5jID0gZmFsc2U7XG5cbiAgICAgIGlmICghZnVsY3J1bS5hcmdzLmZvcmV2ZXIpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGludGVydmFsID0gZnVsY3J1bS5hcmdzLmludGVydmFsID8gKCtmdWxjcnVtLmFyZ3MuaW50ZXJ2YWwgKiAxMDAwKSA6IDE1MDAwO1xuXG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBpbnRlcnZhbCkpO1xuICAgIH1cbiAgfVxufVxuIl19