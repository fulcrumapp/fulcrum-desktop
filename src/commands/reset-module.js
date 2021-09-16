import App from '../app';

const app = App.instance;

exports.command = 'reset',
exports.desc = 'reset an organization',
exports.builder = {
  org: {
    desc: 'organization name',
    required: true,
    type: 'string'
  }
},
exports.handler = async () => {
  await app.activatePlugins();

  const account = await fulcrum.fetchAccount(fulcrum.args.org);

  if (account == null) {
    app.logger.error('Unable to find organization:', fulcrum.args.org);
    return;
  }

  await account.reset();
};