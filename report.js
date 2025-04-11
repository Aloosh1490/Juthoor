async function sendToChatAI() {
    const rawResult = localStorage.getItem('document_result');
    if (!rawResult) {
      document.getElementById('resultText').innerText = 'لم يتم العثور على تقرير.';
      return;
    }
  
    const result = JSON.parse(rawResult);
  
    const prompt = `أنت خبير متخصص في تحليل التقارير الجينية وتقديم توصيات شخصية لرياضات مناسبة، بشرط أن تكون هذه الرياضات متوفرة في السعودية. سيتم تزويدك بتقرير جيني يحتوي على معلومات عن البنية الجسدية، القوة العضلية، قدرة التحمل، المرونة، والاستجابة للتمارين الهوائية وتمارين القوة.\n\nمهمتك:\n- استخرج بيانات المريض من التقرير.\n- رشّح أفضل ثلاث رياضات مناسبة لجسمه وجيناته، بشرط أن تكون هذه الرياضات متوفرة في السعودية.\n- فسّر سبب ترشيح كل رياضة.\n- في النهاية، اعرض ملخص بيانات المريض كما استخرجتها من التقرير.\n\nإليك التقرير:\n${JSON.stringify(result)}`;
  
    try {
      const response = await fetch('https://Akhle-m9alb72m-eastus2.services.ai.azure.com/models/chat/completions?api-version=2024-05-01-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': '5Mo8GOQN8D87CgsVz88S1Pq2MePPZczx0PmfS3e0ZePFBLYzcsP5JQQJ99BDACHYHv6XJ3w3AAAAACOGGokZ'
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "أنت مساعد طبي متخصص في تحليل التقارير الجينية الخاصة باللياقة البدنية"
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 1000,
          model: "gpt-4o"
        })
      });
  
      if (!response.ok) {
        const err = await response.text();
        throw new Error(`API Error: ${response.status}\n${err}`);
      }
  
      const data = await response.json();
      const message = data.choices?.[0]?.message?.content || "لم يتم استلام رد من الذكاء الاصطناعي.";
      document.getElementById('resultText').innerText = message;
  
    } catch (err) {
      console.error("Error details:", err);
      alert("تفاصيل الخطأ: " + err.message);
      document.getElementById('resultText').innerText = 'حدث خطأ أثناء تحليل البيانات.';
    }
  }
  
  // شغّل الدالة تلقائيًا أول ما الصفحة تفتح
  sendToChatAI();