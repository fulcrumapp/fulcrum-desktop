import repl from 'repl';
import fs from 'fs';
import pkg from '../version';
import Command from './command';

export default class extends Command {
  async task(cli) {
    const app = this.app;
    return cli.command({
      command: 'fulcrum console',
      desc: 'run the console',
      builder: {
        org: {
          desc: 'organization name',
          type: 'string'
        },
        file: {
          desc: 'file to execute',
          type: 'string'
        },
        code: {
          desc: 'code to execute',
          type: 'string'
        }
      },
      async handler(){
        await app.activatePlugins();

        const account = await fulcrum.fetchAccount(fulcrum.args.org);

        const code = fulcrum.args.file ? fs.readFileSync(fulcrum.args.file).toString() : fulcrum.args.code;

        if (code) {
          await eval(code);
          return;
        }

        console.log('');
        console.log('Fulcrum'.green, pkg.version.green, fulcrum.databaseFilePath);
        console.log('');

        const server = repl.start({prompt: '> ', terminal: true});

        server.context.account = account;
        server.context.app = app;

        // the process quits immediately unless we wire up an exit event
        await new Promise((resolve) => {
          server.on('exit', resolve);
        });
      }
    });
  }
}
