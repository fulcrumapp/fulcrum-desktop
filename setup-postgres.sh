echo 'DROP DATABASE fulcrum_desktop;' | psql fulcrum_development
echo 'CREATE DATABASE fulcrum_desktop;' | psql fulcrum_development
echo 'CREATE EXTENSION postgis;' | psql fulcrum_desktop
echo 'CREATE SCHEMA fulcrum_data;' | psql fulcrum_desktop
echo 'CREATE SCHEMA fulcrum_views;' | psql fulcrum_desktop
