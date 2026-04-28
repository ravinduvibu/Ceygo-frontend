import urllib.request
import json
import traceback

req = urllib.request.Request(
    'http://127.0.0.1:8000/api/predict-custom',
    data=json.dumps({"year": 2026, "month": 8}).encode('utf-8'),
    headers={'Content-Type': 'application/json'},
    method='POST'
)

try:
    with urllib.request.urlopen(req) as response:
        print("Status:", response.status)
        print("Body:", response.read().decode('utf-8'))
except Exception as e:
    print("API is not reachable:", e)
    traceback.print_exc()
