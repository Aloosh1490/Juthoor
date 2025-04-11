
const form = document.getElementById('uploadForm');
const fileInput = document.getElementById('pdfFile');

form.addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const file = fileInput.files[0];
    if (!file) {
      alert("Please upload a PDF file.");
      return;
    }
  
    try {
      const response = await fetch('https://doc-non-free.cognitiveservices.azure.com/documentintelligence/documentModels/prebuilt-layout:analyze?_overload=analyzeDocument&api-version=2024-11-30', {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': '1wrz6LE2aT8bfRChWo7D0xwTYfSwnjbWu63jZqRR6kfyYOW3rC0cJQQJ99BDACYeBjFXJ3w3AAALACOGqtU1',
          'Content-Type': 'application/pdf'
        },
        body: file
      });
  
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Upload failed: ${response.status}\n${errText}`);
      }
  
      const operationLocation = response.headers.get("operation-location");
      if (!operationLocation) {
        throw new Error("No operation-location header returned!");
      }
  
      // استنى لحد ما التحليل يخلص (ممكن يستغرق ثواني)
      await new Promise(res => setTimeout(res, 3000));
  
      const resultResponse = await fetch(operationLocation, {
        headers: {
          'Ocp-Apim-Subscription-Key': '1wrz6LE2aT8bfRChWo7D0xwTYfSwnjbWu63jZqRR6kfyYOW3rC0cJQQJ99BDACYeBjFXJ3w3AAALACOGqtU1',
        }
      });
  
      const result = await resultResponse.json();
      console.log(result);
      alert("PDF processed successfully! Check console for results.");
  
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Check the console.");
    }
  });
  