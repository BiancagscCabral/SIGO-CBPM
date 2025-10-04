import { useEffect } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';

export const useSpeech = () => {
  const { isSpeechEnabled, speakText } = useAccessibility();

  useEffect(() => {
    if (!isSpeechEnabled) return;

    const getCleanText = (element) => {
      if (element.tagName === 'INPUT') {
        return element.placeholder || element.value || element.getAttribute('aria-label') || '';
      }
      
      if (element.tagName === 'BUTTON') {
        return element.textContent || element.getAttribute('aria-label') || '';
      }
 
      if (element.tagName === 'SELECT') {
        const labelElement = document.querySelector(`label[for="${element.id}"]`);
        return labelElement ? labelElement.textContent : 'Dropdown';
      }
      
      if (element.tagName === 'OPTION') {
        return element.textContent || element.value || '';
      }
      
      if (element.classList.contains('switch') || element.classList.contains('slider')) {
        const toggleItem = element.closest('.toggle-item');
        if (toggleItem) {
          const spanElement = toggleItem.querySelector('span:not(.slider)');
          const inputElement = toggleItem.querySelector('input[type="checkbox"]');
          const spanText = spanElement ? spanElement.textContent : '';
          const status = inputElement && inputElement.checked ? 'ativado' : 'desativado';
          return spanText ? `${spanText}: ${status}` : '';
        }
      }
      
      return element.textContent || element.getAttribute('aria-label') || '';
    };

    const addHoverSpeech = (element) => {
      if (element.hasAttribute('data-speech-enabled')) return;
      
      const handleMouseEnter = () => {
        const text = getCleanText(element);
        if (text.trim()) {
          speakText(text.trim());
        }
      };

      element.addEventListener('mouseenter', handleMouseEnter);
      element.setAttribute('data-speech-enabled', 'true');
      
      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeAttribute('data-speech-enabled');
      };
    };

    const selectors = [
      'button:not(.slider)',
      'a:not(.nav-item)', 
      '.nav-item',
      'h1',
      'h2', 
      'h3',
      'label:not(.switch)',
      'input[placeholder]',
      'select',
      '.stat-card',
      '.quick-access-card',
      '.analytics-card',
      '.available-report-card',
      '.ocorrencia-item',
      '.toggle-item span',
      '.switch',
      '.slider',
      '.dashboard-header h1',
      '.dashboard-header p',
      '.page-header h1', 
      '.page-header p',
      '.save-btn',
      '.cancel-btn',
      '.edit-btn',
      '.delete-btn',
      '.form-group label',
      '.config-section h2',
      '.profile-section h2',
      '.security-section h2',
      '.notification-section h2',
      '.accessibility-section h2'
    ];

    const cleanupFunctions = [];

    const applyToExistingElements = () => {
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          const cleanup = addHoverSpeech(element);
          if (cleanup) {
            cleanupFunctions.push(cleanup);
          }
        });
      });
    };

    applyToExistingElements();

    const timeoutId = setTimeout(() => {
      applyToExistingElements();
    }, 1000);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
          
            selectors.forEach(selector => {
              if (node.matches && node.matches(selector)) {
                const cleanup = addHoverSpeech(node);
                if (cleanup) cleanupFunctions.push(cleanup);
              }
              
              const childElements = node.querySelectorAll ? node.querySelectorAll(selector) : [];
              childElements.forEach(childElement => {
                const cleanup = addHoverSpeech(childElement);
                if (cleanup) cleanupFunctions.push(cleanup);
              });
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [isSpeechEnabled, speakText]);

  return { isSpeechEnabled, speakText };
};