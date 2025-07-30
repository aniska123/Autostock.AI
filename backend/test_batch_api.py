import requests
import pandas as pd
import os

url = "http://127.0.0.1:5000/predict-sales"

payload = {
    "data": [
        {
            "store_nbr": 1,
            "family": "BEVERAGES",
            "historical_data": [
                {"date": "2017-01-01", "sales": 100, "onpromotion": 0, "day_of_week": 6, "month": 1},
                {"date": "2017-01-02", "sales": 105, "onpromotion": 0, "day_of_week": 0, "month": 1},
                {"date": "2017-01-03", "sales": 98, "onpromotion": 1, "day_of_week": 1, "month": 1},
                # add up to 30
            ]
        },
        {
            "store_nbr": 2,
            "family": "DAIRY",
            "historical_data": [
                {"date": "2017-01-01", "sales": 90, "onpromotion": 1, "day_of_week": 6, "month": 1},
                {"date": "2017-01-02", "sales": 95, "onpromotion": 0, "day_of_week": 0, "month": 1},
                {"date": "2017-01-03", "sales": 92, "onpromotion": 1, "day_of_week": 1, "month": 1},
                # add up to 30
            ]
        }
    ]
}

response = requests.post(url, json=payload)

output_path = os.path.join("C:/Users/nayak/AutoStock.AI/data", "batch_predictions.csv")

try:
    result = response.json()
    df = pd.DataFrame(result["results"])
    df["predicted_sales"] = df["predicted_sales"].apply(lambda x: x[0])  # flatten
    df.to_csv(output_path, index=False)
    print(f"✅ Predictions saved to {output_path}")
except Exception as e:
    print("❌ Failed to decode JSON response.")
    print("Response text:", response.text)
