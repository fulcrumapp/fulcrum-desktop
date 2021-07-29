import {exec} from 'child_process';

export default function execute(command, options = {}, logPrefix = 'execute') {
  if (options == null) {
    options = {};
  }

  const env = {
    ...process.env,
    ...options.env,
    ELECTRON_RUN_AS_NODE: 1
  };

  return new Promise((resolve, reject) => {
    try {
      const child = exec(command, {...options, env});

      const stdoutWrite = (data) => {
        process.stdout.write(logPrefix.green + ' ' + data.toString());
      };

      const stderrWrite = (data) => {
        process.stderr.write(logPrefix.red + ' ' + data.toString());
      };

      stdoutWrite(command + '\n');

      child.stdout.on('data', stdoutWrite);
      child.stderr.on('data', stderrWrite);

      child.on('exit', resolve);
    } catch (ex) {
      reject(ex);
    }
  });
}
