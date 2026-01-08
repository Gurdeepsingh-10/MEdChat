#!/usr/bin/env bash

cd backend
export PYTHONPATH=$(pwd)

echo "🚀 Starting FastAPI from $(pwd)"
uvicorn app.main:app --host 0.0.0.0 --port $PORT
