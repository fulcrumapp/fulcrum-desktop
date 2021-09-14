import 'colors';
import inquirer from 'inquirer';
import Account from '../models/account';
import Client from '../api/client';
import Command from './command';

function prompt(questions) {
  return inquirer.prompt(questions);
}

const questions = [
  {
    type: 'input',
    name: 'email',
    message: 'Enter your Fulcrum email address'
  }, {
    type: 'password',
    message: 'Enter your Fulcrum password',
    name: 'password'
  }
];

const againQuestion = {
  type: 'confirm',
  name: 'again',
  message: 'Try again? (just hit enter for YES)',
  'default': true
};

const setupAccount = async ({email, password, token}) => {
  const results = token ? await Client.authenticateWithToken(token)
                        : await Client.authenticate(email, password);

  const response = results;
  const body = results.body;

  if (response.statusCode === 200) {
    const user = JSON.parse(body).user;

    fulcrum.logger.log(('Successfully authenticated with ' + user.email).green);

    const context = user.contexts.find(o => o.name === fulcrum.args.org);

    if (!context) {
      fulcrum.logger.error(`Organization ${ fulcrum.args.org } not found for this account.`.red);
      return false;
    }

    const isOwner = context.role.name === 'Owner' && context.role.is_system;

    if (!isOwner) {
      fulcrum.logger.error(`This account is not an owner of ${ fulcrum.args.org }. You must be an account owner to use Fulcrum Desktop.`.red);
      return false;
    }

    const contextAttributes = {
      user_resource_id: user.id,
      organization_resource_id: context.id
    };

    const db = fulcrum.db;

    const account = await Account.findOrCreate(db, contextAttributes);

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
}

export default class extends Command {
  async task(cli) {
    return cli.command({
      command: 'fulcrum setup',
      desc: 'setup the local fulcrum database',
      builder: {
        org: {
          desc: 'organization name',
          required: true,
          type: 'string'
        }
      },
      async handler () {
        let exit = false;

        while (!exit) {
          if (fulcrum.args.token) {
            await setupAccount({token: fulcrum.args.token});
            return;
          }

          if (fulcrum.args.email && fulcrum.args.password) {
            await setupAccount({email: fulcrum.args.email, password: fulcrum.args.password});
            return;
          }

          const answers = await prompt(questions);

          const success = await setupAccount({email: answers.email, password: answers.password});

          if (success) {
            exit = true;
          } else {
            let retry = await prompt(againQuestion);

            if (!retry.again) {
              exit = true;
            }
          }
        }
      }
    });
  }
}
