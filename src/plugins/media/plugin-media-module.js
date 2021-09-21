import path from 'path';
import mkdirp from 'mkdirp';
import ConcurrentQueue from './concurrent-queue';
import fs from 'fs';
import { APIClient, core } from '../../api';
import request from 'request';
import rimraf from 'rimraf';

let log, warn, error, mediaPath, account, queue, worker;

exports.activate = async () => {
  const logger = fulcrum.logger.withContext('media');

  log = logger.log;
  warn = logger.warn;
  error = logger.error

  account = await fulcrum.fetchAccount(fulcrum.args.org);

  mediaPath = fulcrum.args.mediaPath || fulcrum.dir('media');

  mkdirp.sync(mediaPath);
  mkdirp.sync(path.join(mediaPath, 'photos'));
  mkdirp.sync(path.join(mediaPath, 'videos'));
  mkdirp.sync(path.join(mediaPath, 'audio'));
  mkdirp.sync(path.join(mediaPath, 'signatures'));

  // fulcrum.on('form:save', this.onFormSave);
  // fulcrum.on('records:finish', this.onRecordsFinished);
}

exports.deactivate = async () => {};

const worker = async (task) => {
  try {
    const url = {
      photo: APIClient.getPhotoURL,
      video: APIClient.getVideoURL,
      audio: APIClient.getAudioURL,
      signature: APIClient.getSignatureURL
    }[task.type].bind(APIClient)({token: task.token}, task);

    const extension = {
      photo: 'jpg',
      video: 'mp4',
      audio: 'm4a',
      signature: 'png'
    }[task.type];

    const outputFileName = path.join(mediaPath, task.table, task.id + '.' + extension);

    if (task.track) {
      writeTracks(task.id, task.table, task.track);
    }

    let success = true;

    if (!fs.existsSync(outputFileName) || fs.statSync(outputFileName).size < 10) {
      try {
        log('Downloading', task.type, task.id);

        const outputName = await downloadWithRetries(url, outputFileName);

        if (outputName == null) {
          log('Not Found', url);
          rimraf.sync(outputFileName);
          success = false;
        }
      } catch (ex) {
        log(ex);
        success = false;
      }
    }

    if (success) {
      await updateDownloadState(task.table, task.id);
    }
  } catch (ex) {
    error(ex);
  }
}

function writeTracks(id, table, trackJSON) {
  const track = new core.Track(id, JSON.parse(trackJSON));

  writeTrackFile(id, table, 'gpx', track, 'toGPX');
  writeTrackFile(id, table, 'kml', track, 'toKML');
  writeTrackFile(id, table, 'srt', track, 'toSRT');
  writeTrackFile(id, table, 'geojson', track, 'toGeoJSONString');
  writeTrackFile(id, table, 'json', track, 'toJSONString');
}

function writeTrackFile(id, table, extension, track, method) {
  const outputFileName = path.join(mediaPath, table, id + '.' + extension);

  if (!fs.existsSync(outputFileName) || fs.statSync(outputFileName).size === 0) {
    try {
      fs.writeFileSync(outputFileName, track[method]().toString());
    } catch (ex) {
      error('error processing track file', extension, id);
      error(ex);
    }
  }
}

async function queueMediaDownload(account, table, type) {
  let trackColumn = 'NULL as track';

  if (type === 'video' || type === 'audio') {
    trackColumn = 'track';
  }

  await account.findEachBySQL(`SELECT resource_id, ${ trackColumn } FROM ${ table } WHERE account_id = ${ account.rowID } AND is_stored = 1 AND is_downloaded = 0`, null, ({values}) => {
    if (values) {
      queue.push({
        token: account.token,
        type: type,
        table: table,
        id: values.resource_id,
        track: values.track
      });
    }
  });
}

async function downloadWithRetries(url, outputFileName) {
  let tries = 0;
  const maxTries = 5;

  while (++tries < maxTries) {
    try {
      await download(url, outputFileName);

      return outputFileName;
    } catch (ex) {
      if (ex.message === 'not found') {
        return null;
      }

      error('Failed', url, ex.message, 'retrying...');
    }
  }
}

function download(url, to) {
  return new Promise((resolve, reject) => {
    const req = request
      .get(url)
      .on('response', function(response) {
        if (response.statusCode !== 200) {
          abort();
        }
      })
      .on('abort', () => reject(new Error('not found')))
      .on('end', () => resolve(req))
      .on('error', reject)
      .pipe(fs.createWriteStream(to));
  });
}

function updateDownloadState(table, id) {
  // Don't update the state of videos or audio because the track files might come later and we need to re-process them.
  // In order to fix this, we would need to store the download state of the track and the raw video file.
  if (table === 'videos' || table === 'audio') {
    return;
  }

  return account.db.execute(`
    UPDATE ${ table } SET is_downloaded = 1 WHERE account_id = ${ account.rowID } AND resource_id = '${ id }'
  `);
}

exports.command = 'media',
exports.desc = 'download media',
exports.builder = {
  org: {
    desc: 'organization name',
    required: true,
    type: 'string'
  },
  mediaPath: {
    desc: 'media storage directory',
    type: 'string'
  },
  mediaConcurrency: {
    desc: 'concurrent downloads (between 1 and 10)',
    type: 'number'
  }
},
exports.handler = async () => {
  await activate();

  account = await fulcrum.fetchAccount(fulcrum.args.org);

  if (account) {
    const concurrency = Math.min(Math.max(1, fulcrum.args.mediaConcurrency || 3), 10);

    queue = new ConcurrentQueue(worker, concurrency);

    await queueMediaDownload(account, 'photos', 'photo');
    await queueMediaDownload(account, 'signatures', 'signature');
    await queueMediaDownload(account, 'audio', 'audio');
    await queueMediaDownload(account, 'videos', 'video');

    await queue.drain();
  } else {
    error('Unable to find account', fulcrum.args.org);
  }
}
