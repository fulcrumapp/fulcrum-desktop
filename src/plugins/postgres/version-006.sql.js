export default `
BEGIN TRANSACTION;

DROP INDEX idx_audio_row_id;
DROP INDEX idx_changesets_row_id;
DROP INDEX idx_choice_lists_row_id;
DROP INDEX idx_classification_sets_row_id;
DROP INDEX idx_forms_row_id;
DROP INDEX idx_memberships_row_id;
DROP INDEX idx_photos_row_id;
DROP INDEX idx_projects_row_id;
DROP INDEX idx_roles_row_id;
DROP INDEX idx_signatures_row_id;
DROP INDEX idx_videos_row_id;
DROP INDEX idx_records_row_id;

CREATE INDEX idx_audio_row_id ON __SCHEMA__.system_audio USING btree (row_id);
CREATE INDEX idx_changesets_row_id ON __SCHEMA__.system_changesets USING btree (row_id);
CREATE INDEX idx_choice_lists_row_id ON __SCHEMA__.system_choice_lists USING btree (row_id);
CREATE INDEX idx_classification_sets_row_id ON __SCHEMA__.system_classification_sets USING btree (row_id);
CREATE INDEX idx_forms_row_id ON __SCHEMA__.system_forms USING btree (row_id);
CREATE INDEX idx_memberships_row_id ON __SCHEMA__.system_memberships USING btree (row_id);
CREATE INDEX idx_photos_row_id ON __SCHEMA__.system_photos USING btree (row_id);
CREATE INDEX idx_projects_row_id ON __SCHEMA__.system_projects USING btree (row_id);
CREATE INDEX idx_roles_row_id ON __SCHEMA__.system_roles USING btree (row_id);
CREATE INDEX idx_signatures_row_id ON __SCHEMA__.system_signatures USING btree (row_id);
CREATE INDEX idx_videos_row_id ON __SCHEMA__.system_videos USING btree (row_id);
CREATE INDEX idx_records_row_id ON __SCHEMA__.system_records USING btree (row_id);

INSERT INTO __SCHEMA__.migrations (name) VALUES ('006');

COMMIT TRANSACTION;
`;

