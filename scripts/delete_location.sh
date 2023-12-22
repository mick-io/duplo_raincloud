#!/bin/bash

if [ "$1" == "--help" ]; then
  echo "Usage: ./delete_location.sh [id] or ./delete_location.sh [latitude] [longitude]"
  echo "id: ID of the location."
  echo "latitude: Latitude of the location."
  echo "longitude: Longitude of the location."
  exit 0
fi

if [ $# -eq 1 ]; then
  ID=$1
  if command -v http >/dev/null 2>&1; then
    http DELETE http://localhost:4000/locations id==$ID
  else
    curl -X DELETE http://localhost:4000/locations/$ID
  fi
else
  if [ -z "$1" ]; then
    read -p "Please enter latitude to DELETE: " LATITUDE
  else
    LATITUDE=$1
  fi

  if [ -z "$2" ]; then
    read -p "Please enter longitude to DELETE: " LONGITUDE
  else
    LONGITUDE=$2
  fi

  if command -v http >/dev/null 2>&1; then
    http DELETE http://localhost:4000/locations latitude==$LATITUDE longitude==$LONGITUDE
  else
    curl -X DELETE "http://localhost:4000/locations?latitude=$LATITUDE&longitude=$LONGITUDE"
  fi
fi
