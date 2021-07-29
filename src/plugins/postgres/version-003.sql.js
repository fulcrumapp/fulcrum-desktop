export default `
BEGIN TRANSACTION;

DROP VIEW IF EXISTS __VIEW_SCHEMA__.records_view;

CREATE OR REPLACE VIEW __VIEW_SCHEMA__.records_view AS
SELECT
  records.row_resource_id AS record_id,
  records.form_resource_id AS form_id,
  forms.name AS form_name,
  records.project_resource_id AS project_id,
  projects.name AS project_name,
  records.assigned_to_resource_id AS assigned_to_id,
  assignment.name AS assigned_to_name,
  records.status AS status,
  records.latitude AS latitude,
  records.longitude AS longitude,
  records.created_at AS created_at,
  records.updated_at AS updated_at,
  records.version AS version,
  records.created_by_resource_id AS created_by_id,
  created_by.name AS created_by_name,
  records.updated_by_resource_id AS updated_by_id,
  updated_by.name AS updated_by_name,
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
FROM __SCHEMA__.system_records records
LEFT OUTER JOIN __SCHEMA__.system_forms forms ON records.form_id = forms.row_id
LEFT OUTER JOIN __SCHEMA__.system_projects projects ON records.project_id = projects.row_id
LEFT OUTER JOIN __SCHEMA__.system_memberships assignment ON records.assigned_to_id = assignment.row_id
LEFT OUTER JOIN __SCHEMA__.system_memberships created_by ON records.created_by_id = created_by.row_id
LEFT OUTER JOIN __SCHEMA__.system_memberships updated_by ON records.updated_by_id = updated_by.row_id;

INSERT INTO __SCHEMA__.migrations (name) VALUES ('003');

COMMIT;
`;
