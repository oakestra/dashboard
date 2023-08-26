# Oakestra-Dashboard

You can find a detailed description [here](https://www.oakestra.io/docs/)        

The Dashboard is a sophisticated web-based user interface for the Oakestra system. It is designed to provide 
users with a comprehensive set of tools to deploy applications to a Oakestra cluster, 
effectively manage cluster resources, and troubleshoot any issues that may arise.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Run

Export system manager url: `export SYSTEM_MANAGER=<ip or url without port>`
Run `docker-compose up --build` to start the Website with docker compose.

This starts the website on the port 8888 which then accesses the Oakestra System Manager on the configured IP address.

