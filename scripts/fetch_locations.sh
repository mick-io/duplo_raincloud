#!/bin/bash

if command -v http >/dev/null 2>&1; then
  http GET http://localhost:4000/locations/
else
  curl -i http://localhost:4000/locations/
fi
