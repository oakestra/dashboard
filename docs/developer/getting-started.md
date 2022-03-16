# Getting started

This document describes how to setup your development environment.

## Preparation

Make sure the following software is installed:

* Git 2.13.2+ ([installation manual](https://git-scm.com/downloads))
* Docker 1.13.1+ ([installation manual](https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/))
* Node.js 16+ and npm 8+ ([installation with nvm](https://github.com/creationix/nvm#usage))

Clone the repository and install the dependencies:

```shell
npm ci
```

If you are running commands with root privileges set `--unsafe-perm flag`:

```shell
npm ci --unsafe-perm
```

## Running the EdgeIO Framework

To be able to log in to the dashboard and test all functions, at least the System Manager and MongoDB must be started.
How to start them is described in the README of the `edgeio` repository. 

## Serving Dashboard for Development

Quick updated version:

```shell
npm start
```

In the background, `npm start` starts the `angular` development server.

Once the angular server starts, it takes some time to pre-compile all assets before serving them. By default, the angular development server watches for file changes and will update accordingly.

As stated in the [Angular documentation](https://angular.io/guide/i18n#generate-app-versions-for-each-locale), i18n does not work in the development mode.
Follow [Building Dashboard for Production](#building-dashboard-for-production) section to test this feature.

> Due to the deployment complexities of i18n and the need to minimize rebuild time, the development server only supports localizing a single locale at a time. Setting the "localize" option to true will cause an error when using ng serve if more than one locale is defined. Setting the option to a specific locale, such as "localize": ["fr"], can work if you want to develop against a specific locale (such as fr).

## Building Dashboard for Production

The Dashboard project can be built for production by using the following task:

```shell
make build
```

The code is compiled, compressed, i18n support is enabled and debug support removed. The dashboard binary can be found in the `dist` folder.

To build the docker image you will need to set environment variable in the `docker-compose.yml`:

```shell
API_ADDRESS=IP:PORT #ip and port of the system manager
```
