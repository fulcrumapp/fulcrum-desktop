"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _os = _interopRequireDefault(require("os"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// we need this file because we want to get these paths from Nodejs-only processes

/*
 *  Windows: %LOCALAPPDATA%
 *  macOS:   ~/Library/Application Support
 *  Linux:   ~/.config
 */
let appData = '';
let userData = '';
const APPNAME = 'Fulcrum';

if (process.platform === 'win32') {
  appData = process.env.LOCALAPPDATA;
} else if (process.platform === 'darwin') {
  appData = _path.default.join(_os.default.homedir(), 'Library', 'Application Support');
} else {
  appData = process.env.XDG_CONFIG_HOME || _path.default.join(_os.default.homedir(), '.config');
}

userData = _path.default.join(appData, APPNAME);
const paths = {
  appData,
  userData
};
var _default = paths;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHBsaWNhdGlvbi1wYXRocy5qcyJdLCJuYW1lcyI6WyJhcHBEYXRhIiwidXNlckRhdGEiLCJBUFBOQU1FIiwicHJvY2VzcyIsInBsYXRmb3JtIiwiZW52IiwiTE9DQUxBUFBEQVRBIiwicGF0aCIsImpvaW4iLCJvcyIsImhvbWVkaXIiLCJYREdfQ09ORklHX0hPTUUiLCJwYXRocyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOzs7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQUlBLE9BQU8sR0FBRyxFQUFkO0FBQ0EsSUFBSUMsUUFBUSxHQUFHLEVBQWY7QUFFQSxNQUFNQyxPQUFPLEdBQUcsU0FBaEI7O0FBRUEsSUFBSUMsT0FBTyxDQUFDQyxRQUFSLEtBQXFCLE9BQXpCLEVBQWtDO0FBQ2hDSixFQUFBQSxPQUFPLEdBQUdHLE9BQU8sQ0FBQ0UsR0FBUixDQUFZQyxZQUF0QjtBQUNELENBRkQsTUFFTyxJQUFJSCxPQUFPLENBQUNDLFFBQVIsS0FBcUIsUUFBekIsRUFBbUM7QUFDeENKLEVBQUFBLE9BQU8sR0FBR08sY0FBS0MsSUFBTCxDQUFVQyxZQUFHQyxPQUFILEVBQVYsRUFBd0IsU0FBeEIsRUFBbUMscUJBQW5DLENBQVY7QUFDRCxDQUZNLE1BRUE7QUFDTFYsRUFBQUEsT0FBTyxHQUFHRyxPQUFPLENBQUNFLEdBQVIsQ0FBWU0sZUFBWixJQUErQkosY0FBS0MsSUFBTCxDQUFVQyxZQUFHQyxPQUFILEVBQVYsRUFBd0IsU0FBeEIsQ0FBekM7QUFDRDs7QUFFRFQsUUFBUSxHQUFHTSxjQUFLQyxJQUFMLENBQVVSLE9BQVYsRUFBbUJFLE9BQW5CLENBQVg7QUFFQSxNQUFNVSxLQUFLLEdBQUc7QUFDWlosRUFBQUEsT0FEWTtBQUVaQyxFQUFBQTtBQUZZLENBQWQ7ZUFLZVcsSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IG9zIGZyb20gJ29zJztcblxuLy8gd2UgbmVlZCB0aGlzIGZpbGUgYmVjYXVzZSB3ZSB3YW50IHRvIGdldCB0aGVzZSBwYXRocyBmcm9tIE5vZGVqcy1vbmx5IHByb2Nlc3Nlc1xuXG4vKlxuICogIFdpbmRvd3M6ICVMT0NBTEFQUERBVEElXG4gKiAgbWFjT1M6ICAgfi9MaWJyYXJ5L0FwcGxpY2F0aW9uIFN1cHBvcnRcbiAqICBMaW51eDogICB+Ly5jb25maWdcbiAqL1xuXG5sZXQgYXBwRGF0YSA9ICcnO1xubGV0IHVzZXJEYXRhID0gJyc7XG5cbmNvbnN0IEFQUE5BTUUgPSAnRnVsY3J1bSc7XG5cbmlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gIGFwcERhdGEgPSBwcm9jZXNzLmVudi5MT0NBTEFQUERBVEE7XG59IGVsc2UgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICdkYXJ3aW4nKSB7XG4gIGFwcERhdGEgPSBwYXRoLmpvaW4ob3MuaG9tZWRpcigpLCAnTGlicmFyeScsICdBcHBsaWNhdGlvbiBTdXBwb3J0Jyk7XG59IGVsc2Uge1xuICBhcHBEYXRhID0gcHJvY2Vzcy5lbnYuWERHX0NPTkZJR19IT01FIHx8IHBhdGguam9pbihvcy5ob21lZGlyKCksICcuY29uZmlnJyk7XG59XG5cbnVzZXJEYXRhID0gcGF0aC5qb2luKGFwcERhdGEsIEFQUE5BTUUpO1xuXG5jb25zdCBwYXRocyA9IHtcbiAgYXBwRGF0YSxcbiAgdXNlckRhdGFcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHBhdGhzO1xuIl19