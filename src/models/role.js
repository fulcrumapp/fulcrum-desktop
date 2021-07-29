import { PersistentObject } from 'minidb';
import { Role as RoleBase } from 'fulcrum-core';

export default class Role extends RoleBase {
  static get tableName() {
    return 'roles';
  }

  static get columns() {
    return [
      { name: 'accountRowID', column: 'account_id', type: 'integer', null: false },
      { name: 'id', column: 'resource_id', type: 'string', null: false },
      { name: 'name', column: 'name', type: 'string', null: false },
      { name: 'isSystem', column: 'is_system', type: 'boolean', null: false },
      { name: 'isDefault', column: 'is_default', type: 'boolean', null: false },
      { name: 'canManageSubscription', column: 'can_manage_subscription', type: 'boolean', null: false },
      { name: 'canUpdateOrganization', column: 'can_update_organization', type: 'boolean', null: false },
      { name: 'canManageMembers', column: 'can_manage_members', type: 'boolean', null: false },
      { name: 'canManageRoles', column: 'can_manage_roles', type: 'boolean', null: false },
      { name: 'canManageApps', column: 'can_manage_apps', type: 'boolean', null: false },
      { name: 'canManageProjects', column: 'can_manage_projects', type: 'boolean', null: false },
      { name: 'canManageChoiceLists', column: 'can_manage_choice_lists', type: 'boolean', null: false },
      { name: 'canManageClassificationSets', column: 'can_manage_classification_sets', type: 'boolean', null: false },
      { name: 'canCreateRecords', column: 'can_create_records', type: 'boolean', null: false },
      { name: 'canUpdateRecords', column: 'can_update_records', type: 'boolean', null: false },
      { name: 'canDeleteRecords', column: 'can_delete_records', type: 'boolean', null: false },
      { name: 'canChangeStatus', column: 'can_change_status', type: 'boolean', null: false },
      { name: 'canChangeProject', column: 'can_change_project', type: 'boolean', null: false },
      { name: 'canAssignRecords', column: 'can_assign_records', type: 'boolean', null: false },
      { name: 'canImportRecords', column: 'can_import_records', type: 'boolean', null: false },
      { name: 'canExportRecords', column: 'can_export_records', type: 'boolean', null: false },
      { name: 'canRunReports', column: 'can_run_reports', type: 'boolean', null: false },
      { name: 'canManageLayers', column: 'can_manage_layers', type: 'boolean', null: false },
      { name: 'canManageAuthorizations', column: 'can_manage_authorizations', type: 'boolean', null: false },
      { name: 'createdAt', column: 'server_created_at', type: 'datetime' },
      { name: 'updatedAt', column: 'server_updated_at', type: 'datetime' },
      { name: 'deletedAt', column: 'deleted_at', type: 'datetime' }
    ];
  }
}

PersistentObject.register(Role);
