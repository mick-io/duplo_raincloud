#!/bin/bash

ID=$1
curl -X DELETE "http://localhost:4000/locations?id=$ID"
