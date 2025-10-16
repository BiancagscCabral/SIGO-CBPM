import { createContext, useContext, useState, useEffect } from 'react';
import UserProfileService from '../services/UserProfileService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState({
    id: null,
    full_name: '',
    registration: '',
    user_role: '',
    phone: '',
    email: ''
  });

  const [notificationPreferences, setNotificationPreferences] = useState({
    incendio: false,
    emergencia: false,
    transito: false,
    outros: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const getUserIdFromCookie = () => {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('USER_ID='));
    return cookie ? cookie.split('=')[1] : null;
  };

  const fetchUserProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await UserProfileService.getUserProfile();
      
      if (result.success) {
        const userData = result.data;
        const hasProfileChanged = !userProfile.id || 
          userProfile.id !== userData.id || 
          userProfile.user_role !== userData.user_role;
        
        setUserProfile(userData);
      
        if (hasProfileChanged) {
          console.log('Perfil de usuário atualizado:', userData);
        }
        
        return { success: true, data: userData };
      } else {
        const errorMessage = result.error || 'Não foi possível localizar o usuário.';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = 'Erro de conexão. Não foi possível localizar o usuário.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (updatedData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUserProfile(updatedUser);
        return { success: true, data: updatedUser };
      } else {
        const errorMessage = 'Erro ao atualizar perfil. Tente novamente mais tarde.';
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = 'Erro de conexão ao atualizar perfil.';
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotificationPreferences = async () => {
    const result = await UserProfileService.getNotificationPreferences();
    if (result.success) {
      setNotificationPreferences(result.preferences);
    }
    return result;
  };

  const updateNotificationPreferences = async (preferences) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await UserProfileService.updateNotificationPreferences(preferences);
      if (result.success) {
        setNotificationPreferences(preferences);
      } else {
        setError(result.error);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    fetchUserProfile();
    fetchNotificationPreferences();
    
    const initialUserId = getUserIdFromCookie();
    setCurrentUserId(initialUserId);
    
    const interval = setInterval(() => {
      const newUserId = getUserIdFromCookie();
      
      if (newUserId !== currentUserId) {
        console.log('UserContext: Mudança detectada no USER_ID:', { 
          anterior: currentUserId, 
          novo: newUserId 
        });
        
        setCurrentUserId(newUserId);
        
        if (newUserId) {
          console.log('UserContext: Atualizando perfil para novo usuário...');
          setTimeout(() => {
            fetchUserProfile();
            fetchNotificationPreferences();
          }, 200); 
        } else {
          console.log('UserContext: Logout detectado, limpando dados...');
          setUserProfile({
            id: null,
            full_name: '',
            registration: '',
            user_role: '',
            phone: '',
            email: ''
          });
          setNotificationPreferences({
            incendio: false,
            emergencia: false,
            transito: false,
            outros: false
          });
        }
      }
    }, 300); 
    
    const handleFocus = () => {
      fetchUserProfile();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [currentUserId]);

  const refreshUserSession = async () => {
    await fetchUserProfile();
    await fetchNotificationPreferences();
  };

  const value = {
    userProfile,
    setUserProfile,
    notificationPreferences,
    setNotificationPreferences,
    isLoading,
    error,
    clearError,
    fetchUserProfile,
    updateUserProfile,
    fetchNotificationPreferences,
    updateNotificationPreferences,
    refreshUserSession
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
};

export { UserContext };
export default UserContext;