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
    const [ocorrenciaSelecionada, setOcorrenciaSelecionada] = useState(null);

    const handleEdit = (ocorrenciaId) => alert(`Editar ocorrência ${ocorrenciaId}`);

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
                                <span className="prioridade">Prioridade: {ocorrencia.prioridade}</span>
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