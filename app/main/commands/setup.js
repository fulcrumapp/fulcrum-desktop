"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("colors");

var _inquirer = _interopRequireDefault(require("inquirer"));

var _account = _interopRequireDefault(require("../models/account"));

var _client = _interopRequireDefault(require("../api/client"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function prompt(questions) {
  return _inquirer.default.prompt(questions);
}

const questions = [{
  type: 'input',
  name: 'email',
  message: 'Enter your Fulcrum email address'
}, {
  type: 'password',
  message: 'Enter your Fulcrum password',
  name: 'password'
}];
const againQuestion = {
  type: 'confirm',
  name: 'again',
  message: 'Try again? (just hit enter for YES)',
  'default': true
};

class _default {
  constructor() {
    _defineProperty(this, "runCommand", async () => {
      let exit = false;

      while (!exit) {
        if (fulcrum.args.token) {
          await this.setupAccount({
            token: fulcrum.args.token
          });
          return;
        }

        if (fulcrum.args.email && fulcrum.args.password) {
          await this.setupAccount({
            email: fulcrum.args.email,
            password: fulcrum.args.password
          });
          return;
        }

        const answers = await prompt(questions);
        const success = await this.setupAccount({
          email: answers.email,
          password: answers.password
        });

        if (success) {
          exit = true;
        } else {
          let retry = await prompt(againQuestion);

          if (!retry.again) {
            exit = true;
          }
        }
      }
    });

    _defineProperty(this, "setupAccount", async ({
      email,
      password,
      token
    }) => {
      const results = token ? await _client.default.authenticateWithToken(token) : await _client.default.authenticate(email, password);
      const response = results;
      const body = results.body;

      if (response.statusCode === 200) {
        const user = JSON.parse(body).user;
        fulcrum.logger.log(('Successfully authenticated with ' + user.email).green);
        const context = user.contexts.find(o => o.name === fulcrum.args.org);

        if (!context) {
          fulcrum.logger.error(`Organization ${fulcrum.args.org} not found for this account.`.red);
          return false;
        }

        const isOwner = context.role.name === 'Owner' && context.role.is_system;

        if (!isOwner) {
          fulcrum.logger.error(`This account is not an owner of ${fulcrum.args.org}. You must be an account owner to use Fulcrum Desktop.`.red);
          return false;
        }

        const contextAttributes = {
          user_resource_id: user.id,
          organization_resource_id: context.id
        };
        const db = fulcrum.db;
        const account = await _account.default.findOrCreate(db, contextAttributes);
        account._organizationName = context.name;
        account._firstName = user.first_name;
        account._lastName = user.last_name;
        account._email = user.email;
        account._token = context.api_token;
        await account.save();
        fulcrum.logger.log('✓'.green, context.name);
        return true;
      } else {
        fulcrum.logger.log('Username or password incorrect'.red);
      }

      return false;
    });
  }

  async task(cli) {
    return cli.command({
      command: 'setup',
      desc: 'setup the local fulcrum database',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL3NldHVwLmpzIl0sIm5hbWVzIjpbInByb21wdCIsInF1ZXN0aW9ucyIsImlucXVpcmVyIiwidHlwZSIsIm5hbWUiLCJtZXNzYWdlIiwiYWdhaW5RdWVzdGlvbiIsImV4aXQiLCJmdWxjcnVtIiwiYXJncyIsInRva2VuIiwic2V0dXBBY2NvdW50IiwiZW1haWwiLCJwYXNzd29yZCIsImFuc3dlcnMiLCJzdWNjZXNzIiwicmV0cnkiLCJhZ2FpbiIsInJlc3VsdHMiLCJDbGllbnQiLCJhdXRoZW50aWNhdGVXaXRoVG9rZW4iLCJhdXRoZW50aWNhdGUiLCJyZXNwb25zZSIsImJvZHkiLCJzdGF0dXNDb2RlIiwidXNlciIsIkpTT04iLCJwYXJzZSIsImxvZ2dlciIsImxvZyIsImdyZWVuIiwiY29udGV4dCIsImNvbnRleHRzIiwiZmluZCIsIm8iLCJvcmciLCJlcnJvciIsInJlZCIsImlzT3duZXIiLCJyb2xlIiwiaXNfc3lzdGVtIiwiY29udGV4dEF0dHJpYnV0ZXMiLCJ1c2VyX3Jlc291cmNlX2lkIiwiaWQiLCJvcmdhbml6YXRpb25fcmVzb3VyY2VfaWQiLCJkYiIsImFjY291bnQiLCJBY2NvdW50IiwiZmluZE9yQ3JlYXRlIiwiX29yZ2FuaXphdGlvbk5hbWUiLCJfZmlyc3ROYW1lIiwiZmlyc3RfbmFtZSIsIl9sYXN0TmFtZSIsImxhc3RfbmFtZSIsIl9lbWFpbCIsIl90b2tlbiIsImFwaV90b2tlbiIsInNhdmUiLCJ0YXNrIiwiY2xpIiwiY29tbWFuZCIsImRlc2MiLCJidWlsZGVyIiwicmVxdWlyZWQiLCJoYW5kbGVyIiwicnVuQ29tbWFuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFFQSxTQUFTQSxNQUFULENBQWdCQyxTQUFoQixFQUEyQjtBQUN6QixTQUFPQyxrQkFBU0YsTUFBVCxDQUFnQkMsU0FBaEIsQ0FBUDtBQUNEOztBQUVELE1BQU1BLFNBQVMs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QU8sQ0FBQ1csSUFBUixFQUFOO0FBRUFqRCxRQUFBQSxPQUFPLENBQUNvQixNQUFSLENBQWVDLEdBQWYsQ0FBbUIsSUFBSUMsS0FBdkIsRUFBOEJDLE9BQU8sQ0FBQzNCLElBQXRDO0FBRUEsZUFBTyxJQUFQO0FBQ0QsT0F2Q0QsTUF1Q087QUFDTEksUUFBQUEsT0FBTyxDQUFDb0IsTUFBUixDQUFlQyxHQUFmLENBQW1CLGlDQUFpQ1EsR0FBcEQ7QUFDRDs7QUFFRCxhQUFPLEtBQVA7QUFDRCxLQWpHa0I7QUFBQTs7QUFDVCxRQUFKcUIsSUFBSSxDQUFDQyxHQUFELEVBQU07QUFDZCxXQUFPQSxHQUFHLENBQUNDLE9BQUosQ0FBWTtBQUNqQkEsTUFBQUEsT0FBTyxFQUFFLE9BRFE7QUFFakJDLE1BQUFBLElBQUksRUFBRSxrQ0FGVztBQUdqQkMsTUFBQUEsT0FBTyxFQUFFO0FBQ1AzQixRQUFBQSxHQUFHLEVBQUU7QUFDSDBCLFVBQUFBLElBQUksRUFBRSxtQkFESDtBQUVIRSxVQUFBQSxRQUFRLEVBQUUsSUFGUDtBQUdINUQsVUFBQUEsSUFBSSxFQUFFO0FBSEg7QUFERSxPQUhRO0FBVWpCNkQsTUFBQUEsT0FBTyxFQUFFLEtBQUtDO0FBVkcsS0FBWixDQUFQO0FBWUQ7O0FBZGtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdjb2xvcnMnO1xuaW1wb3J0IGlucXVpcmVyIGZyb20gJ2lucXVpcmVyJztcbmltcG9ydCBBY2NvdW50IGZyb20gJy4uL21vZGVscy9hY2NvdW50JztcbmltcG9ydCBDbGllbnQgZnJvbSAnLi4vYXBpL2NsaWVudCc7XG5cbmZ1bmN0aW9uIHByb21wdChxdWVzdGlvbnMpIHtcbiAgcmV0dXJuIGlucXVpcmVyLnByb21wdChxdWVzdGlvbnMpO1xufVxuXG5jb25zdCBxdWVzdGlvbnMgPSBbXG4gIHtcbiAgICB0eXBlOiAnaW5wdXQnLFxuICAgIG5hbWU6ICdlbWFpbCcsXG4gICAgbWVzc2FnZTogJ0VudGVyIHlvdXIgRnVsY3J1bSBlbWFpbCBhZGRyZXNzJ1xuICB9LCB7XG4gICAgdHlwZTogJ3Bhc3N3b3JkJyxcbiAgICBtZXNzYWdlOiAnRW50ZXIgeW91ciBGdWxjcnVtIHBhc3N3b3JkJyxcbiAgICBuYW1lOiAncGFzc3dvcmQnXG4gIH1cbl07XG5cbmNvbnN0IGFnYWluUXVlc3Rpb24gPSB7XG4gIHR5cGU6ICdjb25maXJtJyxcbiAgbmFtZTogJ2FnYWluJyxcbiAgbWVzc2FnZTogJ1RyeSBhZ2Fpbj8gKGp1c3QgaGl0IGVudGVyIGZvciBZRVMpJyxcbiAgJ2RlZmF1bHQnOiB0cnVlXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gIGFzeW5jIHRhc2soY2xpKSB7XG4gICAgcmV0dXJuIGNsaS5jb21tYW5kKHtcbiAgICAgIGNvbW1hbmQ6ICdzZXR1cCcsXG4gICAgICBkZXNjOiAnc2V0dXAgdGhlIGxvY2FsIGZ1bGNydW0gZGF0YWJhc2UnLFxuICAgICAgYnVpbGRlcjoge1xuICAgICAgICBvcmc6IHtcbiAgICAgICAgICBkZXNjOiAnb3JnYW5pemF0aW9uIG5hbWUnLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBoYW5kbGVyOiB0aGlzLnJ1bkNvbW1hbmRcbiAgICB9KTtcbiAgfVxuXG4gIHJ1bkNvbW1hbmQgPSBhc3luYyAoKSA9PiB7XG4gICAgbGV0IGV4aXQgPSBmYWxzZTtcblxuICAgIHdoaWxlICghZXhpdCkge1xuICAgICAgaWYgKGZ1bGNydW0uYXJncy50b2tlbikge1xuICAgICAgICBhd2FpdCB0aGlzLnNldHVwQWNjb3VudCh7dG9rZW46IGZ1bGNydW0uYXJncy50b2tlbn0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChmdWxjcnVtLmFyZ3MuZW1haWwgJiYgZnVsY3J1bS5hcmdzLnBhc3N3b3JkKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuc2V0dXBBY2NvdW50KHtlbWFpbDogZnVsY3J1bS5hcmdzLmVtYWlsLCBwYXNzd29yZDogZnVsY3J1bS5hcmdzLnBhc3N3b3JkfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYW5zd2VycyA9IGF3YWl0IHByb21wdChxdWVzdGlvbnMpO1xuXG4gICAgICBjb25zdCBzdWNjZXNzID0gYXdhaXQgdGhpcy5zZXR1cEFjY291bnQoe2VtYWlsOiBhbnN3ZXJzLmVtYWlsLCBwYXNzd29yZDogYW5zd2Vycy5wYXNzd29yZH0pO1xuXG4gICAgICBpZiAoc3VjY2Vzcykge1xuICAgICAgICBleGl0ID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCByZXRyeSA9IGF3YWl0IHByb21wdChhZ2FpblF1ZXN0aW9uKTtcblxuICAgICAgICBpZiAoIXJldHJ5LmFnYWluKSB7XG4gICAgICAgICAgZXhpdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXR1cEFjY291bnQgPSBhc3luYyAoe2VtYWlsLCBwYXNzd29yZCwgdG9rZW59KSA9PiB7XG4gICAgY29uc3QgcmVzdWx0cyA9IHRva2VuID8gYXdhaXQgQ2xpZW50LmF1dGhlbnRpY2F0ZVdpdGhUb2tlbih0b2tlbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgOiBhd2FpdCBDbGllbnQuYXV0aGVudGljYXRlKGVtYWlsLCBwYXNzd29yZCk7XG5cbiAgICBjb25zdCByZXNwb25zZSA9IHJlc3VsdHM7XG4gICAgY29uc3QgYm9keSA9IHJlc3VsdHMuYm9keTtcblxuICAgIGlmIChyZXNwb25zZS5zdGF0dXNDb2RlID09PSAyMDApIHtcbiAgICAgIGNvbnN0IHVzZXIgPSBKU09OLnBhcnNlKGJvZHkpLnVzZXI7XG5cbiAgICAgIGZ1bGNydW0ubG9nZ2VyLmxvZygoJ1N1Y2Nlc3NmdWxseSBhdXRoZW50aWNhdGVkIHdpdGggJyArIHVzZXIuZW1haWwpLmdyZWVuKTtcblxuICAgICAgY29uc3QgY29udGV4dCA9IHVzZXIuY29udGV4dHMuZmluZChvID0+IG8ubmFtZSA9PT0gZnVsY3J1bS5hcmdzLm9yZyk7XG5cbiAgICAgIGlmICghY29udGV4dCkge1xuICAgICAgICBmdWxjcnVtLmxvZ2dlci5lcnJvcihgT3JnYW5pemF0aW9uICR7IGZ1bGNydW0uYXJncy5vcmcgfSBub3QgZm91bmQgZm9yIHRoaXMgYWNjb3VudC5gLnJlZCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaXNPd25lciA9IGNvbnRleHQucm9sZS5uYW1lID09PSAnT3duZXInICYmIGNvbnRleHQucm9sZS5pc19zeXN0ZW07XG5cbiAgICAgIGlmICghaXNPd25lcikge1xuICAgICAgICBmdWxjcnVtLmxvZ2dlci5lcnJvcihgVGhpcyBhY2NvdW50IGlzIG5vdCBhbiBvd25lciBvZiAkeyBmdWxjcnVtLmFyZ3Mub3JnIH0uIFlvdSBtdXN0IGJlIGFuIGFjY291bnQgb3duZXIgdG8gdXNlIEZ1bGNydW0gRGVza3RvcC5gLnJlZCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29udGV4dEF0dHJpYnV0ZXMgPSB7XG4gICAgICAgIHVzZXJfcmVzb3VyY2VfaWQ6IHVzZXIuaWQsXG4gICAgICAgIG9yZ2FuaXphdGlvbl9yZXNvdXJjZV9pZDogY29udGV4dC5pZFxuICAgICAgfTtcblxuICAgICAgY29uc3QgZGIgPSBmdWxjcnVtLmRiO1xuXG4gICAgICBjb25zdCBhY2NvdW50ID0gYXdhaXQgQWNjb3VudC5maW5kT3JDcmVhdGUoZGIsIGNvbnRleHRBdHRyaWJ1dGVzKTtcblxuICAgICAgYWNjb3VudC5fb3JnYW5pemF0aW9uTmFtZSA9IGNvbnRleHQubmFtZTtcbiAgICAgIGFjY291bnQuX2ZpcnN0TmFtZSA9IHVzZXIuZmlyc3RfbmFtZTtcbiAgICAgIGFjY291bnQuX2xhc3ROYW1lID0gdXNlci5sYXN0X25hbWU7XG4gICAgICBhY2NvdW50Ll9lbWFpbCA9IHVzZXIuZW1haWw7XG4gICAgICBhY2NvdW50Ll90b2tlbiA9IGNvbnRleHQuYXBpX3Rva2VuO1xuXG4gICAgICBhd2FpdCBhY2NvdW50LnNhdmUoKTtcblxuICAgICAgZnVsY3J1bS5sb2dnZXIubG9nKCfinJMnLmdyZWVuLCBjb250ZXh0Lm5hbWUpO1xuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnVsY3J1bS5sb2dnZXIubG9nKCdVc2VybmFtZSBvciBwYXNzd29yZCBpbmNvcnJlY3QnLnJlZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iXX0=