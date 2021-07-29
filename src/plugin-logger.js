import path from 'path';
import {format} from 'util';

export default (pluginPath) => {
  const parts = pluginPath.split(path.sep);
  const name = parts[parts.length - 1];

  const stdoutWrite = (data) => {
    process.stdout.write(name.green + ' ' + data.toString());
  };

  const stderrWrite = (data) => {
    process.stderr.write(name.red + ' ' + data.toString());
  };

  return {
    stdoutWrite,
    stderrWrite,
    log: (...args) => {
      stdoutWrite(format.apply(null, args) + '\n');
    },
    error: (...args) => {
      stderrWrite(format.apply(null, args) + '\n');
    }
  };
};
