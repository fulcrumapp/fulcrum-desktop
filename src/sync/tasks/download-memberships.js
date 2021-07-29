import Client from '../../api/client';
import Membership from '../../models/membership';
import DownloadResource from './download-resource';

export default class DownloadMemberships extends DownloadResource {
  get resourceName() {
    return 'memberships';
  }

  get typeName() {
    return 'membership';
  }

  fetchObjects(lastSync, sequence) {
    return Client.getMemberships(this.account);
  }

  fetchLocalObjects() {
    return this.account.findMemberships();
  }

  findOrCreate(database, attributes) {
    return Membership.findOrCreate(database, {user_resource_id: attributes.user_id, account_id: this.account.rowID});
  }

  async loadObject(object, attributes) {
    await object.getLocalRole();
  }
}
