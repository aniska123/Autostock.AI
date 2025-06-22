from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS
from ml_service.predict import predict_sales

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def home():
    return "<h3>✅ AutoStock.AI API is up</h3>"

@app.route("/predict-sales", methods=["POST"])
def predict_batch():
    try:
        data = request.get_json()
        results = []
        for entry in data["data"]:
            store = entry["store_nbr"]
            family = entry["family"]
            df = pd.DataFrame(entry["historical_data"])
            preds = predict_sales(df)
            val = round(float(preds[0]), 2)
            cs = 10000
            thr = round(0.75 * val, 2)
            status = "✅ Restock Needed" if cs < thr else "Stock Sufficient"
            results.append({
                "store": store, "family": family,
                "predicted_sales": val,
                "current_stock": cs, "threshold": thr,
                "restock": status
            })
        return jsonify({"results": results})
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route("/save-predictions", methods=["POST"])
def save_predictions():
    preds = request.get_json().get("results", [])
    if not preds:
        return jsonify({"message": "No data"}), 400
    pd.DataFrame(preds).to_csv("data/batch_predictions.csv", index=False)
    return jsonify({"message": "Saved"}), 200

@app.route("/download-predictions", methods=["GET"])
def download_csv():
    try:
        df = pd.read_csv("data/batch_predictions.csv")
        return df.to_csv(index=False), 200, {
            "Content-Type": "text/csv",
            "Content-Disposition": "attachment; filename=batch_predictions.csv"
        }
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
