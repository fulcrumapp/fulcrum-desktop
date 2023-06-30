FROM ubuntu:20.04

# System Dependencies
RUN apt-get update -y && apt-get install -y \
  apt-transport-https \
  curl \
  ca-certificates \
  software-properties-common && \
  curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | \
  tee /etc/apt/sources.list.d/yarn.list && \
  add-apt-repository ppa:linuxuprising/libpng12 && \
  add-apt-repository -y ppa:ubuntugis/ubuntugis-unstable && \
  curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
  apt-get update -y && apt-get install -y \
    libjson-c-dev \
    libsqlite3-dev \
    libproj-dev \
    libgeos-dev \
    libgeos++-dev \
    libspatialite-dev \
    libgeotiff-dev \
    libgdal-dev \
    gdal-bin \
    libmapnik-dev \
    mapnik-utils \
    python-dev \
    python-setuptools \
    python3-pip \
    python3-gdal \
    python3-mapnik \
    libprotobuf-dev \
    protobuf-compiler \
    nodejs \
    yarn \
    gdebi-core \
    build-essential \
    xfonts-base \
    xfonts-75dpi \
    libssl-dev \
    libpq-dev \
    libxml2-dev \
    libxslt1-dev \
    imagemagick \
    libmagickwand-dev \
    git \
    libyaml-dev \
    sqlite3 \
    autoconf \
    libgmp-dev \
    libgdbm-dev \
    libncurses5-dev \
    automake \
    make \
    bison \
    flex \
    libtool \
    xz-utils \
    libffi-dev \
    libgmp-dev \
    libpng12-0 \
    libreadline6-dev \
    postgresql-client \
    libx11-xcb1

# libssql1.0.0 dependency for wkhtmltopdf
RUN curl http://security.ubuntu.com/ubuntu/pool/main/o/openssl1.0/libssl1.0.0_1.0.2n-1ubuntu5.13_amd64.deb > ~/libssl.deb
RUN dpkg -i ~/libssl.deb
RUN rm -rf ~/libssl.deb

# wkhtmltopdf installation
ENV WKHTMLTOPFD_URL http://zhm.s3.amazonaws.com/wkhtmltopdf/wkhtmltox-0.12.2.1_linux-trusty-amd64.deb
RUN curl $WKHTMLTOPFD_URL > ~/wkhtmltox.deb
RUN fc-cache -f -v
RUN dpkg -i ~/wkhtmltox.deb
RUN rm -rf ~/wkhtmltox.deb

# App directory
RUN mkdir fulcrum-desktop
ENV APP_HOME /fulcrum-desktop
WORKDIR $APP_HOME
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
ADD . $APP_HOME
