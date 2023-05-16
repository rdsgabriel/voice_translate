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
          const textarea = document.querySelector('textarea');
          const currentValue = textarea.value
           textarea.value = `${currentValue ? `${currentValue}\n` : ''}${translatedText}`;

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
      startButton.innerHTML = '<svg style="color: red" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-mic" viewBox="0 0 16 16"> <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z" fill="red"></path> <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z" fill="red"></path> </svg>'
      startButton.classList.add('bg-white')
      startButton.classList.add('animate-bounce')
      recognition.start()
  })


  recognition.onend = (e) => {
    startButton.classList.remove('bg-white')
    startButton.classList.remove('animate-bounce')
    startButton.innerHTML = 'Start'
  }


