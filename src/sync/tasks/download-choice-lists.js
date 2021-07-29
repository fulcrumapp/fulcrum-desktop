import Client from '../../api/client';
import ChoiceList from '../../models/choice-list';
import DownloadResource from './download-resource';

export default class DownloadChoiceLists extends DownloadResource {
  get resourceName() {
    return 'choice_lists';
  }

  get typeName() {
    return 'choice-list';
  }

  get propertyName() {
    return 'choiceList';
  }

  fetchObjects(lastSync, sequence) {
    return Client.getChoiceLists(this.account);
  }

  fetchLocalObjects() {
    return this.account.findChoiceLists();
  }

  findOrCreate(database, attributes) {
    return ChoiceList.findOrCreate(database, {resource_id: attributes.id, account_id: this.account.rowID});
  }
}
