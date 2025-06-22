import requests
from datetime import datetime, timedelta
import random

url = "http://127.0.0.1:5000/predict-sales"

# Generate 30 days of dummy data
historical_data = []
start_date = datetime.strptime("2017-01-01", "%Y-%m-%d")

for i in range(30):
    date = (start_date + timedelta(days=i)).strftime("%Y-%m-%d")
    sales = random.randint(80, 150)
    onpromotion = random.randint(0, 1)
    day_of_week = (start_date + timedelta(days=i)).weekday()
    month = (start_date + timedelta(days=i)).month
    historical_data.append({
        "date": date,
        "sales": sales,
        "onpromotion": onpromotion,
        "day_of_week": day_of_week,
        "month": month
    })

# ✅ Wrapped in "data" list
payload = {
    "data": [
        {
            "store_nbr": 1,
            "family": "BEVERAGES",
            "historical_data": historical_data
        }
    ]
}

response = requests.post(url, json=payload)

try:
    print(response.json())
except Exception as e:
    print("❌ Failed to decode response:", response.text)
