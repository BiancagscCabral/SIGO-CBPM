import { useCallback, useEffect } from 'react';

export const useLoginDetection = (onNewLogin) => {
  const checkForNewLogin = useCallback(() => {
    const currentUserId = document.cookie
      .split('; ')
      .find(row => row.startsWith('USER_ID='))
      ?.split('=')[1];
    
    const lastUserId = localStorage.getItem('lastUserId');
  
    if (currentUserId && currentUserId !== lastUserId) {
      console.log('Login detectado:', { currentUserId, lastUserId });
      localStorage.setItem('lastUserId', currentUserId);
      if (onNewLogin) {
        onNewLogin(currentUserId);
      }
    } 
    else if (!currentUserId && lastUserId) {
      console.log('Logout detectado:', { lastUserId });
      localStorage.removeItem('lastUserId');
      if (onNewLogin) {
        onNewLogin(null);
      }
    }
  }, [onNewLogin]);

  useEffect(() => {
    checkForNewLogin();
    const interval = setInterval(checkForNewLogin, 1000);
    
    const handleFocus = () => {
      checkForNewLogin();
    };
    
    const handleStorageChange = (e) => {
      if (e.key === 'lastUserId') {
        checkForNewLogin();
      }

      if (e.key === 'userPermissions') {
        console.log('Permissões atualizadas pelo backend:', e.newValue);
        checkForNewLogin();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkForNewLogin]);

  return checkForNewLogin;
};

export default useLoginDetection;