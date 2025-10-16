import { useState } from 'react';
import { useOcorrencias } from '../contexts/OcorrenciasContext';
import { useUser } from '../contexts/UserContext';
import { verificarPermissaoEdicaoOcorrencia } from '../utils/permissions';
import './Ocorrencias.css';
import Modal from '../components/Modal';

const getStatusClass = (status) => {
    if (status === 'Em andamento') return 'status-andamento';
    if (status === 'Reforço Solicitado') return 'status-reforco';
    if (status === 'Finalizada') return 'status-finalizada';
    return '';
};

const formatarHorario = (timestamp) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

const prioridadeValor = {
    'Alta': 3,
    'Média': 2,
    'Baixa': 1,
};

function Ocorrencias() {
    const { ocorrencias, loading, error, atualizarOcorrencia, removerOcorrencia } = useOcorrencias();
    const { userProfile } = useUser();
    const [ordenacao, setOrdenacao] = useState('horario-recente');
    const [filtroUsuario, setFiltroUsuario] = useState('minhas');

    const [modalVisivel, setModalVisivel] = useState(false);
    const [modalEditarVisivel, setModalEditarVisivel] = useState(false);
    const [ocorrenciaSelecionada, setOcorrenciaSelecionada] = useState(null);
    const [ocorrenciaEditando, setOcorrenciaEditando] = useState(null);

    const handleEdit = (ocorrenciaId) => {
        const ocorrencia = ocorrencias.find(o => o.id === ocorrenciaId);
        if (ocorrencia) {
            setOcorrenciaEditando({ ...ocorrencia });
            setModalEditarVisivel(true);
        }
    };

    const handleSalvarEdicao = () => {
        if (ocorrenciaEditando) {
            atualizarOcorrencia(ocorrenciaEditando.id, ocorrenciaEditando);
            setModalEditarVisivel(false);
            setOcorrenciaEditando(null);
        }
    };

    const handleCancelarEdicao = () => {
        setModalEditarVisivel(false);
        setOcorrenciaEditando(null);
    };

    const handleExcluirOcorrencia = () => {
        if (ocorrenciaEditando && window.confirm('Tem certeza que deseja excluir esta ocorrência? Esta ação não pode ser desfeita.')) {
            removerOcorrencia(ocorrenciaEditando.id);
            setModalEditarVisivel(false);
            setOcorrenciaEditando(null);
        }
    };

    const handleInputChange = (campo, valor) => {
        setOcorrenciaEditando(prev => ({
            ...prev,
            [campo]: valor
        }));
    };

    const handleEnderecoChange = (campo, valor) => {
        setOcorrenciaEditando(prev => ({
            ...prev,
            endereco: {
                ...prev.endereco,
                [campo]: valor
            }
        }));
    };

    const handleChamadoChange = (campo, valor) => {
        setOcorrenciaEditando(prev => ({
            ...prev,
            chamado: {
                ...prev.chamado,
                [campo]: valor
            }
        }));
    };

    const handleTimestampChange = (campo, valor) => {
        setOcorrenciaEditando(prev => ({
            ...prev,
            timestamps: {
                ...prev.timestamps,
                [campo]: valor
            }
        }));
    };

    const handleSolicitanteChange = (campo, valor) => {
        setOcorrenciaEditando(prev => ({
            ...prev,
            chamado: {
                ...prev.chamado,
                solicitante: {
                    ...prev.chamado.solicitante || {},
                    [campo]: valor
                }
            }
        }));
    };

    const handleEquipeChange = (equipeIndex, campo, valor) => {
        setOcorrenciaEditando(prev => ({
            ...prev,
            equipes: prev.equipes.map((equipe, index) => 
                index === equipeIndex 
                    ? { ...equipe, [campo]: valor }
                    : equipe
            )
        }));
    };

    const adicionarEquipe = () => {
        setOcorrenciaEditando(prev => ({
            ...prev,
            equipes: [
                ...prev.equipes,
                {
                    id: '',
                    lider: '',
                    efetivo: 1
                }
            ]
        }));
    };

    const removerEquipe = (equipeIndex) => {
        setOcorrenciaEditando(prev => ({
            ...prev,
            equipes: prev.equipes.filter((_, index) => index !== equipeIndex)
        }));
    };

    const handleVerDetalhes = (ocorrencia) => {
        setOcorrenciaSelecionada(ocorrencia);
        setModalVisivel(true);
    };

    const podeEditar = (ocorrencia) => {

        if (!userProfile?.id) {
            return false;
        }
        
        let isOwner = false;
        if (ocorrencia.metadata && ocorrencia.metadata.usuarioId) {
            const usuarioOcorrencia = String(ocorrencia.metadata.usuarioId);
            const usuarioLogado = String(userProfile.id);
            isOwner = usuarioOcorrencia === usuarioLogado;
        }
        
        return verificarPermissaoEdicaoOcorrencia(userProfile.user_role, isOwner);
    };

    const ocorrenciasFiltradas = filtroUsuario === 'minhas' 
        ? ocorrencias.filter(ocorrencia => podeEditar(ocorrencia))
        : ocorrencias;    const ocorrenciasOrdenadas = [...ocorrenciasFiltradas].sort((a, b) => {
        switch (ordenacao) {
            case 'id-crescente':
                return parseInt(a.id) - parseInt(b.id);
            case 'id-decrescente':
                return parseInt(b.id) - parseInt(a.id);
            case 'horario-recente':
                return b.timestamps.abertura.localeCompare(a.timestamps.abertura);
            case 'horario-antigo':
                return a.timestamps.abertura.localeCompare(b.timestamps.abertura);
            case 'prioridade-alta':
                return (prioridadeValor[b.prioridade] || 0) - (prioridadeValor[a.prioridade] || 0);
            case 'prioridade-baixa':
                return (prioridadeValor[a.prioridade] || 0) - (prioridadeValor[b.prioridade] || 0);
            default:
                return 0;
        }
    });

    return (
        <div className="ocorrencias-container">
            <div className="page-header">
                <h1>Ocorrências</h1>
                <p>Visualize e gerencie as ocorrências do sistema</p>
            </div>

            <div className="ocorrencias-actions">
                <div className="filters-container">
                    <div className="filter-group">
                        <label htmlFor="filtro-usuario-select">Filtrar por:</label>
                        <select 
                            id="filtro-usuario-select"
                            value={filtroUsuario} 
                            onChange={(e) => setFiltroUsuario(e.target.value)}
                            className="filter-select"
                        >
                            <option value="minhas">Minhas Ocorrências</option>
                            <option value="geral">Todas as Ocorrências</option>
                        </select>
                    </div>
                </div>
                
                <div className="ordenacao-container">
                    <label htmlFor="ordenacao-select">Ordenar por:</label>
                    <select
                        id="ordenacao-select"
                        value={ordenacao}
                        onChange={(e) => setOrdenacao(e.target.value)}>
                        <option value="horario-recente">Horário (mais recente)</option>
                        <option value="horario-antigo">Horário (menos recente)</option>
                        <option value="id-crescente">ID (menor para maior)</option>
                        <option value="id-decrescente">ID (maior para menor)</option>
                        <option value="prioridade-alta">Prioridade (Alta → Baixa)</option>
                        <option value="prioridade-baixa">Prioridade (Baixa → Alta)</option>
                    </select>
                </div>
            </div>

            <div className="ocorrencia-list">
                {loading ? (
                    <div className="empty-state">
                        <h3>Carregando ocorrências...</h3>
                        <p>Aguarde enquanto buscamos suas ocorrências.</p>
                    </div>
                ) : error ? (
                    <div className="empty-state">
                        <h3>Erro ao carregar ocorrências</h3>
                        <p>{error}</p>
                        <p>Exibindo dados salvos localmente, se disponíveis.</p>
                    </div>
                ) : ocorrenciasFiltradas.length === 0 ? (
                    <div className="empty-state">
                        <h3>
                            {filtroUsuario === 'minhas' 
                                ? 'Nenhuma ocorrência registrada por você'
                                : 'Nenhuma ocorrência encontrada'
                            }
                        </h3>
                        <p>
                            {filtroUsuario === 'minhas' 
                                ? 'Você ainda não registrou nenhuma ocorrência. Quando você registrar uma nova ocorrência, ela aparecerá aqui.'
                                : 'Não há ocorrências cadastradas no sistema no momento.'
                            }
                        </p>
                        <a href="/registro-ocorrencia" className="btn btn-primary">
                            Registrar Nova Ocorrência
                        </a>
                    </div>
                ) : (
                    ocorrenciasOrdenadas.map((ocorrencia) => (
                    <div key={ocorrencia.id} className="ocorrencia-item">
                        <div className="ocorrencia-details">
                            <strong>
                                #{ocorrencia.id}
                                <span className={`status ${getStatusClass(ocorrencia.status)}`}>
                                    {ocorrencia.status}
                                </span>
                                <span className={`prioridade prioridade-${ocorrencia.prioridade.toLowerCase()}`}>
                                    Prioridade: {ocorrencia.prioridade}
                                </span>
                            </strong>
                            <p>{ocorrencia.chamado.tipo}</p>
                            <p className="endereco">
                                {`${ocorrencia.endereco.logradouro}, ${ocorrencia.endereco.numero} - ${ocorrencia.endereco.bairro}`}
                            </p>
                            {ocorrencia.metadata && (ocorrencia.metadata.nomeUsuario || ocorrencia.metadata.matriculaUsuario) && (
                                <p className="registrado-por">
                                    Registrado por: {ocorrencia.metadata.nomeUsuario || 'N/A'} 
                                    {ocorrencia.metadata.matriculaUsuario && (
                                        <span className="matricula"> (Mat: {ocorrencia.metadata.matriculaUsuario})</span>
                                    )}
                                </p>
                            )}
                        </div>

                        <div className="ocorrencia-actions-time">
                            <span className="horario">{formatarHorario(ocorrencia.timestamps.abertura)}</span>
                            <div className="item-buttons">
                                {podeEditar(ocorrencia) && (
                                    <button className="btn btn-editar" onClick={() => handleEdit(ocorrencia.id)}>Editar</button>
                                )}
                            </div>
                            <a href="#" onClick={() => handleVerDetalhes(ocorrencia)}>Ver Detalhes da Ocorrência</a>
                        </div>
                    </div>
                    ))
                )}
            </div>

            {modalEditarVisivel && ocorrenciaEditando && (
                <div className="modal-overlay">
                    <div className="modal-content modal-editar">
                        <div className="modal-header">
                            <h2>Editar Ocorrência #{ocorrenciaEditando.id}</h2>
                            <button className="close-button" onClick={handleCancelarEdicao}>×</button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="form-section">
                                <h3>Informações Básicas</h3>
                                <div className="form-group">
                                    <label>Status:</label>
                                    <select 
                                        value={ocorrenciaEditando.status} 
                                        onChange={(e) => handleInputChange('status', e.target.value)}
                                    >
                                        <option value="Em andamento">Em andamento</option>
                                        <option value="Reforço Solicitado">Reforço Solicitado</option>
                                        <option value="Finalizada">Finalizada</option>
                                    </select>
                                </div>
                                
                                <div className="form-group">
                                    <label>Prioridade:</label>
                                    <select 
                                        value={ocorrenciaEditando.prioridade} 
                                        onChange={(e) => handleInputChange('prioridade', e.target.value)}
                                    >
                                        <option value="Alta">Alta</option>
                                        <option value="Média">Média</option>
                                        <option value="Baixa">Baixa</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>Horários</h3>
                                <div className="form-group">
                                    <label>Data/Hora de Abertura:</label>
                                    <input 
                                        type="datetime-local"
                                        value={ocorrenciaEditando.timestamps.abertura ? new Date(ocorrenciaEditando.timestamps.abertura).toISOString().slice(0, 16) : ''} 
                                        onChange={(e) => handleTimestampChange('abertura', e.target.value ? new Date(e.target.value).toISOString() : null)}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Data/Hora de Chegada no Local:</label>
                                    <input 
                                        type="datetime-local"
                                        value={ocorrenciaEditando.timestamps.chegadaNoLocal ? new Date(ocorrenciaEditando.timestamps.chegadaNoLocal).toISOString().slice(0, 16) : ''} 
                                        onChange={(e) => handleTimestampChange('chegadaNoLocal', e.target.value ? new Date(e.target.value).toISOString() : null)}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Data/Hora de Finalização:</label>
                                    <input 
                                        type="datetime-local"
                                        value={ocorrenciaEditando.timestamps.finalizacao ? new Date(ocorrenciaEditando.timestamps.finalizacao).toISOString().slice(0, 16) : ''} 
                                        onChange={(e) => handleTimestampChange('finalizacao', e.target.value ? new Date(e.target.value).toISOString() : null)}
                                    />
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>Endereço</h3>
                                <div className="form-group">
                                    <label>Logradouro:</label>
                                    <input 
                                        type="text"
                                        value={ocorrenciaEditando.endereco.logradouro} 
                                        onChange={(e) => handleEnderecoChange('logradouro', e.target.value)}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Número:</label>
                                    <input 
                                        type="text"
                                        value={ocorrenciaEditando.endereco.numero} 
                                        onChange={(e) => handleEnderecoChange('numero', e.target.value)}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Bairro:</label>
                                    <input 
                                        type="text"
                                        value={ocorrenciaEditando.endereco.bairro} 
                                        onChange={(e) => handleEnderecoChange('bairro', e.target.value)}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Cidade:</label>
                                    <input 
                                        type="text"
                                        value={ocorrenciaEditando.endereco.cidade} 
                                        onChange={(e) => handleEnderecoChange('cidade', e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>UF:</label>
                                    <select 
                                        value={ocorrenciaEditando.endereco.uf || 'PE'} 
                                        onChange={(e) => handleEnderecoChange('uf', e.target.value)}
                                    >
                                        <option value="PE">PE</option>
                                        <option value="BA">BA</option>
                                        <option value="AL">AL</option>
                                        <option value="SE">SE</option>
                                        <option value="PB">PB</option>
                                        <option value="RN">RN</option>
                                        <option value="CE">CE</option>
                                        <option value="PI">PI</option>
                                        <option value="MA">MA</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Ponto de Referência:</label>
                                    <input 
                                        type="text"
                                        value={ocorrenciaEditando.endereco.pontoReferencia || ''} 
                                        onChange={(e) => handleEnderecoChange('pontoReferencia', e.target.value)}
                                        placeholder="Ex: Próximo ao shopping, em frente à escola..."
                                    />
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>Detalhes do Chamado</h3>
                                <div className="form-group">
                                    <label>Tipo:</label>
                                    <select 
                                        value={ocorrenciaEditando.chamado.tipo} 
                                        onChange={(e) => handleChamadoChange('tipo', e.target.value)}
                                    >
                                        <option value="Atendimento Pré-Hospitalar (APH)">Atendimento Pré-Hospitalar (APH)</option>
                                        <option value="Incêndio">Incêndio</option>
                                        <option value="Acidente de Trânsito">Acidente de Trânsito</option>
                                        <option value="Salvamento Aquático">Salvamento Aquático</option>
                                        <option value="Vazamento de Gás">Vazamento de Gás</option>
                                        <option value="Incêndio em Veículo">Incêndio em Veículo</option>
                                        <option value="Outros">Outros</option>
                                    </select>
                                </div>
                                
                                <div className="form-group">
                                    <label>Detalhes:</label>
                                    <textarea 
                                        rows="4"
                                        value={ocorrenciaEditando.chamado.detalhes} 
                                        onChange={(e) => handleChamadoChange('detalhes', e.target.value)}
                                        placeholder="Descreva os detalhes da ocorrência..."
                                    ></textarea>
                                </div>

                                <div className="form-subsection">
                                    <h4>Solicitante</h4>
                                    <div className="form-group">
                                        <label>Nome:</label>
                                        <input 
                                            type="text"
                                            value={ocorrenciaEditando.chamado.solicitante?.nome || ''} 
                                            onChange={(e) => handleSolicitanteChange('nome', e.target.value)}
                                            placeholder="Nome do solicitante"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>Equipes Designadas</h3>
                                {ocorrenciaEditando.equipes.map((equipe, index) => (
                                    <div key={index} className="equipe-form">
                                        <div className="equipe-header">
                                            <h4>Equipe {index + 1}</h4>
                                            {ocorrenciaEditando.equipes.length > 1 && (
                                                <button 
                                                    type="button" 
                                                    className="btn-remove-equipe"
                                                    onClick={() => removerEquipe(index)}
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                        
                                        <div className="form-group">
                                            <label>Viatura:</label>
                                            <input 
                                                type="text"
                                                value={equipe.id} 
                                                onChange={(e) => handleEquipeChange(index, 'id', e.target.value)}
                                                placeholder="Ex: ABT-05"
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label>Líder:</label>
                                            <input 
                                                type="text"
                                                value={equipe.lider || ''} 
                                                onChange={(e) => handleEquipeChange(index, 'lider', e.target.value)}
                                                placeholder="Ex: Sgt. Lima"
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label>Efetivo:</label>
                                            <input 
                                                type="number"
                                                min="1"
                                                max="10"
                                                value={equipe.efetivo} 
                                                onChange={(e) => handleEquipeChange(index, 'efetivo', parseInt(e.target.value) || 1)}
                                            />
                                        </div>
                                    </div>
                                ))}
                                
                                <button 
                                    type="button" 
                                    className="btn-add-equipe"
                                    onClick={adicionarEquipe}
                                >
                                    + Adicionar Equipe
                                </button>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-danger" onClick={handleExcluirOcorrencia}>
                                Excluir Ocorrência
                            </button>
                            <div className="modal-footer-right">
                                <button className="btn btn-secondary" onClick={handleCancelarEdicao}>
                                    Cancelar
                                </button>
                                <button className="btn btn-primary" onClick={handleSalvarEdicao}>
                                    Salvar Alterações
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {modalVisivel && (
                <Modal
                    ocorrencia={ocorrenciaSelecionada}
                    onClose={() => setModalVisivel(false)}
                />
            )}
        </div>
    );
}

export default Ocorrencias;