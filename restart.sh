echo 'DROP DATABASE fulcrum_desktop;' | psql fulcrum_development
echo 'CREATE DATABASE fulcrum_desktop;' | psql fulcrum_development
echo 'CREATE EXTENSION postgis;' | psql fulcrum_desktop

./run setup --org 'Zac Personal' --token '23972494c60c6caed1d3b1262bd56a091d6da357c5fa90b5c6a92c59e7e1b9c922cf5dc0ce688f80'
# ./run sync --org 'Zac Personal' --pg-database fulcrum_desktop
./run sync --org 'Zac Personal' --pg-database fulcrum_desktop --mssql-database fulcrum_sync5 --mssql-user sa --mssql-password spatial --mssql-underscore-names --no-mssql-prefix --mssql-persistent-table-names

# ./run setup --org 'Fulcrum Labs' --token '8f757165e879c1444cf0b2ee155edca2f4940ba3408b8a9f43f3356689f19e34f73a8c5d41ae699a'
# ./run postgres --org 'Fulcrum Labs' --pg-database fulcrum_desktop
# ./run sync --debug --org 'Fulcrum Labs' --form '6c6ae358-6ac6-419e-8f44-7c29ea28cafb' --pg-database fulcrum_desktop
# ./run sync --org 'Fulcrum Labs' --form 'da6f4690-2a73-489e-80ce-10e671ad0eda' --pg-database fulcrum_desktop --pg-simple-types
# ./run sync --debug --org 'Fulcrum Labs' --pg-database fulcrum_desktop
# ./run sync --org 'Fulcrum Labs' --pg-database fulcrum_desktop --pg-simple-types
