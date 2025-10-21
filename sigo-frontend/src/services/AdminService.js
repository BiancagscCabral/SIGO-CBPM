class AdminService {
  static baseUrl = '/api';

  static async getAllUsers() {
    try {
      const response = await fetch(`${this.baseUrl}/admin/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.text();
        return {
          success: false,
          error: `Erro do servidor: ${response.status} - ${errorData}`
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return {
        success: false,
        error: 'Erro de rede. Verifique sua conexão.'
      };
    }
  }

  // A função updateUserStatus foi removida pois sua lógica foi incorporada em updateUser.

  static async deleteUser(userId) {
    try {
      const response = await fetch(`${this.baseUrl}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.text();
        return {
          success: false,
          error: `Erro ao excluir usuário: ${response.status} - ${errorData}`
        };
      }

      if (response.status === 204) {
        return { success: true };
      }

      const result = await response.json();
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      return {
        success: false,
        error: 'Erro de rede. Verifique sua conexão.'
      };
    }
  }

  static async createUser(userData) {
    try {
      const response = await fetch(`${this.baseUrl}/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        return {
          success: false,
          error: `Erro ao criar usuário: ${response.status} - ${errorData}`
        };
      }

      const result = await response.json();
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return {
        success: false,
        error: 'Erro de rede. Verifique sua conexão.'
      };
    }
  }

  // Função updateUser agora lida com todos os dados, incluindo o status.
  static async updateUser(userId, userData) {
    try {
      const response = await fetch(`${this.baseUrl}/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        return {
          success: false,
          error: `Erro ao atualizar usuário: ${response.status} - ${errorData}`
        };
      }

      const result = await response.json();
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return {
        success: false,
        error: 'Erro de rede. Verifique sua conexão.'
      };
    }
  }

  static async getSystemStats() {
    try {
      const response = await fetch(`${this.baseUrl}/admin/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.text();
        return {
          success: false,
          error: `Erro ao buscar estatísticas: ${response.status} - ${errorData}`
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return {
        success: false,
        error: 'Erro de rede. Verifique sua conexão.'
      };
    }
  }

  static validateUserData(userData) {
    const errors = {};
    if (!userData.nome || userData.nome.trim().length < 2) { errors.nome = 'Nome deve ter pelo menos 2 caracteres'; }
    if (!userData.matricula || userData.matricula.trim().length < 1) { errors.matricula = 'Matrícula é obrigatória'; }
    if (!userData.email || !this.isValidEmail(userData.email)) { errors.email = 'Email inválido'; }
    if (!userData.cargo || userData.cargo.trim().length < 1) { errors.cargo = 'Cargo é obrigatório'; }
    if (userData.telefone && !this.isValidPhone(userData.telefone)) { errors.telefone = 'Telefone inválido'; }
    if (!userData.senha || userData.senha.length < 6) { errors.senha = 'Senha deve ter pelo menos 6 caracteres'; }
    if (userData.senha !== userData.confirma_senha) { errors.confirma_senha = 'Senhas não coincidem'; }
    return { isValid: Object.keys(errors).length === 0, errors: errors };
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPhone(phone) {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return phoneRegex.test(phone);
  }

  static formatPhone(phone) {
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length === 11) { return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`; }
    if (numbers.length === 10) { return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`; }
    return phone;
  }
}

export default AdminService;