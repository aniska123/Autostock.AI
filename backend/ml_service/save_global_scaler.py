import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import joblib
import os

# ✅ Replace with the full training data you used for model training
df = pd.read_csv("C:/Users/nayak/AutoStock.AI/data/train.csv")


# Add time-based features
df["date"] = pd.to_datetime(df["date"])
df["day_of_week"] = df["date"].dt.dayofweek
df["month"] = df["date"].dt.month

# Keep only these 4 features used in training
features = ["sales", "onpromotion", "day_of_week", "month"]
df = df[features]

# Fit global scaler
scaler = MinMaxScaler()
scaler.fit(df)

# Save the scaler
model_dir = os.path.join("backend", "ml_service", "model")
os.makedirs(model_dir, exist_ok=True)

joblib.dump(scaler, os.path.join(model_dir, "global_scaler.pkl"))
print("✅ Saved global_scaler.pkl at:", os.path.join(model_dir, "global_scaler.pkl"))
