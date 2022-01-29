# EdgeIO-Frontend

This is the fist implementation of a Frontend for the EdgeIO Framework. 

The EdgeIO Frontend sends api calls to the System-Manager and displays the results. 

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Run

Run `docker-compose up` to start the Website with docker compose.

or 

Run `docker build -t edgeio-image .` and 

`docker run -e "API_ADDRESS=localhost:10000" -p 8080:80 edgeio-image`

To start the website on the port 8080 which then accesses the EdgeIO System Manager on the configured IP address.

# SLA Configuration from Max

In the Frontend it should be able to enter the data in a form and then this structure of the configuration is generated and can be sent to the root orchestrator.
