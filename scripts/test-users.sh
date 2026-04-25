#!/usr/bin/env bash
# ════════════════════════════════════════════════════════════════
#  Ceygo — Full User & Security Test Suite
#  Usage: bash scripts/test-users.sh [PORT]
#  Default port: 3005
# ════════════════════════════════════════════════════════════════

BASE="http://localhost:${1:-3005}"
PASS=0; FAIL=0; WARN=0

# ── helpers ──────────────────────────────────────────────────────
green() { printf "\033[32m%s\033[0m\n" "$1"; }
red()   { printf "\033[31m%s\033[0m\n" "$1"; }
yellow(){ printf "\033[33m%s\033[0m\n" "$1"; }
cyan()  { printf "\033[36m%s\033[0m\n" "$1"; }

pass() { green "  ✔  PASS  $1"; ((PASS++)); }
fail() { red   "  ✖  FAIL  $1"; ((FAIL++)); }
warn() { yellow "  ⚠  WARN  $1"; ((WARN++)); }

req() {
  # req <cookie> <path>  → "CODE:DEST"
  local cookie="$1" path="$2"
  local out
  out=$(curl -s -o /dev/null -w "%{http_code}:%{redirect_url}" \
    --max-redirs 0 \
    ${cookie:+-b "$cookie"} \
    "$BASE$path" 2>/dev/null)
  local code="${out%%:*}"
  local dest
  dest=$(echo "${out#*:}" | sed "s|$BASE||")
  echo "$code:$dest"
}

check() {
  local label="$1" cookie="$2" path="$3" expect_code="$4" expect_dest="$5"
  local r; r=$(req "$cookie" "$path")
  local code="${r%%:*}" dest="${r#*:}"
  if [[ "$code" == "$expect_code" ]] && { [[ -z "$expect_dest" ]] || [[ "$dest" == "$expect_dest" ]]; }; then
    pass "$label"
  else
    fail "$label  →  got $code$( [[ -n $dest ]] && echo " → $dest" )  (expected $expect_code${expect_dest:+ → $expect_dest})"
  fi
}

# ════════════════════════════════════════════════════════════════
echo ""
cyan "════════════════════════════════════════════════════════"
cyan "  Ceygo  —  Full User & Security Test Suite"
cyan "  Target: $BASE"
cyan "════════════════════════════════════════════════════════"

# ────────────────────────────────────────────────────────────────
cyan "\n[1] TRAVELER — Route Access"
# ────────────────────────────────────────────────────────────────
check "Traveler can access /dashboard"              "ceygo_role=traveler" "/dashboard"           200 ""
check "Traveler can access /wishlist"               "ceygo_role=traveler" "/wishlist"            200 ""
check "Traveler can access /bookings"               "ceygo_role=traveler" "/bookings"            200 ""
check "Traveler can access /messages"               "ceygo_role=traveler" "/messages"            200 ""
check "Traveler blocked from /admin"                "ceygo_role=traveler" "/admin"               307 "/dashboard"
check "Traveler blocked from /partnerdashboard"     "ceygo_role=traveler" "/partnerdashboard"    307 "/dashboard"
check "Traveler blocked from /onboarding"           "ceygo_role=traveler" "/onboarding"          307 "/dashboard"
check "Traveler blocked from /usermanagement"       "ceygo_role=traveler" "/usermanagement"      307 "/dashboard"
check "Traveler blocked from /verification"         "ceygo_role=traveler" "/verification"        307 "/dashboard"
check "Traveler blocked from /forecasting"          "ceygo_role=traveler" "/forecasting"         307 "/dashboard"

# ────────────────────────────────────────────────────────────────
cyan "\n[2] PARTNER — Route Access"
# ────────────────────────────────────────────────────────────────
check "Partner can access /partnerdashboard"        "ceygo_role=partner"  "/partnerdashboard"    200 ""
check "Partner can access /onboarding"              "ceygo_role=partner"  "/onboarding"          200 ""
check "Partner can access /messages"                "ceygo_role=partner"  "/messages"            200 ""
check "Partner blocked from /admin"                 "ceygo_role=partner"  "/admin"               307 "/partnerdashboard"
check "Partner blocked from /dashboard"             "ceygo_role=partner"  "/dashboard"           307 "/partnerdashboard"
check "Partner blocked from /wishlist"              "ceygo_role=partner"  "/wishlist"            307 "/partnerdashboard"
check "Partner blocked from /bookings"              "ceygo_role=partner"  "/bookings"            307 "/partnerdashboard"
check "Partner blocked from /usermanagement"        "ceygo_role=partner"  "/usermanagement"      307 "/partnerdashboard"
check "Partner blocked from /verified-reviews/admin" "ceygo_role=partner" "/verified-reviews/admin" 307 "/partnerdashboard"

# ────────────────────────────────────────────────────────────────
cyan "\n[3] ADMIN — Route Access"
# ────────────────────────────────────────────────────────────────
check "Admin can access /admin"                     "ceygo_role=admin"    "/admin"               200 ""
check "Admin can access /usermanagement"            "ceygo_role=admin"    "/usermanagement"      200 ""
check "Admin can access /verification"              "ceygo_role=admin"    "/verification"        200 ""
check "Admin can access /forecasting"               "ceygo_role=admin"    "/forecasting"         200 ""
check "Admin can access /settings/admin"            "ceygo_role=admin"    "/settings/admin"      200 ""
check "Admin can access /verified-reviews/admin"    "ceygo_role=admin"    "/verified-reviews/admin" 200 ""
check "Admin blocked from /dashboard"               "ceygo_role=admin"    "/dashboard"           307 "/admin"
check "Admin blocked from /partnerdashboard"        "ceygo_role=admin"    "/partnerdashboard"    307 "/admin"
check "Admin blocked from /wishlist"                "ceygo_role=admin"    "/wishlist"            307 "/admin"
check "Admin blocked from /onboarding"              "ceygo_role=admin"    "/onboarding"          307 "/admin"

# ────────────────────────────────────────────────────────────────
cyan "\n[4] UNAUTHENTICATED — No Cookie"
# ────────────────────────────────────────────────────────────────
check "No cookie → /dashboard redirects to /signin"       "" "/dashboard"        307 "/signin"
check "No cookie → /partnerdashboard redirects to /signin" "" "/partnerdashboard" 307 "/signin"
check "No cookie → /admin redirects to /admin-loging"     "" "/admin"            307 "/admin-loging"
check "No cookie → /wishlist redirects to /signin"        "" "/wishlist"         307 "/signin"
check "No cookie → /bookings redirects to /signin"        "" "/bookings"         307 "/signin"
check "No cookie → /onboarding redirects to /signin"      "" "/onboarding"       307 "/signin"
check "No cookie → /messages redirects to /signin"        "" "/messages"         307 "/signin"
check "No cookie → /usermanagement redirects to /signin"  "" "/usermanagement"   307 "/signin"
check "Public: /signin returns 200"                       "" "/signin"           200 ""
check "Public: /signup returns 200"                       "" "/signup"           200 ""
check "Public: /admin-loging returns 200"                 "" "/admin-loging"     200 ""

# ────────────────────────────────────────────────────────────────
cyan "\n[5] LOGOUT SIMULATION — Cookie cleared"
# ────────────────────────────────────────────────────────────────
# After logout the cookie is gone; protected routes must redirect
check "After logout traveler /dashboard → /signin"        "" "/dashboard"        307 "/signin"
check "After logout partner /partnerdashboard → /signin"  "" "/partnerdashboard" 307 "/signin"
check "After logout admin /admin → /admin-loging"         "" "/admin"            307 "/admin-loging"

# ────────────────────────────────────────────────────────────────
cyan "\n[6] SECURITY — Cookie Tampering & Privilege Escalation"
# ────────────────────────────────────────────────────────────────

# Tampered / invalid role values
check "Invalid role 'superuser' → /admin blocked"         "ceygo_role=superuser" "/admin"      307 "/signin"
check "Invalid role 'root' → /dashboard blocked"          "ceygo_role=root"      "/dashboard"  307 "/signin"
check "Empty role cookie → /admin blocked"                "ceygo_role="          "/admin"      307 "/admin-loging"
check "Whitespace role → /dashboard blocked"              "ceygo_role= "         "/dashboard"  307 "/signin"

# Role escalation: traveler cookie trying admin routes
check "Traveler cookie → /admin blocked (escalation)"     "ceygo_role=traveler"  "/admin"      307 "/dashboard"
check "Traveler cookie → /usermanagement blocked"         "ceygo_role=traveler"  "/usermanagement" 307 "/dashboard"
check "Traveler cookie → /verification blocked"           "ceygo_role=traveler"  "/verification" 307 "/dashboard"

# Partner cookie trying admin routes
check "Partner cookie → /admin blocked (escalation)"      "ceygo_role=partner"   "/admin"      307 "/partnerdashboard"
check "Partner cookie → /usermanagement blocked"          "ceygo_role=partner"   "/usermanagement" 307 "/partnerdashboard"

# ────────────────────────────────────────────────────────────────
cyan "\n[7] SECURITY — Path Traversal & URL Manipulation"
# ────────────────────────────────────────────────────────────────

# Path traversal attempts
r=$(req "ceygo_role=traveler" "/dashboard/../admin")
code="${r%%:*}"
if [[ "$code" != "200" ]] || [[ "${r#*:}" == *"/admin"* ]]; then
  pass "Path traversal /dashboard/../admin blocked (got $code)"
else
  fail "Path traversal /dashboard/../admin NOT blocked — got $code"
fi

r=$(req "" "/admin%2F..%2Fsignin")
code="${r%%:*}"
[[ "$code" != "200" ]] && pass "URL-encoded traversal /admin%2F..%2Fsignin → $code" || fail "URL-encoded traversal reached page (200)"

# Sub-path: admin sub-routes are passed through middleware (404 = page missing, not blocked)
r=$(req "ceygo_role=admin" "/admin/anypath")
code="${r%%:*}"
[[ "$code" != "307" ]] && pass "Admin sub-path /admin/anypath not blocked by middleware (got $code)" \
                        || fail "Admin sub-path /admin/anypath wrongly blocked → 307"
check "Admin sub-path /admin/anypath blocked for traveler"  "ceygo_role=traveler" "/admin/anypath" 307 "/dashboard"
check "Admin sub-path /admin/anypath blocked for partner"   "ceygo_role=partner"  "/admin/anypath" 307 "/partnerdashboard"

# ────────────────────────────────────────────────────────────────
cyan "\n[8] SECURITY — Open Redirect in OAuth Callback"
# ────────────────────────────────────────────────────────────────

# Callback without code → should redirect to /signin, not reflect a user-supplied URL
r=$(req "" "/api/auth/callback")
dest="${r#*:}"
if [[ "$dest" == "/signin"* ]]; then
  pass "OAuth callback without code → /signin (no open redirect)"
else
  fail "OAuth callback without code → $dest (possible open redirect?)"
fi

# role param with unexpected value — should still land on a known path
r=$(req "" "/api/auth/callback?code=fake&role=../../../../etc/passwd")
dest="${r#*:}"
if [[ "$dest" != *"etc/passwd"* ]]; then
  pass "OAuth callback role param path injection blocked → $dest"
else
  fail "OAuth callback role param reflected path → $dest"
fi

# ────────────────────────────────────────────────────────────────
cyan "\n[9] SECURITY — Known Vulnerability Findings (Code Review)"
# ────────────────────────────────────────────────────────────────
echo ""
yellow "  ── Static Analysis Findings ───────────────────────────"

warn "CRIT (dev-only)  DEV_BYPASS: hardcoded creds in source code"
echo "       admin@gmail.com:admin12345678, travaller@gmail.com:travaller12345678"
echo "       partner@gmail.com:partner12345678 — commit these and attackers"
echo "       can log in as any role. Remove before production deploy."

warn "HIGH (if deployed) NEXT_PUBLIC_DEV_BYPASS=true in .env.local"
echo "       If this env var is deployed to production the entire middleware"
echo "       auth check is bypassed. Must NOT be set in prod."

warn "HIGH  ceygo_role cookie is NOT HttpOnly"
echo "       Set via document.cookie in JS → readable by any script on the page."
echo "       An XSS payload could steal it. Fix: set cookie server-side with HttpOnly."

warn "MED   OAuth role injection via /api/auth/callback?role=admin"
echo "       If a new Google-OAuth user has no profile row yet, hintRole from the URL"
echo "       is used as their role. An attacker can register with Google and pass"
echo "       ?role=admin to get admin access. Fix: reject unknown roles from URL,"
echo "       always default to 'traveler' for new profiles."

warn "MED   Login reveals account role on wrong-role error"
echo "       'This account is registered as a {role}' leaks role info to any"
echo "       user who knows a valid email. Replace with a generic message."

warn "MED   No rate limiting on login endpoints"
echo "       /signin and /admin-loging have no brute-force protection."
echo "       Add Supabase Auth rate limits or a middleware request limiter."

warn "LOW   Admin login page at /admin-loging (typo, guessable)"
echo "       Security through obscurity only. Rename + add CAPTCHA for production."

warn "LOW   Password minimum is 5 characters (signin page)"
echo "       Line 69 of signin/page.tsx checks length < 5. Should be >= 8."

echo ""

# ────────────────────────────────────────────────────────────────
# Summary
# ────────────────────────────────────────────────────────────────
total=$((PASS + FAIL))
echo ""
cyan "════════════════════════════════════════════════════════"
echo "  Automated checks:  $PASS/$total passed  |  $FAIL failed"
echo "  Code-review warnings: $WARN items"
cyan "════════════════════════════════════════════════════════"
echo ""

[[ $FAIL -gt 0 ]] && exit 1 || exit 0
