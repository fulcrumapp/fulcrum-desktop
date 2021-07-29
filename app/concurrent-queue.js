"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _async = require("async");

const DEFAULT_CONCURRENCY = 5;

class ConcurrentQueue {
  constructor(worker, concurrency) {
    this.worker = worker;
    this.queue = (0, _async.queue)((task, callback) => {
      this.worker(task).then(callback).catch(callback);
    }, concurrency || DEFAULT_CONCURRENCY);

    this.queue.drain = () => {
      if (this.drainResolver) {
        this.drainResolver();
        this.drainResolver = null;
      }
    };
  }

  push(task, handler) {
    this.queue.push(task, handler);
  }

  drain() {
    return new Promise((resolve, reject) => {
      if (this.queue.idle()) {
        resolve();
      } else {
        this.drainResolver = resolve;
      }
    });
  }

}

exports.default = ConcurrentQueue;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25jdXJyZW50LXF1ZXVlLmpzIl0sIm5hbWVzIjpbIkRFRkFVTFRfQ09OQ1VSUkVOQ1kiLCJDb25jdXJyZW50UXVldWUiLCJjb25zdHJ1Y3RvciIsIndvcmtlciIsImNvbmN1cnJlbmN5IiwicXVldWUiLCJ0YXNrIiwiY2FsbGJhY2siLCJ0aGVuIiwiY2F0Y2giLCJkcmFpbiIsImRyYWluUmVzb2x2ZXIiLCJwdXNoIiwiaGFuZGxlciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiaWRsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUVBLE1BQU1BLG1CQUFtQixHQUFHLENBQTVCOztBQUVlLE1BQU1DLGVBQU4sQ0FBc0I7QUFDbkNDLEVBQUFBLFdBQVcsQ0FBQ0MsTUFBRCxFQUFTQyxXQUFULEVBQXNCO0FBQy9CLFNBQUtELE1BQUwsR0FBY0EsTUFBZDtBQUVBLFNBQUtFLEtBQUwsR0FBYSxrQkFBTSxDQUFDQyxJQUFELEVBQU9DLFFBQVAsS0FBb0I7QUFDckMsV0FBS0osTUFBTCxDQUFZRyxJQUFaLEVBQWtCRSxJQUFsQixDQUF1QkQsUUFBdkIsRUFBaUNFLEtBQWpDLENBQXVDRixRQUF2QztBQUNELEtBRlksRUFFVkgsV0FBVyxJQUFJSixtQkFGTCxDQUFiOztBQUlBLFNBQUtLLEtBQUwsQ0FBV0ssS0FBWCxHQUFtQixNQUFNO0FBQ3ZCLFVBQUksS0FBS0MsYUFBVCxFQUF3QjtBQUN0QixhQUFLQSxhQUFMO0FBQ0EsYUFBS0EsYUFBTCxHQUFxQixJQUFyQjtBQUNEO0FBQ0YsS0FMRDtBQU1EOztBQUVEQyxFQUFBQSxJQUFJLENBQUNOLElBQUQsRUFBT08sT0FBUCxFQUFnQjtBQUNsQixTQUFLUixLQUFMLENBQVdPLElBQVgsQ0FBZ0JOLElBQWhCLEVBQXNCTyxPQUF0QjtBQUNEOztBQUVESCxFQUFBQSxLQUFLLEdBQUc7QUFDTixXQUFPLElBQUlJLE9BQUosQ0FBWSxDQUFDQyxPQUFELEVBQVVDLE1BQVYsS0FBcUI7QUFDdEMsVUFBSSxLQUFLWCxLQUFMLENBQVdZLElBQVgsRUFBSixFQUF1QjtBQUNyQkYsUUFBQUEsT0FBTztBQUNSLE9BRkQsTUFFTztBQUNMLGFBQUtKLGFBQUwsR0FBcUJJLE9BQXJCO0FBQ0Q7QUFDRixLQU5NLENBQVA7QUFPRDs7QUE1QmtDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtxdWV1ZX0gZnJvbSAnYXN5bmMnO1xuXG5jb25zdCBERUZBVUxUX0NPTkNVUlJFTkNZID0gNTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29uY3VycmVudFF1ZXVlIHtcbiAgY29uc3RydWN0b3Iod29ya2VyLCBjb25jdXJyZW5jeSkge1xuICAgIHRoaXMud29ya2VyID0gd29ya2VyO1xuXG4gICAgdGhpcy5xdWV1ZSA9IHF1ZXVlKCh0YXNrLCBjYWxsYmFjaykgPT4ge1xuICAgICAgdGhpcy53b3JrZXIodGFzaykudGhlbihjYWxsYmFjaykuY2F0Y2goY2FsbGJhY2spO1xuICAgIH0sIGNvbmN1cnJlbmN5IHx8IERFRkFVTFRfQ09OQ1VSUkVOQ1kpO1xuXG4gICAgdGhpcy5xdWV1ZS5kcmFpbiA9ICgpID0+IHtcbiAgICAgIGlmICh0aGlzLmRyYWluUmVzb2x2ZXIpIHtcbiAgICAgICAgdGhpcy5kcmFpblJlc29sdmVyKCk7XG4gICAgICAgIHRoaXMuZHJhaW5SZXNvbHZlciA9IG51bGw7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHB1c2godGFzaywgaGFuZGxlcikge1xuICAgIHRoaXMucXVldWUucHVzaCh0YXNrLCBoYW5kbGVyKTtcbiAgfVxuXG4gIGRyYWluKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAodGhpcy5xdWV1ZS5pZGxlKCkpIHtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kcmFpblJlc29sdmVyID0gcmVzb2x2ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19