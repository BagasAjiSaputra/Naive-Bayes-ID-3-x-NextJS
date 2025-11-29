import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB

# ==============================
# Load Dataset
# ==============================
df = pd.read_csv("/dataset/wineqt.csv")

# Asumsi kolom terakhir adalah label (quality)
X = df.iloc[:, :-1]   # semua kolom kecuali label
y = df.iloc[:, -1]    # kolom terakhir sebagai target

# ==============================
# Train-Test Split
# ==============================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ==============================
# Model Naive Bayes
# ==============================
nb = GaussianNB()
nb.fit(X_train, y_train)

# ==============================
# Fungsi Prediksi untuk Flask
# ==============================
def predict_quality(payload: dict):
    """
    payload = {
        "fixed_acidity": ...,
        "volatile_acidity": ...,
        "citric_acid": ...,
        ...
    }
    """
    # Ubah payload ke urutan kolom dataset
    input_data = pd.DataFrame([payload], columns=X.columns)

    pred = nb.predict(input_data)[0]
    prob = nb.predict_proba(input_data)[0]

    return {
        "prediction": int(pred),
        "probability": prob.tolist()
    }
