document.getElementById('predictionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    document.getElementById('loading').style.display = 'block';
    document.getElementById('result').style.display = 'none';
  
    const formData = {
        "GENDER": document.getElementById('gender').value,
        "AGE": parseInt(document.getElementById('age').value),
        "SMOKING": parseInt(document.getElementById('smoking').value),
        "YELLOW_FINGERS": parseInt(document.getElementById('yellow_fingers').value),
        "ANXIETY": parseInt(document.getElementById('anxiety').value),
        "PEER_PRESSURE": parseInt(document.getElementById('peer_pressure').value),
        "CHRONIC DISEASE": parseInt(document.getElementById('chronic_disease').value),
        "ALLERGY ": parseInt(document.getElementById('allergy').value),
        "WHEEZING": parseInt(document.getElementById('wheezing').value),
        "ALCOHOL CONSUMING": parseInt(document.getElementById('alcohol').value),
        "COUGHING": parseInt(document.getElementById('coughing').value),
        "SHORTNESS OF BREATH": parseInt(document.getElementById('shortness_of_breath').value),
        "SWALLOWING DIFFICULTY": parseInt(document.getElementById('swallowing_difficulty').value),
        "CHEST PAIN": parseInt(document.getElementById('chest_pain').value)
    };
    
    
    console.log("Form data being sent:", formData);
    
    const requestData = {
        inputs: [formData]
    };
    
    fetch('http://localhost:8000/api/lung_cancer_prediction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('loading').style.display = 'none';
        const resultDiv = document.getElementById('result');
        resultDiv.style.display = 'block';
        
        console.log("API response:", data);
        
        if (data && data.Prediction && data.Prediction[0]) {
            const prediction = data.Prediction[0];
            
            const noCancerProb = prediction[0];
            const cancerProb = prediction[1];
            
            resultDiv.innerHTML = `
                <h2>Prediction Results</h2>
                <p><strong>Probability of No Lung Cancer:</strong> ${(noCancerProb * 100).toFixed(2)}%</p>
                <p><strong>Probability of Lung Cancer:</strong> ${(cancerProb * 100).toFixed(2)}%</p>
                <div class="risk-message">
                    <p>${getRiskMessage(cancerProb * 100)}</p>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `
                <p style="color:red;">Unexpected response format from server.</p>
                <p>${JSON.stringify(data)}</p>
            `;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('result').style.display = 'block';
        document.getElementById('result').innerHTML = `
            <p style="color:red;">Error occurred while processing your request.</p>
            <p>${error.message}</p>
        `;
    });
});

function getRiskMessage(riskPercentage) {
    const risk = parseFloat(riskPercentage);
    if (risk < 10) {
        return "Your risk of lung cancer is very low. Maintain healthy habits!";
    } else if (risk < 30) {
        return "You have a moderate risk of lung cancer. Consider consulting a doctor.";
    } else if (risk < 50) {
        return "You have an elevated risk of lung cancer. Please consult a healthcare professional.";
    } else {
        return "You have a high risk of lung cancer. Please see a doctor as soon as possible.";
    }
}