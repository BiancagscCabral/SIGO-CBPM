class UserProfileService {

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