import Form from './models/form';
import ChoiceList from './models/choice-list';
import ClassificationSet from './models/classification-set';
import Membership from './models/membership';
import Role from './models/role';
import Project from './models/project';
import Changeset from './models/changeset';

export default class LocalDatabaseDataSource {
  constructor(account) {
    this.account = account;
    this.db = account.db;
    this.choiceLists = null;
    this.classificationSets = null;
    this.forms = null;
    this.memberships = null;
    this.projects = null;
    this.roles = null;
  }

  async load(db) {
  }

  async loadObjects(db, type, handler) {
    const objects = await type.findAll(db, {account_id: this.account.rowID});

    const map = {};

    for (const object of objects) {
      if (handler) {
        handler(map, object);
      } else {
        map[object.id] = object;
      }
    }

    return map;
  }

  async loadObject(db, type, id, handler) {
    const object = await type.findFirst(db, {account_id: this.account.rowID, resource_id: id});

    if (handler) {
      handler(object);
    }

    return object;
  }

  invalidate(collection) {
    this[collection] = null;
  }

  lazyLoad(collection, id, type, handler, callback) {
    if (this[collection] == null) {
      this.loadObjects(this.db, type, handler).then((objects) => {
        this[collection] = objects;
        callback(null, this[collection][id]);
      });

      return;
    }

    callback(null, this[collection][id]);
  }

  getProject(id, callback) {
    return this.lazyLoad('projects', id, Project, null, callback);
  }

  getChoiceList(id, callback) {
    return this.lazyLoad('choiceLists', id, ChoiceList, null, callback);
  }

  getClassificationSet(id, callback) {
    return this.lazyLoad('classificationSets', id, ClassificationSet, null, callback);
  }

  getForm(id, callback) {
    return this.lazyLoad('forms', id, Form, null, callback);
  }

  getUser(id, callback) {
    return this.lazyLoad('memberships', id, Membership, (map, object) => {
      map[object._userID] = object;
    }, callback);
  }

  getRole(id, callback) {
    return this.lazyLoad('roles', id, Role, null, callback);
  }

  getChangeset(id, callback) {
    this.loadObject(this.db, Changeset, id).then((object) => {
      callback(null, object);
    });
  }
}

