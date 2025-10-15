import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import UserProfileService from '../services/UserProfileService';
import './Configuracoes.css';

function Configuracoes() {
  const { 
    userProfile, 
    updateUserProfile, 
    notificationPreferences, 
    updateNotificationPreferences, 
    isLoading, 
    error,
    clearError
  } = useUser();
  
  const { isDarkTheme, toggleDarkTheme, textSize, changeTextSize, isSpeechEnabled, toggleSpeech } = useAccessibility();
  
  const [profileData, setProfileData] = useState({
    nome: '',
    matricula: '',
    cargo: '',
    telefone: '',
    email: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const [passwordData, setPasswordData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({});
  
  const [notificationSaving, setNotificationSaving] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationMessageType, setNotificationMessageType] = useState(''); 

  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    const carregarPerfilUsuario = async () => {
      try {
        setProfileLoading(true);
        setProfileError(null);
        
        const resultado = await UserProfileService.getUserProfile();
        
        if (resultado.success) {
          const userData = resultado.data;
          setProfileData({
            nome: userData.nome || '',
            matricula: userData.matricula || '',
            cargo: userData.cargo || '',
            telefone: userData.telefone || '',
            email: userData.email || ''
          });
          
          if (updateUserProfile) {
            updateUserProfile(userData);
          }
        } else {
          setProfileError(resultado.error || 'Erro ao carregar perfil');

          if (userProfile && userProfile.id) {
            setProfileData({
              nome: userProfile.nome || '',
              matricula: userProfile.matricula || '',
              cargo: userProfile.cargo || '',
              telefone: userProfile.telefone || '',
              email: userProfile.email || ''
            });
          }
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        setProfileError('Erro de conexão ao carregar perfil');
        
        if (userProfile && userProfile.id) {
          setProfileData({
            nome: userProfile.nome || '',
            matricula: userProfile.matricula || '',
            cargo: userProfile.cargo || '',
            telefone: userProfile.telefone || '',
            email: userProfile.email || ''
          });
        }
      } finally {
        setProfileLoading(false);
      }
    };

    carregarPerfilUsuario();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    if (name === 'telefone') {
      formattedValue = UserProfileService.formatPhone(value);
    }
    
    setProfileData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

    const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setSaveMessage('');
      clearError(); 
      
      const { cargo, ...updatedData } = profileData;
      
      const result = await updateUserProfile(updatedData);
      
      if (result.success) {
        setSaveMessage('Perfil atualizado com sucesso!');
        setIsEditing(false);
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage(result.error || 'Erro ao atualizar perfil. Tente novamente.');
        setTimeout(() => setSaveMessage(''), 5000);
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setSaveMessage('Erro ao atualizar perfil. Tente novamente.');
      setTimeout(() => setSaveMessage(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setProfileData({
      nome: userProfile.nome || '',
      matricula: userProfile.matricula || '',
      cargo: userProfile.cargo || '',
      telefone: userProfile.telefone || '',
      email: userProfile.email || ''
    });
    setIsEditing(false);
    setValidationErrors({});
    setSaveMessage('');
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    
    const updatedPasswordData = {
      ...passwordData,
      [name]: value
    };
    
    setPasswordData(updatedPasswordData);

    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (name === 'confirmarSenha' || (name === 'novaSenha' && updatedPasswordData.confirmarSenha)) {
      if (updatedPasswordData.novaSenha && updatedPasswordData.confirmarSenha && 
          updatedPasswordData.novaSenha !== updatedPasswordData.confirmarSenha) {
        setPasswordErrors(prev => ({
          ...prev,
          confirmarSenha: 'Nova senha e confirmação não coincidem'
        }));
      } else {
        setPasswordErrors(prev => ({
          ...prev,
          confirmarSenha: ''
        }));
      }
    }

    if (name === 'novaSenha' || (name === 'senhaAtual' && updatedPasswordData.novaSenha)) {
      if (updatedPasswordData.senhaAtual && updatedPasswordData.novaSenha && 
          updatedPasswordData.senhaAtual === updatedPasswordData.novaSenha) {
        setPasswordErrors(prev => ({
          ...prev,
          novaSenha: 'Nova senha deve ser diferente da senha atual'
        }));
      } else if (name === 'novaSenha' && passwordErrors.novaSenha === 'Nova senha deve ser diferente da senha atual') {
        setPasswordErrors(prev => ({
          ...prev,
          novaSenha: ''
        }));
      }
    }
  };

  const handleChangePassword = async () => {
   
    const validation = UserProfileService.validatePasswordData(passwordData);
    
    if (!validation.isValid) {
      setPasswordErrors(validation.errors);
      setPasswordMessage('Por favor, corrija os erros antes de alterar a senha.');
      return;
    }

    setIsChangingPassword(true);
    setPasswordMessage('');
    setPasswordErrors({});

    try {
      const result = await UserProfileService.updatePassword(
        passwordData.senhaAtual, 
        passwordData.novaSenha
      );
      
      if (result.success) {
        setPasswordMessage(result.message);
        setPasswordData({
          senhaAtual: '',
          novaSenha: '',
          confirmarSenha: ''
        });
        setIsEditingPassword(false);
        
        setTimeout(() => setPasswordMessage(''), 3000);
      } else {
        setPasswordMessage(result.error || 'Erro ao alterar senha');
      }
    } catch (error) {
      setPasswordMessage('Erro ao alterar senha. Tente novamente.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleCancelPasswordEdit = () => {
    setPasswordData({
      senhaAtual: '',
      novaSenha: '',
      confirmarSenha: ''
    });
    setIsEditingPassword(false);
    setPasswordErrors({});
    setPasswordMessage('');
  };

  const handleNotificationChange = async (notificationType, newValue) => {
    const updatedPreferences = {
      ...notificationPreferences,
      [notificationType]: newValue
    };

    setNotificationSaving(true);
    setNotificationMessage('');
    setNotificationMessageType('');

    try {
      const result = await updateNotificationPreferences(updatedPreferences);
      
      if (result.success) {
        setNotificationMessage('Preferências salvas com sucesso!');
        setNotificationMessageType('success');
        setTimeout(() => {
          setNotificationMessage('');
          setNotificationMessageType('');
        }, 3000);
      } else {
        setNotificationMessage(result.error || 'Erro ao salvar preferências');
        setNotificationMessageType('error');
        setTimeout(() => {
          setNotificationMessage('');
          setNotificationMessageType('');
        }, 5000);
      }
    } catch (error) {
      setNotificationMessage('Erro ao salvar preferências de notificação');
      setNotificationMessageType('error');
      setTimeout(() => {
        setNotificationMessage('');
        setNotificationMessageType('');
      }, 5000);
    } finally {
      setNotificationSaving(false);
    }
  };

  return (
    <main className="main-content">
      <div className="configuracoes-container">
        <div className="page-header">
          <h1>Configurações</h1>
          <p>Gerencie preferências e configurações do sistema</p>
        </div>

        <section className="settings-section">
          <h2>Perfil do Usuário</h2>

          {saveMessage && (
            <div className={`save-message ${saveMessage.includes('sucesso') ? 'success' : 'error'}`}>
              {saveMessage}
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="loading-message">
              Carregando dados do perfil...
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nome">Nome Completo *</label>
              <input 
                type="text" 
                id="nome" 
                name="nome"
                value={profileData.nome} 
                onChange={handleInputChange}
                disabled={!isEditing || isLoading}
                className={validationErrors.nome ? 'error' : ''}
              />
              {validationErrors.nome && (
                <span className="field-error">{validationErrors.nome}</span>
              )}
            </div>            <div className="form-group">
              <label htmlFor="matricula">Matrícula</label>
              <input 
                type="text" 
                id="matricula" 
                name="matricula"
                value={profileData.matricula} 
                onChange={handleInputChange}
                disabled={true}
                className="readonly"
              />
              {isEditing && (
                <small className="field-note">Alterado apenas por administradores</small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="cargo">Cargo</label>
              <input 
                type="text" 
                id="cargo" 
                name="cargo"
                value={profileData.cargo || 'Não definido'} 
                onChange={handleInputChange}
                disabled={true}
                className="readonly"
              />
              {isEditing && (
                <small className="field-note">Alterado apenas por administradores</small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                value={profileData.email} 
                onChange={handleInputChange}
                disabled={!isEditing || isLoading}
                className={validationErrors.email ? 'error' : ''}
              />
              {validationErrors.email && (
                <span className="field-error">{validationErrors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="telefone">Telefone</label>
              <input 
                type="tel" 
                id="telefone" 
                name="telefone"
                value={profileData.telefone} 
                onChange={handleInputChange}
                disabled={!isEditing || isLoading}
                placeholder="(XX) XXXXX-XXXX"
                className={validationErrors.telefone ? 'error' : ''}
              />
              {validationErrors.telefone && (
                <span className="field-error">{validationErrors.telefone}</span>
              )}
            </div>
          </div>

              <div className="form-actions">
                {isEditing ? (
                  <>
                    <button 
                      className="btn-salvar" 
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                    <button 
                      className="btn-cancelar" 
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button 
                    className="btn-editar" 
                    onClick={() => setIsEditing(true)}
                    disabled={isLoading}
                  >
                    Editar Perfil
                  </button>
                )}
              </div>

              {isEditing && (
                <div className="form-footer">
                  <small>* Campos obrigatórios</small>
                </div>
              )}
        </section>

        <section className="settings-section">
          <h2>Segurança</h2>

          {passwordMessage && (
            <div className={`save-message ${passwordMessage.includes('sucesso') ? 'success' : 'error'}`}>
              {passwordMessage}
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="senha-atual">Senha Atual *</label>
              <input 
                type="password" 
                id="senha-atual"
                name="senhaAtual"
                value={passwordData.senhaAtual}
                onChange={handlePasswordInputChange}
                disabled={!isEditingPassword || isChangingPassword}
                className={passwordErrors.senhaAtual ? 'error' : ''}
              />
              {passwordErrors.senhaAtual && (
                <span className="field-error">{passwordErrors.senhaAtual}</span>
              )}
            </div>
            <div className="form-group"></div>
            <div className="form-group">
              <label htmlFor="nova-senha">Nova Senha *</label>
              <input 
                type="password" 
                id="nova-senha"
                name="novaSenha"
                value={passwordData.novaSenha}
                onChange={handlePasswordInputChange}
                disabled={!isEditingPassword || isChangingPassword}
                className={passwordErrors.novaSenha ? 'error' : ''}
              />
              {passwordErrors.novaSenha && (
                <span className="field-error">{passwordErrors.novaSenha}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="confirmar-senha">Confirmar Nova Senha *</label>
              <input 
                type="password" 
                id="confirmar-senha"
                name="confirmarSenha"
                value={passwordData.confirmarSenha}
                onChange={handlePasswordInputChange}
                disabled={!isEditingPassword || isChangingPassword}
                className={passwordErrors.confirmarSenha ? 'error' : ''}
              />
              {passwordErrors.confirmarSenha && (
                <span className="field-error">{passwordErrors.confirmarSenha}</span>
              )}
            </div>
          </div>
          
          <div className="form-actions">
            {isEditingPassword ? (
              <>
                <button 
                  className="btn-salvar" 
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? 'Alterando...' : 'Alterar Senha'}
                </button>
                <button 
                  className="btn-cancelar" 
                  onClick={handleCancelPasswordEdit}
                  disabled={isChangingPassword}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button 
                className="btn-editar" 
                onClick={() => setIsEditingPassword(true)}
              >
                Editar Senha
              </button>
            )}
          </div>

          {isEditingPassword && (
            <div className="form-footer">
              <small>* Campos obrigatórios</small>
            </div>
          )}
        </section>

        <section className="settings-section">
          <h2>Notificações</h2>
          
          {notificationSaving && (
            <div className="loading-message">
              Salvando preferências...
            </div>
          )}
          
          {notificationMessage && (
            <div className={`message ${notificationMessageType}`}>
              {notificationMessage}
            </div>
          )}
          
          <div className="toggle-list">
            <div className="toggle-item">
              <span>Incêndio</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={notificationPreferences.incendio} 
                  onChange={(e) => handleNotificationChange('incendio', e.target.checked)} 
                />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="toggle-item">
              <span>Emergência Médica</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={notificationPreferences.emergencia} 
                  onChange={(e) => handleNotificationChange('emergencia', e.target.checked)} 
                />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="toggle-item">
              <span>Acidentes de Trânsito</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={notificationPreferences.transito} 
                  onChange={(e) => handleNotificationChange('transito', e.target.checked)} 
                />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="toggle-item">
              <span>Outros</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={notificationPreferences.outros} 
                  onChange={(e) => handleNotificationChange('outros', e.target.checked)} 
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h2>Acessibilidade</h2>
           <div className="toggle-list">
            <div className="toggle-item">
              <span>Tema</span>
              <label className="switch">
                <input type="checkbox" checked={isDarkTheme} onChange={toggleDarkTheme} />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="toggle-item">
              <span>Leitura por Voz</span>
              <label className="switch">
                <input type="checkbox" checked={isSpeechEnabled} onChange={toggleSpeech} />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="toggle-item">
                <label htmlFor="tamanho-texto">Tamanho do Texto</label>
                 <select id="tamanho-texto" value={textSize} onChange={(e) => changeTextSize(e.target.value)}>
                    <option value="pequeno">Pequeno</option>
                    <option value="medio">Médio</option>
                    <option value="grande">Grande</option>
                </select>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Configuracoes;