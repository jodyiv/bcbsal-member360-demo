#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."
ROOT=$(pwd)

echo "======================================================"
echo "  BCBS AL Member 360 Lakehouse Demo — Setup"
echo "======================================================"

# Check node
node --version >/dev/null 2>&1 || { echo "❌ Node.js not found. Install v20+."; exit 1; }
# Check python3
python3 --version >/dev/null 2>&1 || { echo "❌ Python 3 not found. Install v3.11+."; exit 1; }

# Create .env if missing
if [ ! -f "$ROOT/.env" ]; then
  cp "$ROOT/.env.example" "$ROOT/.env"
  echo "✅ .env created from .env.example (mock mode by default)"
else
  echo "✅ .env already exists"
fi

# Frontend deps
echo "📦 Installing frontend dependencies…"
cd "$ROOT/frontend" && npm install
echo "✅ Frontend dependencies installed"

# Backend venv + deps
echo "🐍 Setting up Python virtual environment…"
cd "$ROOT/backend"
python3 -m venv .venv
source .venv/bin/activate
pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt
echo "✅ Backend dependencies installed"

echo ""
echo "======================================================"
echo "  Setup complete! Run the demo:"
echo ""
echo "  Backend:  cd demo-bcbsal-member360/backend && source .venv/bin/activate && uvicorn main:app --reload --port 8000"
echo "  Frontend: cd demo-bcbsal-member360/frontend && npm run dev"
echo ""
echo "  Open: http://localhost:3000"
echo "======================================================"
