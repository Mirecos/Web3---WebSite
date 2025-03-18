#!/bin/sh
if [ "$PRODUCTION_MODE" = "True" ]; then
    echo "Starting in production mode"
    exec pnpm serve -s build -l 3000
else
    echo "Starting in development mode"
    exec pnpm run start
fi