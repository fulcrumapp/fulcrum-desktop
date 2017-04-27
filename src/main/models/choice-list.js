import { PersistentObject } from 'minidb';
import { ChoiceList as ChoiceListBase } from 'fulcrum-core';

export default class ChoiceList extends ChoiceListBase {
  static get tableName() {
    return 'choice_lists';
  }

  static get columns() {
    return [
      { name: 'accountRowID', column: 'account_id', type: 'integer', null: false },
      { name: 'id', column: 'resource_id', type: 'string', null: false },
      { name: 'name', column: 'name', type: 'string', null: false },
      { name: 'description', column: 'description', type: 'string' },
      { name: 'choicesJSON', column: 'choices', type: 'json', null: false },
      { name: 'createdAt', column: 'created_at', type: 'datetime', null: false },
      { name: 'updatedAt', column: 'updated_at', type: 'datetime', null: false },
      { name: 'deletedAt', column: 'deleted_at', type: 'datetime' }
    ];
  }
}

PersistentObject.register(ChoiceList);