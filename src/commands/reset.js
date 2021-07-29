export default class {
  async task(cli) {
    return cli.command({
      command: 'reset',
      desc: 'reset an organization',
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

  runCommand = async () => {
    await this.app.activatePlugins();

    const account = await fulcrum.fetchAccount(fulcrum.args.org);

    if (account == null) {
      fulcrum.logger.error('Unable to find organization:', fulcrum.args.org);
      return;
    }

    await account.reset();
  }
}
