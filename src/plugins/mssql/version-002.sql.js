export default `
BEGIN TRANSACTION;

CREATE TABLE __SCHEMA__.records (
  id bigint NOT NULL IDENTITY(1,1) PRIMARY KEY,
  row_id bigint NOT NULL,
  row_resource_id varchar(100) NOT NULL,
  form_id bigint NOT NULL,
  form_resource_id varchar(100) NOT NULL,
  project_id bigint,
  project_resource_id varchar(100),
  assigned_to_id bigint,
  assigned_to_resource_id varchar(100),
  status varchar(1000),
  latitude float,
  longitude float,
  created_at datetime NOT NULL,
  updated_at datetime NOT NULL,
  version bigint NOT NULL,
  created_by_id bigint,
  created_by_resource_id varchar(100),
  updated_by_id bigint,
  updated_by_resource_id varchar(100),
  server_created_at datetime NOT NULL,
  server_updated_at datetime NOT NULL,
  record_index_text varchar(max),
  record_index varchar(max),
  geometry geography,
  altitude float,
  speed float,
  course float,
  horizontal_accuracy float,
  vertical_accuracy float,
  form_values varchar(max),
  changeset_id bigint,
  changeset_resource_id varchar(100),
  title varchar(max),
  created_latitude float,
  created_longitude float,
  created_geometry geography,
  created_altitude float,
  created_horizontal_accuracy float,
  updated_latitude float,
  updated_longitude float,
  updated_geometry geography,
  updated_altitude float,
  updated_horizontal_accuracy float,
  created_duration bigint,
  updated_duration bigint,
  edited_duration bigint
);

IF OBJECT_ID('__VIEW_SCHEMA__.records_view', 'V') IS NOT NULL DROP VIEW __VIEW_SCHEMA__.records_view;

CREATE VIEW __VIEW_SCHEMA__.records_view AS
SELECT
  records.row_resource_id AS record_id,
  records.form_resource_id AS form_id,
  records.project_resource_id AS project_id,
  records.assigned_to_resource_id AS assigned_to_id,
  records.status AS status,
  records.latitude AS latitude,
  records.longitude AS longitude,
  records.created_at AS created_at,
  records.updated_at AS updated_at,
  records.version AS version,
  records.created_by_resource_id AS created_by_id,
  records.updated_by_resource_id AS updated_by_id,
  records.server_created_at AS server_created_at,
  records.server_updated_at AS server_updated_at,
  records.geometry AS geometry,
  records.altitude AS altitude,
  records.speed AS speed,
  records.course AS course,
  records.horizontal_accuracy AS horizontal_accuracy,
  records.vertical_accuracy AS vertical_accuracy,
  records.changeset_resource_id AS changeset_id,
  records.title AS title,
  records.created_latitude AS created_latitude,
  records.created_longitude AS created_longitude,
  records.created_geometry AS created_geometry,
  records.created_altitude AS created_altitude,
  records.created_horizontal_accuracy AS created_horizontal_accuracy,
  records.updated_latitude AS updated_latitude,
  records.updated_longitude AS updated_longitude,
  records.updated_geometry AS updated_geometry,
  records.updated_altitude AS updated_altitude,
  records.updated_horizontal_accuracy AS updated_horizontal_accuracy,
  records.created_duration AS created_duration,
  records.updated_duration AS updated_duration,
  records.edited_duration AS edited_duration
FROM __SCHEMA__.records;


CREATE UNIQUE INDEX idx_records_row_resource_id ON __SCHEMA__.records (row_resource_id);

CREATE UNIQUE INDEX idx_records_row_id ON __SCHEMA__.records (row_id);

CREATE INDEX idx_records_form_resource_id ON __SCHEMA__.records (form_resource_id);

CREATE INDEX idx_records_assigned_to_resource_id ON __SCHEMA__.records (assigned_to_resource_id);

CREATE INDEX idx_records_changeset_resource_id ON __SCHEMA__.records (changeset_resource_id);

CREATE SPATIAL INDEX idx_records_geometry ON __SCHEMA__.records (geometry);

CREATE INDEX idx_records_project_resource_id ON __SCHEMA__.records (project_resource_id);

-- CREATE INDEX idx_records_record_index ON __SCHEMA__.records USING gin (record_index);

CREATE INDEX idx_records_server_updated_at ON __SCHEMA__.records (server_updated_at);

CREATE INDEX idx_records_server_created_at ON __SCHEMA__.records (server_created_at);

CREATE INDEX idx_records_status ON __SCHEMA__.records (status);

INSERT INTO __SCHEMA__.migrations (name) VALUES ('002');

EXEC sp_rename '__SCHEMA__.audio', 'system_audio';
EXEC sp_rename '__SCHEMA__.changesets', 'system_changesets';
EXEC sp_rename '__SCHEMA__.choice_lists', 'system_choice_lists';
EXEC sp_rename '__SCHEMA__.classification_sets', 'system_classification_sets';
EXEC sp_rename '__SCHEMA__.forms', 'system_forms';
EXEC sp_rename '__SCHEMA__.memberships', 'system_memberships';
EXEC sp_rename '__SCHEMA__.photos', 'system_photos';
EXEC sp_rename '__SCHEMA__.projects', 'system_projects';
EXEC sp_rename '__SCHEMA__.roles', 'system_roles';
EXEC sp_rename '__SCHEMA__.signatures', 'system_signatures';
EXEC sp_rename '__SCHEMA__.videos', 'system_videos';
EXEC sp_rename '__SCHEMA__.records', 'system_records';

COMMIT TRANSACTION;
`;
