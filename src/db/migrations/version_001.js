export default `
CREATE TABLE IF NOT EXISTS accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_resource_id TEXT,
  organization_resource_id TEXT,
  organization_name TEXT,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  description TEXT,
  token TEXT,
  last_sync_photos INTEGER,
  last_sync_videos INTEGER,
  last_sync_audio INTEGER,
  last_sync_signatures INTEGER,
  last_sync_changesets INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_accounts_user_organization ON accounts (user_resource_id ASC, organization_resource_id ASC);

CREATE TABLE IF NOT EXISTS sync_state (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  resource TEXT NOT NULL,
  scope TEXT,
  hash TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_sync_state_account_resource_scope ON sync_state (account_id ASC, resource ASC, scope ASC);

CREATE TABLE IF NOT EXISTS records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  resource_id TEXT NOT NULL,
  form_id INTEGER NOT NULL,
  status TEXT,
  version INTEGER NOT NULL,
  title TEXT,
  form_values TEXT,
  latitude REAL,
  longitude REAL,
  altitude REAL,
  course REAL,
  speed REAL,
  horizontal_accuracy REAL,
  vertical_accuracy REAL,
  client_created_at INTEGER,
  client_updated_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  changeset_id INTEGER,
  changeset_resource_id TEXT,
  project_id INTEGER,
  project_resource_id TEXT,
  assigned_to_id INTEGER,
  assigned_to_resource_id TEXT,
  updated_by_id INTEGER,
  updated_by_resource_id TEXT,
  created_by_id INTEGER,
  created_by_resource_id TEXT,
  draft INTEGER NOT NULL DEFAULT 0,
  has_changes INTEGER NOT NULL DEFAULT 0,
  is_new INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  index_text TEXT,
  created_latitude REAL,
  created_longitude REAL,
  created_altitude REAL,
  created_accuracy REAL,
  updated_latitude REAL,
  updated_longitude REAL,
  updated_altitude REAL,
  updated_accuracy REAL,
  created_duration INTEGER,
  updated_duration INTEGER,
  edited_duration INTEGER
);

CREATE UNIQUE INDEX idx_records_account_resource_id ON records (account_id, resource_id);

CREATE VIRTUAL TABLE records_index USING fts4(content='records', index_text, form_id, prefix="1,2,3");

CREATE TRIGGER records_before_update BEFORE UPDATE ON records BEGIN
  DELETE FROM records_index WHERE docid=old.rowid;
END;

CREATE TRIGGER records_before_delete BEFORE DELETE ON records BEGIN
  DELETE FROM records_index WHERE docid=old.rowid;
END;

CREATE TRIGGER records_after_update AFTER UPDATE ON records BEGIN
  INSERT INTO records_index (docid, index_text, form_id) VALUES (new.rowid, new.index_text, new.form_id);
END;

CREATE TRIGGER records_after_insert AFTER INSERT ON records BEGIN
  INSERT INTO records_index (docid, index_text, form_id) VALUES (new.rowid, new.index_text, new.form_id);
END;

CREATE INDEX IF NOT EXISTS idx_records_account_id ON records (account_id);
CREATE INDEX IF NOT EXISTS idx_records_account_id_remote_id ON records (account_id, resource_id);
CREATE INDEX IF NOT EXISTS idx_records_form_status ON records (form_id, status);
CREATE INDEX IF NOT EXISTS idx_records_form_title ON records (form_id, title);
CREATE INDEX IF NOT EXISTS idx_records_form_client_created_at ON records (form_id, client_created_at);
CREATE INDEX IF NOT EXISTS idx_records_form_client_updated_at ON records (form_id, client_updated_at);
CREATE INDEX IF NOT EXISTS idx_records_form_resource_id ON records (form_id, resource_id);
CREATE INDEX IF NOT EXISTS idx_records_form_latitude_longitude ON records (form_id, latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_records_form_project ON records (form_id, project_id);
CREATE INDEX IF NOT EXISTS idx_records_latitude_longitude ON records (latitude, longitude);

CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  resource_id TEXT NOT NULL,
  name TEXT,
  is_system INTEGER NOT NULL,
  is_default INTEGER NOT NULL,
  can_manage_subscription INTEGER NOT NULL,
  can_update_organization INTEGER NOT NULL,
  can_manage_members INTEGER NOT NULL,
  can_manage_roles INTEGER NOT NULL,
  can_manage_layers INTEGER NOT NULL,
  can_manage_apps INTEGER NOT NULL,
  can_create_records INTEGER NOT NULL,
  can_update_records INTEGER NOT NULL,
  can_delete_records INTEGER NOT NULL,
  can_manage_projects INTEGER NOT NULL,
  can_manage_choice_lists INTEGER NOT NULL,
  can_manage_classification_sets INTEGER NOT NULL,
  can_change_status INTEGER NOT NULL,
  can_change_project INTEGER NOT NULL,
  can_assign_records INTEGER NOT NULL,
  can_import_records INTEGER NOT NULL,
  can_export_records INTEGER NOT NULL,
  can_run_reports INTEGER NOT NULL,
  can_manage_authorizations INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_roles_account_resource_id ON roles (account_id, resource_id);

CREATE TABLE IF NOT EXISTS memberships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  resource_id TEXT NOT NULL,
  user_resource_id TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  role_id INTEGER NOT NULL,
  role_resource_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_memberships_account_user_organization ON memberships (account_id, user_resource_id);

CREATE TABLE IF NOT EXISTS choice_lists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  resource_id TEXT NOT NULL,
  choices TEXT,
  name TEXT,
  description TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_choice_lists_account_resource_id ON choice_lists (account_id, resource_id);

CREATE TABLE IF NOT EXISTS classification_sets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  resource_id TEXT NOT NULL,
  items TEXT,
  name TEXT,
  description TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_classification_sets_account_resource_id ON classification_sets (account_id, resource_id);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  resource_id TEXT NOT NULL,
  name TEXT,
  description TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_account_resource_id ON projects (account_id, resource_id);
CREATE INDEX IF NOT EXISTS idx_projects_account_id_name ON projects (account_id, name);

CREATE TABLE IF NOT EXISTS forms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  resource_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  name TEXT,
  description TEXT,
  title_field_keys TEXT,
  status_field TEXT,
  elements TEXT,
  last_sync INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_forms_account_resource_id ON forms (account_id, resource_id);
CREATE INDEX IF NOT EXISTS idx_forms_account_id ON forms (account_id);
CREATE INDEX IF NOT EXISTS idx_forms_account_id_name ON forms (account_id, name);

CREATE TABLE IF NOT EXISTS photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  resource_id TEXT NOT NULL,
  file_path TEXT,
  exif TEXT,
  form_id INTEGER,
  record_id INTEGER,
  latitude REAL,
  longitude REAL,
  is_downloaded INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_photos_account_resource_id ON photos (account_id, resource_id);

CREATE TABLE IF NOT EXISTS videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  resource_id TEXT NOT NULL,
  file_path TEXT,
  metadata TEXT,
  form_id INTEGER,
  record_id INTEGER,
  is_downloaded INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_videos_account_resource_id ON videos (account_id, resource_id);

CREATE TABLE IF NOT EXISTS audio (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  resource_id TEXT NOT NULL,
  file_path TEXT,
  metadata TEXT,
  form_id INTEGER,
  record_id INTEGER,
  is_downloaded INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_audio_account_resource_id ON audio (account_id, resource_id);

CREATE TABLE IF NOT EXISTS signatures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  resource_id TEXT NOT NULL,
  file_path TEXT,
  form_id INTEGER,
  record_id INTEGER,
  is_downloaded INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_signatures_account_resource_id ON signatures (account_id, resource_id);

CREATE TABLE IF NOT EXISTS changesets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  resource_id TEXT NOT NULL,
  form_id INTEGER,
  metadata TEXT,
  metadata_index_text TEXT,
  closed_at INTEGER,
  closed_by_id INTEGER,
  closed_by_resource_id TEXT,
  created_by_id INTEGER,
  created_by_resource_id TEXT,
  number_of_changes INTEGER NOT NULL DEFAULT 0,
  min_lat REAL,
  max_lat REAL,
  min_lon REAL,
  max_lon REAL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_changesets_account_resource_id ON changesets (account_id, resource_id);

CREATE VIRTUAL TABLE changesets_index USING fts4(content='changesets', metadata_index_text, form_id, prefix="1,2,3");

CREATE TRIGGER changesets_before_update BEFORE UPDATE ON changesets BEGIN
  DELETE FROM changesets_index WHERE docid=old.rowid;
END;

CREATE TRIGGER changesets_before_delete BEFORE DELETE ON changesets BEGIN
  DELETE FROM changesets_index WHERE docid=old.rowid;
END;

CREATE TRIGGER changesets_after_update AFTER UPDATE ON changesets BEGIN
  INSERT INTO changesets_index (docid, metadata_index_text, form_id) VALUES (new.rowid, new.metadata_index_text, new.form_id);
END;

CREATE TRIGGER changesets_after_insert AFTER INSERT ON changesets BEGIN
  INSERT INTO changesets_index (docid, metadata_index_text, form_id) VALUES (new.rowid, new.metadata_index_text, new.form_id);
END;
`;
