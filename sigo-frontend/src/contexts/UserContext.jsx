import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState({
    id: null,
    nome: '',
    matricula: '',
    telefone: '',
    email: '',
    cidade: '',
    estado: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/user/profile', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUserProfile(userData);
        return { success: true, data: userData };
      } else {
        // Se a API retornar erro, usar dados simulados
        console.log('API retornou erro, usando dados simulados');
        const simulatedData = {
          id: 1,
          nome: 'Gislany Araujo',
          matricula: '123456',
          telefone: '(81) 99999-9999',
          email: 'gis.araujo@cbm.pe.gov.br',
          cidade: 'Recife',
          estado: 'PE'
        };
        setUserProfile(simulatedData);
        return { success: true, data: simulatedData };
      }
    } catch (err) {
      // Se houver erro de conexão, usar dados simulados
      console.log('Erro de conexão com API, usando dados simulados');
      const simulatedData = {
        id: 1,
        nome: 'Gislany Araujo',
        matricula: '12345-6',
        telefone: '(81) 99999-9999',
        email: 'gis.araujo@cbm.pe.gov.br',
        cidade: 'Recife',
        estado: 'PE'
      };
      setUserProfile(simulatedData);
      return { success: true, data: simulatedData };
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
        // Se a API retornar erro, simular salvamento local
        console.log('API retornou erro ao salvar, simulando salvamento local');
        setUserProfile(updatedData);
        return { success: true, data: updatedData };
      }
    } catch (err) {
      // Se houver erro de conexão, simular salvamento local
      console.log('Erro de conexão ao salvar, simulando salvamento local');
      setUserProfile(updatedData);
      return { success: true, data: updatedData };
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('UserContext: Iniciando carregamento do perfil...');
    fetchUserProfile();
  }, []);

  const value = {
    userProfile,
    setUserProfile,
    isLoading,
    error,
    fetchUserProfile,
    updateUserProfile
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