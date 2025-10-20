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
  const { userProfile, isLoading: isUserLoading } = useUser();

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
        setOcorrencias(ocorrenciasConvertidas);
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
        setError(result.message);
      }
    } catch (error) {
      console.error('Erro ao carregar ocorrências:', error);
      setError('Erro de conexão com o servidor');
      
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
    if (!isUserLoading && userProfile?.id) {
      carregarOcorrencias();
    }
  }, [userProfile?.id, userProfile?.user_role, isUserLoading]);

  useEffect(() => {
    if (ocorrencias.length > 0) {
      localStorage.setItem('minhasOcorrencias', JSON.stringify(ocorrencias));
    }
  }, [ocorrencias]);

  const converterDoBackendParaFrontend = (ocorrenciaBackend) => {
    return {
      id: ocorrenciaBackend.id || gerarIdOcorrencia(),
      status: ocorrenciaBackend.status || 'Em andamento',
      prioridade: ocorrenciaBackend.prioridade || 'Baixa',
      timestamps: {
        abertura: ocorrenciaBackend.data_criacao || new Date().toISOString(),
        finalizacao: ocorrenciaBackend.data_finalizacao || null
      },
      endereco: {
        logradouro: ocorrenciaBackend.endereco?.logradouro || '',
        numero: ocorrenciaBackend.endereco?.numero || '',
        bairro: ocorrenciaBackend.endereco?.bairro || '',
        cidade: ocorrenciaBackend.endereco?.cidade || '',
        uf: ocorrenciaBackend.endereco?.uf || ''
      },
      chamado: {
        tipo: ocorrenciaBackend.tipo || '',
        subtipo: ocorrenciaBackend.subtipo || '',
        detalhes: ocorrenciaBackend.descricao || 'Ocorrência registrada pelo sistema',
        pontoReferencia: ocorrenciaBackend.ponto_referencia || null,
        coordenadas: ocorrenciaBackend.coordenadas || null
      },
      equipes: ocorrenciaBackend.equipes || [],
      anexos: {
        fotos: ocorrenciaBackend.anexos?.fotos?.length || 0,
        videos: ocorrenciaBackend.anexos?.videos?.length || 0
      },
      metadata: {
        dataRegistro: ocorrenciaBackend.data_criacao || new Date().toISOString(),
        assinatura: !!ocorrenciaBackend.assinatura,
        usuarioId: ocorrenciaBackend.usuario_id || null,
        nomeUsuario: ocorrenciaBackend.usuario_nome || '',
        matriculaUsuario: ocorrenciaBackend.usuario_matricula || ''
      },
      isLocal: false
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
        coordenadas: dadosRegistro.localizacao?.coordenadas || null
      },

      equipes: (dadosRegistro.ocorrencia?.idEquipe || dadosRegistro.ocorrencia?.codigoViatura) ? [{
        id: dadosRegistro.ocorrencia?.idEquipe || dadosRegistro.ocorrencia?.codigoViatura,
        efetivo: 1
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
      },
      isLocal: true
    };
  };

  const adicionarOcorrencia = async (dadosRegistro) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await OcorrenciasService.criarOcorrencia(dadosRegistro);
      
      if (result.success) {
        const novaOcorrencia = converterDoBackendParaFrontend(result.data);
        setOcorrencias(prevOcorrencias => [novaOcorrencia, ...prevOcorrencias]);
        return novaOcorrencia.id;
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