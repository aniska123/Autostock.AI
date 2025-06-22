import numpy as np
import pandas as pd
from tensorflow import keras
import joblib

# Load model and global scaler ONCE at module level
model = keras.models.load_model("backend/ml_service/model/lstm_refined_model.h5")
scaler = joblib.load("backend/ml_service/model/global_scaler.pkl")  # Must be created and saved

def preprocess_input(df):
    df = df.copy()
    df["date"] = pd.to_datetime(df["date"])
    df.sort_values("date", inplace=True)

    # Create time-based features
    df["day_of_week"] = df["date"].dt.dayofweek
    df["month"] = df["date"].dt.month

    # Select relevant features
    features = ["sales", "onpromotion", "day_of_week", "month"]
    df = df[features]

    # If less than 30 days of data, pad with zeros at the top
    if df.shape[0] < 30:
        padding_rows = 30 - df.shape[0]
        pad_df = pd.DataFrame(np.zeros((padding_rows, len(features))), columns=features)
        df = pd.concat([pad_df, df], ignore_index=True)
    else:
        df = df[-30:]  # keep only last 30 days

    # Use the global scaler (already loaded)
    scaled = scaler.transform(df)
    X_input = np.expand_dims(scaled, axis=0)  # shape: (1, 30, 4)
    return X_input


def predict_sales(df):
    try:
        X_input = preprocess_input(df)
        prediction = model.predict(X_input)  # shape: (1, 1)

        print(f"🔹 Raw model prediction (normalized): {prediction}")

        # Pad prediction with 3 zeros to match scaler.inverse_transform shape (1, 4)
        padded_pred = np.hstack([prediction, np.zeros((1, 3))])
        print(f"🔹 Padded prediction for inverse_transform: {padded_pred}")

        predicted_sales = scaler.inverse_transform(padded_pred)[:, 0]
        print(f"✅ Inversed predicted sales (real scale): {predicted_sales}")

        return predicted_sales.tolist()

    except Exception as e:
        print(f"❌ Prediction error: {str(e)}")
        return [f"Prediction error: {str(e)}"]
