export default `
BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS __SCHEMA__.system_tables (
  name text,
  alias text,
  type text,
  parent text,
  form_id text,
  field text,
  field_type text,
  data_name text
);

CREATE OR REPLACE VIEW __VIEW_SCHEMA__.tables_view AS
SELECT name, alias, type, parent, form_id, field, field_type, data_name
FROM __SCHEMA__.system_tables;

CREATE INDEX idx_tables_name ON __SCHEMA__.system_tables (name);

CREATE INDEX idx_tables_alias ON __SCHEMA__.system_tables (alias);

CREATE INDEX idx_tables_form_id ON __SCHEMA__.system_tables (form_id);



CREATE TABLE IF NOT EXISTS __SCHEMA__.system_columns (
  table_name text,
  table_alias text,
  name text,
  ordinal bigint,
  type text,
  nullable boolean,
  form_id text,
  field text,
  field_type text,
  data_name text,
  part text,
  data text
);

CREATE OR REPLACE VIEW __VIEW_SCHEMA__.columns_view AS
SELECT table_name, name, ordinal, type, nullable, form_id, field, field_type, data_name, part, data
FROM __SCHEMA__.system_columns;

CREATE INDEX idx_columns_table_name ON __SCHEMA__.system_columns (table_name);

CREATE INDEX idx_columns_table_alias ON __SCHEMA__.system_columns (table_alias);

CREATE INDEX idx_columns_form_id ON __SCHEMA__.system_columns (form_id);

INSERT INTO __SCHEMA__.migrations (name) VALUES ('005');

COMMIT TRANSACTION;
`;
