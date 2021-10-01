# Commands

Fulcrum Desktop has several built-in commands to setup your database with your Fulcrum account.  

Run the `fulcrum` command to list the various arguments and options available.

### Authenticate and Setup the database

`fulcrum setup --org 'Organization Name'`

You can pass the credentials or Api token to authenticate with your Fulcrum account to configure your local database:

```sh
fulcrum setup --org 'Organization Name' --email 'EMAIL' --password 'SECRET'
fulcrum setup --org 'Organization Name' --token '<token>'
```

### Sync the given account

Sync an organization to the local database:

`fulcrum sync --org 'Organization Name'`

Use `--forever` option for keep the sync with your database(Postgres in this case) running forever, every 15 secords:

```sh
fulcrum sync --org 'Organization Name' --pg-user 'myuser' --pg-password 'mypassword' --pg-database 'mydatabase' --forever
```

### Query in the local database

You can run SQL queries from your synchronized database:

`fulcrum query --sql '<QUERY>'`

For example:

```sh
fulcrum query --sql 'SELECT COUNT(*) FROM forms'
```

### Fulcrum Console

Run the fulcrum console:

`fulcrum console`

### Reset an organization

Reset the organizaton and data in your Fulcrum sync database:

`fulcrum reset --org 'Organization Name'`
