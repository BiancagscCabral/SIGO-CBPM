import { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [textSize, setTextSize] = useState('pequeno');

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
  }, []);

  // Função para alternar o tema
  const toggleDarkTheme = () => {
    const newThemeState = !isDarkTheme;
    setIsDarkTheme(newThemeState);
    
    // Salvar no localStorage
    localStorage.setItem('darkTheme', newThemeState.toString());
    
    if (newThemeState) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  // Função para alterar o tamanho do texto
  const changeTextSize = (size) => {
    setTextSize(size);
    
    // Salvar no localStorage
    localStorage.setItem('textSize', size);
    
    // Aplicar atributo no HTML
    document.documentElement.setAttribute('data-text-size', size);
  };

  const value = {
    isDarkTheme,
    toggleDarkTheme,
    textSize,
    changeTextSize
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