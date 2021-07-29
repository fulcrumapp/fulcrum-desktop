import Client from '../../api/client';
import ClassificationSet from '../../models/classification-set';
import DownloadResource from './download-resource';

export default class DownloadClassificationSets extends DownloadResource {
  get resourceName() {
    return 'classification_sets';
  }

  get typeName() {
    return 'classification-set';
  }

  get propertyName() {
    return 'classificationSet';
  }

  fetchObjects(lastSync, sequence) {
    return Client.getClassificationSets(this.account);
  }

  fetchLocalObjects() {
    return this.account.findClassificationSets();
  }

  findOrCreate(database, attributes) {
    return ClassificationSet.findOrCreate(database, {resource_id: attributes.id, account_id: this.account.rowID});
  }
}
