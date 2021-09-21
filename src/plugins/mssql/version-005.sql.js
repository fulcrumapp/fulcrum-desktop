export default `
BEGIN TRANSACTION;

CREATE TABLE __SCHEMA__.system_tables (
  name varchar(500),
  alias varchar(500),
  type varchar(500),
  parent varchar(500),
  form_id varchar(100),
  field varchar(500),
  field_type varchar(500),
  data_name varchar(500)
);

CREATE VIEW __VIEW_SCHEMA__.tables_view AS
SELECT name, alias, type, parent, form_id, field, field_type, data_name
FROM __SCHEMA__.system_tables;

CREATE INDEX idx_tables_name ON __SCHEMA__.system_tables (name);

CREATE INDEX idx_tables_alias ON __SCHEMA__.system_tables (alias);

CREATE INDEX idx_tables_form_id ON __SCHEMA__.system_tables (form_id);



CREATE TABLE __SCHEMA__.system_columns (
  table_name varchar(500),
  table_alias varchar(500),
  name varchar(500),
  ordinal bigint,
  type varchar(500),
  nullable bit,
  form_id varchar(100),
  field varchar(500),
  field_type varchar(500),
  data_name varchar(500),
  part varchar(500),
  data varchar(max)
);

CREATE VIEW __VIEW_SCHEMA__.columns_view AS
SELECT table_name, name, ordinal, type, nullable, form_id, field, field_type, data_name, part, data
FROM __SCHEMA__.system_columns;

CREATE INDEX idx_columns_table_name ON __SCHEMA__.system_columns (table_name);

CREATE INDEX idx_columns_table_alias ON __SCHEMA__.system_columns (table_alias);

CREATE INDEX idx_columns_form_id ON __SCHEMA__.system_columns (form_id);

INSERT INTO __SCHEMA__.migrations (name) VALUES ('005');

COMMIT TRANSACTION;
`;
