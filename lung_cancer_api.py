import pandas as pd
from joblib import load
from flask import Flask, request, jsonify
from flask_cors import CORS
from category_encoders import BinaryEncoder

# Load the model
model = load('decision_tree_model.joblib')

# import the dataset
x = pd.read_csv('updated_survey_lung_cancer.csv')

categorycal_features = ['GENDER']
encoder = BinaryEncoder()
x_encoded = encoder.fit_transform(x[categorycal_features])

api = Flask(__name__)
CORS(api)

@api.route('/api/lung_cancer_prediction', methods=['POST'])
def predict_heart_failure():
    #get the request data from the client
    data = request.json['inputs']
    input_df = pd.DataFrame(data)
    input_encoded = encoder.transform(input_df[categorycal_features])
    input_df = input_df.drop(categorycal_features, axis=1)
    input_encoded = input_encoded.reset_index(drop=True)

    final_input = pd.concat([input_df, input_encoded], axis=1)

    prediction = model.predict_proba(final_input)
    class_labels = model.classes_

    response = []
    for prob in prediction:
        prob_dict ={}
        for k, v in zip(class_labels, prob):
            prob_dict[str(k)] = round(float(v)* 100, 2)
        response.append(prob_dict)

    return jsonify({f"Prediction": prediction.tolist()})

if __name__ == '__main__':
    api.run(port=8000)

