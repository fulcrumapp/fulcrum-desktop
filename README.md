## :construction: Fulcrum Desktop :construction:

Sync Fulcrum data to a local database. The local database is a complete API representation with search indexes and query tables. It's intended to be the foundation for local/disconnected data synchronization and reporting.

### Documentation

https://learn.fulcrumapp.com/dev/desktop/intro/

### Development

```sh
git clone git@github.com:fulcrumapp/fulcrum-desktop.git
cd fulcrum-desktop
yarn
```

## Usage

### Commands

Fulcrum Desktop has several built-in commands to setup your database with your Fulcrum account.

Run the `fulcrum` command to list the various arguments and options available.

#### Authenticate and Setup the database

`fulcrum setup --org 'Organization Name'`

You can pass the credentials or Api token to authenticate with your Fulcrum account to configure your local database:

```sh
fulcrum setup --org 'Organization Name' --email 'EMAIL' --password 'SECRET'
fulcrum setup --org 'Organization Name' --token '<token>'
```

#### Sync the given account

Sync an organization to the local database:

`fulcrum sync --org 'Organization Name'`

Use `--forever` option for keep the sync with your database(Postgres in this case) running forever, every 15 secords:

```sh
fulcrum sync --org 'Organization Name' --pg-user 'myuser' --pg-password 'mypassword' --pg-database 'mydatabase' --forever
```

#### Query in the local database

You can run SQL queries from your synchronized database:

`fulcrum query --sql '<QUERY>'`

For example:

```sh
fulcrum query --sql 'SELECT COUNT(*) FROM forms'
```

#### Fulcrum Console

Run the fulcrum console:

`fulcrum console`

#### Reset an organization

Reset the organizaton and data in your Fulcrum sync database:

`fulcrum reset --org 'Organization Name'`

### Plugins

Plugins are extensions to the Fulcrum Desktop application. Each plugin has its own functionality to accomplish a specific task.

### Available Plugins

You can enable which plugins to use during the execution of the application.

### Database plugins

Fulcrum Desktop syncs with an internal SQLite database, similar to the database embedded within the mobile applications. This internal fulcrum.db database is not very user-friendly, so you will likely want to install one of the database plugins, which include more user-friendly app record views. Note that none of these plugins automatically creates the database.

#### PostgreSQL

If you want to sync your PostgreSQL database with your Fulcrum Organization, you can enable this plugin. Be sure you have a database already created with the PostGIS extension installed. You can name your database "fulcrumapp" to use the default settings.

To enable PostGIS you can run:

`CREATE EXTENSION postgis;`

Keep the database in sync with your Organization:

```sh
fulcrum sync --org 'Organization Name' --pg-database 'mydatabase' --forever
```

#### MS SQL Server

If you want to sync your Fulcrum Organization with MS SQL Server, enable this plugin. Be sure you have a database already created. You can name your database "fulcrumapp" to use the default settings.

Keep the database in sync with your Organization:

```sh
fulcrum sync --org 'Organization Name' --forever --mssql-user 'USERNAME' --mssql-password 'PASSWORD' --mssql-host 'localhost'
```

#### GeoPackage

If you want to sync your Fulcrum Organization with your GeoPackage database for transferring geospatial information, enable this plugin.  

Setup the database:

```sh
fulcrum geopackage --org 'Organization Name'
```

This will create a GeoPackage file in the following path:

```sh
/.fulcrum/geopackage/Organization Name.gpkg
```

Keep the database in sync with your Organization:

```sh
fulcrum sync --org 'Organization Name' --forever
```

### Media plugins

In addition to syncing database records. Fulcrum Desktop supports intelligently downloading media files.

#### Media

Concurrent file downloads and automatic retries for Fulcrum media files (photos, videos, audio, signatures) and associated track files for spatial video & audio (gpx, kml, geojson, json, srt).

Download all media files for your Organization:

```sh
fulcrum media --org 'Organization Name'
```

You can pass the directory where you want to storage these files with the `--media-path` option, but the default path is:

```sh
/.fulcrum/media
```

#### S3

Sync media to your own Amazon Simple Storage Service (Amazon S3) bucket.

```sh
fulcrum sync --org 'Organization Name' --s3-access-key-id 'KEY' --s3-secret-access-key 'SECRET' --s3-bucket 'MYBUCKET'
```

### Other plugins

#### Reports

Generate custom PDF reports from Fulcrum data. To customize reports, edit template.ejs or use the `--template` option to reference a custom .ejs embedded JavaScript template file.

```sh
fulcrum reports --org 'Organization Name' --form 'Form Name' --template custom.ejs
```

##

#### More detailed information on the use of these plugins can be found [here](https://docs.fulcrumapp.com/docs/desktop-sync).
