# Getting started

This document describes how to setup your development environment.

## Preparation

Make sure the following software is installed:

* Git 2.13.2+ ([installation manual](https://git-scm.com/downloads))
* Docker 1.13.1+ ([installation manual](https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/))
* Node.js 16+ and npm 8+ ([installation with nvm](https://github.com/creationix/nvm#usage))

1) Clone the repository
```shell
git clone https://github.com/edgeIO/dashboard.git
```

2) Install the dependencies:

```shell
npm install
```

## Running the Okakestra Framework

To be able to log in to the dashboard and test all functions, at least the System Manager and MongoDB must be started.
How to start them is described in the README of the `edgeio` repository.

## Serving Dashboard for Development


```shell
npm start
```

In the background, `npm start` starts the `angular` development server. By default, the server starts on `localhost:4200`

Once the angular server starts, it takes some time to pre-compile all assets before serving them. By default, the angular development server watches for file changes and will update accordingly.

As stated in the [Angular documentation](https://angular.io/guide/i18n#generate-app-versions-for-each-locale), i18n does not work in the development mode.
Follow [Building Dashboard for Production](#building-dashboard-for-production) section to test this feature.

> Due to the deployment complexities of i18n and the need to minimize rebuild time, the development server only supports localizing a single locale at a time. Setting the "localize" option to true will cause an error when using ng serve if more than one locale is defined. Setting the option to a specific locale, such as "localize": ["fr"], can work if you want to develop against a specific locale (such as fr).

## Building Dashboard for Production

In the production environment you need the following files: 

1) `dist` folder
2) `docker` folder
3) `Dockerfile`
4) `docker-compose.yml`


### 1. dist folder:
The dashboard project can be built for production by using the following task:

```shell
npm run build
```

The code is compiled, compressed, i18n support is enabled and debug support removed. The dashboard binary can be found in the `dist` folder.

### 2. docker folder: 

To use the environment variables of a Docker container in your Angular application we use the library [angular-server-side-configuration](https://www.npmjs.com/package/angular-server-side-configuration). For any problems you can consult the readme of that repository.

This folder contains the angular-environment folder, the entrypoint.sh file and a Nginx configuration file. 

In the angular-environment folder is the code that needs to run every time you start your Docker container. 
It contains a package.json file that has a dependency on angular-server-side-configuration and runs the main.js file.

The entrypoint.sh script is used to install NodeJS and the angular-server-side-configuration library. After that, it runs the main.js script to set the environment variables and at the end, all NodeJS-related stuff is deleted and the Nginx server can be started with the defined settings in the configuration file. 

### 3. dockerfile 

Copies all relevant files into the container and executes the `entrypoint.sh` script

### 4. docker compose

To start the Docker service the Ip address of the system manager should be defined in the `docker-compose.yml` file. If the dashboard cannot reach the system manager, the user cannot log in.

```shell
API_ADDRESS=IP:PORT #ip and port of the system manager
```

## Starting the dashboard

If you have all the above files, you can build and start the Dashboard using the following command.

```shell
docker-compose.yml up –build -d
```
