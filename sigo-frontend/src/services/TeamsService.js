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