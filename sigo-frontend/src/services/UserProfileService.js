class UserProfileService {

  static async getUserProfile() {
    try {
      const response = await fetch('http://localhost:8000/user/profile', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const profileData = await response.json();

        return {
          success: true,
          data: {
            id: profileData.id,
            nome: profileData.full_name,
            matricula: profileData.registration,
            cargo: profileData.user_role,
            email: profileData.email,
            telefone: profileData.phone
          },
          message: 'Perfil carregado com sucesso!'
        };
      } else {
        const errorText = await response.text();
        return {
          success: false,
          error: `Erro ${response.status}: ${errorText}`,
          message: 'Erro ao carregar perfil do usuário'
        };
      }
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
      return {
        success: false,
        error: error.message,
        message: 'Erro de conexão ao carregar perfil'
      };
    }
  }

  static validateProfileData(profileData) {
    const errors = {};

    if (!profileData.nome || profileData.nome.trim().length < 2) {
      errors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!profileData.email || !this.isValidEmail(profileData.email)) {
      errors.email = 'Email inválido';
    }

    if (profileData.telefone && !this.isValidPhone(profileData.telefone)) {
      errors.telefone = 'Telefone inválido';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  static validatePasswordData(passwordData) {
    const errors = {};

    if (!passwordData.senhaAtual || passwordData.senhaAtual.trim().length === 0) {
      errors.senhaAtual = 'Senha atual é obrigatória';
    }

    if (!passwordData.novaSenha || passwordData.novaSenha.trim().length === 0) {
      errors.novaSenha = 'Nova senha é obrigatória';
    }

    if (!passwordData.confirmarSenha || passwordData.confirmarSenha.trim().length === 0) {
      errors.confirmarSenha = 'Confirmação de senha é obrigatória';
    }

    if (passwordData.novaSenha && passwordData.confirmarSenha && 
        passwordData.novaSenha !== passwordData.confirmarSenha) {
      errors.confirmarSenha = 'Nova senha e confirmação não coincidem';
    }

    if (passwordData.senhaAtual && passwordData.novaSenha && 
        passwordData.senhaAtual === passwordData.novaSenha) {
      errors.novaSenha = 'Nova senha deve ser diferente da senha atual';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  static async updatePassword(senhaAtual, novaSenha) {
    try {
      const formData = new FormData();
      formData.append('senhaAtual', senhaAtual);
      formData.append('novaSenha', novaSenha);
      formData.append('confirmarSenha', novaSenha);

      const response = await fetch('/api/user/password', {
        method: 'PUT',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        const resultText = await response.text();
        return { success: true, message: resultText || 'Senha alterada com sucesso!' };
      } else {
        const errorText = await response.text();
        
        let errorMessage = 'Erro ao alterar senha';
        
        if (response.status === 400) {
          if (errorText.includes('Senha incorreta')) {
            errorMessage = 'Senha atual incorreta';
          } else if (errorText.includes('diferente')) {
            errorMessage = 'Nova senha deve ser diferente da senha atual';
          } else if (errorText.includes('Formulário inválido')) {
            errorMessage = 'Dados do formulário inválidos';
          } else {
            errorMessage = errorText || 'Dados inválidos';
          }
        } else if (response.status === 401) {
          errorMessage = 'Sessão expirada. Faça login novamente';
        } else if (response.status === 500) {
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde';
        } else {
          errorMessage = errorText || 'Erro desconhecido';
        }
        
        return { 
          success: false, 
          error: errorMessage 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Erro de conexão. Não foi possível alterar a senha.' 
      };
    }
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
    if (numbers.length === 11) {
      return `(${numbers.substr(0, 2)}) ${numbers.substr(2, 5)}-${numbers.substr(7, 4)}`;
    } else if (numbers.length === 10) {
      return `(${numbers.substr(0, 2)}) ${numbers.substr(2, 4)}-${numbers.substr(6, 4)}`;
    }
    return phone;
  }

  static async updateNotificationPreferences(preferences) {
    try {
      const response = await fetch('/api/user/notification_preferences', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          incendio: preferences.incendio,
          emergencia: preferences.emergencia,
          transito: preferences.transito,
          outros: preferences.outros
        })
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, message: 'Preferências de notificação salvas com sucesso!' };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Erro ao salvar preferências de notificação' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Erro de conexão. Não foi possível salvar as preferências.' 
      };
    }
  }

  static async getNotificationPreferences() {
    try {
      const response = await fetch('/api/user/notification_preferences', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const preferences = await response.json();
        return { 
          success: true, 
          preferences: {
            incendio: preferences.incendio ?? false,
            emergencia: preferences.emergencia ?? false,
            transito: preferences.transito ?? false,
            outros: preferences.outros ?? false
          }
        };
      } else {
        return { 
          success: true, 
          preferences: {
            incendio: false,
            emergencia: false,
            transito: false,
            outros: false
          }
        };
      }
    } catch (error) {
      return { 
        success: true, 
        preferences: {
          incendio: false,
          emergencia: false,
          transito: false,
          outros: false
        }
      };
    }
  }
}

export default UserProfileService;