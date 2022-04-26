# EdgeIO-Frontend

You can find a detailed description [here](docs/README.md)

This is the fist implementation of a frontend for the EdgeIO framework.
The EdgeIO frontend sends API calls to the System-Manager and displays the results. 

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
