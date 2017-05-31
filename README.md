![Fulcrum](https://d2ppvlu71ri8gs.cloudfront.net/items/322R2o0M300C043H1Y0u/fulcrum-desktop.png)

## :construction: Fulcrum Desktop :construction:

[![Build Status](https://travis-ci.org/fulcrumapp/fulcrum-desktop.svg?branch=master)](https://travis-ci.org/fulcrumapp/fulcrum-desktop)
[![Build status](https://ci.appveyor.com/api/projects/status/ii22qlgf1eomi9hm?svg=true)](https://ci.appveyor.com/project/Fulcrum/fulcrum-desktop)


Sync Fulcrum data to a local database. The local database is a complete API representation with search indexes and
query tables. It's intended to be the foundation for local/disconnected data synchronization and reporting.

### Documentation

* [Get Started](/docs/guides/installation.md)
* [Documentation](/docs)

```sh
git clone git@github.com:fulcrumapp/fulcrum-desktop.git
cd fulcrum-desktop
yarn
```

### Setup

```sh
./run setup # follow login instructions
./run sync --org 'Fulcrum Labs'
```

### Plugins

To create a new plugin:

```sh
./run create-plugin --name my-plugin
```

To install a plugin:

```sh
./run install-plugin --name geopackage

./run install-plugin --name reports

./run install-plugin --name postgres

./run install-plugin --name s3
```
