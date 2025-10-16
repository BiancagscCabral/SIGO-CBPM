import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { verificarAcesso } from '../utils/permissions';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      setIsLoading(true);
      
      try {
        const authResponse = await fetch('/api/user/profile', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!authResponse.ok) {
          setIsAuthenticated(false);
          setHasPermission(false);
          setIsLoading(false);
          return;
        }

        const userData = await authResponse.json();
        setIsAuthenticated(true);

        if (allowedRoles.length === 0) {
          setHasPermission(true);
          setIsLoading(false);
          return;
        }
        const userRole = userData.user_role;
        const hasRequiredPermission = verificarAcesso(userRole, allowedRoles);
        
        setHasPermission(hasRequiredPermission);
      } catch (error) {
        console.error('Erro ao verificar permissões:', error);
        setIsAuthenticated(false);
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkPermissions();
  }, [allowedRoles]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Verificando permissões...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasPermission) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;