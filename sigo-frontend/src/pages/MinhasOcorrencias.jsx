import { useState } from 'react';
import './MinhasOcorrencias.css';
import Modal from '../components/Modal';

const getStatusClass = (status) => {
    if (status === 'Em andamento') return 'status-andamento';
    if (status === 'Reforço Solicitado') return 'status-reforco';
    if (status === 'Finalizada') return 'status-finalizada';
    return '';
};

// DADOS
const dadosIniciaisMinhasOcorrencias = [
    {
        id: '025',
        status: 'Reforço Solicitado',
        prioridade: 'Média',
        timestamps: {
            abertura: '2025-09-13T14:33:00-03:00',
            finalizacao: null
        },
        endereco: {
            logradouro: 'Av. Principal',
            numero: '456',
            bairro: 'Boa Viagem',
            cidade: 'Recife',
            uf: 'PE'
        },
        chamado: {
            tipo: 'Acidente de Trânsito',
            detalhes: 'Colisão entre dois veículos.'
        },
        equipes: [
            {
                id: 'UR-05',
                viatura: 'Unidade de Resgate',
                efetivo: 3
            }
        ]
    },
    {
        id: '007',
        status: 'Finalizada',
        prioridade: 'Média',
        timestamps: {
            abertura: '2025-09-13T12:45:00-03:00',
            finalizacao: '2025-09-13T13:50:00-03:00'
        },
        endereco: {
            logradouro: 'Rua do Sertão',
            numero: '789',
            bairro: 'Pina',
            cidade: 'Recife',
            uf: 'PE'
        },
        chamado: {
            tipo: 'Salvamento Aquático',
            detalhes: 'Banhista com dificuldades de retornar à praia.'
        },
        equipes: [
            {
                id: 'AE-02',
                viatura: 'Auto Escada',
                efetivo: 4
            }
        ]
    },
    {
        id: '037',
        status: 'Em andamento',
        prioridade: 'Alta',
        timestamps: {
            abertura: '2025-09-13T16:05:00-03:00',
            finalizacao: null
        },
        endereco: {
            logradouro: 'Rua das Laranjeiras',
            numero: '10',
            bairro: 'Graças',
            cidade: 'Recife',
            uf: 'PE'
        },
        chamado: {
            tipo: 'Vazamento de Gás',
            detalhes: 'Forte cheiro de gás em edifício residencial.'
        },
        equipes: [
            {
                id: 'ABT-05',
                viatura: 'Auto Bomba Tanque',
                efetivo: 4
            },
            {
                id: 'AR-12',
                viatura: 'Auto Resgate',
                efetivo: 3
            }
        ]
    },
    {
        id: '016',
        status: 'Finalizada',
        prioridade: 'Baixa',
        timestamps: {
            abertura: '2025-09-13T18:10:00-03:00',
            chegadaNoLocal: '2025-09-13T18:25:00-03:00',
            finalizacao: '2025-09-13T18:55:00-03:00'
        },
        endereco: {
            logradouro: 'Rua da Aurora',
            numero: '550',
            bairro: 'Santo Amaro',
            cidade: 'Recife',
            uf: 'PE',
            pontoReferencia: 'Próximo ao Ginásio Pernambucano'
        },
        chamado: {
            tipo: 'Incêndio em Veículo',
            detalhes: 'Carro pegando fogo no acostamento, sem vítimas aparentes.',
            solicitante: {
                nome: 'Pedro Henrique',
                telefone: '(81) 99123-4567'
            }
        },
        equipes: [
            {
                id: 'ABT-09',
                viatura: 'Auto Bomba Tanque',
                lider: 'Sgt. Lima',
                efetivo: 4
            }
        ]
    },
];

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

function MinhasOcorrencias() {
    const [ocorrencias, setOcorrencias] = useState(dadosIniciaisMinhasOcorrencias);
    const [ordenacao, setOrdenacao] = useState('horario-recente');

    // CONTROLE DO MODAL
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
            setOcorrencias(prevOcorrencias => 
                prevOcorrencias.map(o => 
                    o.id === ocorrenciaEditando.id ? ocorrenciaEditando : o
                )
            );
            setModalEditarVisivel(false);
            setOcorrenciaEditando(null);
        }
    };

    const handleCancelarEdicao = () => {
        setModalEditarVisivel(false);
        setOcorrenciaEditando(null);
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
                    viatura: '',
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

    // ABRIR O MODAL
    const handleVerDetalhes = (ocorrencia) => {
        setOcorrenciaSelecionada(ocorrencia);
        setModalVisivel(true);
    };

    const ocorrenciasOrdenadas = [...ocorrencias].sort((a, b) => {
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
        <div className="minhas-ocorrencias-container">
            <div className="page-header">
                <h1>Minhas Ocorrências</h1>
                <p>Visualize e gerencie as ocorrências que você registrou</p>
            </div>

            <div className="minhas-ocorrencias-actions">
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
                {ocorrenciasOrdenadas.map((ocorrencia) => (
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
                        </div>

                        <div className="ocorrencia-actions-time">
                            <span className="horario">{formatarHorario(ocorrencia.timestamps.abertura)}</span>
                            <div className="item-buttons">
                                <button className="btn btn-editar" onClick={() => handleEdit(ocorrencia.id)}>Editar</button>
                            </div>
                            <a href="#" onClick={() => handleVerDetalhes(ocorrencia)}>Ver Detalhes da Ocorrência</a>
                        </div>
                    </div>
                ))}
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
                                            <label>ID da Viatura:</label>
                                            <input 
                                                type="text"
                                                value={equipe.id} 
                                                onChange={(e) => handleEquipeChange(index, 'id', e.target.value)}
                                                placeholder="Ex: ABT-05"
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label>Tipo de Viatura:</label>
                                            <select 
                                                value={equipe.viatura} 
                                                onChange={(e) => handleEquipeChange(index, 'viatura', e.target.value)}
                                            >
                                                <option value="">Selecione o tipo</option>
                                                <option value="Auto Bomba Tanque">Auto Bomba Tanque</option>
                                                <option value="Auto Escada">Auto Escada</option>
                                                <option value="Auto Resgate">Auto Resgate</option>
                                                <option value="Unidade de Resgate">Unidade de Resgate</option>
                                                <option value="Ambulância">Ambulância</option>
                                                <option value="Outros">Outros</option>
                                            </select>
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
                            <button className="btn btn-secondary" onClick={handleCancelarEdicao}>
                                Cancelar
                            </button>
                            <button className="btn btn-primary" onClick={handleSalvarEdicao}>
                                Salvar Alterações
                            </button>
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

export default MinhasOcorrencias;