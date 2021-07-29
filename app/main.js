"use strict";

var _electron = require("electron");

var _path = _interopRequireDefault(require("path"));

var _url = _interopRequireDefault(require("url"));

require("./auto-updater");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Don't store the app data in the roaming dir.
// https://github.com/electron/electron/issues/1404#issuecomment-194391247
if (process.platform === 'win32') {
  _electron.app.setAppUserModelId('com.spatialnetworks.fulcrum');

  _electron.app.setPath('appData', process.env.LOCALAPPDATA);

  _electron.app.setPath('userData', _path.default.join(process.env.LOCALAPPDATA, 'Fulcrum'));
}

let browserWindow = null;

function start() {
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  function createWindow() {
    browserWindow = new _electron.BrowserWindow({
      width: 210,
      height: 114
    }); // and load the index.html of the app.

    browserWindow.loadURL(_url.default.format({
      pathname: _path.default.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    })); // browserWindow.webContents.openDevTools({mode: 'detach'});

    browserWindow.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      browserWindow = null;
    });
  }

  _electron.app.on('ready', createWindow);

  _electron.app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      _electron.app.quit();
    }
  });

  _electron.app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (browserWindow === null) {
      createWindow();
    }
  });
}

start();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbInByb2Nlc3MiLCJwbGF0Zm9ybSIsImFwcCIsInNldEFwcFVzZXJNb2RlbElkIiwic2V0UGF0aCIsImVudiIsIkxPQ0FMQVBQREFUQSIsInBhdGgiLCJqb2luIiwiYnJvd3NlcldpbmRvdyIsInN0YXJ0IiwiY3JlYXRlV2luZG93IiwiQnJvd3NlcldpbmRvdyIsIndpZHRoIiwiaGVpZ2h0IiwibG9hZFVSTCIsInVybCIsImZvcm1hdCIsInBhdGhuYW1lIiwiX19kaXJuYW1lIiwicHJvdG9jb2wiLCJzbGFzaGVzIiwib24iLCJxdWl0Il0sIm1hcHBpbmdzIjoiOztBQUFBOztBQUNBOztBQUNBOztBQVVBOzs7O0FBUkE7QUFDQTtBQUNBLElBQUlBLE9BQU8sQ0FBQ0MsUUFBUixLQUFxQixPQUF6QixFQUFrQztBQUNoQ0MsZ0JBQUlDLGlCQUFKLENBQXNCLDZCQUF0Qjs7QUFDQUQsZ0JBQUlFLE9BQUosQ0FBWSxTQUFaLEVBQXVCSixPQUFPLENBQUNLLEdBQVIsQ0FBWUMsWUFBbkM7O0FBQ0FKLGdCQUFJRSxPQUFKLENBQVksVUFBWixFQUF3QkcsY0FBS0MsSUFBTCxDQUFVUixPQUFPLENBQUNLLEdBQVIsQ0FBWUMsWUFBdEIsRUFBb0MsU0FBcEMsQ0FBeEI7QUFDRDs7QUFJRCxJQUFJRyxhQUFhLEdBQUcsSUFBcEI7O0FBRUEsU0FBU0MsS0FBVCxHQUFpQjtBQUNmO0FBQ0E7QUFDQSxXQUFTQyxZQUFULEdBQXdCO0FBQ3RCRixJQUFBQSxhQUFhLEdBQUcsSUFBSUcsdUJBQUosQ0FBa0I7QUFBQ0MsTUFBQUEsS0FBSyxFQUFFLEdBQVI7QUFBYUMsTUFBQUEsTUFBTSxFQUFFO0FBQXJCLEtBQWxCLENBQWhCLENBRHNCLENBR3RCOztBQUNBTCxJQUFBQSxhQUFhLENBQUNNLE9BQWQsQ0FBc0JDLGFBQUlDLE1BQUosQ0FBVztBQUMvQkMsTUFBQUEsUUFBUSxFQUFFWCxjQUFLQyxJQUFMLENBQVVXLFNBQVYsRUFBcUIsWUFBckIsQ0FEcUI7QUFFL0JDLE1BQUFBLFFBQVEsRUFBRSxPQUZxQjtBQUcvQkMsTUFBQUEsT0FBTyxFQUFFO0FBSHNCLEtBQVgsQ0FBdEIsRUFKc0IsQ0FVdEI7O0FBRUFaLElBQUFBLGFBQWEsQ0FBQ2EsRUFBZCxDQUFpQixRQUFqQixFQUEyQixNQUFNO0FBQy9CO0FBQ0E7QUFDQTtBQUNBYixNQUFBQSxhQUFhLEdBQUcsSUFBaEI7QUFDRCxLQUxEO0FBTUQ7O0FBRURQLGdCQUFJb0IsRUFBSixDQUFPLE9BQVAsRUFBZ0JYLFlBQWhCOztBQUVBVCxnQkFBSW9CLEVBQUosQ0FBTyxtQkFBUCxFQUE0QixNQUFNO0FBQ2hDO0FBQ0E7QUFDQSxRQUFJdEIsT0FBTyxDQUFDQyxRQUFSLEtBQXFCLFFBQXpCLEVBQW1DO0FBQ2pDQyxvQkFBSXFCLElBQUo7QUFDRDtBQUNGLEdBTkQ7O0FBUUFyQixnQkFBSW9CLEVBQUosQ0FBTyxVQUFQLEVBQW1CLE1BQU07QUFDdkI7QUFDQTtBQUNBLFFBQUliLGFBQWEsS0FBSyxJQUF0QixFQUE0QjtBQUMxQkUsTUFBQUEsWUFBWTtBQUNiO0FBQ0YsR0FORDtBQU9EOztBQUVERCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthcHAsIEJyb3dzZXJXaW5kb3d9IGZyb20gJ2VsZWN0cm9uJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHVybCBmcm9tICd1cmwnO1xuXG4vLyBEb24ndCBzdG9yZSB0aGUgYXBwIGRhdGEgaW4gdGhlIHJvYW1pbmcgZGlyLlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2VsZWN0cm9uL2VsZWN0cm9uL2lzc3Vlcy8xNDA0I2lzc3VlY29tbWVudC0xOTQzOTEyNDdcbmlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gIGFwcC5zZXRBcHBVc2VyTW9kZWxJZCgnY29tLnNwYXRpYWxuZXR3b3Jrcy5mdWxjcnVtJyk7XG4gIGFwcC5zZXRQYXRoKCdhcHBEYXRhJywgcHJvY2Vzcy5lbnYuTE9DQUxBUFBEQVRBKTtcbiAgYXBwLnNldFBhdGgoJ3VzZXJEYXRhJywgcGF0aC5qb2luKHByb2Nlc3MuZW52LkxPQ0FMQVBQREFUQSwgJ0Z1bGNydW0nKSk7XG59XG5cbmltcG9ydCAnLi9hdXRvLXVwZGF0ZXInO1xuXG5sZXQgYnJvd3NlcldpbmRvdyA9IG51bGw7XG5cbmZ1bmN0aW9uIHN0YXJ0KCkge1xuICAvLyBLZWVwIGEgZ2xvYmFsIHJlZmVyZW5jZSBvZiB0aGUgd2luZG93IG9iamVjdCwgaWYgeW91IGRvbid0LCB0aGUgd2luZG93IHdpbGxcbiAgLy8gYmUgY2xvc2VkIGF1dG9tYXRpY2FsbHkgd2hlbiB0aGUgSmF2YVNjcmlwdCBvYmplY3QgaXMgZ2FyYmFnZSBjb2xsZWN0ZWQuXG4gIGZ1bmN0aW9uIGNyZWF0ZVdpbmRvdygpIHtcbiAgICBicm93c2VyV2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3coe3dpZHRoOiAyMTAsIGhlaWdodDogMTE0fSk7XG5cbiAgICAvLyBhbmQgbG9hZCB0aGUgaW5kZXguaHRtbCBvZiB0aGUgYXBwLlxuICAgIGJyb3dzZXJXaW5kb3cubG9hZFVSTCh1cmwuZm9ybWF0KHtcbiAgICAgIHBhdGhuYW1lOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnaW5kZXguaHRtbCcpLFxuICAgICAgcHJvdG9jb2w6ICdmaWxlOicsXG4gICAgICBzbGFzaGVzOiB0cnVlXG4gICAgfSkpO1xuXG4gICAgLy8gYnJvd3NlcldpbmRvdy53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoe21vZGU6ICdkZXRhY2gnfSk7XG5cbiAgICBicm93c2VyV2luZG93Lm9uKCdjbG9zZWQnLCAoKSA9PiB7XG4gICAgICAvLyBEZXJlZmVyZW5jZSB0aGUgd2luZG93IG9iamVjdCwgdXN1YWxseSB5b3Ugd291bGQgc3RvcmUgd2luZG93c1xuICAgICAgLy8gaW4gYW4gYXJyYXkgaWYgeW91ciBhcHAgc3VwcG9ydHMgbXVsdGkgd2luZG93cywgdGhpcyBpcyB0aGUgdGltZVxuICAgICAgLy8gd2hlbiB5b3Ugc2hvdWxkIGRlbGV0ZSB0aGUgY29ycmVzcG9uZGluZyBlbGVtZW50LlxuICAgICAgYnJvd3NlcldpbmRvdyA9IG51bGw7XG4gICAgfSk7XG4gIH1cblxuICBhcHAub24oJ3JlYWR5JywgY3JlYXRlV2luZG93KTtcblxuICBhcHAub24oJ3dpbmRvdy1hbGwtY2xvc2VkJywgKCkgPT4ge1xuICAgIC8vIE9uIG1hY09TIGl0IGlzIGNvbW1vbiBmb3IgYXBwbGljYXRpb25zIGFuZCB0aGVpciBtZW51IGJhclxuICAgIC8vIHRvIHN0YXkgYWN0aXZlIHVudGlsIHRoZSB1c2VyIHF1aXRzIGV4cGxpY2l0bHkgd2l0aCBDbWQgKyBRXG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICdkYXJ3aW4nKSB7XG4gICAgICBhcHAucXVpdCgpO1xuICAgIH1cbiAgfSk7XG5cbiAgYXBwLm9uKCdhY3RpdmF0ZScsICgpID0+IHtcbiAgICAvLyBPbiBtYWNPUyBpdCdzIGNvbW1vbiB0byByZS1jcmVhdGUgYSB3aW5kb3cgaW4gdGhlIGFwcCB3aGVuIHRoZVxuICAgIC8vIGRvY2sgaWNvbiBpcyBjbGlja2VkIGFuZCB0aGVyZSBhcmUgbm8gb3RoZXIgd2luZG93cyBvcGVuLlxuICAgIGlmIChicm93c2VyV2luZG93ID09PSBudWxsKSB7XG4gICAgICBjcmVhdGVXaW5kb3coKTtcbiAgICB9XG4gIH0pO1xufVxuXG5zdGFydCgpO1xuIl19