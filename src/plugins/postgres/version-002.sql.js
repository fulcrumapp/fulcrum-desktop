export default `
BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS __SCHEMA__.records (
  id bigserial NOT NULL,
  row_id bigint NOT NULL,
  row_resource_id text NOT NULL,
  form_id bigint NOT NULL,
  form_resource_id text NOT NULL,
  project_id bigint,
  project_resource_id text,
  assigned_to_id bigint,
  assigned_to_resource_id text,
  status text,
  latitude double precision,
  longitude double precision,
  created_at timestamp with time zone NOT NULL,
  updated_at timestamp with time zone NOT NULL,
  version bigint NOT NULL,
  created_by_id bigint,
  created_by_resource_id text,
  updated_by_id bigint,
  updated_by_resource_id text,
  server_created_at timestamp with time zone NOT NULL,
  server_updated_at timestamp with time zone NOT NULL,
  record_index_text text,
  record_index tsvector,
  geometry geometry(Geometry,4326),
  altitude double precision,
  speed double precision,
  course double precision,
  horizontal_accuracy double precision,
  vertical_accuracy double precision,
  form_values text,
  changeset_id bigint,
  changeset_resource_id text,
  title text,
  created_latitude double precision,
  created_longitude double precision,
  created_geometry geometry(Geometry,4326),
  created_altitude double precision,
  created_horizontal_accuracy double precision,
  updated_latitude double precision,
  updated_longitude double precision,
  updated_geometry geometry(Geometry,4326),
  updated_altitude double precision,
  updated_horizontal_accuracy double precision,
  created_duration bigint,
  updated_duration bigint,
  edited_duration bigint,
  CONSTRAINT records_pkey PRIMARY KEY (id)
);

DROP VIEW IF EXISTS __VIEW_SCHEMA__.records_view;

CREATE OR REPLACE VIEW __VIEW_SCHEMA__.records_view AS
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


CREATE UNIQUE INDEX idx_records_row_resource_id ON __SCHEMA__.records USING btree (row_resource_id);

CREATE UNIQUE INDEX idx_records_row_id ON __SCHEMA__.records USING btree (row_id);

CREATE INDEX idx_records_form_resource_id ON __SCHEMA__.records USING btree (form_resource_id);

CREATE INDEX idx_records_assigned_to_resource_id ON __SCHEMA__.records USING btree (assigned_to_resource_id);

CREATE INDEX idx_records_changeset_resource_id ON __SCHEMA__.records USING btree (changeset_resource_id);

CREATE INDEX idx_records_geometry ON __SCHEMA__.records USING gist (geometry);

CREATE INDEX idx_records_project_resource_id ON __SCHEMA__.records USING btree (project_resource_id);

CREATE INDEX idx_records_record_index ON __SCHEMA__.records USING gin (record_index);

CREATE INDEX idx_records_server_updated_at ON __SCHEMA__.records USING btree (server_updated_at);

CREATE INDEX idx_records_server_created_at ON __SCHEMA__.records USING btree (server_created_at);

CREATE INDEX idx_records_status ON __SCHEMA__.records USING btree (status);

INSERT INTO __SCHEMA__.migrations (name) VALUES ('002');

ALTER TABLE __SCHEMA__.audio RENAME TO system_audio;
ALTER TABLE __SCHEMA__.changesets RENAME TO system_changesets;
ALTER TABLE __SCHEMA__.choice_lists RENAME TO system_choice_lists;
ALTER TABLE __SCHEMA__.classification_sets RENAME TO system_classification_sets;
ALTER TABLE __SCHEMA__.forms RENAME TO system_forms;
ALTER TABLE __SCHEMA__.memberships RENAME TO system_memberships;
ALTER TABLE __SCHEMA__.photos RENAME TO system_photos;
ALTER TABLE __SCHEMA__.projects RENAME TO system_projects;
ALTER TABLE __SCHEMA__.roles RENAME TO system_roles;
ALTER TABLE __SCHEMA__.signatures RENAME TO system_signatures;
ALTER TABLE __SCHEMA__.videos RENAME TO system_videos;
ALTER TABLE __SCHEMA__.records RENAME TO system_records;

COMMIT;
`;

