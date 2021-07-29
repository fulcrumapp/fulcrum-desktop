import ProgressBar from 'progress';
import {format} from 'util';
import app from '../../app';

export default class Task {
  constructor({synchronizer, syncState}) {
    this._synchronizer = synchronizer;
    this._syncState = syncState;

    this._isSimpleShell = app.args.simpleOutput || process.platform === 'win32';
    this._noProgress = app.args.progress === false || !process.stdout.isTTY;
  }

  get synchronizer() {
    return this._synchronizer;
  }

  getSyncState(resource, scope = null) {
    return this._syncState.find((object) => {
      return object.resource === resource && ((object.scope == null && scope === '') || object.scope === scope);
    });
  }

  async checkSyncState() {
    const scope = this.syncResourceScope || '';
    const resource = this.syncResourceName;

    const oldState = await this.account.findSyncState({resource, scope});
    const newState = this.getSyncState(resource, scope || '');

    let needsUpdate = true;

    if (oldState && newState && oldState.hash === newState.hash) {
      needsUpdate = false;
    }

    const update = async () => {
      if (oldState && newState) {
        oldState.hash = newState.hash;
        oldState.scope = oldState.scope || '';

        await oldState.save();
      }
    };

    return { needsUpdate, state: oldState, update };
  }

  async execute({account, dataSource}) {
    this.account = account;
    this.db = account.db;

    const syncName = this.syncResourceName;

    if (syncName) {
      await this.trigger(`${syncName}:start`, {task: this});
    }

    const result = await this.run({account, dataSource});

    if (this.bar) {
      console.log('');
    }

    if (syncName) {
      await this.trigger(`${syncName}:finish`, {task: this});
    }

    return result;
  }

  trigger(name, args) {
    return app.emit(name, {account: this.account, ...args});
  }

  get downloading() {
    return this._isSimpleShell ? '[downloading]' : '😀 ';
  }

  get processing() {
    return this._isSimpleShell ? '[processing]' : '🤔 ';
  }

  get finished() {
    return this._isSimpleShell ? '[finished]' : '😎 ';
  }

  progress({message, count, total}) {
    if (this._noProgress) {
      if (message !== this._lastMessage) {
        fulcrum.logger.log(message);
        this._lastMessage = message;
      }

      return;
    }

    let fmt = '';

    if (total === -1) {
      fmt = format('%s (:current) :elapsed', message.green);
    } else if (count != null) {
      fmt = format('%s :bar :percent (:current/:total) :etas :elapsed', message.green);
    } else {
      fmt = format('%s', message.green);
    }
    // const fmt = count != null ? format('%s :bar :percent (:current/:total) :etas :elapsed', message.green)
    //                           : format('%s', message.green);

    if (!this.bar) {
      const options = {
        width: 40,
        total: total || 1,
        complete: '▇'.green,
        incomplete: '-',
        clear: false
      };

      this.bar = new ProgressBar(fmt, options);
      this.bar.tick(0);
    }

    this.bar.fmt = fmt;

    if (total != null) {
      this.bar.total = total || 1;
    }

    if (this._message !== message) {
      this.bar.curr = 0;
      this.bar.render();
      this._message = message;
    }

    if (count != null) {
      this.bar.curr = count;
      this.bar.render();
    }
  }

  async markDeletedObjects(localObjects, newObjects, typeName, propName) {
    // delete all objects that don't exist on the server anymore
    for (const object of localObjects) {
      let objectExistsOnServer = false;

      for (const attributes of newObjects) {
        if (attributes.id === object.id) {
          objectExistsOnServer = true;
          break;
        }
      }

      if (!objectExistsOnServer) {
        const isChanged = object._deletedAt == null;

        object._deletedAt = object._deletedAt ? object._deletedAt : new Date();

        await object.save();

        if (isChanged) {
          await this.trigger(`${ typeName }:delete`, {[propName || typeName]: object});
        }
      }
    }
  }

  async lookup(record, resourceID, propName, getter) {
    if (resourceID) {
      const object = await new Promise((resolve) => {
        this.dataSource[getter](resourceID, (err, object) => resolve(object));
      });

      if (object) {
        record[propName] = object.rowID;
      }
    }
  }
}
