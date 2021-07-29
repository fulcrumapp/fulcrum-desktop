import Client from '../../api/client';
import Role from '../../models/role';
import DownloadResource from './download-resource';

export default class DownloadRoles extends DownloadResource {
  get resourceName() {
    return 'roles';
  }

  get typeName() {
    return 'role';
  }

  fetchObjects(lastSync, sequence) {
    return Client.getRoles(this.account);
  }

  fetchLocalObjects() {
    return this.account.findRoles();
  }

  findOrCreate(database, attributes) {
    return Role.findOrCreate(database, {resource_id: attributes.id, account_id: this.account.rowID});
  }
}
