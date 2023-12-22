#!/bin/bash

if command -v http >/dev/null 2>&1; then
    http GET http://localhost:4000/forecast/
else
    curl -i http://localhost:4000/forecast/
fi
