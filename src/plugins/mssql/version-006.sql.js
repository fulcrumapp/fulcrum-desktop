export default `
BEGIN TRANSACTION;

DROP INDEX idx_audio_row_id ON __SCHEMA__.system_audio;
DROP INDEX idx_changesets_row_id ON __SCHEMA__.system_changesets;
DROP INDEX idx_choice_lists_row_id ON __SCHEMA__.system_choice_lists;
DROP INDEX idx_classification_sets_row_id ON __SCHEMA__.system_classification_sets;
DROP INDEX idx_forms_row_id ON __SCHEMA__.system_forms;
DROP INDEX idx_memberships_row_id ON __SCHEMA__.system_memberships;
DROP INDEX idx_photos_row_id ON __SCHEMA__.system_photos;
DROP INDEX idx_projects_row_id ON __SCHEMA__.system_projects;
DROP INDEX idx_roles_row_id ON __SCHEMA__.system_roles;
DROP INDEX idx_signatures_row_id ON __SCHEMA__.system_signatures;
DROP INDEX idx_videos_row_id ON __SCHEMA__.system_videos;
DROP INDEX idx_records_row_id ON __SCHEMA__.system_records;

CREATE INDEX idx_audio_row_id ON __SCHEMA__.system_audio (row_id);
CREATE INDEX idx_changesets_row_id ON __SCHEMA__.system_changesets (row_id);
CREATE INDEX idx_choice_lists_row_id ON __SCHEMA__.system_choice_lists (row_id);
CREATE INDEX idx_classification_sets_row_id ON __SCHEMA__.system_classification_sets (row_id);
CREATE INDEX idx_forms_row_id ON __SCHEMA__.system_forms (row_id);
CREATE INDEX idx_memberships_row_id ON __SCHEMA__.system_memberships (row_id);
CREATE INDEX idx_photos_row_id ON __SCHEMA__.system_photos (row_id);
CREATE INDEX idx_projects_row_id ON __SCHEMA__.system_projects (row_id);
CREATE INDEX idx_roles_row_id ON __SCHEMA__.system_roles (row_id);
CREATE INDEX idx_signatures_row_id ON __SCHEMA__.system_signatures (row_id);
CREATE INDEX idx_videos_row_id ON __SCHEMA__.system_videos (row_id);
CREATE INDEX idx_records_row_id ON __SCHEMA__.system_records (row_id);

INSERT INTO __SCHEMA__.migrations (name) VALUES ('006');

COMMIT TRANSACTION;
`;
