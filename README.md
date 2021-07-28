## :construction: Fulcrum Desktop :construction:

[![Build Status](https://travis-ci.org/fulcrumapp/fulcrum-desktop.svg?branch=master)](https://travis-ci.org/fulcrumapp/fulcrum-desktop)
[![Build status](https://ci.appveyor.com/api/projects/status/ii22qlgf1eomi9hm?svg=true)](https://ci.appveyor.com/project/Fulcrum/fulcrum-desktop)


Sync Fulcrum data to a local database. The local database is a complete API representation with search indexes and
query tables. It's intended to be the foundation for local/disconnected data synchronization and reporting.

### Documentation

https://learn.fulcrumapp.com/dev/desktop/intro/

### Development

```sh
git clone git@github.com:fulcrumapp/fulcrum-desktop.git
cd fulcrum-desktop
yarn
```

### Production

To run in production, build as a docker image.

```sh
docker build . -t fulcrum-desktop:latest
docker run fulcrum-desktop:latest
```
