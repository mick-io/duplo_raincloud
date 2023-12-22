#!/bin/bash

if [ "$1" == "--help" ]; then
    echo "Usage: ./add_location.sh [latitude] [longitude]"
    echo "latitude: Latitude of the location. Default is 50."
    echo "longitude: Longitude of the location. Default is 50."
    exit 0
fi

LATITUDE=${1:-50}
LONGITUDE=${2:-50}

curl -i -X POST \
    -H "Content-Type: application/json" \
    -d "{\"latitude\":$LATITUDE, \"longitude\":$LONGITUDE}" \
    "http://localhost:4000/locations"
