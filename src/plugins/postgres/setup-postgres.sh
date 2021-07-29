echo 'DROP DATABASE fulcrumapp;' | psql $1 postgres
echo 'CREATE DATABASE fulcrumapp;' | psql $1 postgres
echo 'CREATE EXTENSION postgis;' | psql fulcrumapp
