#!/usr/bin/env bash
# Route protection test suite for Ceygo
# Usage: bash scripts/test-routes.sh
# Requires: dev server running on localhost:3000

BASE="http://localhost:3000"
PASS=0
FAIL=0

# ── helpers ──────────────────────────────────────────────────────────────────
check() {
  local label="$1" role="$2" path="$3" expected="$4"
  local cookie=""
  [[ -n "$role" ]] && cookie="-b ceygo_role=$role"

  actual=$(curl -s -o /dev/null -w "%{http_code}:%{redirect_url}" \
    -L --max-redirs 0 $cookie "$BASE$path" 2>/dev/null)

  code="${actual%%:*}"
  location="${actual#*:}"

  # For redirects we care about the destination path, not the full URL
  dest=$(echo "$location" | sed "s|$BASE||")

  if [[ "$expected" == "200" ]]; then
    if [[ "$code" == "200" ]]; then
      echo "  PASS  [$role] $path → 200"
      ((PASS++))
    else
      echo "  FAIL  [$role] $path → expected 200, got $code (redirected to $dest)"
      ((FAIL++))
    fi
  else
    # Expect a redirect to a specific path
    if [[ "$code" == "307" || "$code" == "308" ]] && [[ "$dest" == "$expected" ]]; then
      echo "  PASS  [$role] $path → $code $dest"
      ((PASS++))
    else
      echo "  FAIL  [$role] $path → expected redirect to $expected, got $code $dest"
      ((FAIL++))
    fi
  fi
}

echo ""
echo "══════════════════════════════════════════════════════"
echo "  Ceygo Route Protection Tests"
echo "══════════════════════════════════════════════════════"

# ── 1. Unauthenticated (no cookie) ───────────────────────────────────────────
echo ""
echo "── Unauthenticated (no cookie) ─────────────────────"
check "unauth→dashboard"        ""          "/dashboard"           "/signin"
check "unauth→partnerdashboard" ""          "/partnerdashboard"    "/signin"
check "unauth→admin"            ""          "/admin"               "/admin-loging"
check "unauth→wishlist"         ""          "/wishlist"            "/signin"
check "unauth→bookings"         ""          "/bookings"            "/signin"
check "unauth→onboarding"       ""          "/onboarding"          "/signin"
check "unauth→messages"         ""          "/messages"            "/signin"

# ── 2. Traveler ───────────────────────────────────────────────────────────────
echo ""
echo "── Traveler ────────────────────────────────────────"
check "traveler→own dashboard"   "traveler"  "/dashboard"           "200"
check "traveler→wishlist"        "traveler"  "/wishlist"            "200"
check "traveler→bookings"        "traveler"  "/bookings"            "200"
check "traveler→messages"        "traveler"  "/messages"            "200"
check "traveler→admin (denied)"  "traveler"  "/admin"               "/dashboard"
check "traveler→partner (denied)" "traveler" "/partnerdashboard"    "/dashboard"
check "traveler→onboarding(denied)" "traveler" "/onboarding"        "/dashboard"

# ── 3. Partner ────────────────────────────────────────────────────────────────
echo ""
echo "── Partner ─────────────────────────────────────────"
check "partner→own dashboard"   "partner"   "/partnerdashboard"    "200"
check "partner→onboarding"      "partner"   "/onboarding"          "200"
check "partner→messages"        "partner"   "/messages"            "200"
check "partner→admin (denied)"  "partner"   "/admin"               "/partnerdashboard"
check "partner→traveler (denied)" "partner" "/dashboard"           "/partnerdashboard"
check "partner→wishlist (denied)" "partner" "/wishlist"            "/partnerdashboard"

# ── 4. Admin ──────────────────────────────────────────────────────────────────
echo ""
echo "── Admin ───────────────────────────────────────────"
check "admin→own dashboard"     "admin"     "/admin"               "200"
check "admin→usermanagement"    "admin"     "/usermanagement"      "200"
check "admin→verification"      "admin"     "/verification"        "200"
check "admin→forecasting"       "admin"     "/forecasting"         "200"
check "admin→traveler (denied)" "admin"     "/dashboard"           "/admin"
check "admin→partner (denied)"  "admin"     "/partnerdashboard"    "/admin"

# ── 5. Public pages always accessible ────────────────────────────────────────
echo ""
echo "── Public pages (always 200) ───────────────────────"
check "signin"                  ""          "/signin"              "200"
check "signup"                  ""          "/signup"              "200"
check "admin-loging"            ""          "/admin-loging"        "200"

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo "══════════════════════════════════════════════════════"
total=$((PASS + FAIL))
echo "  Results: $PASS/$total passed"
[[ $FAIL -gt 0 ]] && echo "  $FAIL test(s) FAILED" || echo "  All tests passed!"
echo "══════════════════════════════════════════════════════"
echo ""

[[ $FAIL -gt 0 ]] && exit 1 || exit 0
