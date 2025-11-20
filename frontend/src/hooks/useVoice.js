import { useState, useRef } from 'react'

export function useVoice(onResult) {
  const recognitionRef = useRef(null)
  const [listening, setListening] = useState(false)

  function start() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      alert('Seu navegador não suporta reconhecimento de voz')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'pt-BR'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript
      onResult(text)
    }

    recognition.onerror = (event) => {
      console.error('Erro no reconhecimento de voz:', event.error)
      setListening(false)
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognition.start()
    recognitionRef.current = recognition
    setListening(true)
  }

  function stop() {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setListening(false)
  }

  return { start, stop, listening }
}
