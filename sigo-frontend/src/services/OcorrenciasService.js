class OcorrenciasService {

  static async criarOcorrencia(dados) {
    try {
      const formData = new FormData();
      
      const { anexos, ...dadosSemAnexos } = dados;
      
      formData.append('dados', JSON.stringify(dadosSemAnexos));
      
      if (anexos?.fotosOriginais) {
        anexos.fotosOriginais.forEach((foto, index) => {
          formData.append(`foto_${index}`, foto, foto.name);
        });
      }
      
      if (anexos?.videosOriginais) {
        anexos.videosOriginais.forEach((video, index) => {
          formData.append(`video_${index}`, video, video.name);
        });
      }

      const response = await fetch('/api/occurrence/new', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          data: result,
          message: 'Ocorrência criada com sucesso!'
        };
      } else {
        const errorText = await response.text();
        return {
          success: false,
          error: errorText,
          message: 'Erro ao criar ocorrência no servidor'
        };
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      return {
        success: false,
        error: error.message,
        message: 'Erro de conexão com o servidor'
      };
    }
  }

  static async listarOcorrencias() {
    try {
      const userResponse = await fetch('/api/user/profile', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!userResponse.ok) {
        throw new Error('Erro ao obter perfil do usuário');
      }

      const userData = await userResponse.json();
      const userId = userData.id;

      const response = await fetch(`/api/user/${userId}/occurrences`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const ocorrencias = await response.json();
        return {
          success: true,
          data: ocorrencias,
          message: 'Ocorrências carregadas com sucesso!'
        };
      } else {
        const errorText = await response.text();
        return {
          success: false,
          error: errorText,
          message: 'Erro ao carregar ocorrências do servidor'
        };
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      return {
        success: false,
        error: error.message,
        message: 'Erro de conexão com o servidor'
      };
    }
  }

  static async listarTodasOcorrencias() {
    try {
      const response = await fetch('/api/occurrences', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const ocorrencias = await response.json();
        return {
          success: true,
          data: ocorrencias,
          message: 'Todas as ocorrências carregadas com sucesso!'
        };
      } else {
        const errorText = await response.text();
        return {
          success: false,
          error: errorText,
          message: 'Erro ao carregar todas as ocorrências do servidor'
        };
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      return {
        success: false,
        error: error.message,
        message: 'Erro de conexão com o servidor'
      };
    }
  }

  static async buscarOcorrenciaPorId(id) {
    try {
      const response = await fetch(`/api/occurrence/${id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const ocorrencia = await response.json();
        return {
          success: true,
          data: ocorrencia,
          message: 'Ocorrência encontrada!'
        };
      } else {
        const errorText = await response.text();
        return {
          success: false,
          error: errorText,
          message: 'Erro ao buscar ocorrência'
        };
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      return {
        success: false,
        error: error.message,
        message: 'Erro de conexão com o servidor'
      };
    }
  }

  static async atualizarOcorrencia(id, dadosAtualizados) {
    try {
      const response = await fetch(`/api/occurrence/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosAtualizados)
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          data: result,
          message: 'Ocorrência atualizada com sucesso!'
        };
      } else {
        const errorText = await response.text();
        return {
          success: false,
          error: errorText,
          message: 'Erro ao atualizar ocorrência'
        };
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      return {
        success: false,
        error: error.message,
        message: 'Erro de conexão com o servidor'
      };
    }
  }

  static async deletarOcorrencia(id) {
    try {
      const response = await fetch(`/api/occurrence/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return {
          success: true,
          message: 'Ocorrência deletada com sucesso!'
        };
      } else {
        const errorText = await response.text();
        return {
          success: false,
          error: errorText,
          message: 'Erro ao deletar ocorrência'
        };
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      return {
        success: false,
        error: error.message,
        message: 'Erro de conexão com o servidor'
      };
    }
  }
}

export default OcorrenciasService;