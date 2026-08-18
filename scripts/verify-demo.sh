#!/usr/bin/env bash
# verify-demo.sh — Boots backend + builds frontend, verifies all endpoints
set -e
cd "$(dirname "$0")/.."
ROOT=$(pwd)
PASS=0; FAIL=0

pass() { echo "✅ $1"; PASS=$((PASS+1)); }
fail() { echo "❌ $1"; FAIL=$((FAIL+1)); }

echo "======================================================"
echo "  BCBS AL Member 360 — Demo Verification"
echo "======================================================"

# ── Stage 1: Backend ─────────────────────────────────────
echo ""
echo "── Stage 1: Backend ─────────────────────────────────"
cd "$ROOT/backend"
[ ! -d .venv ] && python3 -m venv .venv
source .venv/bin/activate
pip install --quiet -r requirements.txt

# Boot backend
uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
sleep 3

curl -fsS http://localhost:8000/api/health      >/dev/null && pass "/api/health returns 200" || fail "/api/health failed"
curl -fsS http://localhost:8000/api/data/dashboard >/dev/null && pass "/api/data/dashboard returns 200" || fail "/api/data/dashboard failed"
curl -fsS http://localhost:8000/api/data/members   >/dev/null && pass "/api/data/members returns 200" || fail "/api/data/members failed"
curl -fsS http://localhost:8000/api/data/member/MBR-JS-0042 >/dev/null && pass "/api/data/member/MBR-JS-0042 returns 200" || fail "/api/data/member/MBR-JS-0042 failed"
curl -fsS http://localhost:8000/api/ai/models >/dev/null && pass "/api/ai/models returns 200" || fail "/api/ai/models failed"
curl -fsS -X POST http://localhost:8000/api/ai/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"What drives her risk score?","member_id":"MBR-JS-0042"}' \
  >/dev/null && pass "/api/ai/ask POST returns 200" || fail "/api/ai/ask POST failed"
curl -fsS http://localhost:8000/api/demo/config >/dev/null && pass "/api/demo/config returns 200" || fail "/api/demo/config failed"

kill $BACKEND_PID 2>/dev/null || true

# ── Stage 2: Frontend build ───────────────────────────────
echo ""
echo "── Stage 2: Frontend build ──────────────────────────"
cd "$ROOT/frontend"
npm ci --silent 2>/dev/null || npm install --silent
npm run build && pass "npm run build exits 0" || fail "npm run build FAILED"

# ── Summary ───────────────────────────────────────────────
echo ""
echo "======================================================"
echo "  Results: $PASS passed · $FAIL failed"
echo "======================================================"
[ $FAIL -eq 0 ] && echo "  🎉 All checks passed — demo is ready" || { echo "  ⚠  Fix failures above before demo"; exit 1; }
