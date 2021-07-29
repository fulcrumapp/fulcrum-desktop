import DownloadRoles from './tasks/download-roles';
import DownloadMemberships from './tasks/download-memberships';
import DownloadChoiceLists from './tasks/download-choice-lists';
import DownloadClassificationSets from './tasks/download-classification-sets';
import DownloadProjects from './tasks/download-projects';
import DownloadForms from './tasks/download-forms';
import DownloadChangesets from './tasks/download-changesets';
import DownloadAllRecords from './tasks/download-all-records';
import app from '../app';
import exec from '../utils/exec';

import Client from '../api/client';

import humanizeDuration from 'humanize-duration';

export default class Synchronizer {
  constructor() {
    this._tasks = [];
    this._recordCount = 0;
  }

  addTask(task) {
    this._tasks.push(task);
  }

  popTask() {
    return this._tasks.shift();
  }

  incrementRecordCount() {
    this._recordCount++;
  }

  async run(account, formName, dataSource, {fullSync}) {
    const start = new Date().getTime();

    this._recordCount = 0;

    const response = await Client.getSync(account);

    this.syncState = fullSync ? [] : JSON.parse(response.body).resources;
    this.taskParams = { synchronizer: this, syncState: this.syncState };

    this.addTask(new DownloadRoles(this.taskParams));
    this.addTask(new DownloadMemberships(this.taskParams));
    this.addTask(new DownloadChoiceLists(this.taskParams));
    this.addTask(new DownloadClassificationSets(this.taskParams));
    this.addTask(new DownloadProjects(this.taskParams));
    this.addTask(new DownloadForms(this.taskParams));
    this.addTask(new DownloadChangesets(this.taskParams));
    this.addTask(new DownloadAllRecords(this.taskParams));

    await dataSource.source.load(account.db);

    await app.emit('sync:start', {account, tasks: this._tasks});

    do {
      const task = this.popTask();

      await task.execute({account, dataSource});
    } while (this._tasks.length);

    await app.emit('sync:finish', {account});

    if (app.args.afterSyncCommand) {
      await exec(app.args.afterSyncCommand, this.afterSyncCommandOptions, 'after-sync');
    }

    fulcrum.logger.log('Synced'.green, humanizeDuration(new Date().getTime() - start));
  }

  get afterSyncCommandOptions() {
    const options = {
      changedRecordCount: this._recordCount,
      args: app.args
    };

    return {
      env: {
        FULCRUM_PAYLOAD: JSON.stringify(options),
        FULCRUM_CHANGED_RECORD_COUNT: options.recordCount
      }
    };
  }
}
