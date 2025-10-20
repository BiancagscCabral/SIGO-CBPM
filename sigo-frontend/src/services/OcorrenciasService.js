class OcorrenciasService {

  static async criarOcorrencia(dados) {
    try {
  const { anexos, ...dadosSemAnexos } = dados || {};

      const normalizeText = (s) => s ? String(s).toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '') : '';

      const mapPrioridade = (p) => {
        if (!p && p !== '') return undefined;
        const v = normalizeText(p);
        if (v === 'alta' || v === 'high') return 'high';
        if (v === 'media' || v === 'medium' || v === 'med') return 'medium';
        if (v === 'baixa' || v === 'low') return 'low';
        return v || undefined;
      };

      const mapCategoria = (t) => {
        const v = normalizeText(t);
        if (!v) return '';
        if (v.includes('incend') || v.includes('incênd')) return 'fire';
        if (v.includes('aph') || v.includes('pre-hospital') || v.includes('medic') || v.includes('pre hospital')) return 'medic_emergency';
        if (v.includes('transito') || v.includes('acident')) return 'traffic_accident';
        if (v.includes('outro') || v === 'outros') return 'other';
        return v.replace(/\s+/g, '_');
      };

      const mapSubcategoria = (s) => {
        const v = normalizeText(s);
        if (!v) return '';
        if (v.includes('injured') || (v.includes('animal') && v.includes('ferid'))) return 'injured_animal';
        if (v.includes('flood') || v.includes('alag')) return 'flood';
        if (v.includes('tree') || v.includes('arvor') || v.includes('árvore')) return 'tree_crash';
        if (v.includes('motor') || v.includes('moto') || v.includes('motociclet')) return 'motorcycle_crash';
        if (v.includes('capot') || v.includes('capotamento')) return 'rollover';
        if (v.includes('atrop') || v.includes('atropelamento')) return 'run_over';
        if (v.includes('colis')) return 'collision';
        if (v.includes('serious') || v.includes('ferimento') || v.includes('grave')) return 'serious_injury';
        if (v.includes('seiz') || v.includes('convuls')) return 'seizure';
        if (v.includes('heart') || v.includes('cardiaca') || v.includes('parada')) return 'heart_stop';
        if (v.includes('pre') && v.includes('hospital') || v === 'aph') return 'pre_hospital_care';
        if (v.includes('intoxic')) return 'intoxication';
        if (v.includes('resid') || v.includes('residencial')) return 'residential';
        if (v.includes('comerc')) return 'comercial';
        if (v.includes('veget')) return 'vegetation';
        if (v.includes('veicul') || v.includes('veiculo')) return 'vehicle';
        return v.replace(/\s+/g, '_');
      };

      const parseCoordinates = (coord) => {
        if (!coord) return null;
        if (Array.isArray(coord)) return coord.map(c => Number(c));
        if (typeof coord === 'string') {
          const parts = coord.split(',').map(p => p.trim()).filter(Boolean);
          if (parts.length >= 2) return [Number(parts[0]), Number(parts[1])];
        }
        return null;
      };

      const buildPayloadForBackend = (raw) => {
        if (raw && typeof raw.categoria === 'string') return raw;

        const ocorr = raw.ocorrencia || {};
        const loc = raw.localizacao || {};

        const rawCategoria = mapCategoria(ocorr.tipo || ocorr.tipoOcorrencia || raw.categoria || '');
        const rawSubcategoria = mapSubcategoria(ocorr.subtipo || ocorr.subtipoOcorrencia || raw.subcategoria || '');
        const mappedPrior = mapPrioridade(ocorr.prioridade || raw.prioridade || '');

        const payload = {
          categoria: rawCategoria || undefined,
          subcategoria: rawSubcategoria || undefined,
          prioridade: mappedPrior || undefined,
          descricao: ocorr.descricao || raw.descricao || ''
        };


  const ponto = loc.pontoReferencia || loc.ponto_de_referencia || raw.pontoReferencia || raw.ponto_de_referencia || raw.pontoDeReferencia || '';
  payload.pontoDeReferencia = ponto || '';

        const coords = parseCoordinates(loc.coordenadas || loc.coordenates || raw.coordenadas || raw.coordenates || raw.gps || null);
        if (coords) payload.gps = coords;
        if (ocorr.idEquipes && Array.isArray(ocorr.idEquipes)) payload.idEquipes = ocorr.idEquipes;
        else if (ocorr.idEquipe) payload.idEquipes = [ocorr.idEquipe];
        else if (raw.idEquipes && Array.isArray(raw.idEquipes)) payload.idEquipes = raw.idEquipes;
        else if (raw.idEquipe) payload.idEquipes = [raw.idEquipe];

        if (ocorr.codigoViatura || raw.codigoViatura) payload.codigoViatura = ocorr.codigoViatura || raw.codigoViatura;

        if (raw.anexos) {
          const anex = {};
          if (Array.isArray(raw.anexos.fotos) && raw.anexos.fotos.length > 0) anex.fotos = raw.anexos.fotos;
          if (Array.isArray(raw.anexos.videos) && raw.anexos.videos.length > 0) anex.videos = raw.anexos.videos;
          if (Object.keys(anex).length > 0) payload.anexos = anex;
        }

        return payload;
      };

      const payload = buildPayloadForBackend({ ...dadosSemAnexos, anexos });
      console.warn('OcorrenciasService.criarOcorrencia - enviando JSON (payload normalizado)', payload);
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

        let parsedBody = null;
        let rawText = null;

        try {
          const text = await response.text();
          rawText = text;
          try {
            parsedBody = JSON.parse(text);
          } catch (e) {
            parsedBody = null;
          }
        } catch (e) {
        }

        return {
          success: false,
          status: response.status,
          error: parsedBody || rawText || `HTTP ${response.status}`,
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