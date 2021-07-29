import DownloadResource from './download-resource';
import Client from '../../api/client';
import fs from 'fs';
import tempy from 'tempy';
import { parseFile } from '../../jsonseq';
import { format } from 'util';

const QUERY_PAGE_SIZE = 5000;

export default class DownloadQuerySequence extends DownloadResource {
  get useRestAPI() {
    return true;
  }

  async run({dataSource}) {
    const state = await this.checkSyncState();

    if (!state.needsUpdate) {
      return;
    }

    const lastSync = this.lastSync;

    const sequence = lastSync ? lastSync.getTime() : null;

    this.dataSource = dataSource;

    await this.download(lastSync, sequence, state);
  }

  async download(lastSync, sequence, state) {
    let nextSequence = sequence || 0;

    while (nextSequence != null) {
      if (this.useRestAPI && lastSync != null) {
        nextSequence = await this.downloadRestAPIPage(lastSync, nextSequence, state);
      } else {
        nextSequence = await this.downloadQueryAPIPage(lastSync, nextSequence, state);
      }

      await this.account.save();
    }

    await state.update();
    await this.finish();
  }

  async downloadRestAPIPage(lastSync, sequence, state) {
    const beginFetchTime = new Date();

    this.progress({message: this.downloading + ' ' + this.syncLabel.blue});

    const results = await this.fetchObjects(lastSync, sequence);

    const totalFetchTime = new Date().getTime() - beginFetchTime.getTime();

    if (results.statusCode !== 200) {
      this.fail(results);
      return null;
    }

    const data = JSON.parse(results.body);

    const objects = data[this.resourceName];

    const db = this.db;

    let now = new Date();

    this.progress({message: this.processing + ' ' + this.syncLabel.blue, count: 0, total: objects.length});

    await db.transaction(async (database) => {
      for (let index = 0; index < objects.length; ++index) {
        const attributes = objects[index];

        const object = await this.findOrCreate(database, attributes);

        await this.process(object, attributes);

        this.progress({message: this.processing + ' ' + this.syncLabel.blue, count: index + 1, total: objects.length});
      }
    });

    const totalTime = new Date().getTime() - now.getTime();

    const message = format(this.finished + ' %s | %s | %s',
                           this.syncLabel.blue,
                           (totalFetchTime + 'ms').cyan,
                           (totalTime + 'ms').red);

    this.progress({message, count: objects.length, total: objects.length});

    return data.next_sequence;
  }

  async downloadQueryAPIPage(lastSync, sequence, state) {
    const sql = this.generateQuery(sequence || 0, QUERY_PAGE_SIZE);

    const options = Client.getQueryURL(this.account, sql);

    const filePath = tempy.file({extension: 'jsonseq'});

    this.progress({message: this.downloading + ' ' + this.syncLabel.blue});

    await this.downloadQuery(options, filePath);

    const {count, lastObject} = await this.processQueryResponse(filePath);

    const message = format(this.finished + ' %s',
                           this.syncLabel.blue);

    this.progress({message, count: count, total: -1});

    if (count >= QUERY_PAGE_SIZE) {
      return Math.ceil(lastObject.updatedAt.getTime() - 1);
    }

    return null;
  }

  async processQueryResponse(filePath) {
    this.progress({message: this.processing + ' ' + this.syncLabel.blue, count: 0, total: -1});

    let index = 0;
    let lastObject = null;

    await this.db.transaction(async (database) => {
      await new Promise((resolve, reject) => {
        const onObject = (json, done) => {
          if (json.row) {
            this.processQueryObject(json, database, (err, object) => {
              if (err) {
                fulcrum.logger.error('Error', err.message, err.stack);
                return done(err);
              }

              lastObject = object;
              this.progress({message: this.processing + ' ' + this.syncLabel.blue, count: index + 1, total: -1});
              ++index;
              done();
            });
          } else {
            done();
          }
        };

        const onInvalid = (data, done) => {
          fulcrum.logger.error('Invalid', data && data.toString());
          done(new Error('invalid JSON sequence'));
        };

        const onTruncated = (data, done) => {
          fulcrum.logger.error('Truncated:', data && data.toString());
          done(new Error('truncated JSON sequence'));
        };

        const onEnd = () => {
          resolve();
        };

        const onError = (err) => {
          reject(err);
        };

        parseFile(filePath, {onObject, onInvalid, onTruncated})
          .on('end', onEnd)
          .on('error', onError);
      });
    });

    return {count: index, lastObject};
  }

  processQueryObject(attributes, database, done) {
    this.processObjectAsync(attributes, database).then(o => done(null, o)).catch(done);
  }

  async processObjectAsync(json, database) {
    const attributes = this.attributesForQueryRow(json.row);

    const object = await this.findOrCreate(database, attributes);

    await this.process(object, attributes);

    return object;
  }

  async downloadQuery(options, to) {
    return new Promise((resolve, reject) => {
      const rq = Client.rawRequest(options).pipe(fs.createWriteStream(to));
      rq.on('close', () => resolve(rq));
      rq.on('error', reject);
    });
  }

  async finish() {
    await this.account.save();
  }
}
