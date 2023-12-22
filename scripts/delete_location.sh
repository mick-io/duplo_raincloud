#!/bin/bash

if [ "$1" == "--help" ]; then
  echo "Usage: ./delete_location.sh [id] or ./delete_location.sh [latitude] [longitude]"
  echo "id: ID of the location."
  echo "latitude: Latitude of the location. Default is 50."
  echo "longitude: Longitude of the location. Default is 50."
  exit 0
fi

if [ $# -eq 1 ]; then
  ID=$1
  http DELETE http://localhost:4000/locations id==$ID
else
  LATITUDE=${1:-50}
  LONGITUDE=${2:-50}
  http DELETE http://localhost:4000/locations latitude==$LATITUDE longitude==$LONGITUDE
fi
