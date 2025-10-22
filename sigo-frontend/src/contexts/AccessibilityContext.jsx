import { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [textSize, setTextSize] = useState('pequeno');
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'true') {
      setIsDarkTheme(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    const savedTextSize = localStorage.getItem('textSize');
    if (savedTextSize) {
      setTextSize(savedTextSize);
      document.documentElement.setAttribute('data-text-size', savedTextSize);
    }

    const savedSpeech = localStorage.getItem('speechEnabled');
    if (savedSpeech === 'true') {
      setIsSpeechEnabled(true);
    }

    if (window.speechSynthesis) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
      
      loadVoices();
    }
  }, []);

  const toggleDarkTheme = () => {
    const newThemeState = !isDarkTheme;
    setIsDarkTheme(newThemeState);
    
    localStorage.setItem('darkTheme', newThemeState.toString());
    
    if (newThemeState) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  const changeTextSize = (size) => {
    setTextSize(size);
    
    localStorage.setItem('textSize', size);
    
    document.documentElement.setAttribute('data-text-size', size);
  };


  const toggleSpeech = () => {
    const newSpeechState = !isSpeechEnabled;
    setIsSpeechEnabled(newSpeechState);
    
    localStorage.setItem('speechEnabled', newSpeechState.toString());
    
    if (!newSpeechState && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const speakText = (text) => {
    if (!isSpeechEnabled || !text || !window.speechSynthesis) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.rate = 0.8; // Velocidade da fala
    utterance.pitch = 1; // Tom da voz
    utterance.volume = 0.8; // Volume
    
    const voices = window.speechSynthesis.getVoices();
    const portugueseVoice = voices.find(voice => voice.lang.includes('pt'));
    if (portugueseVoice) {
      utterance.voice = portugueseVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const value = {
    isDarkTheme,
    toggleDarkTheme,
    textSize,
    changeTextSize,
    isSpeechEnabled,
    toggleSpeech,
    speakText,
    stopSpeech
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};