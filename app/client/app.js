"use strict";

var _child_process = require("child_process");

var _electron = require("electron");

window.onload = () => {
  document.querySelector('.cli').onclick = () => {
    const cmd = 'rm /usr/local/bin/fulcrum && ln -s /Applications/Fulcrum.app/Contents/scripts/fulcrum /usr/local/bin/fulcrum';
    (0, _child_process.exec)(cmd, (error, stdout, stderr) => {
      console.log('Finished', error);

      if (error == null && stderr.toString().trim().length === 0) {
        alert(`Successfully installed 'fulcrum' command at /usr/local/bin/fulcrum`);
      }
    });
  };

  document.querySelector('.quit').onclick = () => {
    _electron.remote.app.quit();
  };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGllbnQvYXBwLmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsIm9ubG9hZCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsIm9uY2xpY2siLCJjbWQiLCJlcnJvciIsInN0ZG91dCIsInN0ZGVyciIsImNvbnNvbGUiLCJsb2ciLCJ0b1N0cmluZyIsInRyaW0iLCJsZW5ndGgiLCJhbGVydCIsInJlbW90ZSIsImFwcCIsInF1aXQiXSwibWFwcGluZ3MiOiI7O0FBQUE7O0FBQ0E7O0FBRUFBLE1BQU0sQ0FBQ0MsTUFBUCxHQUFnQixNQUFNO0FBQ3BCQyxFQUFBQSxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsTUFBdkIsRUFBK0JDLE9BQS9CLEdBQXlDLE1BQU07QUFDN0MsVUFBTUMsR0FBRyxHQUFHLDhHQUFaO0FBRUEsNkJBQUtBLEdBQUwsRUFBVSxDQUFDQyxLQUFELEVBQVFDLE1BQVIsRUFBZ0JDLE1BQWhCLEtBQTJCO0FBQ25DQyxNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxVQUFaLEVBQXdCSixLQUF4Qjs7QUFFQSxVQUFJQSxLQUFLLElBQUksSUFBVCxJQUFpQkUsTUFBTSxDQUFDRyxRQUFQLEdBQWtCQyxJQUFsQixHQUF5QkMsTUFBekIsS0FBb0MsQ0FBekQsRUFBNEQ7QUFDMURDLFFBQUFBLEtBQUssQ0FBRSxvRUFBRixDQUFMO0FBQ0Q7QUFDRixLQU5EO0FBT0QsR0FWRDs7QUFZQVosRUFBQUEsUUFBUSxDQUFDQyxhQUFULENBQXVCLE9BQXZCLEVBQWdDQyxPQUFoQyxHQUEwQyxNQUFNO0FBQzlDVyxxQkFBT0MsR0FBUCxDQUFXQyxJQUFYO0FBQ0QsR0FGRDtBQUdELENBaEJEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXhlYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0IHsgcmVtb3RlIH0gZnJvbSAnZWxlY3Ryb24nO1xuXG53aW5kb3cub25sb2FkID0gKCkgPT4ge1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2xpJykub25jbGljayA9ICgpID0+IHtcbiAgICBjb25zdCBjbWQgPSAncm0gL3Vzci9sb2NhbC9iaW4vZnVsY3J1bSAmJiBsbiAtcyAvQXBwbGljYXRpb25zL0Z1bGNydW0uYXBwL0NvbnRlbnRzL3NjcmlwdHMvZnVsY3J1bSAvdXNyL2xvY2FsL2Jpbi9mdWxjcnVtJztcblxuICAgIGV4ZWMoY21kLCAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnRmluaXNoZWQnLCBlcnJvcik7XG5cbiAgICAgIGlmIChlcnJvciA9PSBudWxsICYmIHN0ZGVyci50b1N0cmluZygpLnRyaW0oKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgYWxlcnQoYFN1Y2Nlc3NmdWxseSBpbnN0YWxsZWQgJ2Z1bGNydW0nIGNvbW1hbmQgYXQgL3Vzci9sb2NhbC9iaW4vZnVsY3J1bWApO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5xdWl0Jykub25jbGljayA9ICgpID0+IHtcbiAgICByZW1vdGUuYXBwLnF1aXQoKTtcbiAgfTtcbn07XG4iXX0=