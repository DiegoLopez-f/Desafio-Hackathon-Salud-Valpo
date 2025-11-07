from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
from typing import List, Optional
import os

# ============================================
# CONFIGURACIÓN
# ============================================
MODEL_PATH = os.getenv("MODEL_PATH", "./models/tu_modelo.pkl")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

# ============================================
# CREAR APP
# ============================================
app = FastAPI(title="ML API Simple", version="1.0")

# Configurar CORS para Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Variable global para el modelo
model = None

# ============================================
# SCHEMAS
# ============================================
class PredictionInput(BaseModel):
    features: List[float]
    user_id: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "features": [1.5, 2.3, 4.1, 0.8],
                "user_id": "user123"
            }
        }

class PredictionOutput(BaseModel):
    prediction: float | int | list
    probability: Optional[float] = None

# ============================================
# CARGAR MODELO AL INICIO
# ============================================
@app.on_event("startup")
def load_model():
    global model
    try:
        model = joblib.load(MODEL_PATH)
        print(f"✓ Modelo cargado desde: {MODEL_PATH}")
    except Exception as e:
        print(f"✗ Error cargando modelo: {e}")
        print("⚠ La API seguirá funcionando pero /predict fallará")

# ============================================
# ENDPOINTS
# ============================================

@app.get("/")
def root():
    """Endpoint raíz"""
    return {
        "message": "ML API funcionando",
        "model_loaded": model is not None,
        "docs": "/docs"
    }

@app.get("/health")
def health():
    """Health check"""
    if model is None:
        raise HTTPException(status_code=503, detail="Modelo no cargado")
    return {"status": "ok", "model_loaded": True}

@app.post("/predict", response_model=PredictionOutput)
def predict(data: PredictionInput):
    """Endpoint principal de predicción"""

    if model is None:
        raise HTTPException(status_code=503, detail="Modelo no disponible")

    try:
        # Convertir features a numpy array
        X = np.array(data.features).reshape(1, -1)

        # Hacer predicción
        prediction = model.predict(X)[0]

        # Intentar obtener probabilidad si el modelo lo soporta
        probability = None
        if hasattr(model, 'predict_proba'):
            proba = model.predict_proba(X)[0]
            probability = float(max(proba))

        # Convertir a tipo Python nativo
        if isinstance(prediction, np.ndarray):
            prediction = prediction.tolist()
        elif isinstance(prediction, (np.int32, np.int64)):
            prediction = int(prediction)
        elif isinstance(prediction, (np.float32, np.float64)):
            prediction = float(prediction)

        return {
            "prediction": prediction,
            "probability": probability
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en predicción: {str(e)}")

# ============================================
# EJECUTAR
# ============================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)