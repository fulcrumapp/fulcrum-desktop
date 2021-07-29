import Client from '../../api/client';
import Project from '../../models/project';
import DownloadResource from './download-resource';

export default class DownloadProjects extends DownloadResource {
  get resourceName() {
    return 'projects';
  }

  get typeName() {
    return 'project';
  }

  fetchObjects(lastSync, sequence) {
    return Client.getProjects(this.account);
  }

  fetchLocalObjects() {
    return this.account.findProjects();
  }

  findOrCreate(database, attributes) {
    return Project.findOrCreate(database, {resource_id: attributes.id, account_id: this.account.rowID});
  }
}
