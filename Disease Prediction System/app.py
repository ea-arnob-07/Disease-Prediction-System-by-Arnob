from fastapi import Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles


#________________load model_____________
import joblib

model = joblib.load("models/disease_model.pkl")
mlb = joblib.load("models/label_encoder.pkl")

print("Model loaded:", type(model))
print("Encoder loaded:", type(mlb))

#________________Configure ngrok________________
#from pyngrok import ngrok

#ngrok.set_auth_token("3F7ra1abv0Dwj895Wmi4uIri77t_4PSyBSkPbrBV1kf9TuuSS")



#*______________Create FastAPI app_____________
from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np

app = FastAPI(title="Disease Prediction API")

templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html"
    )

#________________Define request schema__________________
from pydantic import BaseModel
class Symptoms(BaseModel):
    Fever: int
    Cough: int
    Headache: int
    Fatigue: int
    Sore_Throat: int
    Runny_Nose: int
    Shortness_of_Breath: int
    Nausea: int
    Body_Ache: int
    Diarrhea: int



#___________________triage function______________
def triage(symptoms):

    fever = bool(symptoms.Fever)
    cough = bool(symptoms.Cough)
    headache = bool(symptoms.Headache)
    fatigue = bool(symptoms.Fatigue)
    sore_throat = bool(symptoms.Sore_Throat)
    runny_nose = bool(symptoms.Runny_Nose)
    shortness_of_breath = bool(symptoms.Shortness_of_Breath)
    nausea = bool(symptoms.Nausea)
    body_ache = bool(symptoms.Body_Ache)
    diarrhea = bool(symptoms.Diarrhea)

    if shortness_of_breath:
        return "HIGH RISK - Seek immediate medical attention"

    if fever and cough and fatigue and body_ache:
        return "MEDIUM-HIGH RISK - Consult a doctor"

    if fever and (headache or fatigue):
        return "MEDIUM RISK - Monitor and consider consultation"

    if runny_nose or sore_throat:
        return "LOW RISK - Home care may be sufficient"

    return "LOW RISK - Monitor symptoms"


#___________________Prediction endpoint______________
@app.post("/predict")
def predict(data: Symptoms):

    x = np.array([[
        data.Fever,
        data.Cough,
        data.Headache,
        data.Fatigue,
        data.Sore_Throat,
        data.Runny_Nose,
        data.Shortness_of_Breath,
        data.Nausea,
        data.Body_Ache,
        data.Diarrhea
    ]])

    pred = model.predict(x)

    diseases = mlb.inverse_transform(pred)[0]

    return {
        "possible_conditions": list(diseases),
        "urgency": triage(data)
    }


#__________________api start and ngrock tunnel_____________________
#import uvicorn
#from threading import Thread

#def run_api():
   # uvicorn.run(app, host="0.0.0.0", port=8000)

#Thread(target=run_api).start()


#public_url = ngrok.connect(8000)
#print(public_url.public_url)

