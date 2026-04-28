import pickle
import pandas as pd
import math
import sys

try:
    with open(r'C:\Users\Tharinda\Desktop\ai\sarima_monthly_model.pkl', 'rb') as file:
        model = pickle.load(file)

    year = 2026
    month = 8

    last_training_date = pd.to_datetime('2023-12-01')
    target_date = pd.to_datetime(f"{year}-{month:02d}-01")
    
    months_ahead = (target_date.year - last_training_date.year) * 12 + (target_date.month - last_training_date.month)
    months_ahead_dec = (year - last_training_date.year) * 12 + (12 - last_training_date.month)

    print(f"Months ahead for target: {months_ahead}")
    print(f"Months ahead for dec: {months_ahead_dec}")

    forecast = model.predict(n_periods=months_ahead_dec)
    forecast_list = list(forecast)
    print(f"Forecast length: {len(forecast_list)}")
    print(f"Prediction for target: {forecast_list[months_ahead - 1]}")
except Exception as e:
    print(f"ERROR: {e}")
