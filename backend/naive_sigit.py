# %% [markdown]
# # Train Naive Bayes Model - Wine Quality
# File ini siap dikonversi menjadi .ipynb menggunakan Jupytext

# %%
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.naive_bayes import GaussianNB
import os

import json

# %% [markdown]
# ## Load Dataset

# %%
df = pd.read_csv("dataset/WineQT.csv")
df = df.drop(columns=["Id"])  # Hapus kolom ID

df.head()

# %% [markdown]
# ## Pisahkan Fitur & Label

# %%
X = df.drop(columns=["quality"])
y = df["quality"]

X.head()a

# %% [markdown]
# ## Split Dataset Train & Test

# %%
x_train, x_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, shuffle=True
)

# %% [markdown]
# ## Train Model Gaussian Naive Bayes

# %%
model = GaussianNB()
model.fit(x_train, y_train)

# Save model
os.makedirs("model", exist_ok=True)
joblib.dump(model, "model/naive_bayes_wine.pkl")
print("Model saved as model/naive_bayes_wine.pkl")

# %% [markdown]
# ## Evaluasi Model

# %%
y_pred = model.predict(x_test)
akurasi = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred, output_dict=True)



print("Akurasi:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))

# %% [markdown]
# ## Contoh Prediksi Manual

# %%
sample = np.array([[7.0, 0.27, 0.36, 20.7, 0.045, 45.0, 170.0, 1.001, 3.0, 0.45, 8.8]])
manual_pred = model.predict(sample)[0]

manual_pred


with open("model/accuracy.json", "w") as f:
    json.dump({
        "accuracy": akurasi,
        "report": report
    }, f, indent=4)

print("Akurasi & report saved to model/accuracy.json")
