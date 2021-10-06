import _ from 'underscore';

const Schema = {};

Schema.includeMediaCaptions = true;
Schema.includeMediaURLs = true;
Schema.includeMediaViewURLs = true;

Schema.systemFormTableColumns = [
  {
    name: 'id',
    type: 'pk'
  }, {
    name: 'record_id',
    type: 'integer',
    allowNull: false
  }, {
    name: 'record_resource_id',
    type: 'string',
    allowNull: false
  }, {
    name: 'project_id',
    type: 'integer'
  }, {
    name: 'project_resource_id',
    type: 'string'
  }, {
    name: 'assigned_to_id',
    type: 'integer'
  }, {
    name: 'assigned_to_resource_id',
    type: 'string'
  }, {
    name: 'status',
    type: 'string',
    length: 100
  }, {
    name: 'latitude',
    type: 'double'
  }, {
    name: 'longitude',
    type: 'double'
  }, {
    name: 'created_at',
    type: 'timestamp',
    allowNull: false
  }, {
    name: 'updated_at',
    type: 'timestamp',
    allowNull: false
  }, {
    name: 'version',
    type: 'integer',
    allowNull: false
  }, {
    name: 'created_by_id',
    type: 'integer',
    allowNull: false
  }, {
    name: 'created_by_resource_id',
    type: 'string'
  }, {
    name: 'updated_by_id',
    type: 'integer',
    allowNull: false
  }, {
    name: 'updated_by_resource_id',
    type: 'string'
  }, {
    name: 'server_created_at',
    type: 'timestamp',
    allowNull: false
  }, {
    name: 'server_updated_at',
    type: 'timestamp',
    allowNull: false
  }, {
    name: 'record_index_text',
    type: 'string'
  }, {
    name: 'record_index',
    type: 'fts'
  }, {
    name: 'geometry',
    type: 'geometry'
  }, {
    name: 'altitude',
    type: 'double'
  }, {
    name: 'speed',
    type: 'double'
  }, {
    name: 'course',
    type: 'double'
  }, {
    name: 'horizontal_accuracy',
    type: 'double'
  }, {
    name: 'vertical_accuracy',
    type: 'double'
  }, {
    name: 'form_values',
    type: 'text'
  }, {
    name: 'changeset_id',
    type: 'integer'
  }, {
    name: 'changeset_resource_id',
    type: 'string'
  }, {
    name: 'title',
    type: 'string'
  }, {
    name: 'created_latitude',
    type: 'double'
  }, {
    name: 'created_longitude',
    type: 'double'
  }, {
    name: 'created_geometry',
    type: 'geometry'
  }, {
    name: 'created_altitude',
    type: 'double'
  }, {
    name: 'created_horizontal_accuracy',
    type: 'double'
  }, {
    name: 'updated_latitude',
    type: 'double'
  }, {
    name: 'updated_longitude',
    type: 'double'
  }, {
    name: 'updated_geometry',
    type: 'geometry'
  }, {
    name: 'updated_altitude',
    type: 'double'
  }, {
    name: 'updated_horizontal_accuracy',
    type: 'double'
  }, {
    name: 'created_duration',
    type: 'integer'
  }, {
    name: 'updated_duration',
    type: 'integer'
  }, {
    name: 'edited_duration',
    type: 'integer'
  }, {
    name: 'report_url',
    type: 'string'
  }
];

Schema.systemValuesTableColumns = [
  {
    name: 'id',
    type: 'pk'
  }, {
    name: 'record_id',
    type: 'integer',
    allowNull: false
  }, {
    name: 'record_resource_id',
    type: 'string'
  }, {
    name: 'parent_resource_id',
    type: 'string'
  }, {
    name: 'key',
    type: 'string',
    allowNull: false,
    length: 4000
  }, {
    name: 'text_value',
    type: 'string',
    length: 4000
  }, {
    name: 'number_value',
    type: 'double'
  }
];

Schema.systemRepeatableTableColumns = [
  {
    name: 'id',
    type: 'pk'
  }, {
    name: 'resource_id',
    type: 'string',
    allowNull: false
  }, {
    name: 'record_id',
    type: 'integer',
    allowNull: false
  }, {
    name: 'record_resource_id',
    type: 'string',
    allowNull: false
  }, {
    name: 'parent_resource_id',
    type: 'string'
  }, {
    name: 'record_project_id',
    type: 'integer'
  }, {
    name: 'record_project_resource_id',
    type: 'string'
  }, {
    name: 'record_assigned_to_id',
    type: 'integer'
  }, {
    name: 'record_assigned_to_resource_id',
    type: 'string'
  }, {
    name: 'record_status',
    type: 'string',
  }, {
    name: 'index', // TODO(zhm) make this work in the app
    type: 'integer'
  }, {
    name: 'latitude',
    type: 'double'
  }, {
    name: 'longitude',
    type: 'double'
  }, {
    name: 'created_at',
    type: 'timestamp',
    allowNull: false
  }, {
    name: 'updated_at',
    type: 'timestamp',
    allowNull: false
  }, {
    name: 'version',
    type: 'integer',
    allowNull: false
  }, {
    name: 'created_by_id',
    type: 'integer',
    allowNull: false
  }, {
    name: 'created_by_resource_id',
    type: 'string'
  }, {
    name: 'updated_by_id',
    type: 'integer',
    allowNull: false
  }, {
    name: 'updated_by_resource_id',
    type: 'string'
  }, {
    name: 'server_created_at',
    type: 'timestamp',
    allowNull: false
  }, {
    name: 'server_updated_at',
    type: 'timestamp',
    allowNull: false
  }, {
    name: 'record_index_text',
    type: 'string'
  }, {
    name: 'record_index',
    type: 'fts'
  }, {
    name: 'geometry',
    type: 'geometry'
  }, {
    name: 'altitude',
    type: 'double'
  }, {
    name: 'speed',
    type: 'double'
  }, {
    name: 'course',
    type: 'double'
  }, {
    name: 'horizontal_accuracy',
    type: 'double'
  }, {
    name: 'vertical_accuracy',
    type: 'double'
  }, {
    name: 'form_values',
    type: 'text'
  }, {
    name: 'changeset_id',
    type: 'integer'
  }, {
    name: 'changeset_resource_id',
    type: 'string'
  }, {
    name: 'title',
    type: 'string'
  }, {
    name: 'created_latitude',
    type: 'double'
  }, {
    name: 'created_longitude',
    type: 'double'
  }, {
    name: 'created_geometry',
    type: 'geometry'
  }, {
    name: 'created_altitude',
    type: 'double'
  }, {
    name: 'created_horizontal_accuracy',
    type: 'double'
  }, {
    name: 'updated_latitude',
    type: 'double'
  }, {
    name: 'updated_longitude',
    type: 'double'
  }, {
    name: 'updated_geometry',
    type: 'geometry'
  }, {
    name: 'updated_altitude',
    type: 'double'
  }, {
    name: 'updated_horizontal_accuracy',
    type: 'double'
  }, {
    name: 'created_duration',
    type: 'integer'
  }, {
    name: 'updated_duration',
    type: 'integer'
  }, {
    name: 'edited_duration',
    type: 'integer'
  }, {
    name: 'report_url',
    type: 'string'
  }
];

Schema.systemFormViewColumns = {
  record_resource_id: 'record_id',
  project_resource_id: 'project_id',
  assigned_to_resource_id: 'assigned_to_id',
  status: 'status',
  latitude: 'latitude',
  longitude: 'longitude',
  created_at: 'created_at',
  updated_at: 'updated_at',
  version: 'version',
  created_by_resource_id: 'created_by_id',
  updated_by_resource_id: 'updated_by_id',
  server_created_at: 'server_created_at',
  server_updated_at: 'server_updated_at',
  geometry: 'geometry',
  altitude: 'altitude',
  speed: 'speed',
  course: 'course',
  horizontal_accuracy: 'horizontal_accuracy',
  vertical_accuracy: 'vertical_accuracy',
  changeset_resource_id: 'changeset_id',
  title: 'title',
  created_latitude: 'created_latitude',
  created_longitude: 'created_longitude',
  created_altitude: 'created_altitude',
  created_horizontal_accuracy: 'created_horizontal_accuracy',
  updated_latitude: 'updated_latitude',
  updated_longitude: 'updated_longitude',
  updated_altitude: 'updated_altitude',
  updated_horizontal_accuracy: 'updated_horizontal_accuracy',
  created_duration: 'created_duration',
  updated_duration: 'updated_duration',
  edited_duration: 'edited_duration',
  report_url: 'report_url'
};

Schema.systemFormFullViewColumns = _.clone(Schema.systemFormViewColumns);
Schema.systemFormFullViewColumns.form_values = 'form_values';
Schema.systemFormFullViewColumns.record_index = 'record_index';
Schema.systemFormFullViewColumns.record_index_text = 'record_index_text';

Schema.systemRepeatableViewColumns = {
  resource_id: 'child_record_id',
  record_resource_id: 'record_id',
  parent_resource_id: 'parent_id',
  record_project_resource_id: 'record_project_id',
  record_assigned_to_resource_id: 'record_assigned_to_id',
  record_status: 'record_status',
  index: 'index',
  latitude: 'latitude',
  longitude: 'longitude',
  created_at: 'created_at',
  updated_at: 'updated_at',
  version: 'version',
  created_by_resource_id: 'created_by_id',
  updated_by_resource_id: 'updated_by_id',
  server_created_at: 'server_created_at',
  server_updated_at: 'server_updated_at',
  geometry: 'geometry',
  changeset_resource_id: 'changeset_id',
  title: 'title',
  created_latitude: 'created_latitude',
  created_longitude: 'created_longitude',
  created_altitude: 'created_altitude',
  created_horizontal_accuracy: 'created_horizontal_accuracy',
  updated_latitude: 'updated_latitude',
  updated_longitude: 'updated_longitude',
  updated_altitude: 'updated_altitude',
  updated_horizontal_accuracy: 'updated_horizontal_accuracy',
  created_duration: 'created_duration',
  updated_duration: 'updated_duration',
  edited_duration: 'edited_duration',
  report_url: 'report_url'
};

Schema.systemRepeatableFullViewColumns = _.clone(Schema.systemRepeatableViewColumns);
Schema.systemRepeatableFullViewColumns.form_values = 'form_values';
Schema.systemRepeatableFullViewColumns.record_index = 'record_index';
Schema.systemRepeatableFullViewColumns.record_index_text = 'record_index_text';

Schema.systemValuesViewColumns = {
  record_resource_id: 'record_id',
  parent_resource_id: 'child_record_id',
  key: 'key',
  text_value: 'text_value'
};

Schema.systemFormTableIndexes = [
  { columns: [ 'record_resource_id' ], method: 'btree', unique: true },
  { columns: [ 'geometry' ], method: 'spatial' },
  // { columns: [ 'record_index' ], method: 'gin' },
  { columns: [ 'status' ], method: 'btree' },
  { columns: [ 'server_updated_at' ], method: 'btree' },
  { columns: [ 'project_resource_id' ], method: 'btree' },
  { columns: [ 'assigned_to_resource_id' ], method: 'btree' },
  { columns: [ 'changeset_resource_id' ], method: 'btree' }
];

Schema.systemRepeatableTableIndexes = [
  { columns: [ 'resource_id' ], method: 'btree', unique: true },
  { columns: [ 'record_resource_id' ], method: 'btree' },
  { columns: [ 'parent_resource_id' ], method: 'btree' },
  { columns: [ 'geometry' ], method: 'spatial' },
  // { columns: [ 'record_index' ], method: 'gin' },
  { columns: [ 'record_status' ], method: 'btree' },
  { columns: [ 'updated_at' ], method: 'btree' },
  { columns: [ 'record_project_resource_id' ], method: 'btree' },
  { columns: [ 'record_assigned_to_resource_id' ], method: 'btree' },
  { columns: [ 'changeset_resource_id' ], method: 'btree' }
];

Schema.systemValuesTableIndexes = [
  { columns: [ 'record_resource_id' ], method: 'btree' },
  { columns: [ 'parent_resource_id' ], method: 'btree' },
  { columns: [ 'text_value' ], method: 'btree' },
  { columns: [ 'key' ], method: 'btree' }
];

export default Schema;
