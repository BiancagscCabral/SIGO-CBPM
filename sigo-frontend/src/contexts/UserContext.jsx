import { createContext, useContext, useState, useEffect } from 'react';
import UserProfileService from '../services/UserProfileService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState({
    id: null,
    nome: '',
    matricula: '',
    cargo: '',
    telefone: '',
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

  const fetchUserProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/user/profile', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const userData = await response.json();
        setUserProfile(userData);
        return { success: true, data: userData };
      } else {
        const errorMessage = 'Não foi possível localizar o usuário. Verifique sua conexão.';
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
      const response = await fetch('http://localhost:8000/api/user/profile', {
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
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = 'Erro de conexão ao atualizar perfil.';
      setError(errorMessage);
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

  useEffect(() => {
    fetchUserProfile();
    fetchNotificationPreferences();
  }, []);

  const value = {
    userProfile,
    setUserProfile,
    notificationPreferences,
    setNotificationPreferences,
    isLoading,
    error,
    fetchUserProfile,
    updateUserProfile,
    fetchNotificationPreferences,
    updateNotificationPreferences
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

export default UserContext;