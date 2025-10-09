import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PainelAdministrativo.css';
import RolesService from '../services/RolesService';

function PainelAdministrativo() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    matricula: '',
    telefone: '',
    email: '',
    senha: '',
    confirma_senha: '',
    cargo: '',
  });
  const [availableRoles, setAvailableRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userError, setUserError] = useState('');
  const [userSuccess, setUserSuccess] = useState('');

  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [teamFormData, setTeamFormData] = useState({
    nome: '',
    lider_id: '',
    membros: [],
    status: 'ativa'
  });
  const [teamError, setTeamError] = useState('');
  const [teamSuccess, setTeamSuccess] = useState('');

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const roles = await RolesService.getRoles();
        setAvailableRoles(roles);
      } catch (error) {
        console.error('Erro ao carregar roles:', error);
        setAvailableRoles(['Bombeiro', 'Capitão', 'Sargento', 'Analista']);
      } finally {
        setRolesLoading(false);
      }
    };

    loadRoles();
    loadUsers(); 
    loadTeams(); 
  }, []);

  const loadUsers = async () => {
    setUsersLoading(true);
    setUserError('');
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const usersData = await response.json();
        setUsers(usersData);
      } else {
        setUserError('Erro ao carregar usuários');
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setUserError('Não foi possível conectar ao servidor');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleUserStatusChange = async (userId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setUserSuccess('Status do usuário atualizado com sucesso!');
        loadUsers(); 
      } else {
        setUserError('Erro ao atualizar status do usuário');
      }
    } catch (error) {
      setUserError('Não foi possível conectar ao servidor');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        setUserSuccess('Usuário excluído com sucesso!');
        loadUsers();
      } else {
        setUserError('Erro ao excluir usuário');
      }
    } catch (error) {
      setUserError('Não foi possível conectar ao servidor');
    }
  };

  const loadTeams = async () => {
    setTeamsLoading(true);
    setTeamError('');
    
    try {
      const response = await fetch('/api/admin/teams', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const teamsData = await response.json();
        setTeams(teamsData);
      } else {
        setTeamError('Erro ao carregar equipes');
      }
    } catch (error) {
      console.error('Erro ao carregar equipes:', error);
      setTeamError('Não foi possível conectar ao servidor');
    } finally {
      setTeamsLoading(false);
    }
  };

  const handleTeamFormChange = (e) => {
    const { name, value } = e.target;
    setTeamFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMemberToggle = (userId) => {
    setTeamFormData(prev => ({
      ...prev,
      membros: prev.membros.includes(userId)
        ? prev.membros.filter(id => id !== userId)
        : [...prev.membros, userId]
    }));
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setTeamError('');
    setTeamSuccess('');

    if (teamFormData.membros.length === 0) {
      setTeamError('Selecione pelo menos um membro para a equipe.');
      return;
    }

    try {
      const response = await fetch('/api/admin/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(teamFormData),
      });

      if (response.ok) {
        setTeamSuccess('Equipe criada com sucesso!');
        setTeamFormData({
          nome: '',
          lider_id: '',
          membros: [],
          status: 'ativa'
        });
        setIsCreatingTeam(false);
        loadTeams();
      } else {
        const errorText = await response.text();
        setTeamError(errorText || 'Erro ao criar equipe');
      }
    } catch (error) {
      setTeamError('Não foi possível conectar ao servidor');
    }
  };

  const handleTeamStatusChange = async (teamId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/teams/${teamId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setTeamSuccess('Status da equipe atualizado com sucesso!');
        loadTeams();
      } else {
        setTeamError('Erro ao atualizar status da equipe');
      }
    } catch (error) {
      setTeamError('Não foi possível conectar ao servidor');
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta equipe?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/teams/${teamId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        setTeamSuccess('Equipe excluída com sucesso!');
        loadTeams();
      } else {
        setTeamError('Erro ao excluir equipe');
      }
    } catch (error) {
      setTeamError('Não foi possível conectar ao servidor');
    }
  };

  const handleCancelTeam = () => {
    setTeamFormData({
      nome: '',
      lider_id: '',
      membros: [],
      status: 'ativa'
    });
    setTeamError('');
    setTeamSuccess('');
    setIsCreatingTeam(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    const onlyNums = value.replace(/[^0-9]/g, '');
    setFormData((prevData) => ({
      ...prevData,
      [name]: onlyNums,
    }));
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.senha !== formData.confirma_senha) {
      setError('As senhas não coincidem.');
      return;
    }

    const formDataForBackend = {
      nome: formData.nome,
      matricula: formData.matricula,
      telefone: formData.telefone,
      email: formData.email,
      senha: formData.senha,
      confirma_senha: formData.confirma_senha,
      cargo: formData.cargo,
    };

    try {
      const response = await fetch('/api/admin/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formDataForBackend),
      });

      const responseText = await response.text();

      if (response.ok) {
        setSuccess(responseText + ' Usuário cadastrado com sucesso!');
        setFormData({
          nome: '',
          matricula: '',
          telefone: '',
          email: '',
          senha: '',
          confirma_senha: '',
          cargo: '',
        });
        setIsEditing(false);
      } else {
        setError(responseText);
      }
    } catch (err) {
      setError('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
    }
  };

  const handleCancel = () => {
    setFormData({
      nome: '',
      matricula: '',
      telefone: '',
      email: '',
      senha: '',
      confirma_senha: '',
      cargo: '',
    });
    setError('');
    setSuccess('');
    setIsEditing(false);
  };

  return (
    <main className="main-content">
      <div className="painel-administrativo">
        <div className="page-header">
          <h1>Painel Administrativo</h1>
          <p>Gerencie usuários e configurações do sistema</p>
        </div>

        <div className="settings-section">
          <h2>Cadastrar Novo Usuário</h2>
          
          {!isEditing ? (
            <div className="form-actions">
              <button 
                className="btn-editar" 
                onClick={() => setIsEditing(true)}
              >
                Cadastrar Usuário
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nome">Nome Completo</label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    placeholder="Digite o nome completo"
                    value={formData.nome || ''}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="matricula">Matrícula</label>
                  <input
                    type="text"
                    id="matricula"
                    name="matricula"
                    inputMode="numeric"
                    placeholder="Digite a matrícula"
                    value={formData.matricula || ''}
                    onChange={handleNumericChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="telefone">Telefone</label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    inputMode="numeric"
                    placeholder="Digite o telefone"
                    value={formData.telefone || ''}
                    onChange={handleNumericChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">E-mail</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Digite o e-mail"
                    value={formData.email || ''}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cargo">Cargo</label>
                  {rolesLoading ? (
                    <div className="loading-roles">Carregando cargos disponíveis</div>
                  ) : (
                    <select
                      id="cargo"
                      name="cargo"
                      value={formData.cargo || ''}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione um cargo</option>
                      {availableRoles.map((role, index) => (
                        <option key={index} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="senha">Senha</label>
                  <input
                    type="password"
                    id="senha"
                    name="senha"
                    placeholder="Digite a senha"
                    value={formData.senha || ''}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmar_senha">Confirmar Senha</label>
                  <input
                    type="password"
                    id="confirmar_senha"
                    name="confirma_senha"
                    placeholder="Confirme a senha"
                    value={formData.confirma_senha || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <div className="form-actions">
                <button type="submit" className="btn-salvar">
                  Salvar Alterações
                </button>
                <button 
                  type="button" 
                  className="btn-cancelar"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="settings-section">
          <div className="section-header">
            <h2>Gerenciar Usuários</h2>
            <button 
              className="btn-editar"
              onClick={loadUsers}
              disabled={usersLoading}
            >
              {usersLoading ? 'Carregando...' : 'Atualizar Lista'}
            </button>
          </div>

          {userError && <div className="error-message">{userError}</div>}
          {userSuccess && <div className="success-message">{userSuccess}</div>}

          {usersLoading ? (
            <div className="loading-message">Carregando usuários...</div>
          ) : users.length === 0 ? (
            <div className="placeholder-content">
              <p>Nenhum usuário encontrado.</p>
            </div>
          ) : (
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Matrícula</th>
                    <th>Email</th>
                    <th>Cargo</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.nome}</td>
                      <td>{user.matricula}</td>
                      <td>{user.email}</td>
                      <td>{user.cargo}</td>
                      <td>
                        <span className={`status-badge ${user.ativo ? 'active' : 'inactive'}`}>
                          {user.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-action btn-toggle"
                            onClick={() => handleUserStatusChange(user.id, !user.ativo)}
                            title={user.ativo ? 'Desativar usuário' : 'Ativar usuário'}
                          >
                            {user.ativo ? 'Desativar' : 'Ativar'}
                          </button>
                          <button
                            className="btn-action btn-delete"
                            onClick={() => handleDeleteUser(user.id)}
                            title="Excluir usuário"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="settings-section">
          <div className="section-header">
            <h2>Gerenciar Equipes</h2>
            <div className="header-buttons">
              {!isCreatingTeam && (
                <button 
                  className="btn-editar"
                  onClick={() => setIsCreatingTeam(true)}
                >
                  Criar Nova Equipe
                </button>
              )}
              <button 
                className="btn-editar"
                onClick={loadTeams}
                disabled={teamsLoading}
              >
                {teamsLoading ? 'Carregando...' : 'Atualizar Lista'}
              </button>
            </div>
          </div>

          {teamError && <div className="error-message">{teamError}</div>}
          {teamSuccess && <div className="success-message">{teamSuccess}</div>}

          {isCreatingTeam && (
            <form onSubmit={handleCreateTeam} className="team-form">
              <h3>Criar Nova Equipe</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="team_nome">Nome da Equipe</label>
                  <input
                    type="text"
                    id="team_nome"
                    name="nome"
                    placeholder="Digite o nome da equipe"
                    value={teamFormData.nome}
                    onChange={handleTeamFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="team_lider">Líder da Equipe</label>
                  <select
                    id="team_lider"
                    name="lider_id"
                    value={teamFormData.lider_id}
                    onChange={handleTeamFormChange}
                    required
                  >
                    <option value="">Selecione um líder</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.nome} - {user.cargo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Membros da Equipe</label>
                  <div className="members-selection">
                    {users.length === 0 ? (
                      <div className="no-users-message">
                        <p>Nenhum usuário disponível. Carregue a lista de usuários primeiro.</p>
                        <button 
                          type="button" 
                          className="btn-editar"
                          onClick={loadUsers}
                        >
                          Carregar Usuários
                        </button>
                      </div>
                    ) : (
                      <div className="members-grid">
                        {users.map((user) => (
                          <div key={user.id} className="member-item">
                            <label className="member-checkbox">
                              <input
                                type="checkbox"
                                checked={teamFormData.membros.includes(user.id)}
                                onChange={() => handleMemberToggle(user.id)}
                              />
                              <div className="member-info">
                                <span className="member-name">{user.nome}</span>
                                <span className="member-role">{user.cargo}</span>
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="members-count">
                      {teamFormData.membros.length} membro(s) selecionado(s)
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="team_status">Status</label>
                  <select
                    id="team_status"
                    name="status"
                    value={teamFormData.status}
                    onChange={handleTeamFormChange}
                  >
                    <option value="ativa">Ativa</option>
                    <option value="inativa">Inativa</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-salvar">
                  Criar Equipe
                </button>
                <button 
                  type="button" 
                  className="btn-cancelar"
                  onClick={handleCancelTeam}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {teamsLoading ? (
            <div className="loading-message">Carregando equipes...</div>
          ) : teams.length === 0 ? (
            <div className="placeholder-content">
              <p>Nenhuma equipe encontrada.</p>
            </div>
          ) : (
            <div className="teams-grid">
              {teams.map((team) => (
                <div key={team.id} className="team-card">
                  <div className="team-header">
                    <h4>{team.nome}</h4>
                    <span className={`status-badge ${team.status}`}>
                      {team.status === 'ativa' ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>
                  
                  <div className="team-info">
                    <p><strong>Líder:</strong> {team.lider_nome || 'Não definido'}</p>
                    <p><strong>Membros:</strong> {team.total_membros || 0}</p>
                    {team.descricao && (
                      <p><strong>Descrição:</strong> {team.descricao}</p>
                    )}
                  </div>

                  <div className="team-actions">
                    <button
                      className="btn-action btn-toggle"
                      onClick={() => handleTeamStatusChange(team.id, team.status === 'ativa' ? 'inativa' : 'ativa')}
                      title={team.status === 'ativa' ? 'Desativar equipe' : 'Ativar equipe'}
                    >
                      {team.status === 'ativa' ? 'Desativar' : 'Ativar'}
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDeleteTeam(team.id)}
                      title="Excluir equipe"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default PainelAdministrativo;