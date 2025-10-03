class UserProfileService {

  static validateProfileData(profileData) {
    const errors = {};

    if (!profileData.nome || profileData.nome.trim().length < 2) {
      errors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!profileData.cargo || profileData.cargo.trim().length < 2) {
      errors.cargo = 'Cargo é obrigatório';
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

    if (!passwordData.novaSenha || passwordData.novaSenha.length < 6) {
      errors.novaSenha = 'Nova senha deve ter pelo menos 6 caracteres';
    }

    if (!passwordData.confirmarSenha || passwordData.confirmarSenha.length === 0) {
      errors.confirmarSenha = 'Confirmação de senha é obrigatória';
    }

    if (passwordData.novaSenha && passwordData.confirmarSenha && passwordData.novaSenha !== passwordData.confirmarSenha) {
      errors.confirmarSenha = 'Senhas não coincidem';
    }

    if (passwordData.senhaAtual && passwordData.novaSenha && passwordData.senhaAtual === passwordData.novaSenha) {
      errors.novaSenha = 'Nova senha deve ser diferente da senha atual';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  static async updatePassword(senhaAtual, novaSenha) {
    try {
      const response = await fetch('http://localhost:8000/api/user/password', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          currentPassword: senhaAtual, 
          newPassword: novaSenha 
        })
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, message: 'Senha alterada com sucesso!' };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Erro ao alterar senha' 
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
}

export default UserProfileService;