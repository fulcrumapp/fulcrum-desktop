# ./run mssql --org "Fulcrum Labs" --mssql-user sa --mssql-password Spatial2019 --mssql-database msdb --mssql-drop-database fulcrum_test
./run mssql --org "Zac Gallery Staging Account" --mssql-user sa --mssql-password Banksy2020 --mssql-database msdb --mssql-create-database fulcrum_test
./run mssql --org "Zac Gallery Staging Account" --mssql-user sa --mssql-password Banksy2020 --mssql-database fulcrum_test --mssql-setup
# ./run sync --org "Fulcrum Labs" --mssql-user sa --mssql-password Spatial2019 --mssql-database fulcrum_test --debug
./run sync --org "Zac Gallery Staging Account" --mssql-user sa --mssql-password Banksy2020 --mssql-database fulcrum_test
