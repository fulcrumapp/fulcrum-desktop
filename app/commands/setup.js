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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9zZXR1cC5qcyJdLCJuYW1lcyI6WyJwcm9tcHQiLCJxdWVzdGlvbnMiLCJpbnF1aXJlciIsInR5cGUiLCJuYW1lIiwibWVzc2FnZSIsImFnYWluUXVlc3Rpb24iLCJleGl0IiwiZnVsY3J1bSIsImFyZ3MiLCJ0b2tlbiIsInNldHVwQWNjb3VudCIsImVtYWlsIiwicGFzc3dvcmQiLCJhbnN3ZXJzIiwic3VjY2VzcyIsInJldHJ5IiwiYWdhaW4iLCJyZXN1bHRzIiwiQ2xpZW50IiwiYXV0aGVudGljYXRlV2l0aFRva2VuIiwiYXV0aGVudGljYXRlIiwicmVzcG9uc2UiLCJib2R5Iiwic3RhdHVzQ29kZSIsInVzZXIiLCJKU09OIiwicGFyc2UiLCJsb2dnZXIiLCJsb2ciLCJncmVlbiIsImNvbnRleHQiLCJjb250ZXh0cyIsImZpbmQiLCJvIiwib3JnIiwiZXJyb3IiLCJyZWQiLCJpc093bmVyIiwicm9sZSIsImlzX3N5c3RlbSIsImNvbnRleHRBdHRyaWJ1dGVzIiwidXNlcl9yZXNvdXJjZV9pZCIsImlkIiwib3JnYW5pemF0aW9uX3Jlc291cmNlX2lkIiwiZGIiLCJhY2NvdW50IiwiQWNjb3VudCIsImZpbmRPckNyZWF0ZSIsIl9vcmdhbml6YXRpb25OYW1lIiwiX2ZpcnN0TmFtZSIsImZpcnN0X25hbWUiLCJfbGFzdE5hbWUiLCJsYXN0X25hbWUiLCJfZW1haWwiLCJfdG9rZW4iLCJhcGlfdG9rZW4iLCJzYXZlIiwidGFzayIsImNsaSIsImNvbW1hbmQiLCJkZXNjIiwiYnVpbGRlciIsInJlcXVpcmVkIiwiaGFuZGxlciIsInJ1bkNvbW1hbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEsU0FBU0EsTUFBVCxDQUFnQkMsU0FBaEIsRUFBMkI7QUFDekIsU0FBT0Msa0JBQVNGLE1BQVQsQ0FBZ0JDLFNBQWhCLENBQVA7QUFDRDs7QUFFRCxNQUFNQSxTQUFTLEdBQUcsQ0FD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LElBQVIsRUFBTjtBQUVBakQsUUFBQUEsT0FBTyxDQUFDb0IsTUFBUixDQUFlQyxHQUFmLENBQW1CLElBQUlDLEtBQXZCLEVBQThCQyxPQUFPLENBQUMzQixJQUF0QztBQUVBLGVBQU8sSUFBUDtBQUNELE9BdkNELE1BdUNPO0FBQ0xJLFFBQUFBLE9BQU8sQ0FBQ29CLE1BQVIsQ0FBZUMsR0FBZixDQUFtQixpQ0FBaUNRLEdBQXBEO0FBQ0Q7O0FBRUQsYUFBTyxLQUFQO0FBQ0QsS0FqR2tCO0FBQUE7O0FBQ1QsUUFBSnFCLElBQUksQ0FBQ0MsR0FBRCxFQUFNO0FBQ2QsV0FBT0EsR0FBRyxDQUFDQyxPQUFKLENBQVk7QUFDakJBLE1BQUFBLE9BQU8sRUFBRSxPQURRO0FBRWpCQyxNQUFBQSxJQUFJLEVBQUUsa0NBRlc7QUFHakJDLE1BQUFBLE9BQU8sRUFBRTtBQUNQM0IsUUFBQUEsR0FBRyxFQUFFO0FBQ0gwQixVQUFBQSxJQUFJLEVBQUUsbUJBREg7QUFFSEUsVUFBQUEsUUFBUSxFQUFFLElBRlA7QUFHSDVELFVBQUFBLElBQUksRUFBRTtBQUhIO0FBREUsT0FIUTtBQVVqQjZELE1BQUFBLE9BQU8sRUFBRSxLQUFLQztBQVZHLEtBQVosQ0FBUDtBQVlEOztBQWRrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnY29sb3JzJztcbmltcG9ydCBpbnF1aXJlciBmcm9tICdpbnF1aXJlcic7XG5pbXBvcnQgQWNjb3VudCBmcm9tICcuLi9tb2RlbHMvYWNjb3VudCc7XG5pbXBvcnQgQ2xpZW50IGZyb20gJy4uL2FwaS9jbGllbnQnO1xuXG5mdW5jdGlvbiBwcm9tcHQocXVlc3Rpb25zKSB7XG4gIHJldHVybiBpbnF1aXJlci5wcm9tcHQocXVlc3Rpb25zKTtcbn1cblxuY29uc3QgcXVlc3Rpb25zID0gW1xuICB7XG4gICAgdHlwZTogJ2lucHV0JyxcbiAgICBuYW1lOiAnZW1haWwnLFxuICAgIG1lc3NhZ2U6ICdFbnRlciB5b3VyIEZ1bGNydW0gZW1haWwgYWRkcmVzcydcbiAgfSwge1xuICAgIHR5cGU6ICdwYXNzd29yZCcsXG4gICAgbWVzc2FnZTogJ0VudGVyIHlvdXIgRnVsY3J1bSBwYXNzd29yZCcsXG4gICAgbmFtZTogJ3Bhc3N3b3JkJ1xuICB9XG5dO1xuXG5jb25zdCBhZ2FpblF1ZXN0aW9uID0ge1xuICB0eXBlOiAnY29uZmlybScsXG4gIG5hbWU6ICdhZ2FpbicsXG4gIG1lc3NhZ2U6ICdUcnkgYWdhaW4/IChqdXN0IGhpdCBlbnRlciBmb3IgWUVTKScsXG4gICdkZWZhdWx0JzogdHJ1ZVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICBhc3luYyB0YXNrKGNsaSkge1xuICAgIHJldHVybiBjbGkuY29tbWFuZCh7XG4gICAgICBjb21tYW5kOiAnc2V0dXAnLFxuICAgICAgZGVzYzogJ3NldHVwIHRoZSBsb2NhbCBmdWxjcnVtIGRhdGFiYXNlJyxcbiAgICAgIGJ1aWxkZXI6IHtcbiAgICAgICAgb3JnOiB7XG4gICAgICAgICAgZGVzYzogJ29yZ2FuaXphdGlvbiBuYW1lJyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaGFuZGxlcjogdGhpcy5ydW5Db21tYW5kXG4gICAgfSk7XG4gIH1cblxuICBydW5Db21tYW5kID0gYXN5bmMgKCkgPT4ge1xuICAgIGxldCBleGl0ID0gZmFsc2U7XG5cbiAgICB3aGlsZSAoIWV4aXQpIHtcbiAgICAgIGlmIChmdWxjcnVtLmFyZ3MudG9rZW4pIHtcbiAgICAgICAgYXdhaXQgdGhpcy5zZXR1cEFjY291bnQoe3Rva2VuOiBmdWxjcnVtLmFyZ3MudG9rZW59KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoZnVsY3J1bS5hcmdzLmVtYWlsICYmIGZ1bGNydW0uYXJncy5wYXNzd29yZCkge1xuICAgICAgICBhd2FpdCB0aGlzLnNldHVwQWNjb3VudCh7ZW1haWw6IGZ1bGNydW0uYXJncy5lbWFpbCwgcGFzc3dvcmQ6IGZ1bGNydW0uYXJncy5wYXNzd29yZH0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGFuc3dlcnMgPSBhd2FpdCBwcm9tcHQocXVlc3Rpb25zKTtcblxuICAgICAgY29uc3Qgc3VjY2VzcyA9IGF3YWl0IHRoaXMuc2V0dXBBY2NvdW50KHtlbWFpbDogYW5zd2Vycy5lbWFpbCwgcGFzc3dvcmQ6IGFuc3dlcnMucGFzc3dvcmR9KTtcblxuICAgICAgaWYgKHN1Y2Nlc3MpIHtcbiAgICAgICAgZXhpdCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcmV0cnkgPSBhd2FpdCBwcm9tcHQoYWdhaW5RdWVzdGlvbik7XG5cbiAgICAgICAgaWYgKCFyZXRyeS5hZ2Fpbikge1xuICAgICAgICAgIGV4aXQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2V0dXBBY2NvdW50ID0gYXN5bmMgKHtlbWFpbCwgcGFzc3dvcmQsIHRva2VufSkgPT4ge1xuICAgIGNvbnN0IHJlc3VsdHMgPSB0b2tlbiA/IGF3YWl0IENsaWVudC5hdXRoZW50aWNhdGVXaXRoVG9rZW4odG9rZW4pXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDogYXdhaXQgQ2xpZW50LmF1dGhlbnRpY2F0ZShlbWFpbCwgcGFzc3dvcmQpO1xuXG4gICAgY29uc3QgcmVzcG9uc2UgPSByZXN1bHRzO1xuICAgIGNvbnN0IGJvZHkgPSByZXN1bHRzLmJvZHk7XG5cbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzQ29kZSA9PT0gMjAwKSB7XG4gICAgICBjb25zdCB1c2VyID0gSlNPTi5wYXJzZShib2R5KS51c2VyO1xuXG4gICAgICBmdWxjcnVtLmxvZ2dlci5sb2coKCdTdWNjZXNzZnVsbHkgYXV0aGVudGljYXRlZCB3aXRoICcgKyB1c2VyLmVtYWlsKS5ncmVlbik7XG5cbiAgICAgIGNvbnN0IGNvbnRleHQgPSB1c2VyLmNvbnRleHRzLmZpbmQobyA9PiBvLm5hbWUgPT09IGZ1bGNydW0uYXJncy5vcmcpO1xuXG4gICAgICBpZiAoIWNvbnRleHQpIHtcbiAgICAgICAgZnVsY3J1bS5sb2dnZXIuZXJyb3IoYE9yZ2FuaXphdGlvbiAkeyBmdWxjcnVtLmFyZ3Mub3JnIH0gbm90IGZvdW5kIGZvciB0aGlzIGFjY291bnQuYC5yZWQpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlzT3duZXIgPSBjb250ZXh0LnJvbGUubmFtZSA9PT0gJ093bmVyJyAmJiBjb250ZXh0LnJvbGUuaXNfc3lzdGVtO1xuXG4gICAgICBpZiAoIWlzT3duZXIpIHtcbiAgICAgICAgZnVsY3J1bS5sb2dnZXIuZXJyb3IoYFRoaXMgYWNjb3VudCBpcyBub3QgYW4gb3duZXIgb2YgJHsgZnVsY3J1bS5hcmdzLm9yZyB9LiBZb3UgbXVzdCBiZSBhbiBhY2NvdW50IG93bmVyIHRvIHVzZSBGdWxjcnVtIERlc2t0b3AuYC5yZWQpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvbnRleHRBdHRyaWJ1dGVzID0ge1xuICAgICAgICB1c2VyX3Jlc291cmNlX2lkOiB1c2VyLmlkLFxuICAgICAgICBvcmdhbml6YXRpb25fcmVzb3VyY2VfaWQ6IGNvbnRleHQuaWRcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGRiID0gZnVsY3J1bS5kYjtcblxuICAgICAgY29uc3QgYWNjb3VudCA9IGF3YWl0IEFjY291bnQuZmluZE9yQ3JlYXRlKGRiLCBjb250ZXh0QXR0cmlidXRlcyk7XG5cbiAgICAgIGFjY291bnQuX29yZ2FuaXphdGlvbk5hbWUgPSBjb250ZXh0Lm5hbWU7XG4gICAgICBhY2NvdW50Ll9maXJzdE5hbWUgPSB1c2VyLmZpcnN0X25hbWU7XG4gICAgICBhY2NvdW50Ll9sYXN0TmFtZSA9IHVzZXIubGFzdF9uYW1lO1xuICAgICAgYWNjb3VudC5fZW1haWwgPSB1c2VyLmVtYWlsO1xuICAgICAgYWNjb3VudC5fdG9rZW4gPSBjb250ZXh0LmFwaV90b2tlbjtcblxuICAgICAgYXdhaXQgYWNjb3VudC5zYXZlKCk7XG5cbiAgICAgIGZ1bGNydW0ubG9nZ2VyLmxvZygn4pyTJy5ncmVlbiwgY29udGV4dC5uYW1lKTtcblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZ1bGNydW0ubG9nZ2VyLmxvZygnVXNlcm5hbWUgb3IgcGFzc3dvcmQgaW5jb3JyZWN0Jy5yZWQpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIl19