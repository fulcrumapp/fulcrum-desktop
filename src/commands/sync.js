import Synchronizer from '../sync/synchronizer';
import Command from './command';

async function syncLoop(account, fullSync) {
  const sync = true;

  const dataSource = await fulcrum.createDataSource(account);

  while (sync) {
    const synchronizer = new Synchronizer();

    try {
      await synchronizer.run(account, fulcrum.args.form, dataSource, {fullSync});
    } catch (ex) {
      this.app.logger.error(ex);
    }

    fullSync = false;

    if (!fulcrum.args.forever) {
      break;
    }

    const interval = fulcrum.args.interval ? (+fulcrum.args.interval * 1000) : 15000;

    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}

export default class extends Command {
  async task(cli) {
    const app = this.app;
    return cli.command({
      command: 'fulcrum sync',
      desc: 'sync an organization',
      builder: {
        org: {
          desc: 'organization name',
          required: true,
          type: 'string'
        },
        forever: {
          default: false,
          type: 'boolean',
          describe: 'keep the sync running forever'
        },
        clean: {
          default: false,
          type: 'boolean',
          describe: 'start a clean sync, all data will be deleted before starting'
        }
      },
      async handler () {
        await app.activatePlugins();

        const account = await fulcrum.fetchAccount(fulcrum.args.org);

        if (account == null) {
          app.logger.error('Unable to find organization:', fulcrum.args.org);
          return;
        }

        if (fulcrum.args.clean) {
          await account.reset();
        }

        await syncLoop(account, fulcrum.args.full);
      }
    });
  }
}