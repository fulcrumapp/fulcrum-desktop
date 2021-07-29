## Fulcrum Desktop PostgreSQL

Sync Fulcrum data to PostgreSQL.

### Installation

```sh
fulcrum install-plugin --url https://github.com/fulcrumapp/fulcrum-desktop-postgres
```

### Sync a Form

```sh
# Create a database
./setup-postgres.sh
```

### Sync a Form

```
fulcrum postgres --org 'Fulcrum Account Name'
```

### Keep it up to date

```
fulcrum sync --org 'Fulcrum Account Name'
```

### Setup user and schema for friendly views

```
BEGIN;

CREATE ROLE fulcrum_desktop_query_user WITH NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION LOGIN ENCRYPTED PASSWORD 'SECRETPASSWORDVALUE';

CREATE SCHEMA IF NOT EXISTS fulcrum_data;

SET search_path TO "$user",public,fulcrum_data;

ALTER DATABASE fulcrumapp SET search_path TO "$user",public,fulcrum_data;

ALTER ROLE fulcrum_desktop_query_user SET search_path TO "$user",fulcrum_data;

REVOKE ALL PRIVILEGES ON DATABASE fulcrumapp FROM fulcrum_desktop_query_user;

GRANT CONNECT ON DATABASE fulcrumapp TO fulcrum_desktop_query_user;

GRANT USAGE ON SCHEMA fulcrum_data TO fulcrum_desktop_query_user;

GRANT SELECT ON ALL TABLES IN SCHEMA fulcrum_data TO fulcrum_desktop_query_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA fulcrum_data GRANT SELECT ON TABLES TO fulcrum_desktop_query_user;

GRANT SELECT ON ALL TABLES IN SCHEMA fulcrum_data TO fulcrum_desktop_query_user;

COMMIT;
```

Then run the sync process with `--pgschema fulcrum_data` and connect to the database as user `fulcrum_desktop_query_user` and you will only see the friendly views.
