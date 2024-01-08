# DuploRaincloud

Hello Duplolcloud employee! Thank you for taking the time to review my assessment project! I was asked to complete the following 
requirements within 48 hours:

> The aim of this task is to build a simple API (backed by any kind of database). The application should be able to
> store weather forecast data in the database, based on provided latitude and longitude - you can use
> https://open-meteo.com/ to get a weather forecast. The API should be able to add (new longitude and latitude), delete
> or provide weather forecast. It should also provide an endpoint to list previously used longitudes and latitudes from
> the database, and choose them to provide the newest weather forecast.

I took some liberties concerning the shape of the returned forecast data as none was specified.

### Improved Branch

I've created a branch named `improved` which contains numerous changes to the application that I completed after the 48 hour deadline.

## Getting Started

I've included a [Dockerfile](./Dockerfile) and [docker-compose file](./docker-compose.yml). After you build and run the
image you can interact with the API.

### Building and Running the Docker Container

Build the Docker image (`npm ci` may take a couple minute):

```sh
npm run containerize

# OR

docker build -t duplo_raincloud .
```

Run Docker Compose

```sh
npm run compose

# OR

docker compose up -d
```

The API should now be running! Try the following in your terminal:

```sh
curl -i localhost:4000/health

# OR

scripts/health_check.sh
```

If you see "_OK_" in the terminal after the health check, the service is running!

#### Custom Configuration

I've hardcoded configurations for the [docker-compose](docker-compose.yml) file. If you wish to run and interact with
the service locally, you can create a `.env` file at the workspace root. See the [config file](src/config.ts)
for details about the expected schema.

### Interacting

I've included a Postman collection that you can import under [postman/](postman/DuploRaincloud.postman_collection.json)

I've also created scripts that preferentially use [httpie](https://httpie.io/). `curl` is used as a fallback if
[httpie](https://httpie.io/) is not installed. find them under scripts/

The [scripts/](scripts/) directory contains utility that can help you interact with the API:

- [`add_location.sh`](scripts/add_location.sh): This script allows you to add a new location. You need to provide the latitude and longitude as arguments.
- [`delete_location.sh`](scripts/delete_location.sh): This script allows you to delete a location by its ID. You need to provide the ID as an argument.
- [`fetch_forecast.sh`](scripts/fetch_forecast.sh): This script fetches the forecast for a specific location. You need to provide the latitude and longitude as arguments.
- [`fetch_locations.sh`](scripts/fetch_locations.sh): This script fetches all locations.
- [`health_check.sh`](scripts/health_check.sh): This script checks the health of the API.
- [`latest_forecast.sh`](scripts/latest_forecast.sh): This script fetches the latest forecast for all locations.

## API Endpoints

The API exposes the following endpoints:

- `GET /health`: Checks the health of the API. Returns "OK" if the service is running.
- `GET /locations`: Fetches all locations.
- `POST /locations`: Adds a new location. Requires latitude and longitude in the request body.
- `DELETE /locations?id=:id`: Deletes a location by its ID.
- `DELETE /locations?latitude=:latitude&longitude=:longitude` Deletes a location by latitude and longitude.
- `GET /forecasts`: Fetches the forecast for all locations.
- `GET /forecast/latest`: Fetches the latest forecast for all locations.

You can interact with these endpoints using the provided scripts in the [`scripts/`](scripts/) directory or by using the
included Postman collection in the [`postman/`](postman/DuploRaincloud.postman_collection.json)directory.
