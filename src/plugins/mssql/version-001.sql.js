export default `
BEGIN TRANSACTION;

CREATE TABLE __SCHEMA__.migrations (
  id bigint NOT NULL IDENTITY(1,1) PRIMARY KEY,
  name varchar(100) NOT NULL,
  created_at datetime NOT NULL DEFAULT GETDATE()
);

CREATE UNIQUE INDEX idx_migrations_name ON __SCHEMA__.migrations (name);

CREATE TABLE __SCHEMA__.audio (
  id bigint NOT NULL IDENTITY(1,1) PRIMARY KEY,
  row_id bigint NOT NULL,
  row_resource_id varchar(100) NOT NULL,
  access_key varchar(100) NOT NULL,
  record_id bigint,
  record_resource_id varchar(100),
  form_id bigint,
  form_resource_id varchar(100),
  metadata varchar(max),
  file_size bigint,
  created_by_id bigint,
  created_by_resource_id varchar(100),
  updated_by_id bigint,
  updated_by_resource_id varchar(100),
  created_at datetime NOT NULL,
  updated_at datetime NOT NULL,
  [file] varchar(max),
  content_type varchar(max),
  is_uploaded bit NOT NULL DEFAULT 0,
  is_stored bit NOT NULL DEFAULT 0,
  is_processed bit NOT NULL DEFAULT 0,
  has_track bit,
  track varchar(max),
  geometry geography,
  duration float,
  bit_rate float
);

CREATE TABLE __SCHEMA__.changesets (
  id bigint NOT NULL IDENTITY(1,1) PRIMARY KEY,
  row_id bigint NOT NULL,
  row_resource_id varchar(100) NOT NULL,
  form_id bigint NULL,
  form_resource_id varchar(100),
  metadata varchar(max),
  closed_at datetime,
  created_by_id bigint,
  created_by_resource_id varchar(100),
  updated_by_id bigint,
  updated_by_resource_id varchar(100),
  closed_by_id bigint,
  closed_by_resource_id varchar(100),
  created_at datetime NOT NULL,
  updated_at datetime NOT NULL,
  min_lat float,
  max_lat float,
  min_lon float,
  max_lon float,
  number_of_changes bigint,
  number_of_creates bigint,
  number_of_updates bigint,
  number_of_deletes bigint,
  metadata_index_text varchar(max),
  metadata_index varchar(max),
  bounding_box geography
);

CREATE TABLE __SCHEMA__.choice_lists (
  id bigint NOT NULL IDENTITY(1,1) PRIMARY KEY,
  row_id bigint NOT NULL,
  row_resource_id varchar(100) NOT NULL,
  name varchar(1000) NOT NULL,
  description varchar(max),
  version bigint NOT NULL,
  items varchar(max) NOT NULL,
  created_by_id bigint,
  created_by_resource_id varchar(100),
  updated_by_id bigint,
  updated_by_resource_id varchar(100),
  created_at datetime NOT NULL,
  updated_at datetime NOT NULL,
  deleted_at datetime
);

CREATE TABLE __SCHEMA__.classification_sets (
  id bigint NOT NULL IDENTITY(1,1) PRIMARY KEY,
  row_id bigint NOT NULL,
  row_resource_id varchar(100) NOT NULL,
  name varchar(1000) NOT NULL,
  description varchar(max),
  version bigint NOT NULL,
  items varchar(max) NOT NULL,
  created_by_id bigint,
  created_by_resource_id varchar(100),
  updated_by_id bigint,
  updated_by_resource_id varchar(100),
  created_at datetime NOT NULL,
  updated_at datetime NOT NULL,
  deleted_at datetime
);

CREATE TABLE __SCHEMA__.forms (
  id bigint NOT NULL IDENTITY(1,1) PRIMARY KEY,
  row_id bigint NOT NULL,
  row_resource_id varchar(100) NOT NULL,
  name varchar(1000) NOT NULL,
  description varchar(max),
  version bigint NOT NULL,
  elements varchar(max),
  bounding_box geography,
  record_count bigint NOT NULL DEFAULT 0,
  record_changed_at datetime,
  recent_lat_longs varchar(max),
  status varchar(max),
  status_field varchar(max),
  created_by_id bigint,
  created_by_resource_id varchar(100),
  updated_by_id bigint,
  updated_by_resource_id varchar(100),
  created_at datetime NOT NULL,
  updated_at datetime NOT NULL,
  photo_usage bigint,
  photo_count bigint,
  video_usage bigint,
  video_count bigint,
  audio_usage bigint,
  audio_count bigint,
  signature_usage bigint,
  signature_count bigint,
  media_usage bigint,
  media_count bigint,
  auto_assign bit NOT NULL,
  title_field_keys varchar(max),
  hidden_on_dashboard bit NOT NULL,
  geometry_types varchar(max),
  geometry_required bit NOT NULL,
  script varchar(max),
  image varchar(max),
  projects_enabled bit NOT NULL,
  assignment_enabled bit NOT NULL,
  deleted_at datetime
);

CREATE TABLE __SCHEMA__.memberships (
  id bigint NOT NULL IDENTITY(1,1) PRIMARY KEY,
  row_id bigint NOT NULL,
  row_resource_id varchar(100) NOT NULL,
  user_resource_id varchar(100),
  first_name varchar(max),
  last_name varchar(max),
  name varchar(1000),
  email varchar(max),
  role_id bigint NOT NULL,
  role_resource_id varchar(100) NOT NULL,
  status varchar(max),
  created_at datetime NOT NULL,
  updated_at datetime NOT NULL,
  deleted_at datetime
);

CREATE TABLE __SCHEMA__.photos (
  id bigint NOT NULL IDENTITY(1,1) PRIMARY KEY,
  row_id bigint NOT NULL,
  row_resource_id varchar(100) NOT NULL,
  access_key varchar(100) NOT NULL,
  record_id bigint,
  record_resource_id varchar(100),
  form_id bigint,
  form_resource_id varchar(100),
  exif varchar(max),
  file_size bigint,
  created_by_id bigint,
  created_by_resource_id varchar(100),
  updated_by_id bigint,
  updated_by_resource_id varchar(100),
  created_at datetime NOT NULL,
  updated_at datetime NOT NULL,
  [file] varchar(max),
  content_type varchar(max),
  is_uploaded bit NOT NULL DEFAULT 0,
  is_stored bit NOT NULL DEFAULT 0,
  is_processed bit NOT NULL DEFAULT 0,
  geometry geography,
  latitude float,
  longitude float,
  altitude float,
  accuracy float,
  direction float,
  width bigint,
  height bigint,
  make varchar(max),
  model varchar(max),
  software varchar(max),
  date_time varchar(max)
);

CREATE TABLE __SCHEMA__.projects (
  id bigint NOT NULL IDENTITY(1,1) PRIMARY KEY,
  row_id bigint NOT NULL,
  row_resource_id varchar(100) NOT NULL,
  name varchar(1000) NOT NULL,
  description varchar(max),
  created_by_id bigint,
  created_by_resource_id varchar(100),
  created_at datetime NOT NULL,
  updated_at datetime NOT NULL,
  deleted_at datetime
);

CREATE TABLE __SCHEMA__.roles (
  id bigint NOT NULL IDENTITY(1,1) PRIMARY KEY,
  row_id bigint NOT NULL,
  row_resource_id varchar(100) NOT NULL,
  name varchar(1000) NOT NULL,
  description varchar(max),
  created_by_id bigint,
  created_by_resource_id varchar(100),
  updated_by_id bigint,
  updated_by_resource_id varchar(100),
  created_at datetime NOT NULL,
  updated_at datetime NOT NULL,
  is_system bit NOT NULL,
  is_default bit NOT NULL,
  can_manage_subscription bit NOT NULL DEFAULT 0,
  can_update_organization bit NOT NULL DEFAULT 0,
  can_manage_members bit NOT NULL DEFAULT 0,
  can_manage_roles bit NOT NULL DEFAULT 0,
  can_manage_apps bit NOT NULL DEFAULT 0,
  can_manage_projects bit NOT NULL DEFAULT 0,
  can_manage_choice_lists bit NOT NULL DEFAULT 0,
  can_manage_classification_sets bit NOT NULL DEFAULT 0,
  can_create_records bit NOT NULL DEFAULT 0,
  can_update_records bit NOT NULL DEFAULT 0,
  can_delete_records bit NOT NULL DEFAULT 0,
  can_change_status bit NOT NULL DEFAULT 0,
  can_change_project bit NOT NULL DEFAULT 0,
  can_assign_records bit NOT NULL DEFAULT 0,
  can_import_records bit NOT NULL DEFAULT 0,
  can_export_records bit NOT NULL DEFAULT 0,
  can_run_reports bit NOT NULL DEFAULT 0,
  can_manage_authorizations bit NOT NULL DEFAULT 0,
  deleted_at datetime
);

CREATE TABLE __SCHEMA__.signatures (
  id bigint NOT NULL IDENTITY(1,1) PRIMARY KEY,
  row_id bigint NOT NULL,
  row_resource_id varchar(100) NOT NULL,
  access_key varchar(100) NOT NULL,
  record_id bigint,
  record_resource_id varchar(100),
  form_id bigint,
  form_resource_id varchar(100),
  exif varchar(max),
  file_size bigint,
  created_by_id bigint,
  created_by_resource_id varchar(100),
  updated_by_id bigint,
  updated_by_resource_id varchar(100),
  created_at datetime NOT NULL,
  updated_at datetime NOT NULL,
  [file] varchar(max),
  content_type varchar(max),
  is_uploaded bit NOT NULL DEFAULT 0,
  is_stored bit NOT NULL DEFAULT 0,
  is_processed bit NOT NULL DEFAULT 0
);

CREATE TABLE __SCHEMA__.videos (
  id bigint NOT NULL IDENTITY(1,1) PRIMARY KEY,
  row_id bigint NOT NULL,
  row_resource_id varchar(100) NOT NULL,
  access_key varchar(100) NOT NULL,
  record_id bigint,
  record_resource_id varchar(100),
  form_id bigint,
  form_resource_id varchar(100),
  metadata varchar(max),
  file_size bigint,
  created_by_id bigint,
  created_by_resource_id varchar(100),
  updated_by_id bigint,
  updated_by_resource_id varchar(100),
  created_at datetime NOT NULL,
  updated_at datetime NOT NULL,
  [file] varchar(max),
  content_type varchar(max),
  is_uploaded bit NOT NULL DEFAULT 0,
  is_stored bit NOT NULL DEFAULT 0,
  is_processed bit NOT NULL DEFAULT 0,
  has_track bit,
  track varchar(max),
  geometry geography,
  width bigint,
  height bigint,
  duration float,
  bit_rate float
);

IF OBJECT_ID('__VIEW_SCHEMA__.audio_view', 'V') IS NOT NULL DROP VIEW __VIEW_SCHEMA__.audio_view;

CREATE VIEW __VIEW_SCHEMA__.audio_view AS
SELECT
  access_key AS audio_id,
  record_resource_id AS record_id,
  form_resource_id AS form_id,
  metadata AS metadata,
  file_size AS file_size,
  created_by_resource_id AS created_by_id,
  updated_by_resource_id AS updated_by_id,
  created_at AS created_at,
  updated_at AS updated_at,
  [file] AS [file],
  content_type AS content_type,
  is_uploaded AS is_uploaded,
  is_stored AS is_stored,
  is_processed AS is_processed,
  has_track AS has_track,
  track AS track,
  geometry AS geometry,
  duration AS duration,
  bit_rate AS bit_rate
FROM __SCHEMA__.audio;

IF OBJECT_ID('__VIEW_SCHEMA__.changesets_view', 'V') IS NOT NULL DROP VIEW __VIEW_SCHEMA__.changesets_view;

CREATE VIEW __VIEW_SCHEMA__.changesets_view AS
SELECT
  row_resource_id AS changeset_id,
  form_resource_id AS form_id,
  metadata AS metadata,
  closed_at AS closed_at,
  created_by_resource_id AS created_by_id,
  updated_by_resource_id AS updated_by_id,
  closed_by_resource_id AS closed_by_id,
  created_at AS created_at,
  updated_at AS updated_at,
  min_lat AS min_lat,
  max_lat AS max_lat,
  min_lon AS min_lon,
  max_lon AS max_lon,
  number_of_changes AS number_of_changes,
  number_of_creates AS number_of_creates,
  number_of_updates AS number_of_updates,
  number_of_deletes AS number_of_deletes,
  metadata_index AS metadata_index,
  bounding_box AS bounding_box
FROM __SCHEMA__.changesets;

IF OBJECT_ID('__VIEW_SCHEMA__.choice_lists_view', 'V') IS NOT NULL DROP VIEW __VIEW_SCHEMA__.choice_lists_view;

CREATE VIEW __VIEW_SCHEMA__.choice_lists_view AS
SELECT
  row_resource_id AS choice_list_id,
  name AS name,
  description AS description,
  version AS version,
  items AS items,
  created_by_resource_id AS created_by_id,
  updated_by_resource_id AS updated_by_id,
  created_at AS created_at,
  updated_at AS updated_at,
  deleted_at AS deleted_at
FROM __SCHEMA__.choice_lists;

IF OBJECT_ID('__VIEW_SCHEMA__.classification_sets_view', 'V') IS NOT NULL DROP VIEW __VIEW_SCHEMA__.classification_sets_view;

CREATE VIEW __VIEW_SCHEMA__.classification_sets_view AS
SELECT
  row_resource_id AS classification_set_id,
  name AS name,
  description AS description,
  version AS version,
  items AS items,
  created_by_resource_id AS created_by_id,
  updated_by_resource_id AS updated_by_id,
  created_at AS created_at,
  updated_at AS updated_at,
  deleted_at AS deleted_at
FROM __SCHEMA__.classification_sets;

IF OBJECT_ID('__VIEW_SCHEMA__.forms_view', 'V') IS NOT NULL DROP VIEW __VIEW_SCHEMA__.forms_view;

CREATE VIEW __VIEW_SCHEMA__.forms_view AS
SELECT
  row_resource_id AS form_id,
  name AS name,
  description AS description,
  version AS version,
  elements AS elements,
  bounding_box AS bounding_box,
  status AS status,
  status_field AS status_field,
  created_by_resource_id AS created_by_id,
  updated_by_resource_id AS updated_by_id,
  created_at AS created_at,
  updated_at AS updated_at,
  deleted_at AS deleted_at,
  auto_assign AS auto_assign,
  title_field_keys AS title_field_keys,
  hidden_on_dashboard AS hidden_on_dashboard,
  geometry_types AS geometry_types,
  geometry_required AS geometry_required,
  script AS script,
  image AS image,
  projects_enabled AS projects_enabled,
  assignment_enabled AS assignment_enabled
FROM __SCHEMA__.forms;

IF OBJECT_ID('__VIEW_SCHEMA__.memberships_view', 'V') IS NOT NULL DROP VIEW __VIEW_SCHEMA__.memberships_view;

CREATE VIEW __VIEW_SCHEMA__.memberships_view AS
SELECT
  memberships.row_resource_id AS membership_id,
  memberships.user_resource_id AS user_id,
  memberships.first_name AS first_name,
  memberships.last_name AS last_name,
  memberships.name AS name,
  memberships.email AS email,
  memberships.role_resource_id AS role_id,
  roles.name AS role_name,
  memberships.status AS status,
  memberships.created_at AS created_at,
  memberships.updated_at AS updated_at,
  memberships.deleted_at AS deleted_at
FROM __SCHEMA__.memberships memberships
LEFT OUTER JOIN __SCHEMA__.roles roles ON memberships.role_resource_id = roles.row_resource_id;

IF OBJECT_ID('__VIEW_SCHEMA__.photos_view', 'V') IS NOT NULL DROP VIEW __VIEW_SCHEMA__.photos_view;

CREATE VIEW __VIEW_SCHEMA__.photos_view AS
SELECT
  access_key AS photo_id,
  record_resource_id AS record_id,
  form_resource_id AS form_id,
  exif AS exif,
  file_size AS file_size,
  created_by_resource_id AS created_by_id,
  updated_by_resource_id AS updated_by_id,
  created_at AS created_at,
  updated_at AS updated_at,
  [file] AS [file],
  content_type AS content_type,
  is_uploaded AS is_uploaded,
  is_stored AS is_stored,
  is_processed AS is_processed,
  geometry AS geometry,
  latitude AS latitude,
  longitude AS longitude,
  altitude AS altitude,
  accuracy AS accuracy,
  direction AS direction,
  width AS width,
  height AS height,
  make AS make,
  model AS model,
  software AS software,
  date_time AS date_time
FROM __SCHEMA__.photos;

IF OBJECT_ID('__VIEW_SCHEMA__.projects_view', 'V') IS NOT NULL DROP VIEW __VIEW_SCHEMA__.projects_view;

CREATE VIEW __VIEW_SCHEMA__.projects_view AS
SELECT
  row_resource_id AS project_id,
  name AS name,
  description AS description,
  created_by_resource_id AS created_by_id,
  created_at AS created_at,
  updated_at AS updated_at,
  deleted_at AS deleted_at
FROM __SCHEMA__.projects;

IF OBJECT_ID('__VIEW_SCHEMA__.roles_view', 'V') IS NOT NULL DROP VIEW __VIEW_SCHEMA__.roles_view;

CREATE VIEW __VIEW_SCHEMA__.roles_view AS
SELECT
  row_resource_id AS role_id,
  name AS name,
  description AS description,
  created_by_resource_id AS created_by_id,
  updated_by_resource_id AS updated_by_id,
  created_at AS created_at,
  updated_at AS updated_at,
  deleted_at AS deleted_at,
  is_system AS is_system,
  is_default AS is_default,
  can_manage_subscription AS can_manage_subscription,
  can_update_organization AS can_update_organization,
  can_manage_members AS can_manage_members,
  can_manage_roles AS can_manage_roles,
  can_manage_apps AS can_manage_apps,
  can_manage_projects AS can_manage_projects,
  can_manage_choice_lists AS can_manage_choice_lists,
  can_manage_classification_sets AS can_manage_classification_sets,
  can_create_records AS can_create_records,
  can_update_records AS can_update_records,
  can_delete_records AS can_delete_records,
  can_change_status AS can_change_status,
  can_change_project AS can_change_project,
  can_assign_records AS can_assign_records,
  can_import_records AS can_import_records,
  can_export_records AS can_export_records,
  can_run_reports AS can_run_reports,
  can_manage_authorizations AS can_manage_authorizations
FROM __SCHEMA__.roles;

IF OBJECT_ID('__VIEW_SCHEMA__.signatures_view', 'V') IS NOT NULL DROP VIEW __VIEW_SCHEMA__.signatures_view;

CREATE VIEW __VIEW_SCHEMA__.signatures_view AS
SELECT
  access_key AS signature_id,
  record_resource_id AS record_id,
  form_resource_id AS form_id,
  file_size AS file_size,
  created_by_resource_id AS created_by_id,
  updated_by_resource_id AS updated_by_id,
  created_at AS created_at,
  updated_at AS updated_at,
  [file] AS [file],
  content_type AS content_type,
  is_uploaded AS is_uploaded,
  is_stored AS is_stored,
  is_processed AS is_processed
FROM __SCHEMA__.signatures;

IF OBJECT_ID('__VIEW_SCHEMA__.videos_view', 'V') IS NOT NULL DROP VIEW __VIEW_SCHEMA__.videos_view;

CREATE VIEW __VIEW_SCHEMA__.videos_view AS
SELECT
  access_key AS video_id,
  record_resource_id AS record_id,
  form_resource_id AS form_id,
  metadata AS metadata,
  file_size AS file_size,
  created_by_resource_id AS created_by_id,
  updated_by_resource_id AS updated_by_id,
  created_at AS created_at,
  updated_at AS updated_at,
  [file] AS [file],
  content_type AS content_type,
  is_uploaded AS is_uploaded,
  is_stored AS is_stored,
  is_processed AS is_processed,
  has_track AS has_track,
  track AS track,
  geometry AS geometry,
  width AS width,
  height AS height,
  duration AS duration,
  bit_rate AS bit_rate
FROM __SCHEMA__.videos;

CREATE UNIQUE INDEX idx_audio_row_resource_id ON __SCHEMA__.audio (row_resource_id);

CREATE UNIQUE INDEX idx_audio_row_id ON __SCHEMA__.audio (row_id);

CREATE INDEX idx_audio_access_key ON __SCHEMA__.audio (access_key);

CREATE INDEX idx_audio_record_resource_id ON __SCHEMA__.audio (record_resource_id);

CREATE INDEX idx_audio_form_resource_id ON __SCHEMA__.audio (form_resource_id);

CREATE INDEX idx_audio_created_by_resource_id ON __SCHEMA__.audio (created_by_resource_id);

CREATE SPATIAL INDEX idx_audio_geometry ON __SCHEMA__.audio (geometry);

CREATE INDEX idx_audio_updated_at ON __SCHEMA__.audio (updated_at);

CREATE UNIQUE INDEX idx_changesets_row_resource_id ON __SCHEMA__.changesets (row_resource_id);

CREATE UNIQUE INDEX idx_changesets_row_id ON __SCHEMA__.changesets (row_id);

CREATE INDEX idx_changesets_form_id ON __SCHEMA__.changesets (form_id);

-- CREATE INDEX idx_changesets_metadata_index ON __SCHEMA__.changesets USING gin (metadata_index) WITH (fastupdate = off);

CREATE INDEX idx_changesets_form_id_updated_at ON __SCHEMA__.changesets (form_id, updated_at);

CREATE INDEX idx_changesets_updated_at ON __SCHEMA__.changesets (updated_at);

CREATE UNIQUE INDEX idx_choice_lists_row_resource_id ON __SCHEMA__.choice_lists (row_resource_id);

CREATE UNIQUE INDEX idx_choice_lists_row_id ON __SCHEMA__.choice_lists (row_id);

CREATE INDEX idx_choice_lists_name ON __SCHEMA__.choice_lists (name);

CREATE INDEX idx_choice_lists_updated_at ON __SCHEMA__.choice_lists (updated_at);

CREATE UNIQUE INDEX idx_classification_sets_row_resource_id ON __SCHEMA__.classification_sets (row_resource_id);

CREATE UNIQUE INDEX idx_classification_sets_row_id ON __SCHEMA__.classification_sets (row_id);

CREATE INDEX idx_classification_sets_name ON __SCHEMA__.classification_sets (name);

CREATE INDEX idx_classification_sets_updated_at ON __SCHEMA__.classification_sets (updated_at);

CREATE UNIQUE INDEX idx_forms_row_resource_id ON __SCHEMA__.forms (row_resource_id);

CREATE UNIQUE INDEX idx_forms_row_id ON __SCHEMA__.forms (row_id);

CREATE INDEX idx_forms_name ON __SCHEMA__.forms (name);

CREATE INDEX idx_forms_updated_at ON __SCHEMA__.forms (updated_at);

CREATE UNIQUE INDEX idx_memberships_row_resource_id ON __SCHEMA__.memberships (row_resource_id);

CREATE UNIQUE INDEX idx_memberships_row_id ON __SCHEMA__.memberships (row_id);

CREATE INDEX idx_memberships_user_resource_id ON __SCHEMA__.memberships (user_resource_id);

CREATE INDEX idx_memberships_role_resource_id ON __SCHEMA__.memberships (role_resource_id);

CREATE INDEX idx_memberships_name ON __SCHEMA__.memberships (name);

CREATE INDEX idx_memberships_updated_at ON __SCHEMA__.memberships (updated_at);

CREATE UNIQUE INDEX idx_photos_row_resource_id ON __SCHEMA__.photos (row_resource_id);

CREATE UNIQUE INDEX idx_photos_row_id ON __SCHEMA__.photos (row_id);

CREATE INDEX idx_photos_access_key ON __SCHEMA__.photos (access_key);

CREATE INDEX idx_photos_record_resource_id ON __SCHEMA__.photos (record_resource_id);

CREATE INDEX idx_photos_form_resource_id ON __SCHEMA__.photos (form_resource_id);

CREATE INDEX idx_photos_created_by_resource_id ON __SCHEMA__.photos (created_by_resource_id);

CREATE SPATIAL INDEX idx_photos_geometry ON __SCHEMA__.photos (geometry);

CREATE INDEX idx_photos_updated_at ON __SCHEMA__.photos (updated_at);

CREATE UNIQUE INDEX idx_projects_row_resource_id ON __SCHEMA__.projects (row_resource_id);

CREATE UNIQUE INDEX idx_projects_row_id ON __SCHEMA__.projects (row_id);

CREATE INDEX idx_projects_name ON __SCHEMA__.projects (name);

CREATE INDEX idx_projects_updated_at ON __SCHEMA__.projects (updated_at);

CREATE UNIQUE INDEX idx_roles_row_resource_id ON __SCHEMA__.roles (row_resource_id);

CREATE UNIQUE INDEX idx_roles_row_id ON __SCHEMA__.roles (row_id);

CREATE INDEX idx_roles_name ON __SCHEMA__.roles (name);

CREATE INDEX idx_roles_updated_at ON __SCHEMA__.roles (updated_at);

CREATE UNIQUE INDEX idx_signatures_row_resource_id ON __SCHEMA__.signatures (row_resource_id);

CREATE UNIQUE INDEX idx_signatures_row_id ON __SCHEMA__.signatures (row_id);

CREATE INDEX idx_signatures_access_key ON __SCHEMA__.signatures (access_key);

CREATE INDEX idx_signatures_record_resource_id ON __SCHEMA__.signatures (record_resource_id);

CREATE INDEX idx_signatures_form_resource_id ON __SCHEMA__.signatures (form_resource_id);

CREATE INDEX idx_signatures_created_by_resource_id ON __SCHEMA__.signatures (created_by_resource_id);

CREATE INDEX idx_signatures_updated_at ON __SCHEMA__.signatures (updated_at);

CREATE UNIQUE INDEX idx_videos_row_resource_id ON __SCHEMA__.videos (row_resource_id);

CREATE UNIQUE INDEX idx_videos_row_id ON __SCHEMA__.videos (row_id);

CREATE INDEX idx_videos_access_key ON __SCHEMA__.videos (access_key);

CREATE INDEX idx_videos_record_resource_id ON __SCHEMA__.videos (record_resource_id);

CREATE INDEX idx_videos_form_resource_id ON __SCHEMA__.videos (form_resource_id);

CREATE INDEX idx_videos_created_by_resource_id ON __SCHEMA__.videos (created_by_resource_id);

CREATE SPATIAL INDEX idx_videos_geometry ON __SCHEMA__.videos (geometry);

CREATE INDEX idx_videos_updated_at ON __SCHEMA__.videos (updated_at);

COMMIT TRANSACTION;
`;
