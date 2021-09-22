import AWS from 'aws-sdk';
import path from 'path';
import mkdirp from 'mkdirp';
import fs from 'fs';
import rimraf from 'rimraf';
import { APIClient } from '../../api';
import tempy from 'tempy';

let log, warn, error, s3;

const activate = async () => {
  const logger = fulcrum.logger.withContext('s3');

  log = logger.log;
  warn = logger.warn;
  error = logger.error;

  AWS.config.update({
    accessKeyId: fulcrum.args.s3AccessKeyId || process.env.S3_ACCESS_KEY,
    secretAccessKey: fulcrum.args.s3SecretAccessKey || process.env.S3_ACCESS_SECRET,
    region: fulcrum.args.s3Region || process.env.S3_REGION || 'us-east-1'
  });

  s3 = new AWS.S3();

  fulcrum.on('photo:save', handlePhotoSave);
  fulcrum.on('video:save', handleVideoSave);
  fulcrum.on('audio:save', handleAudioSave);
  fulcrum.on('signature:save', handleSignatureSave);
}

exports.activate = activate;

const handlePhotoSave = async ({account, photo}) => {
  const downloadURL = APIClient.getPhotoURL(account, photo);

  await uploadFile(account, photo, downloadURL, `photos/${photo.id}.jpg`);
}

const handleVideoSave = async ({account, video}) => {
  const downloadURL = APIClient.getVideoURL(account, video);

  await uploadFile(account, video, downloadURL, `videos/${video.id}.mp4`);
}

const handleAudioSave = async ({account, audio}) => {
  const downloadURL = APIClient.getAudioURL(account, audio);

  await uploadFile(account, audio, downloadURL, `audio/${audio.id}.m4a`);
}

const handleSignatureSave = async ({account, signature}) => {
  const downloadURL = APIClient.getSignatureURL(account, signature);

  await uploadFile(account, signature, downloadURL, `signatures/${signature.id}.png`);
}

async function uploadFile(account, media, url, name) {
  const tempFile = tempy.file({extension: 'download'});

  await APIClient.download(url, tempFile);

  return new Promise((resolve, reject) => {
    const bodyStream = fs.createReadStream(tempFile);

    s3.putObject({
      Bucket: fulcrum.args.s3Bucket || process.env.S3_BUCKET,
      Key: name,
      Body: bodyStream,
      ACL: 'public-read'
    }, (err, data) => {
      bodyStream.close();

      rimraf.sync(tempFile);

      if (err) {
        error(err);
        return reject(err);
      }

      resolve(data);
    });
  });
}

async function syncAll(account) {
  await account.findEachPhoto({}, async (photo, {index}) => {
    await handlePhotoSave({account, photo});
  });

  await account.findEachVideo({}, async (video, {index}) => {
    await handleVideoSave({account, video});
  });

  await account.findEachAudio({}, async (audio, {index}) => {
    await handleAudioSave({account, audio});
  });

  await account.findEachSignature({}, async (signature, {index}) => {
    await handleSignatureSave({account, signature});
  });
}

exports.command = 's3',
exports.desc = 'sync media for an organization to S3',
exports.builder = {
  org: {
    desc: 'organization name',
    required: true,
    type: 'string'
  },
  s3AccessKeyId: {
    desc: 'S3 access key id',
    type: 'string'
  },
  s3SecretAccessKey: {
    desc: 'S3 secret access key',
    type: 'string'
  },
  s3Bucket: {
    desc: 'S3 bucket',
    type: 'string'
  },
  s3Region: {
    desc: 'S3 region',
    type: 'string',
    default: 'us-east-1'
  }
},
exports.handler = async () => {
  await activate();

  const account = await fulcrum.fetchAccount(fulcrum.args.org);

  if (account) {
    await syncAll(account);
  } else {
    error('Unable to find account', fulcrum.args.org);
  }
}
