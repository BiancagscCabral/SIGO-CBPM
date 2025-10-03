import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import UserProfileService from '../services/UserProfileService';
import './Configuracoes.css';

function Configuracoes() {
  const { userProfile, updateUserProfile, isLoading, error } = useUser();
  
  const [profileData, setProfileData] = useState({
    nome: '',
    matricula: '',
    telefone: '',
    email: '',
    cidade: '',
    estado: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const [notificacaoIncendio, setNotificacaoIncendio] = useState(true);
  const [notificacaoEmergencia, setNotificacaoEmergencia] = useState(true);
  const [notificacaoTransito, setNotificacaoTransito] = useState(true);
  const [notificacaoOutros, setNotificacaoOutros] = useState(false);
  
  const [Tema, setTema] = useState(false);
  const [leitorDeTela, setLeitorDeTela] = useState(false);
  const [comandoPorVoz, setComandoPorVoz] = useState(false);
  const [tamanhoTexto, setTamanhoTexto] = useState('pequeno');

  useEffect(() => {
    if (userProfile && userProfile.id) {
      setProfileData({
        nome: userProfile.nome || '',
        matricula: userProfile.matricula || '',
        telefone: userProfile.telefone || '',
        email: userProfile.email || '',
        cidade: userProfile.cidade || '',
        estado: userProfile.estado || ''
      });
    }
  }, [userProfile]);

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
    const validation = UserProfileService.validateProfileData(profileData);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setSaveMessage('Por favor, corrija os erros antes de salvar.');
      return;
    }

    setIsSaving(true);
    setSaveMessage('');
    setValidationErrors({});

    try {
      const result = await updateUserProfile(profileData);
      
      if (result.success) {
        setSaveMessage('Perfil atualizado com sucesso!');
        setIsEditing(false);
        
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage(result.error || 'Erro ao salvar perfil');
      }
    } catch (error) {
      setSaveMessage('Erro ao salvar perfil. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setProfileData({
      nome: userProfile.nome || '',
      matricula: userProfile.matricula || '',
      telefone: userProfile.telefone || '',
      email: userProfile.email || '',
      cidade: userProfile.cidade || '',
      estado: userProfile.estado || ''
    });
    setIsEditing(false);
    setValidationErrors({});
    setSaveMessage('');
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
              Erro ao carregar perfil: {error}
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
            </div>

            <div className="form-group">
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

            <div className="form-group">
              <label htmlFor="cidade">Cidade</label>
              <input 
                type="text" 
                id="cidade" 
                name="cidade"
                value={profileData.cidade} 
                onChange={handleInputChange}
                disabled={!isEditing || isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="estado">Estado</label>
              <select 
                id="estado" 
                name="estado"
                value={profileData.estado} 
                onChange={handleInputChange}
                disabled={!isEditing || isLoading}
              >
                <option value="">Selecione o estado</option>
                <option value="PE">Pernambuco</option>
                <option value="AL">Alagoas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="MA">Maranhão</option>
                <option value="PB">Paraíba</option>
                <option value="PI">Piauí</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="SE">Sergipe</option>
              </select>
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
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="senha-atual">Senha Atual</label>
              <input type="password" id="senha-atual" />
            </div>
            <div className="form-group"></div>
            <div className="form-group">
              <label htmlFor="nova-senha">Nova Senha</label>
              <input type="password" id="nova-senha" />
            </div>
            <div className="form-group">
              <label htmlFor="confirmar-senha">Confirmar Nova Senha</label>
              <input type="password" id="confirmar-senha" />
            </div>
          </div>
           <div className="form-actions">
            <button className="btn-salvar">Alterar Senha</button>
          </div>
        </section>

        <section className="settings-section">
          <h2>Notificações</h2>
          <div className="toggle-list">
            <div className="toggle-item">
              <span>Incêndio</span>
              <label className="switch">
                <input type="checkbox" checked={notificacaoIncendio} onChange={() => setNotificacaoIncendio(!notificacaoIncendio)} />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="toggle-item">
              <span>Emergência Médica</span>
              <label className="switch">
                <input type="checkbox" checked={notificacaoEmergencia} onChange={() => setNotificacaoEmergencia(!notificacaoEmergencia)} />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="toggle-item">
              <span>Acidentes de Trânsito</span>
              <label className="switch">
                <input type="checkbox" checked={notificacaoTransito} onChange={() => setNotificacaoTransito(!notificacaoTransito)} />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="toggle-item">
              <span>Outros</span>
              <label className="switch">
                <input type="checkbox" checked={notificacaoOutros} onChange={() => setNotificacaoOutros(!notificacaoOutros)} />
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
                <input type="checkbox" checked={Tema} onChange={() => setTema(!Tema)} />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="toggle-item">
              <span>Leitores de Tela</span>
              <label className="switch">
                <input type="checkbox" checked={leitorDeTela} onChange={() => setLeitorDeTela(!leitorDeTela)} />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="toggle-item">
              <span>Comando por voz</span>
              <label className="switch">
                <input type="checkbox" checked={comandoPorVoz} onChange={() => setComandoPorVoz(!comandoPorVoz)} />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="toggle-item">
                <label htmlFor="tamanho-texto">Tamanho do Texto</label>
                 <select id="tamanho-texto" value={tamanhoTexto} onChange={(e) => setTamanhoTexto(e.target.value)}>
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