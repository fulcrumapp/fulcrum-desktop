import Command from './command';

export default class extends Command {
  async task(cli) {
    const app = this.app;
    return cli.command({
      command: 'fulcrum reset',
      desc: 'reset an organization',
      builder: {
        org: {
          desc: 'organization name',
          required: true,
          type: 'string'
        }
      },
      async handler (){
        await app.activatePlugins();

        const account = await fulcrum.fetchAccount(fulcrum.args.org);

        if (account == null) {
          app.logger.error('Unable to find organization:', fulcrum.args.org);
          return;
        }

        await account.reset();
      }
    });
  }
}
