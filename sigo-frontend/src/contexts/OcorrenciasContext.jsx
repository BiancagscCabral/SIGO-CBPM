import { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';
import OcorrenciasService from '../services/OcorrenciasService';

const OcorrenciasContext = createContext();

export const useOcorrencias = () => {
  const context = useContext(OcorrenciasContext);
  if (!context) {
    throw new Error('useOcorrencias deve ser usado dentro de um OcorrenciasProvider');
  }
  return context;
};

export const OcorrenciasProvider = ({ children }) => {
  const [ocorrencias, setOcorrencias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userProfile } = useUser();

  const obterUsuarioAtual = () => {
    if (userProfile && userProfile.id) {
      return {
        id: userProfile.id,
        nome: userProfile.full_name || '',
        matricula: userProfile.registration || ''
      };
    }
    
    try {
      const userIdCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('USER_ID='))
        ?.split('=')[1];
      
      return userIdCookie ? { id: userIdCookie, nome: '', matricula: '' } : null;
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
  };

  const fetchAddressFromCoords = async (lat, lon) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`);
      if (!response.ok) return null;
      const data = await response.json();
      if (!data || !data.address) return null;
      const address = data.address;
      const logradouro = address.road || address.street || address.pedestrian || address.footway || address.residential || '';
      const numero = address.house_number || '';
      const bairro = address.neighbourhood || address.suburb || address.city_district || '';
      const cidade = address.city || address.town || address.village || address.county || '';
      const uf = address.state || address.region || '';
      const cep = address.postcode || '';

      const enderecoObj = {
        logradouro: logradouro,
        numero: numero,
        bairro: bairro,
        cidade: cidade,
        uf: uf,
        cep: cep,
        formatted: [logradouro, numero].filter(Boolean).join(', ') + (bairro ? ` - ${bairro}` : '') + (cidade ? `, ${cidade}` : '') + (uf ? `/${uf}` : '') + (cep ? `, CEP: ${cep}` : ''),
        display_name: data.display_name || ''
      };

      return enderecoObj;
    } catch (error) {
      console.error('Erro no reverse geocoding:', error);
      return null;
    }
  };

  const preencherEnderecosPorCoordenadas = async (ocorrenciasList) => {
    if (!Array.isArray(ocorrenciasList) || ocorrenciasList.length === 0) return;

    for (const ocorrencia of ocorrenciasList) {
      try {
        const coords = ocorrencia.chamado?.coordenadas;
        const enderecoAtual = ocorrencia.endereco || {};
        if (Array.isArray(coords) && coords.length >= 2 && !enderecoAtual.logradouro) {
          const lat = parseFloat(coords[0]);
          const lon = parseFloat(coords[1]);
          if (!isNaN(lat) && !isNaN(lon)) {
            const endereco = await fetchAddressFromCoords(lat, lon);
            if (endereco) {
              setOcorrencias(prev => prev.map(o => o.id === ocorrencia.id ? { ...o, endereco: { ...o.endereco, ...endereco } } : o));
            }
       
            await new Promise(r => setTimeout(r, 150));
          }
        }
      } catch (error) {
        console.error('Erro ao preencher endereço da ocorrência', ocorrencia.id, error);
      }
    }
  };

  const carregarOcorrencias = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      if (userProfile?.user_role === 'desenvolvedor') {
        result = await OcorrenciasService.listarTodasOcorrencias();
      } else {
        result = await OcorrenciasService.listarOcorrencias();
      }
      
      if (result.success) {
        const ocorrenciasConvertidas = result.data.map(ocorrenciaBackend =>
          converterDoBackendParaFrontend(ocorrenciaBackend)
        );

        let localSaved = [];
        try {
          localSaved = JSON.parse(localStorage.getItem('minhasOcorrencias') || '[]');
        } catch (e) {
          localSaved = [];
        }

        const merged = [
          ...localSaved.filter(ls => !ocorrenciasConvertidas.some(oc => String(oc.id) === String(ls.id))),
          ...ocorrenciasConvertidas
        ];

        setOcorrencias(merged);
        setTimeout(() => {
          preencherEnderecosPorCoordenadas(merged);
        }, 50);
      } else {
        console.warn('Falha ao carregar do backend, usando localStorage como fallback');
        const ocorrenciasSalvas = localStorage.getItem('minhasOcorrencias');
        if (ocorrenciasSalvas) {
          try {
            const ocorrenciasCarregadas = JSON.parse(ocorrenciasSalvas);
            setOcorrencias(ocorrenciasCarregadas);
          } catch (error) {
            console.error('Erro ao carregar ocorrências do localStorage:', error);
            setOcorrencias([]);
          }
        } else {
          setOcorrencias([]);
        }
        setError(result.error || result.message);
      }
    } catch (error) {
      console.error('Erro ao carregar ocorrências:', error);
      setError(error.message || 'Erro de conexão com o servidor');
      
      const ocorrenciasSalvas = localStorage.getItem('minhasOcorrencias');
      if (ocorrenciasSalvas) {
        try {
          const ocorrenciasCarregadas = JSON.parse(ocorrenciasSalvas);
          setOcorrencias(ocorrenciasCarregadas);
        } catch (error) {
          console.error('Erro ao carregar ocorrências do localStorage:', error);
          setOcorrencias([]);
        }
      } else {
        setOcorrencias([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile?.id) {
      carregarOcorrencias();
    }
  }, [userProfile?.id, userProfile?.user_role]);

  useEffect(() => {
    if (ocorrencias.length > 0) {
      localStorage.setItem('minhasOcorrencias', JSON.stringify(ocorrencias));
    }
  }, [ocorrencias]);

  const converterDoBackendParaFrontend = (ocorrenciaBackend) => {
    const id = ocorrenciaBackend.id || gerarIdOcorrencia();

    const rawPriority = ocorrenciaBackend.priority || ocorrenciaBackend.prioridade || '';
    const prioridadeMap = (p) => {
      if (!p && p !== '') return 'Baixa';
      const v = String(p).toLowerCase();
      if (v === 'high' || v === 'alta') return 'Alta';
      if (v === 'medium' || v === 'média' || v === 'media') return 'Média';
      if (v === 'low' || v === 'baixa') return 'Baixa';
      return String(p);
    };

    const prioridadeBackend = prioridadeMap(rawPriority || 'low');
    const categoriaToken = ocorrenciaBackend.categoria || ocorrenciaBackend.tipo || '';
    const subcategoriaToken = ocorrenciaBackend.subcategoria || ocorrenciaBackend.subtipo || '';

    const categoriaLabelMap = {
      'fire': 'Incêndio',
      'medic_emergency': 'Emergência Médica',
      'traffic_accident': 'Acidente de Trânsito',
      'other': 'Outro'
    };

    const subcategoriaLabelMap = {
      'residential': 'Residencial',
      'comercial': 'Comercial',
      'vegetation': 'Vegetação',
      'vehicle': 'Veículo',
      'heart_stop': 'Parada cardíaca',
      'seizure': 'Convulsão',
      'serious_injury': 'Ferimento grave',
      'intoxication': 'Intoxicação',
      'pre_hospital_care': 'Atendimento Pré-Hospitalar',
      'collision': 'Colisão',
      'run_over': 'Atropelamento',
      'rollover': 'Capotamento',
      'motorcycle_crash': 'Queda de motocicleta',
      'tree_crash': 'Queda de árvore',
      'flood': 'Alagamento',
      'injured_animal': 'Animal ferido'
    };

    const categoriaLabel = categoriaLabelMap[categoriaToken] || (categoriaToken ? String(categoriaToken) : '');
    const subcategoriaLabel = subcategoriaLabelMap[subcategoriaToken] || (subcategoriaToken ? String(subcategoriaToken) : '');

    const createdAt = ocorrenciaBackend.created_at || ocorrenciaBackend.data_criacao || null;
    let aberturaISO;
    try {
      if (!createdAt) aberturaISO = new Date().toISOString();
      else if (typeof createdAt === 'number') aberturaISO = new Date(createdAt * 1000).toISOString();
      else {
        const parsed = Date.parse(createdAt);
        aberturaISO = isNaN(parsed) ? new Date().toISOString() : new Date(parsed).toISOString();
      }
    } catch (e) {
      aberturaISO = new Date().toISOString();
    }

  const applicantId = ocorrenciaBackend.applicant_id || ocorrenciaBackend.usuario_id || ocorrenciaBackend.applicantId || null;

    const brigadeId = ocorrenciaBackend.brigade_id || ocorrenciaBackend.brigadeId || null;
    const idEquipesArray = ocorrenciaBackend.idEquipes || ocorrenciaBackend.id_equipes || ocorrenciaBackend.idEquipe || ocorrenciaBackend.idsEquipe || null;
    const equipes = [];

    if (Array.isArray(brigadeId)) {
      brigadeId.forEach((b) => {
        if (b) equipes.push({ id: b });
      });
    } else if (typeof brigadeId === 'string' && brigadeId) {
      equipes.push({ id: brigadeId });
    } else if (brigadeId && typeof brigadeId === 'object' && brigadeId.id) {
      equipes.push({ id: brigadeId.id });
    }

    if (Array.isArray(idEquipesArray)) {
      idEquipesArray.forEach((e) => {
        if (e) equipes.push({ id: e });
      });
    } else if (typeof idEquipesArray === 'string' && idEquipesArray) {
      equipes.push({ id: idEquipesArray });
    }

    const rawGps = ocorrenciaBackend.gps || ocorrenciaBackend.coordenadas || null;
    let coordenadas = null;
    if (Array.isArray(rawGps) && rawGps.length >= 2) {
      const lat = parseFloat(rawGps[0]);
      const lon = parseFloat(rawGps[1]);
      if (!isNaN(lat) && !isNaN(lon)) coordenadas = [lat, lon];
    }

    return {
      id,
      status: 'Em andamento',
      prioridade: prioridadeBackend,
      timestamps: {
        abertura: aberturaISO,
        finalizacao: null
      },
      endereco: {
        logradouro: '',
        numero: '',
        bairro: '',
        cidade: '',
        uf: ''
      },
      chamado: {
        tipoToken: categoriaToken || '',
        subtipoToken: subcategoriaToken || '',
        tipo: categoriaLabel || (ocorrenciaBackend.categoria || ocorrenciaBackend.tipo || ''),
        subtipo: subcategoriaLabel || (ocorrenciaBackend.subcategoria || ocorrenciaBackend.subtipo || ''),
        detalhes: ocorrenciaBackend.descricao || 'Ocorrência registrada pelo sistema',
        pontoReferencia: ocorrenciaBackend.ponto_referencia || ocorrenciaBackend.pontoDeReferencia || null,
        coordenadas: coordenadas
      },
      equipes: equipes,
      anexos: {
        fotos: 0,
        videos: 0
      },
      metadata: {
        dataRegistro: aberturaISO,
        assinatura: false,
        usuarioId: applicantId || (typeof userProfile !== 'undefined' && userProfile && userProfile.id ? userProfile.id : null),
        nomeUsuario: ocorrenciaBackend.applicant_name || ocorrenciaBackend.nomeUsuario || ocorrenciaBackend.nome || ocorrenciaBackend.creator_name || userProfile?.full_name || '',
        matriculaUsuario: ocorrenciaBackend.applicant_matricula || ocorrenciaBackend.matricula || userProfile?.registration || ''
      }
    };
  };

  const gerarIdOcorrencia = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return String(timestamp).slice(-6) + String(random).padStart(3, '0');
  };

  const converterParaFormatoMinhasOcorrencias = (dadosRegistro) => {
    const agora = new Date().toISOString();
    const usuarioAtual = obterUsuarioAtual();
    
  const endereco = dadosRegistro.localizacao?.endereco || '';
  const partesEndereco = endereco.split(',');
    
    return {
      id: gerarIdOcorrencia(),
      status: 'Em andamento',
      prioridade: dadosRegistro.ocorrencia?.prioridade || 'Baixa',
      timestamps: {
        abertura: agora,
        finalizacao: null
      },
      endereco: {
        logradouro: partesEndereco[0]?.trim() || endereco,
        numero: partesEndereco[1]?.trim() || '',
        bairro: partesEndereco[2]?.trim() || '',
        cidade: partesEndereco[3]?.trim() || '',
        uf: partesEndereco[4]?.trim() || ''
      },
      chamado: {
        tipo: dadosRegistro.ocorrencia?.tipo || '',
        subtipo: dadosRegistro.ocorrencia?.subtipo || '',
        detalhes: dadosRegistro.ocorrencia?.descricao || 'Ocorrência registrada pelo sistema',
        pontoReferencia: dadosRegistro.localizacao?.pontoReferencia || null,
        coordenadas: (typeof dadosRegistro.localizacao?.coordenadas === 'string')
          ? dadosRegistro.localizacao.coordenadas.split(',').map(c => parseFloat(c.trim())).filter(n => !isNaN(n))
          : dadosRegistro.localizacao?.coordenadas || null
      },
      equipes: dadosRegistro.ocorrencia?.codigoViatura ? [{
        id: dadosRegistro.ocorrencia.codigoViatura,
        efetivo: parseInt(dadosRegistro.ocorrencia.membrosEquipe) || 1
      }] : [],
      anexos: {
        fotos: dadosRegistro.anexos?.quantidadeFotos || 0,
        videos: dadosRegistro.anexos?.quantidadeVideos || 0
      },
      metadata: {
        dataRegistro: dadosRegistro.metadata?.dataRegistro || agora,
        assinatura: !!dadosRegistro.assinatura,
        usuarioId: usuarioAtual?.id || userProfile?.id || null,
        nomeUsuario: usuarioAtual?.nome || userProfile?.full_name || '',
        matriculaUsuario: usuarioAtual?.matricula || userProfile?.registration || ''
      }
    };
  };

  const adicionarOcorrencia = async (dadosRegistro) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await OcorrenciasService.criarOcorrencia(dadosRegistro);
      
      if (result.success) {
        const ocorrenciaConvertida = converterDoBackendParaFrontend(result.data);

        const merged = { ...ocorrenciaConvertida };
        merged.chamado = { ...ocorrenciaConvertida.chamado };
        merged.equipes = Array.isArray(ocorrenciaConvertida.equipes) ? [...ocorrenciaConvertida.equipes] : [];

        try {
          const tipo = dadosRegistro.categoria || dadosRegistro.tipo;
          const subtipo = dadosRegistro.subcategoria || dadosRegistro.subtipo;
          const detalhes = dadosRegistro.descricao || dadosRegistro.detalhes || '';
          const pontoRef = dadosRegistro.pontoDeReferencia || dadosRegistro.ponto_referencia || dadosRegistro.pontoReferencia || null;

          const categoriaLabelMap = {
            'fire': 'Incêndio',
            'medic_emergency': 'Emergência Médica',
            'traffic_accident': 'Acidente de Trânsito',
            'other': 'Outro'
          };
          const subcategoriaLabelMap = {
            'residential': 'Residencial',
            'comercial': 'Comercial',
            'vegetation': 'Vegetação',
            'vehicle': 'Veículo',
            'heart_stop': 'Parada cardíaca',
            'seizure': 'Convulsão',
            'serious_injury': 'Ferimento grave',
            'intoxication': 'Intoxicação',
            'pre_hospital_care': 'Atendimento Pré-Hospitalar',
            'collision': 'Colisão',
            'run_over': 'Atropelamento',
            'rollover': 'Capotamento',
            'motorcycle_crash': 'Queda de motocicleta',
            'tree_crash': 'Queda de árvore',
            'flood': 'Alagamento',
            'injured_animal': 'Animal ferido'
          };

          if (tipo) merged.chamado.tipo = (categoriaLabelMap[tipo] || tipo);
          if (subtipo) merged.chamado.subtipo = (subcategoriaLabelMap[subtipo] || subtipo);
          if (detalhes) merged.chamado.detalhes = detalhes;
          if (pontoRef) merged.chamado.pontoReferencia = pontoRef;

          const gpsRaw = dadosRegistro.gps || dadosRegistro.coordenadas || null;
          if (Array.isArray(gpsRaw) && gpsRaw.length >= 2) {
            merged.chamado.coordenadas = [parseFloat(gpsRaw[0]), parseFloat(gpsRaw[1])];
          } else if (typeof gpsRaw === 'string' && gpsRaw.includes(',')) {
            const parts = gpsRaw.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
            if (parts.length >= 2) merged.chamado.coordenadas = parts;
          }

          const ids = [];
          if (dadosRegistro.idEquipe) ids.push(dadosRegistro.idEquipe);
          if (dadosRegistro.id_equipe) ids.push(dadosRegistro.id_equipe);
          if (Array.isArray(dadosRegistro.idEquipes)) ids.push(...dadosRegistro.idEquipes);
          if (Array.isArray(dadosRegistro.id_equipes)) ids.push(...dadosRegistro.id_equipes);
          if (dadosRegistro.codigoViatura) ids.push(dadosRegistro.codigoViatura);

          ids.forEach(id => {
            if (!merged.equipes.some(e => String(e.id) === String(id))) {
              merged.equipes.push({ id });
            }
          });

          if (!merged.metadata) merged.metadata = {};
          const usuarioAtual = obterUsuarioAtual();
          merged.metadata.usuarioId = merged.metadata.usuarioId || (usuarioAtual && usuarioAtual.id) || (userProfile && userProfile.id) || null;

          const enderecoFormulario = dadosRegistro.endereco || dadosRegistro.localizacao?.endereco || null;
          if (enderecoFormulario && typeof enderecoFormulario === 'string' && enderecoFormulario.trim()) {
            let cleaned = enderecoFormulario.replace(/CEP:\s*/i, '').trim();
            const partes = cleaned.split(',').map(p => p.trim()).filter(Boolean);

            let uf = '';
            let cep = '';
            const last = partes[partes.length - 1] || '';
            if (/^\d{5}-?\d{3}$/.test(last)) {
              cep = last;
              partes.pop();
            } else if (/^[A-Za-z]{2}$/.test(last)) {
              uf = last.toUpperCase();
              partes.pop();
            }

            const logradouro = partes[0] || cleaned;
            const numero = partes[1] || '';
            const bairro = partes[2] || '';
            const cidade = partes[3] || '';

            merged.endereco = {
              logradouro: logradouro,
              numero: numero,
              bairro: bairro,
              cidade: cidade,
              uf: uf,
              cep: cep,
              formatted: `${logradouro}${numero ? ', ' + numero : ''}${bairro ? ' - ' + bairro : ''}${cidade ? ', ' + cidade : ''}${uf ? '/' + uf : ''}${cep ? ', CEP: ' + cep : ''}`
            };
          } else if (!merged.endereco || !merged.endereco.logradouro) {
            const coords = merged.chamado?.coordenadas;
            if (Array.isArray(coords) && coords.length >= 2) {
              try {
                const addr = await fetchAddressFromCoords(coords[0], coords[1]);
                if (addr) merged.endereco = { ...merged.endereco, ...addr };
              } catch (e) {
                console.error('Erro ao buscar endereco imediato:', e);
              }
            }
          }
        } catch (e) {
          console.error('Erro ao mesclar dados do formulário na ocorrência retornada:', e);
        }

        setOcorrencias(prevOcorrencias => [merged, ...prevOcorrencias]);
        try {
          const locais = JSON.parse(localStorage.getItem('minhasOcorrencias') || '[]');
          const exists = locais.some(l => String(l.id) === String(merged.id));
          if (!exists) {
            locais.push(merged);
            localStorage.setItem('minhasOcorrencias', JSON.stringify(locais));
          }
        } catch (e) {
          console.error('Erro ao salvar ocorrencia em localStorage:', e);
        }

        return merged.id;
      } else {
        console.warn('Falha ao salvar no backend, usando localStorage como fallback');
        const novaOcorrencia = converterParaFormatoMinhasOcorrencias(dadosRegistro);
        setOcorrencias(prevOcorrencias => [novaOcorrencia, ...prevOcorrencias]);
        setError(result.message);
        return novaOcorrencia.id;
      }
    } catch (error) {
      console.error('Erro ao adicionar ocorrência:', error);
      const novaOcorrencia = converterParaFormatoMinhasOcorrencias(dadosRegistro);
      setOcorrencias(prevOcorrencias => [novaOcorrencia, ...prevOcorrencias]);
      setError('Erro de conexão com o servidor');
      return novaOcorrencia.id;
    } finally {
      setLoading(false);
    }
  };

  const atualizarOcorrencia = async (id, dadosAtualizados) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await OcorrenciasService.atualizarOcorrencia(id, dadosAtualizados);
      
      if (result.success) {
        setOcorrencias(prevOcorrencias =>
          prevOcorrencias.map(ocorrencia =>
            ocorrencia.id === id ? { ...ocorrencia, ...dadosAtualizados } : ocorrencia
          )
        );
      } else {
        setOcorrencias(prevOcorrencias =>
          prevOcorrencias.map(ocorrencia =>
            ocorrencia.id === id ? { ...ocorrencia, ...dadosAtualizados } : ocorrencia
          )
        );
        setError(result.message);
      }
    } catch (error) {
      console.error('Erro ao atualizar ocorrência:', error);
      setOcorrencias(prevOcorrencias =>
        prevOcorrencias.map(ocorrencia =>
          ocorrencia.id === id ? { ...ocorrencia, ...dadosAtualizados } : ocorrencia
        )
      );
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const removerOcorrencia = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await OcorrenciasService.deletarOcorrencia(id);
      
      if (result.success) {
        setOcorrencias(prevOcorrencias =>
          prevOcorrencias.filter(ocorrencia => ocorrencia.id !== id)
        );
      } else {
        setOcorrencias(prevOcorrencias =>
          prevOcorrencias.filter(ocorrencia => ocorrencia.id !== id)
        );
        setError(result.message);
      }
    } catch (error) {
      console.error('Erro ao remover ocorrência:', error);
      setOcorrencias(prevOcorrencias =>
        prevOcorrencias.filter(ocorrencia => ocorrencia.id !== id)
      );
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const sincronizarOcorrenciasOffline = async () => {
    const ocorrenciasOffline = JSON.parse(localStorage.getItem('ocorrencias_offline') || '[]');
    
    if (ocorrenciasOffline.length === 0) return;

    console.log('Sincronizando', ocorrenciasOffline.length, 'ocorrências offline...');
    
    for (const ocorrencia of ocorrenciasOffline) {
      try {
        const result = await OcorrenciasService.criarOcorrencia(ocorrencia);
        if (result.success) {
          console.log('Ocorrência sincronizada:', ocorrencia.id);
        }
      } catch (error) {
        console.error('Erro ao sincronizar ocorrência:', error);
      }
    }
    
    localStorage.removeItem('ocorrencias_offline');
    
    await carregarOcorrencias();
  };

  useEffect(() => {
    const handleOnline = () => {
      if (userProfile?.id) {
        sincronizarOcorrenciasOffline();
      }
    };

    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [userProfile?.id]);

  const limparOcorrencias = () => {
    setOcorrencias([]);
    localStorage.removeItem('minhasOcorrencias');
  };

  const value = {
    ocorrencias,
    loading,
    error,
    adicionarOcorrencia,
    atualizarOcorrencia,
    removerOcorrencia,
    limparOcorrencias,
    carregarOcorrencias,
    sincronizarOcorrenciasOffline
  };

  return (
    <OcorrenciasContext.Provider value={value}>
      {children}
    </OcorrenciasContext.Provider>
  );
};