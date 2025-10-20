class TeamsService {
  static async getTeamsStats() {
    try {
      const response = await fetch('/api/admin/teams/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Erro ao buscar estatísticas de equipes');
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas de equipes:', error);
      throw error;
    }
  }

  static async getTeams() {
    try {
      const response = await fetch('/api/admin/teams', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Erro ao buscar equipes');
      }
    } catch (error) {
      console.error('Erro ao buscar equipes:', error);
      throw error;
    }
  }

  static async getTeamById(teamId) {
    try {
      const response = await fetch(`/api/admin/teams/${teamId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Erro ao buscar equipe: ${response.status} - ${err}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar equipe por id:', error);
      throw error;
    }
  }

  static async createTeam(teamData) {
    try {
      const response = await fetch('/api/admin/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(teamData),
      });

      if (!response.ok) {
        const err = await response.text();
        return { success: false, error: `Erro ao criar equipe: ${response.status} - ${err}` };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao criar equipe:', error);
      return { success: false, error: error.message };
    }
  }

  static async updateTeam(teamId, teamData) {
    try {
      const response = await fetch(`/api/admin/teams/${teamId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(teamData),
      });

      if (!response.ok) {
        const err = await response.text();
        return { success: false, error: `Erro ao atualizar equipe: ${response.status} - ${err}` };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao atualizar equipe:', error);
      return { success: false, error: error.message };
    }
  }

  static async deleteTeam(teamId) {
    try {
      const response = await fetch(`/api/admin/teams/${teamId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        const err = await response.text();
        return { success: false, error: `Erro ao excluir equipe: ${response.status} - ${err}` };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao excluir equipe:', error);
      return { success: false, error: error.message };
    }
  }

  static async updateTeamStatus(teamId, status) {
    try {
      const response = await fetch(`/api/admin/teams/${teamId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Erro ao atualizar status da equipe');
      }
    } catch (error) {
      console.error('Erro ao atualizar status da equipe:', error);
      throw error;
    }
  }
}

export default TeamsService;