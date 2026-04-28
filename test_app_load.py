import sys
import os

os.chdir(r"C:\Users\Tharinda\Desktop\ai")
sys.path.insert(0, r"C:\Users\Tharinda\Desktop\ai")
try:
    import app
    print("SUCCESS: app.py loaded without errors.")
except Exception as e:
    import traceback
    traceback.print_exc()
