const API_BASE_URL = '/api';

class RolesService {
  /**
   * Busca a lista de roles disponíveis do backend
   * @returns {Promise<string[]>} Array com os nomes dos roles
   */
  static async getRoles() {
    try {
      const response = await fetch(`${API_BASE_URL}/user/roles`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar roles: ${response.status}`);
      }

      const roles = await response.json();
      return roles;
    } catch (error) {
      console.error('Erro ao buscar roles:', error);
      throw error;
    }
  }
}

export default RolesService;