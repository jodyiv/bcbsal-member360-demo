#!/usr/bin/env bash
# check-compliance.sh — Pre-demo compliance gate
cd "$(dirname "$0")/.."
ROOT=$(pwd)
FAIL=0

fail() { echo "❌ FAIL: $1"; FAIL=$((FAIL+1)); }
pass() { echo "✅ PASS: $1"; }
warn() { echo "⚠  WARN: $1"; }

echo "======================================================"
echo "  BCBS AL Member 360 — Compliance Check"
echo "======================================================"

# Docs present
[ -f "$ROOT/README.md" ]          && pass "README.md present"       || fail "README.md missing"
[ -f "$ROOT/ARCHITECTURE.md" ]    && pass "ARCHITECTURE.md present" || fail "ARCHITECTURE.md missing"
[ -f "$ROOT/PILOT_PLAN.md" ]      && pass "PILOT_PLAN.md present"   || fail "PILOT_PLAN.md missing"
[ -f "$ROOT/DEMO_SCRIPT.md" ]     && pass "DEMO_SCRIPT.md present"  || fail "DEMO_SCRIPT.md missing"

# No .env committed
git -C "$ROOT" ls-files .env 2>/dev/null | grep -q ".env" && fail ".env is tracked by git!" || pass ".env not tracked by git"

# No hardcoded secrets
grep -r "api_key\s*=\s*['\"][a-zA-Z0-9]" "$ROOT/backend" 2>/dev/null | grep -v ".env" | grep -v example | grep -qv "^Binary" && fail "Possible hardcoded API key in backend" || pass "No hardcoded API keys"

# Carbon in frontend deps
grep -q "@carbon/react" "$ROOT/frontend/package.json" && pass "@carbon/react in frontend deps" || fail "@carbon/react missing from frontend/package.json"

# DemoBanner present
grep -r "DemoBanner" "$ROOT/frontend/src" --include="*.jsx" -l | grep -q . && pass "DemoBanner imported in UI" || fail "DemoBanner not found in UI"

# No real email addresses
grep -r "@bcbsal.com\|@bluecross.com" "$ROOT/frontend/src" 2>/dev/null | grep -qv "example\|demo.ibm" && fail "Possible real email in frontend" || pass "No real emails in frontend"

# Synthetic disclaimer
grep -q "synthetic\|DEMO\|demonstration" "$ROOT/frontend/src/components/DemoBanner.jsx" && pass "Synthetic data disclaimer in DemoBanner" || fail "Disclaimer missing from DemoBanner"

# No eval()
grep -r "eval(" "$ROOT/frontend/src" 2>/dev/null | grep -qv "//.*eval(" && fail "eval() usage found in frontend" || pass "No eval() in frontend"

# Dockerfiles have DEPLOY_TARGET header
for df in Dockerfile.frontend Dockerfile.backend; do
  [ -f "$ROOT/$df" ] && {
    grep -q "DEPLOY_TARGET:" "$ROOT/$df" && pass "$df has DEPLOY_TARGET header" || fail "$df missing # DEPLOY_TARGET: header"
    grep -q "BUILD_ARCH:"   "$ROOT/$df" && pass "$df has BUILD_ARCH header"    || fail "$df missing # BUILD_ARCH: header"
    grep -q "ubi9/"         "$ROOT/$df" && pass "$df uses UBI 9 base image (OpenShift-safe)" || fail "$df does not use UBI 9 — HARD FAIL for OpenShift"
  } || warn "$df not found (containers not built yet)"
done

# Summary
echo ""
echo "======================================================"
[ $FAIL -eq 0 ] && echo "  🎉 All compliance checks passed." || echo "  ⚠  $FAIL check(s) failed — fix before demo delivery."
echo "======================================================"
exit $FAIL
