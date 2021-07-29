export default `
ALTER TABLE photos ADD COLUMN form_resource_id TEXT;
ALTER TABLE photos ADD COLUMN record_resource_id TEXT;
ALTER TABLE photos ADD COLUMN file_size INTEGER;
ALTER TABLE photos ADD COLUMN is_uploaded INTEGER NOT NULL DEFAULT 0;
ALTER TABLE photos ADD COLUMN is_stored INTEGER NOT NULL DEFAULT 0;
ALTER TABLE photos ADD COLUMN is_processed INTEGER NOT NULL DEFAULT 0;
ALTER TABLE photos ADD COLUMN content_type TEXT;
ALTER TABLE photos ADD COLUMN created_by_id INTEGER;
ALTER TABLE photos ADD COLUMN created_by_resource_id TEXT;
ALTER TABLE photos ADD COLUMN updated_by_id INTEGER;
ALTER TABLE photos ADD COLUMN updated_by_resource_id TEXT;
ALTER TABLE photos ADD COLUMN altitude REAL;
ALTER TABLE photos ADD COLUMN accuracy REAL;
ALTER TABLE photos ADD COLUMN direction REAL;
ALTER TABLE photos ADD COLUMN width INTEGER;
ALTER TABLE photos ADD COLUMN height INTEGER;
ALTER TABLE photos ADD COLUMN make TEXT;
ALTER TABLE photos ADD COLUMN model TEXT;
ALTER TABLE photos ADD COLUMN software TEXT;
ALTER TABLE photos ADD COLUMN date_time TEXT;

ALTER TABLE videos ADD COLUMN form_resource_id TEXT;
ALTER TABLE videos ADD COLUMN record_resource_id TEXT;
ALTER TABLE videos ADD COLUMN file_size INTEGER;
ALTER TABLE videos ADD COLUMN is_uploaded INTEGER NOT NULL DEFAULT 0;
ALTER TABLE videos ADD COLUMN is_stored INTEGER NOT NULL DEFAULT 0;
ALTER TABLE videos ADD COLUMN is_processed INTEGER NOT NULL DEFAULT 0;
ALTER TABLE videos ADD COLUMN content_type TEXT;
ALTER TABLE videos ADD COLUMN created_by_id INTEGER;
ALTER TABLE videos ADD COLUMN created_by_resource_id TEXT;
ALTER TABLE videos ADD COLUMN updated_by_id INTEGER;
ALTER TABLE videos ADD COLUMN updated_by_resource_id TEXT;
ALTER TABLE videos ADD COLUMN has_track INTEGER NOT NULL DEFAULT 0;
ALTER TABLE videos ADD COLUMN track TEXT;
ALTER TABLE videos ADD COLUMN width INTEGER;
ALTER TABLE videos ADD COLUMN height INTEGER;
ALTER TABLE videos ADD COLUMN duration REAL;
ALTER TABLE videos ADD COLUMN bit_rate REAL;

ALTER TABLE audio ADD COLUMN form_resource_id TEXT;
ALTER TABLE audio ADD COLUMN record_resource_id TEXT;
ALTER TABLE audio ADD COLUMN file_size INTEGER;
ALTER TABLE audio ADD COLUMN is_uploaded INTEGER NOT NULL DEFAULT 0;
ALTER TABLE audio ADD COLUMN is_stored INTEGER NOT NULL DEFAULT 0;
ALTER TABLE audio ADD COLUMN is_processed INTEGER NOT NULL DEFAULT 0;
ALTER TABLE audio ADD COLUMN content_type TEXT;
ALTER TABLE audio ADD COLUMN created_by_id INTEGER;
ALTER TABLE audio ADD COLUMN created_by_resource_id TEXT;
ALTER TABLE audio ADD COLUMN updated_by_id INTEGER;
ALTER TABLE audio ADD COLUMN updated_by_resource_id TEXT;
ALTER TABLE audio ADD COLUMN has_track INTEGER NOT NULL DEFAULT 0;
ALTER TABLE audio ADD COLUMN track TEXT;
ALTER TABLE audio ADD COLUMN duration REAL;
ALTER TABLE audio ADD COLUMN bit_rate REAL;

ALTER TABLE signatures ADD COLUMN form_resource_id TEXT;
ALTER TABLE signatures ADD COLUMN record_resource_id TEXT;
ALTER TABLE signatures ADD COLUMN file_size INTEGER;
ALTER TABLE signatures ADD COLUMN is_uploaded INTEGER NOT NULL DEFAULT 0;
ALTER TABLE signatures ADD COLUMN is_stored INTEGER NOT NULL DEFAULT 0;
ALTER TABLE signatures ADD COLUMN is_processed INTEGER NOT NULL DEFAULT 0;
ALTER TABLE signatures ADD COLUMN content_type TEXT;
ALTER TABLE signatures ADD COLUMN created_by_id INTEGER;
ALTER TABLE signatures ADD COLUMN created_by_resource_id TEXT;
ALTER TABLE signatures ADD COLUMN updated_by_id INTEGER;
ALTER TABLE signatures ADD COLUMN updated_by_resource_id TEXT;

CREATE TABLE tables (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  alias TEXT NOT NULL,
  type TEXT,
  parent TEXT,
  form_id TEXT,
  field TEXT,
  field_type TEXT,
  data_name TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_tables_name ON tables (name);
CREATE INDEX IF NOT EXISTS idx_tables_alias ON tables (alias);
CREATE INDEX IF NOT EXISTS idx_tables_form_id ON tables (form_id);

CREATE TABLE columns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_name TEXT NOT NULL,
  table_alias TEXT NOT NULL,
  name TEXT NOT NULL,
  ordinal INTEGER NOT NULL,
  type TEXT NOT NULL,
  nullable INTEGER NOT NULL DEFAULT 1,
  form_id TEXT,
  field TEXT,
  field_type TEXT,
  data_name TEXT,
  part TEXT,
  data TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_columns_table_name_ordinal ON columns (table_name, ordinal);
CREATE INDEX IF NOT EXISTS idx_columns_table_alias_ordinal ON columns (table_alias, ordinal);
CREATE INDEX IF NOT EXISTS idx_columns_form_id ON columns (form_id);


ALTER TABLE records ADD COLUMN server_created_at INTEGER;
ALTER TABLE records ADD COLUMN server_updated_at INTEGER;
UPDATE records SET server_created_at = created_at;
UPDATE records SET server_updated_at = updated_at;

ALTER TABLE roles ADD COLUMN server_created_at INTEGER;
ALTER TABLE roles ADD COLUMN server_updated_at INTEGER;
UPDATE roles SET server_created_at = created_at;
UPDATE roles SET server_updated_at = updated_at;

ALTER TABLE memberships ADD COLUMN server_created_at INTEGER;
ALTER TABLE memberships ADD COLUMN server_updated_at INTEGER;
UPDATE memberships SET server_created_at = created_at;
UPDATE memberships SET server_updated_at = updated_at;

ALTER TABLE projects ADD COLUMN server_created_at INTEGER;
ALTER TABLE projects ADD COLUMN server_updated_at INTEGER;
UPDATE projects SET server_created_at = created_at;
UPDATE projects SET server_updated_at = updated_at;

ALTER TABLE choice_lists ADD COLUMN server_created_at INTEGER;
ALTER TABLE choice_lists ADD COLUMN server_updated_at INTEGER;
UPDATE choice_lists SET server_created_at = created_at;
UPDATE choice_lists SET server_updated_at = updated_at;

ALTER TABLE classification_sets ADD COLUMN server_created_at INTEGER;
ALTER TABLE classification_sets ADD COLUMN server_updated_at INTEGER;
UPDATE classification_sets SET server_created_at = created_at;
UPDATE classification_sets SET server_updated_at = updated_at;

ALTER TABLE forms ADD COLUMN auto_assign INTEGER NOT NULL DEFAULT 0;
ALTER TABLE forms ADD COLUMN hidden_on_dashboard INTEGER NOT NULL DEFAULT 0;
ALTER TABLE forms ADD COLUMN projects_enabled INTEGER NOT NULL DEFAULT 1;
ALTER TABLE forms ADD COLUMN assignment_enabled INTEGER NOT NULL DEFAULT 1;
ALTER TABLE forms ADD COLUMN geometry_types TEXT;
ALTER TABLE forms ADD COLUMN geometry_required INTEGER NOT NULL DEFAULT 0;
ALTER TABLE forms ADD COLUMN server_created_at INTEGER;
ALTER TABLE forms ADD COLUMN server_updated_at INTEGER;
ALTER TABLE forms ADD COLUMN script TEXT;
ALTER TABLE forms ADD COLUMN image TEXT;
ALTER TABLE forms ADD COLUMN image_large TEXT;
ALTER TABLE forms ADD COLUMN image_small TEXT;
ALTER TABLE forms ADD COLUMN image_thumbnail TEXT;
UPDATE forms SET server_created_at = created_at;
UPDATE forms SET server_updated_at = updated_at;

ALTER TABLE photos ADD COLUMN server_created_at INTEGER;
ALTER TABLE photos ADD COLUMN server_updated_at INTEGER;
UPDATE photos SET server_created_at = created_at;
UPDATE photos SET server_updated_at = updated_at;

ALTER TABLE videos ADD COLUMN server_created_at INTEGER;
ALTER TABLE videos ADD COLUMN server_updated_at INTEGER;
UPDATE videos SET server_created_at = created_at;
UPDATE videos SET server_updated_at = updated_at;

ALTER TABLE audio ADD COLUMN server_created_at INTEGER;
ALTER TABLE audio ADD COLUMN server_updated_at INTEGER;
UPDATE audio SET server_created_at = created_at;
UPDATE audio SET server_updated_at = updated_at;

ALTER TABLE signatures ADD COLUMN server_created_at INTEGER;
ALTER TABLE signatures ADD COLUMN server_updated_at INTEGER;
UPDATE signatures SET server_created_at = created_at;
UPDATE signatures SET server_updated_at = updated_at;

ALTER TABLE changesets ADD COLUMN form_resource_id TEXT;
ALTER TABLE changesets ADD COLUMN server_created_at INTEGER;
ALTER TABLE changesets ADD COLUMN server_updated_at INTEGER;
ALTER TABLE changesets ADD COLUMN number_of_creates INTEGER NOT NULL DEFAULT 0;
ALTER TABLE changesets ADD COLUMN number_of_updates INTEGER NOT NULL DEFAULT 0;
ALTER TABLE changesets ADD COLUMN number_of_deletes INTEGER NOT NULL DEFAULT 0;
UPDATE changesets SET server_created_at = created_at;
UPDATE changesets SET server_updated_at = updated_at;
`;
