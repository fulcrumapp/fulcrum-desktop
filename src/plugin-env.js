import pkg from '../version';

export default {
  ...process.env,
  npm_config_target: pkg.electron,
  npm_config_arch: process.arch,
  npm_config_target_arch: process.arch,
  npm_config_disturl: 'https://atom.io/download/electron',
  npm_config_runtime: 'electron',
  npm_config_build_from_source: 'true'
};
