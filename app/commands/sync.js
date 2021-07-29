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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9zeW5jLmpzIl0sIm5hbWVzIjpbImFwcCIsImFjdGl2YXRlUGx1Z2lucyIsImFjY291bnQiLCJmdWxjcnVtIiwiZmV0Y2hBY2NvdW50IiwiYXJncyIsIm9yZyIsImxvZ2dlciIsImVycm9yIiwiY2xlYW4iLCJyZXNldCIsInN5bmNMb29wIiwiZnVsbCIsInRhc2siLCJjbGkiLCJjb21tYW5kIiwiZGVzYyIsImJ1aWxkZXIiLCJyZXF1aXJlZCIsInR5cGUiLCJmb3JldmVyIiwiZGVmYXVsdCIsImRlc2NyaWJlIiwiaGFuZGxlciIsInJ1bkNvbW1hbmQiLCJmdWxsU3luYyIsInN5bmMiLCJkYXRhU291cmNlIiwiY3JlYXRlRGF0YVNvdXJjZSIsInN5bmNocm9uaXplciIsIlN5bmNocm9uaXplciIsInJ1biIsImZvcm0iLCJleCIsImludGVydmFsIiwiUHJvbWlzZSIsInJlc29sdmUiLCJzZXRUaW1lb3V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7OztBQUVlLGVBQU07QUFBQTtBQUFBLHdDQTBCTixZQUFZO0FBQ3ZCLFlBQU0sS0FBS0EsR0FBTCxDQUFTQyxlQUFULEVBQU47QUFFQSxZQUFNQyxPQUFPLEdBQUcsTUFBTUMsT0FBTyxDQUFDQyxZQUFSLENBQXFCRCxPQUFPLENBQUNFLElBQVIsQ0FBYUMsR0FBbEMsQ0FBdEI7O0FBRUEsVUFBSUosT0FBTyxJQUFJLElBQWYsRUFBcUI7QUFDbkJDLFFBQUFBLE9BQU8sQ0FBQ0ksTUFBUixDQUFlQyxLQUFmLENBQXFCLDhCQUFyQixFQUFxREwsT0FBTyxDQUFDRSxJQUFSLENBQWFDLEdBQWxFO0FBQ0E7QUFDRDs7QUFFRCxVQUFJSCxPQUFPLENBQUNFLElBQVIsQ0FBYUksS0FBakIsRUFBd0I7QUFDdEIsY0FBTVAsT0FBTyxDQUFDUSxLQUFSLEVBQU47QUFDRDs7QUFFRCxZQUFNLEtBQUtDLFFBQUwsQ0FBY1QsT0FBZCxFQUF1QkMsT0FBTyxDQUFDRSxJQUFSLENBQWFPLElBQXBDLENBQU47QUFDRCxLQXpDa0I7QUFBQTs7QUFDVCxRQUFKQyxJQUFJLENBQUNDLEdBQUQsRUFBTTtBQUNkLFdBQU9BLEdBQUcsQ0FBQ0MsT0FBSixDQUFZO0FBQ2pCQSxNQUFBQSxPQUFPLEVBQUUsTUFEUTtBQUVqQkMsTUFBQUEsSUFBSSxFQUFFLHNCQUZXO0FBR2pCQyxNQUFBQSxPQUFPLEVBQUU7QUFDUFgsUUFBQUEsR0FBRyxFQUFFO0FBQ0hVLFVBQUFBLElBQUksRUFBRSxtQkFESDtBQUVIRSxVQUFBQSxRQUFRLEVBQUUsSUFGUDtBQUdIQyxVQUFBQSxJQUFJLEVBQUU7QUFISCxTQURFO0FBTVBDLFFBQUFBLE9BQU8sRUFBRTtBQUNQQyxVQUFBQSxPQUFPLEVBQUUsS0FERjtBQUVQRixVQUFBQSxJQUFJLEVBQUUsU0FGQztBQUdQRyxVQUFBQSxRQUFRLEVBQUU7QUFISCxTQU5GO0FBV1BiLFFBQUFBLEtBQUssRUFBRTtBQUNMWSxVQUFBQSxPQUFPLEVBQUUsS0FESjtBQUVMRixVQUFBQSxJQUFJLEVBQUUsU0FGRDtBQUdMRyxVQUFBQSxRQUFRLEVBQUU7QUFITDtBQVhBLE9BSFE7QUFvQmpCQyxNQUFBQSxPQUFPLEVBQUUsS0FBS0M7QUFwQkcsS0FBWixDQUFQO0FBc0JEOztBQW1CYSxRQUFSYixRQUFRLENBQUNULE9BQUQsRUFBVXVCLFFBQVYsRUFBb0I7QUFDaEMsVUFBTUMsSUFBSSxHQUFHLElBQWI7QUFFQSxVQUFNQyxVQUFVLEdBQUcsTUFBTXhCLE9BQU8sQ0FBQ3lCLGdCQUFSLENBQXlCMUIsT0FBekIsQ0FBekI7O0FBRUEsV0FBT3dCLElBQVAsRUFBYTtBQUNYLFlBQU1HLFlBQVksR0FBRyxJQUFJQyxxQkFBSixFQUFyQjs7QUFFQSxVQUFJO0FBQ0YsY0FBTUQsWUFBWSxDQUFDRSxHQUFiLENBQWlCN0IsT0FBakIsRUFBMEJDLE9BQU8sQ0FBQ0UsSUFBUixDQUFhMkIsSUFBdkMsRUFBNkNMLFVBQTdDLEVBQXlEO0FBQUNGLFVBQUFBO0FBQUQsU0FBekQsQ0FBTjtBQUNELE9BRkQsQ0FFRSxPQUFPUSxFQUFQLEVBQVc7QUFDWDlCLFFBQUFBLE9BQU8sQ0FBQ0ksTUFBUixDQUFlQyxLQUFmLENBQXFCeUIsRUFBckI7QUFDRDs7QUFFRFIsTUFBQUEsUUFBUSxHQUFHLEtBQVg7O0FBRUEsVUFBSSxDQUFDdEIsT0FBTyxDQUFDRSxJQUFSLENBQWFlLE9BQWxCLEVBQTJCO0FBQ3pCO0FBQ0Q7O0FBRUQsWUFBTWMsUUFBUSxHQUFHL0IsT0FBTyxDQUFDRSxJQUFSLENBQWE2QixRQUFiLEdBQXlCLENBQUMvQixPQUFPLENBQUNFLElBQVIsQ0FBYTZCLFFBQWQsR0FBeUIsSUFBbEQsR0FBMEQsS0FBM0U7QUFFQSxZQUFNLElBQUlDLE9BQUosQ0FBYUMsT0FBRCxJQUFhQyxVQUFVLENBQUNELE9BQUQsRUFBVUYsUUFBVixDQUFuQyxDQUFOO0FBQ0Q7QUFDRjs7QUFuRWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN5bmNocm9uaXplciBmcm9tICcuLi9zeW5jL3N5bmNocm9uaXplcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgYXN5bmMgdGFzayhjbGkpIHtcbiAgICByZXR1cm4gY2xpLmNvbW1hbmQoe1xuICAgICAgY29tbWFuZDogJ3N5bmMnLFxuICAgICAgZGVzYzogJ3N5bmMgYW4gb3JnYW5pemF0aW9uJyxcbiAgICAgIGJ1aWxkZXI6IHtcbiAgICAgICAgb3JnOiB7XG4gICAgICAgICAgZGVzYzogJ29yZ2FuaXphdGlvbiBuYW1lJyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICB9LFxuICAgICAgICBmb3JldmVyOiB7XG4gICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgIGRlc2NyaWJlOiAna2VlcCB0aGUgc3luYyBydW5uaW5nIGZvcmV2ZXInXG4gICAgICAgIH0sXG4gICAgICAgIGNsZWFuOiB7XG4gICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgIGRlc2NyaWJlOiAnc3RhcnQgYSBjbGVhbiBzeW5jLCBhbGwgZGF0YSB3aWxsIGJlIGRlbGV0ZWQgYmVmb3JlIHN0YXJ0aW5nJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaGFuZGxlcjogdGhpcy5ydW5Db21tYW5kXG4gICAgfSk7XG4gIH1cblxuICBydW5Db21tYW5kID0gYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IHRoaXMuYXBwLmFjdGl2YXRlUGx1Z2lucygpO1xuXG4gICAgY29uc3QgYWNjb3VudCA9IGF3YWl0IGZ1bGNydW0uZmV0Y2hBY2NvdW50KGZ1bGNydW0uYXJncy5vcmcpO1xuXG4gICAgaWYgKGFjY291bnQgPT0gbnVsbCkge1xuICAgICAgZnVsY3J1bS5sb2dnZXIuZXJyb3IoJ1VuYWJsZSB0byBmaW5kIG9yZ2FuaXphdGlvbjonLCBmdWxjcnVtLmFyZ3Mub3JnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZnVsY3J1bS5hcmdzLmNsZWFuKSB7XG4gICAgICBhd2FpdCBhY2NvdW50LnJlc2V0KCk7XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5zeW5jTG9vcChhY2NvdW50LCBmdWxjcnVtLmFyZ3MuZnVsbCk7XG4gIH1cblxuICBhc3luYyBzeW5jTG9vcChhY2NvdW50LCBmdWxsU3luYykge1xuICAgIGNvbnN0IHN5bmMgPSB0cnVlO1xuXG4gICAgY29uc3QgZGF0YVNvdXJjZSA9IGF3YWl0IGZ1bGNydW0uY3JlYXRlRGF0YVNvdXJjZShhY2NvdW50KTtcblxuICAgIHdoaWxlIChzeW5jKSB7XG4gICAgICBjb25zdCBzeW5jaHJvbml6ZXIgPSBuZXcgU3luY2hyb25pemVyKCk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHN5bmNocm9uaXplci5ydW4oYWNjb3VudCwgZnVsY3J1bS5hcmdzLmZvcm0sIGRhdGFTb3VyY2UsIHtmdWxsU3luY30pO1xuICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgZnVsY3J1bS5sb2dnZXIuZXJyb3IoZXgpO1xuICAgICAgfVxuXG4gICAgICBmdWxsU3luYyA9IGZhbHNlO1xuXG4gICAgICBpZiAoIWZ1bGNydW0uYXJncy5mb3JldmVyKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpbnRlcnZhbCA9IGZ1bGNydW0uYXJncy5pbnRlcnZhbCA/ICgrZnVsY3J1bS5hcmdzLmludGVydmFsICogMTAwMCkgOiAxNTAwMDtcblxuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgaW50ZXJ2YWwpKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==