#!/usr/bin/bash

docker compose pull db
docker compose pull devcontainer
docker compose pull kong
docker compose pull rest
docker compose pull realtime
docker compose pull storage
docker compose pull imgproxy
docker compose pull vector

# docker compose pull studio
# docker compose pull db
# docker compose pull auth
# docker compose pull meta
# docker compose pull supavisor
# docker compose pull analytics
# docker compose pull functions
