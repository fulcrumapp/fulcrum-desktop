export default `
BEGIN TRANSACTION;

DROP FUNCTION IF EXISTS FCM_ConvertToDate(input_value text);
CREATE OR REPLACE FUNCTION FCM_ConvertToDate(input_value text)
  RETURNS date AS
$BODY$
DECLARE date_value date DEFAULT NULL;
BEGIN
  BEGIN
    date_value := input_value::date;
  EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
  END;
RETURN date_value;
END;
$BODY$
LANGUAGE 'plpgsql' IMMUTABLE STRICT;

INSERT INTO __SCHEMA__.migrations (name) VALUES ('007');

COMMIT;
`;
