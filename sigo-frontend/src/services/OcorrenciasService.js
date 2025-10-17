class OcorrenciasService {

  static _converterArquivoParaBase64(arquivo) {
    return new Promise((resolve, reject) => {
      const leitor = new FileReader();
      leitor.onload = () => resolve(leitor.result);
      leitor.onerror = (erro) => reject(erro);
      leitor.readAsDataURL(arquivo);
    });
  }

  static async criarOcorrencia(dados) {
    try {
      const { anexos, ...dadosSemAnexos } = dados;

      const fotosBase64 = anexos?.fotosOriginais
        ? await Promise.all(anexos.fotosOriginais.map(foto => OcorrenciasService._converterArquivoParaBase64(foto)))
        : [];

      const videosBase64 = anexos?.videosOriginais
        ? await Promise.all(anexos.videosOriginais.map(video => OcorrenciasService._converterArquivoParaBase64(video)))
        : [];

      const payload = {
        ...dadosSemAnexos,
        anexos: {
          fotos: fotosBase64,
          videos: videosBase64
        }
      };

      const response = await fetch('/api/occurrence/new', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
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