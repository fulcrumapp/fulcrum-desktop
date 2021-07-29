"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _version = _interopRequireDefault(require("../version"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = { ...process.env,
  npm_config_target: _version.default.electron,
  npm_config_arch: process.arch,
  npm_config_target_arch: process.arch,
  npm_config_disturl: 'https://atom.io/download/electron',
  npm_config_runtime: 'electron',
  npm_config_build_from_source: 'true'
};
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wbHVnaW4tZW52LmpzIl0sIm5hbWVzIjpbInByb2Nlc3MiLCJlbnYiLCJucG1fY29uZmlnX3RhcmdldCIsInBrZyIsImVsZWN0cm9uIiwibnBtX2NvbmZpZ19hcmNoIiwiYXJjaCIsIm5wbV9jb25maWdfdGFyZ2V0X2FyY2giLCJucG1fY29uZmlnX2Rpc3R1cmwiLCJucG1fY29uZmlnX3J1bnRpbWUiLCJucG1fY29uZmlnX2J1aWxkX2Zyb21fc291cmNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7ZUFFZSxFQUNiLEdBQUdBLE9BQU8sQ0FBQ0MsR0FERTtBQUViQyxFQUFBQSxpQkFBaUIsRUFBRUMsaUJBQUlDLFFBRlY7QUFHYkMsRUFBQUEsZUFBZSxFQUFFTCxPQUFPLENBQUNNLElBSFo7QUFJYkMsRUFBQUEsc0JBQXNCLEVBQUVQLE9BQU8sQ0FBQ00sSUFKbkI7QUFLYkUsRUFBQUEsa0JBQWtCLEVBQUUsbUNBTFA7QUFNYkMsRUFBQUEsa0JBQWtCLEVBQUUsVUFOUDtBQU9iQyxFQUFBQSw0QkFBNEIsRUFBRTtBQVBqQixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBrZyBmcm9tICcuLi92ZXJzaW9uJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAuLi5wcm9jZXNzLmVudixcbiAgbnBtX2NvbmZpZ190YXJnZXQ6IHBrZy5lbGVjdHJvbixcbiAgbnBtX2NvbmZpZ19hcmNoOiBwcm9jZXNzLmFyY2gsXG4gIG5wbV9jb25maWdfdGFyZ2V0X2FyY2g6IHByb2Nlc3MuYXJjaCxcbiAgbnBtX2NvbmZpZ19kaXN0dXJsOiAnaHR0cHM6Ly9hdG9tLmlvL2Rvd25sb2FkL2VsZWN0cm9uJyxcbiAgbnBtX2NvbmZpZ19ydW50aW1lOiAnZWxlY3Ryb24nLFxuICBucG1fY29uZmlnX2J1aWxkX2Zyb21fc291cmNlOiAndHJ1ZSdcbn07XG4iXX0=