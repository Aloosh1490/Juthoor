
const form = document.getElementById('uploadForm');
const fileInput = document.getElementById('pdfFile');
const statusDiv = document.getElementById('uploadStatus');

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    statusDiv.innerHTML = '<p class="loading">جاري معالجة الملف...</p>';
    
    const file = fileInput.files[0];
    if (!file) {
        showUploadError("يرجى اختيار ملف PDF");
        return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB حد أقصى
        showUploadError("حجم الملف كبير جداً (الحد الأقصى 50MB)");
        return;
    }

    try {
        // الخطوة 1: رفع الملف وتحليله
        const analyzeResponse = await fetch('https://doc-non-free.cognitiveservices.azure.com/documentintelligence/documentModels/prebuilt-layout:analyze?api-version=2024-11-30', {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': '1wrz6LE2aT8bfRChWo7D0xwTYfSwnjbWu63jZqRR6kfyYOW3rC0cJQQJ99BDACYeBjFXJ3w3AAALACOGqtU1',
                'Content-Type': 'application/pdf'
            },
            body: file
        });

        if (!analyzeResponse.ok) {
            const error = await analyzeResponse.json();
            throw new Error(error.error?.message || 'فشل في تحليل الملف');
        }

        // الخطوة 2: جلب نتيجة التحليل
        const operationLocation = analyzeResponse.headers.get('operation-location');
        if (!operationLocation) {
            throw new Error('لا يوجد رابط لمتابعة التحليل');
        }

        const result = await getAnalysisResult(operationLocation);
        console.log(result.analyzeResult.content);
        
        // الخطوة 3: حفظ النتيجة والانتقال
        localStorage.setItem('document_result', JSON.stringify(result.analyzeResult.content));
        window.location.href = 'report.html';

    } catch (error) {
        console.error('Error:', error);
        showUploadError(`حدث خطأ: ${error.message}`);
    }
});

async function getAnalysisResult(operationUrl) {
    let attempts = 0;
    const maxAttempts = 10;
    const delay = 2000; // 2 ثانية بين المحاولات

    while (attempts < maxAttempts) {
        attempts++;
        await new Promise(resolve => setTimeout(resolve, delay));

        const response = await fetch(operationUrl, {
            headers: {
                'Ocp-Apim-Subscription-Key': '1wrz6LE2aT8bfRChWo7D0xwTYfSwnjbWu63jZqRR6kfyYOW3rC0cJQQJ99BDACYeBjFXJ3w3AAALACOGqtU1'
            }
        });

        const result = await response.json();
        
        if (result.status === 'succeeded') {
            return result;
        } else if (result.status === 'failed') {
            throw new Error(result.error?.message || 'فشل التحليل');
        }
    }

    throw new Error('انتهت المحاولات دون الحصول على نتيجة');
}

function showUploadError(message) {
    statusDiv.innerHTML = `<p class="error">${message}</p>`;
}