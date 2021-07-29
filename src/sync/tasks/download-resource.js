import Task from './task';
import { DateUtils } from 'fulcrum-core';

const PAGE_SIZE = 500;

export default class DownloadResource extends Task {
  get syncResourceName() {
    return this.resourceName;
  }

  get pageSize() {
    return PAGE_SIZE;
  }

  get syncResourceScope() {
    return null;
  }

  get resourceName() {
    throw new Error('must implement resourceName');
  }

  get typeName() {
    throw new Error('must implement typeName');
  }

  get propertyName() {
    return this.typeName;
  }

  get syncLabel() {
    return this.resourceName.replace('_', ' ');
  }

  fetchObjects(lastSync, sequence) {
    throw new Error('must implement fetchObjects');
  }

  fetchLocalObjects() {
    throw new Error('must implement fetchLocalObjects');
  }

  findOrCreate(database, attributes) {
    throw new Error('must implement findOrCreate');
  }

  loadObject(object, attributes) {
  }

  async process(object, attributes) {
    const isChanged = !object.isPersisted ||
                      DateUtils.parseISOTimestamp(attributes.updated_at).getTime() !== object.updatedAt.getTime();

    object.updateFromAPIAttributes(attributes);

    if (object._deletedAt != null) {
      object._deletedAt = null;
    }

    await this.loadObject(object, attributes);

    await object.save();

    if (isChanged) {
      await this.triggerEvent('save', {[this.propertyName]: object});
    }
  }

  triggerEvent(name, args) {
    return this.trigger(`${ this.typeName }:${ name }`, args);
  }

  fail(account, results) {
    fulcrum.logger.log(account.organizationName.green, 'failed'.red);
  }

  async run({dataSource}) {
    const sync = await this.checkSyncState();

    if (!sync.needsUpdate) {
      return;
    }

    this.progress({message: this.downloading + ' ' + this.syncLabel});

    const response = await this.fetchObjects();

    const objects = JSON.parse(response.body)[this.resourceName];

    this.progress({message: this.processing + ' ' + this.syncLabel, count: 0, total: objects.length});

    const localObjects = await this.fetchLocalObjects();

    this.markDeletedObjects(localObjects, objects, this.typeName, this.propertyName);

    for (let index = 0; index < objects.length; ++index) {
      const attributes = objects[index];

      const object = await this.findOrCreate(this.account.db, attributes);

      await this.process(object, attributes);

      this.progress({message: this.processing + ' ' + this.syncLabel, count: index + 1, total: objects.length});
    }

    await sync.update();

    dataSource.source.invalidate(this.resourceName);

    this.progress({message: this.finished + ' ' + this.syncLabel, count: objects.length, total: objects.length});
  }
}
