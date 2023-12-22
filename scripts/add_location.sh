#!/bin/bash

if [ "$1" == "--help" ]; then
  echo "Usage: ./add_location.sh [latitude] [longitude]"
  echo "latitude: Latitude of the location."
  echo "longitude: Longitude of the location."
  exit 0
fi

if [ -z "$1" ]; then
  read -p "Please enter latitude: " LATITUDE
else
  LATITUDE=$1
fi

if [ -z "$2" ]; then
  read -p "Please enter longitude: " LONGITUDE
else
  LONGITUDE=$2
fi

if command -v http >/dev/null 2>&1; then
  http POST http://localhost:4000/locations latitude=$LATITUDE longitude=$LONGITUDE
else
  curl -X POST -H "Content-Type: application/json" -d "{\"latitude\": $LATITUDE, \"longitude\": $LONGITUDE}" http://localhost:4000/locations
fi
