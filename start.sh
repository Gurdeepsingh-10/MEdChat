#!/bin/bash
PORT=${PORT:-7860}
echo "🚀 Starting FastAPI on port $PORT"
exec uvicorn app.main:app --host 0.0.0.0 --port "$PORT"
