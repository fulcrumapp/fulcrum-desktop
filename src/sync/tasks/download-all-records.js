import Task from './task';
import DownloadRecords from './download-records';
import DownloadPhotos from './download-photos';
import DownloadVideos from './download-videos';
import DownloadAudio from './download-audio';
import DownloadSignatures from './download-signatures';
import App from '../../app';

export default class DownloadAllRecords extends Task {
  async run({dataSource}) {
    const forms = await this.account.findActiveForms();

    const includedForms = this.includedForms;

    for (const form of forms) {
      if (includedForms != null && includedForms.indexOf(form.id) === -1) {
        continue;
      }

      await new Promise((resolve, reject) => {
        form.load(dataSource, resolve);
      });

      this.synchronizer.addTask(new DownloadRecords({form: form, ...this.synchronizer.taskParams}));
    }

    // download media here to make sure the tasks are ordered after the records
    this.synchronizer.addTask(new DownloadPhotos(this.synchronizer.taskParams));
    this.synchronizer.addTask(new DownloadVideos(this.synchronizer.taskParams));
    this.synchronizer.addTask(new DownloadAudio(this.synchronizer.taskParams));
    this.synchronizer.addTask(new DownloadSignatures(this.synchronizer.taskParams));
  }

  get includedForms() {
    if (App.instance.args.form) {
      return Array.isArray(App.instance.args.form) ? App.instance.args.form : [ App.instance.args.form ];
    }

    return null;
  }
}
