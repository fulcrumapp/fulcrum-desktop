export default `
ALTER TABLE changesets ADD COLUMN updated_by_id INTEGER;
ALTER TABLE changesets ADD COLUMN updated_by_resource_id TEXT;

ALTER TABLE choice_lists ADD COLUMN version INTEGER NOT NULL DEFAULT 0;
ALTER TABLE classification_sets ADD COLUMN version INTEGER NOT NULL DEFAULT 0;
`;
