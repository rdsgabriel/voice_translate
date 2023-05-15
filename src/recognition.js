const recognition = new webkitSpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = 'pt-BR';

let lastText = '';
let timeoutId;

recognition.onresult = (event) => {
  const result = event.results[event.results.length - 1];
  const text = result[0].transcript;
  console.log(`Eu escutei: ${text}`);
  
  if (text !== lastText && text !== '') {
    lastText = text;

    // Se já houver um timeout em andamento, cancela
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Define um novo timeout para enviar a solicitação HTTP
    timeoutId = setTimeout(() => {
      const url = "https://api.mymemory.translated.net/get";
      const langpair = "pt|en";

      fetch(`${url}?q=${lastText}&langpair=${langpair}`)
        .then(response => response.json())
        .then(data => {
          const translatedText = data.responseData.translatedText;
          const createParagraph = document.createElement('h1');
          createParagraph.textContent = translatedText;
          document.body.appendChild(createParagraph);

          // Limpa o último texto e reinicia o reconhecimento de fala
          lastText = '';
          recognition.start();
        })
        .catch(error => console.log(error));
    }, 1000);
  }
};

recognition.onerror = (event) => {
  console.log(`Erro no reconhecimento de fala: ${event.error}`);
};


  const startButton = document.getElementById('start-button')

    startButton.addEventListener('click', () => {
      console.log('Reconhecimento de fala iniciado')
      recognition.start()
  })

  const stopButton = document.getElementById('stop-button')
  
     stopButton.addEventListener('click', () => {
      recognition.onend = () => {
        console.log('Reconhecimento de fala encerrado');
      }
  })



