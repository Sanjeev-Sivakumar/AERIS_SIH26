"""
AERIS — Comprehensive API Key Validation Suite
Validates all 5 configured services:
1. Google Gemini AI API (Real-time Citizen & School Safety Guidance)
2. NASA FIRMS (VIIRS Satellite Stubble Fire Detection)
3. OpenAQ v3 API (Continuous Ambient Air Quality Telemetry)
4. Copernicus Climate Data Store (Atmospheric Boundary Layer Physics)
5. Gmail SMTP Service (Instant Citizen Email Alerts)
"""

import os
import sys
import time
import json
import smtplib
import requests
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from config.settings import settings


def test_gemini_ai():
    print("\n" + "=" * 65)
    print("1. Google Gemini Generative AI (GENAI_API_KEY)")
    print("=" * 65)
    key = settings.GENAI_API_KEY
    if not key:
        print("[-] FAILED: GENAI_API_KEY is not configured.")
        return False, "Not configured"

    masked = f"{key[:8]}...{key[-6:]}"
    print(f"[*] Testing Gemini Key: {masked} (length: {len(key)})")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key={key}"
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": (
                            "You are AERIS Air Quality AI. In 2 concise sentences, "
                            "explain what actions a citizen should take during a severe winter smog episode in Delhi."
                        )
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 200
        }
    }

    t0 = time.time()
    try:
        resp = requests.post(url, json=payload, timeout=12)
        elapsed = time.time() - t0
        print(f"[*] Response Status: HTTP {resp.status_code} ({elapsed:.2f}s)")

        if resp.status_code == 200:
            data = resp.json()
            candidates = data.get("candidates", [])
            if candidates:
                text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "").strip()
                print(f"[+] Output Preview:\n    \"{text}\"")
                print(f"[+] Result: SUCCESS (Gemini AI live generation verified in {elapsed:.2f}s)")
                return True, f"Working ({elapsed:.2f}s response time)"
            else:
                return False, "No candidates returned"
        else:
            print(f"[-] FAILED (HTTP {resp.status_code}): {resp.text[:200]}")
            return False, f"HTTP {resp.status_code}"
    except Exception as e:
        print(f"[-] Request Error: {e}")
        return False, str(e)


def test_nasa_firms():
    print("\n" + "=" * 65)
    print("2. NASA FIRMS VIIRS Stubble Fire API (FIRMS_MAP_KEY)")
    print("=" * 65)
    key = settings.FIRMS_MAP_KEY
    if not key:
        print("[-] FAILED: FIRMS_MAP_KEY is not configured.")
        return False, "Not configured"

    masked = f"{key[:6]}...{key[-4:]}"
    print(f"[*] Testing NASA MAP Key: {masked} (length: {len(key)})")

    url = f"https://firms.modaps.eosdis.nasa.gov/api/area/csv/{key}/VIIRS_SNPP_NRT/73.5,27.0,78.5,32.5/1"
    t0 = time.time()
    try:
        resp = requests.get(url, timeout=20)
        elapsed = time.time() - t0
        print(f"[*] Response Status: HTTP {resp.status_code} ({elapsed:.2f}s)")

        if resp.status_code == 200:
            text = resp.text.strip()
            if "Invalid Map Key" in text or "error" in text.lower():
                print(f"[-] FAILED: NASA returned error message:\n    {text[:200]}")
                return False, "Invalid Map Key"
            lines = text.splitlines()
            fire_count = max(0, len(lines) - 1)
            print(f"[+] Active Fire Points Detected in Indo-Gangetic Plains: {fire_count}")
            if fire_count > 0:
                print(f"[+] Sample Fire Record: {lines[1]}")
            print(f"[+] Result: SUCCESS (NASA FIRMS satellite feed active)")
            return True, f"Working ({fire_count} fires detected)"
        else:
            return False, f"HTTP {resp.status_code}"
    except Exception as e:
        print(f"[-] Request Error: {e}")
        return False, str(e)


def test_openaq():
    print("\n" + "=" * 65)
    print("3. OpenAQ v3 Sensor Network API (OPENAQ_API_KEY)")
    print("=" * 65)
    key = settings.OPENAQ_API_KEY
    if not key:
        print("[-] FAILED: OPENAQ_API_KEY is not configured.")
        return False, "Not configured"

    masked = f"{key[:6]}...{key[-4:]}"
    print(f"[*] Testing OpenAQ Key: {masked} (length: {len(key)})")

    url = "https://api.openaq.org/v3/locations"
    headers = {"X-API-Key": key}
    params = {"limit": 3}
    t0 = time.time()
    try:
        resp = requests.get(url, headers=headers, params=params, timeout=20)
        elapsed = time.time() - t0
        print(f"[*] Response Status: HTTP {resp.status_code} ({elapsed:.2f}s)")

        if resp.status_code == 200:
            data = resp.json()
            locations = data.get("results", [])
            print(f"[+] Retrieved {len(locations)} monitoring stations worldwide")
            for loc in locations[:2]:
                print(f"    - Station: {loc.get('name')} | Country: {loc.get('country', {}).get('name')}")
            print(f"[+] Result: SUCCESS (OpenAQ v3 API validated)")
            return True, f"Working ({len(locations)} stations retrieved)"
        else:
            return False, f"HTTP {resp.status_code}"
    except Exception as e:
        print(f"[-] Request Error: {e}")
        return False, str(e)


def test_copernicus_cds():
    print("\n" + "=" * 65)
    print("4. Copernicus Climate Data Store API (CDS_API_KEY)")
    print("=" * 65)
    key = settings.CDS_API_KEY
    if not key:
        print("[-] FAILED: CDS_API_KEY is not configured.")
        return False, "Not configured"

    masked = f"{key[:6]}...{key[-4:]}"
    print(f"[*] Testing CDS Key: {masked} (length: {len(key)})")

    url = "https://cds.climate.copernicus.eu/api/catalogue/v1/datasets?limit=1"
    headers = {"PRIVATE-TOKEN": key}
    t0 = time.time()
    try:
        resp = requests.get(url, headers=headers, timeout=20)
        elapsed = time.time() - t0
        print(f"[*] Response Status: HTTP {resp.status_code} ({elapsed:.2f}s)")

        if resp.status_code in (200, 201):
            print("[+] Result: SUCCESS (Copernicus CDS authenticated successfully)")
            return True, "Working (Authenticated HTTP 200)"
        else:
            return False, f"HTTP {resp.status_code}"
    except Exception as e:
        print(f"[-] Request Error: {e}")
        return False, str(e)


def test_smtp_alerts():
    print("\n" + "=" * 65)
    print("5. Gmail SMTP Citizen Alert Service (EMAIL_ADDRESS & EMAIL_PASSWORD)")
    print("=" * 65)
    email = settings.EMAIL_ADDRESS
    password = settings.EMAIL_PASSWORD
    host = settings.SMTP_HOST or "smtp.gmail.com"
    port = settings.SMTP_PORT or 587

    if not email or not password:
        print("[-] FAILED: SMTP credentials not configured.")
        return False, "Not configured"

    print(f"[*] Testing Host: {host}:{port}")
    print(f"[*] Sender Address: {email}")

    t0 = time.time()
    try:
        server = smtplib.SMTP(host, port, timeout=12)
        server.starttls()
        server.login(email, password)
        elapsed = time.time() - t0
        server.quit()
        print(f"[+] TLS handshake and authentication succeeded in {elapsed:.2f}s")
        print("[+] Result: SUCCESS (Email notification gateway verified)")
        return True, f"Working ({elapsed:.2f}s auth)"
    except Exception as e:
        print(f"[-] SMTP Error: {e}")
        return False, str(e)


def main():
    print("=" * 65)
    print("AERIS MULTI-SOURCE API & CREDENTIAL VERIFICATION SUITE")
    print("=" * 65)

    results = {}
    results["Google Gemini Generative AI"] = test_gemini_ai()
    results["NASA FIRMS Satellite Active Fires"] = test_nasa_firms()
    results["OpenAQ v3 Continuous Air Quality"] = test_openaq()
    results["Copernicus Climate Data Store"] = test_copernicus_cds()
    results["Gmail SMTP Citizen Alert Service"] = test_smtp_alerts()

    print("\n" + "=" * 65)
    print("FINAL SUMMARY AUDIT REPORT")
    print("=" * 65)
    all_passed = True
    for service, (status, detail) in results.items():
        tag = "[PASSED]" if status else "[FAILED]"
        print(f"{service:38} {tag:>10} -> {detail}")
        if not status:
            all_passed = False

    print("=" * 65)
    if all_passed:
        print("ALL 5 EXTERNAL APIS & INTEGRATION KEYS ARE 100% OPERATIONAL!")
    else:
        print("SOME KEYS REQUIRE ATTENTION. CHECK LOGS ABOVE.")
    print("=" * 65)


if __name__ == "__main__":
    main()
