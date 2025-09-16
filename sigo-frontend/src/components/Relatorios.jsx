{/* (SE GI APAGAR MEUS COMENTS VOU ME MATA) */}
import React, { useState } from 'react';
import './Relatorios.css';
import Modal from './Modal';

// Ícones
import iconeAlerta from '../assets/Alert.png';
import iconeProgresso from '../assets/Progress.png';
import iconeSucesso from '../assets/Success.png';
import iconeEquipes from '../assets/Teams.png';

// DADOS
const dadosIniciaisDasOcorrencias = [
    {
        id: '006', status: 'Em andamento', prioridade: 'Média',
        timestamps: { abertura: '2025-09-13T13:15:00-03:00', finalizacao: null },
        endereco: { logradouro: 'Rua da Moeda', numero: '100', bairro: 'Recife Antigo', cidade: 'Recife', uf: 'PE' },
        chamado: { tipo: 'Alagamento', detalhes: 'Via pública inundada após fortes chuvas.' },
        equipes: [{ id: 'AC-01', viatura: 'Auto Comando', efetivo: 2 }]
    },
    {
        id: '014', status: 'Reforço Solicitado', prioridade: 'Alta',
        timestamps: { abertura: '2025-09-13T14:30:00-03:00', finalizacao: null },
        endereco: { logradouro: 'Rua das Flores', numero: '123', bairro: 'Espinheiro', cidade: 'Recife', uf: 'PE' },
        chamado: { tipo: 'Incêndio Residencial', detalhes: 'Fumaça saindo de apartamento no 2º andar.' },
        equipes: [{ id: 'ABT-02', viatura: 'Auto Bomba Tanque', efetivo: 4 }]
    },
    {
        id: '025', status: 'Reforço Solicitado', prioridade: 'Alta',
        timestamps: { abertura: '2025-09-13T14:33:00-03:00', finalizacao: null },
        endereco: { logradouro: 'Av. Principal', numero: '456', bairro: 'Boa Viagem', cidade: 'Recife', uf: 'PE' },
        chamado: { tipo: 'Acidente de Trânsito', detalhes: 'Colisão entre carro e moto, com vítima.' },
        equipes: [{ id: 'UR-05', viatura: 'Unidade de Resgate', efetivo: 3 }]
    },
    {
        id: '032', status: 'Finalizada', prioridade: 'Alta',
        timestamps: { abertura: '2025-09-13T11:00:00-03:00', finalizacao: '2025-09-13T12:15:00-03:00' },
        endereco: { logradouro: 'Rua do Sol', numero: '500', bairro: 'Santo Antônio', cidade: 'Recife', uf: 'PE' },
        chamado: { tipo: 'Incêndio Residencial', detalhes: 'Curto-circuito em ar-condicionado.' },
        equipes: [{ id: 'ABT-03', viatura: 'Auto Bomba Tanque', efetivo: 4 }]
    },
    {
        id: '037', status: 'Em andamento', prioridade: 'Alta',
        timestamps: { abertura: '2025-09-13T16:05:00-03:00', finalizacao: null },
        endereco: { logradouro: 'Rua das Pitangas', numero: '88', bairro: 'Graças', cidade: 'Recife', uf: 'PE' },
        chamado: { tipo: 'Vazamento de gás', detalhes: 'Forte cheiro de gás em edifício residencial.' },
        equipes: [{ id: 'ABT-05', viatura: 'Auto Bomba Tanque', efetivo: 4 }]
    },
    {
        id: '012', status: 'Em andamento', prioridade: 'Baixa',
        timestamps: { abertura: '2025-09-13T15:50:00-03:00', finalizacao: null },
        endereco: { logradouro: 'Av. Beira Rio', numero: '2010', bairro: 'Madalena', cidade: 'Recife', uf: 'PE' },
        chamado: { tipo: 'Captura de animal', detalhes: 'Gato preso no topo de uma árvore.' },
        equipes: [{ id: 'AR-12', viatura: 'Auto Resgate', efetivo: 2 }]
    },
    {
        id: '024', status: 'Finalizada', prioridade: 'Média',
        timestamps: { abertura: '2025-09-13T10:20:00-03:00', finalizacao: '2025-09-13T10:55:00-03:00' },
        endereco: { logradouro: 'Cruzamento da Caxangá', numero: '700', bairro: 'Cordeiro', cidade: 'Recife', uf: 'PE' },
        chamado: { tipo: 'Acidente de Trânsito', detalhes: 'Colisão sem vítimas, apenas danos materiais.' },
        equipes: [{ id: 'AR-10', viatura: 'Auto Resgate', efetivo: 2 }]
    },
    {
        id: '008', status: 'Finalizada', prioridade: 'Baixa',
        timestamps: { abertura: '2025-09-13T09:45:00-03:00', finalizacao: '2025-09-13T10:30:00-03:00' },
        endereco: { logradouro: 'Rua da Harmonia', numero: '355', bairro: 'Casa Amarela', cidade: 'Recife', uf: 'PE' },
        chamado: { tipo: 'Alagamento', detalhes: 'Pequeno ponto de alagamento em via local.' },
        equipes: [{ id: 'AC-02', viatura: 'Auto Comando', efetivo: 2 }]
    },
    {
        id: '022', status: 'Finalizada', prioridade: 'Alta',
        timestamps: { abertura: '2025-09-13T08:15:00-03:00', finalizacao: '2025-09-13T09:00:00-03:00' },
        endereco: { logradouro: 'Praça de Casa Forte', numero: '112', bairro: 'Casa Forte', cidade: 'Recife', uf: 'PE' },
        chamado: { tipo: 'Incêndio Residencial', detalhes: 'Princípio de incêndio na cozinha, controlado.' },
        equipes: [{ id: 'ABT-01', viatura: 'Auto Bomba Tanque', efetivo: 4 }]
    }
];

const getStatusClass = (status) => {
    if (status === 'Em andamento') return 'status-andamento';
    if (status === 'Reforço Solicitado') return 'status-reforco';
    if (status === 'Finalizada') return 'status-finalizada';
    return '';
};

const formatarHorario = (timestamp) => !timestamp ? '-' : new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
const prioridadeValor = { 'Alta': 3, 'Média': 2, 'Baixa': 1 };

function Relatorio() {
    const [ocorrencias, setOcorrencias] = useState(dadosIniciaisDasOcorrencias);
    const [ordenacao, setOrdenacao] = useState('horario-recente');
    const [modalVisivel, setModalVisivel] = useState(false);
    const [ocorrenciaSelecionada, setOcorrenciaSelecionada] = useState(null);

    const handleVerDetalhes = (event, ocorrencia) => {
        event.preventDefault();
        setOcorrenciaSelecionada(ocorrencia);
        setModalVisivel(true);
    };

    const totalAbertas = ocorrencias.filter(o => o.status !== 'Finalizada').length;
    const totalEmAndamento = ocorrencias.filter(o => o.status === 'Em andamento').length;
    const totalFinalizadas = ocorrencias.filter(o => o.status === 'Finalizada').length;
    const totalEfetivoAtivo = ocorrencias.filter(o => o.status !== 'Finalizada').flatMap(o => o.equipes).reduce((soma, equipe) => soma + equipe.efetivo, 0);

    const sortLogic = (a, b) => {
        switch (ordenacao) {
            case 'id-crescente': return parseInt(a.id) - parseInt(b.id);
            case 'id-decrescente': return parseInt(b.id) - parseInt(a.id);
            case 'horario-recente': return b.timestamps.abertura.localeCompare(a.timestamps.abertura);
            case 'horario-antigo': return a.timestamps.abertura.localeCompare(b.timestamps.abertura);
            case 'prioridade-alta': return (prioridadeValor[b.prioridade] || 0) - (prioridadeValor[a.prioridade] || 0);
            case 'prioridade-baixa': return (prioridadeValor[a.prioridade] || 0) - (prioridadeValor[b.prioridade] || 0);
            default: return 0;
        }
    };
    
    const ocorrenciasAbertasOrdenadas = ocorrencias.filter(o => o.status !== 'Finalizada').sort(sortLogic);
    const ocorrenciasFinalizadasOrdenadas = ocorrencias.filter(o => o.status === 'Finalizada').sort(sortLogic);

    return (
        <div className="relatorio-container">
            <div className="relatorio-header"><h1>RELATÓRIOS</h1></div>

            <div className="stats-grid">
                <div className="stat-card"><div className="stat-info"><span>Ocorrências Abertas</span><strong>{totalAbertas}</strong></div><img src={iconeAlerta} alt="Ícone de alerta" className="stat-icon" /></div>
                <div className="stat-card"><div className="stat-info"><span>Em Andamento</span><strong>{totalEmAndamento}</strong></div><img src={iconeProgresso} alt="Ícone de progresso" className="stat-icon" /></div>
                <div className="stat-card"><div className="stat-info"><span>Finalizadas Hoje</span><strong>{totalFinalizadas}</strong></div><img src={iconeSucesso} alt="Ícone de sucesso" className="stat-icon" /></div>
                <div className="stat-card"><div className="stat-info"><span>Bombeiros em Campo</span><strong>{totalEfetivoAtivo}</strong></div><img src={iconeEquipes} alt="Ícone de equipes" className="stat-icon" /></div>
            </div>

            {/* ORDENAÇÃO */}
            <div className="ordenacao-controls">
                <label htmlFor="ordenacao-select">Ordenar por:</label>
                <select id="ordenacao-select" value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)}>
                    <option value="horario-recente">Horário (mais recente)</option>
                    <option value="horario-antigo">Horário (menos recente)</option>
                    <option value="prioridade-alta">Prioridade (Alta → Baixa)</option>
                    <option value="prioridade-baixa">Prioridade (Baixa → Alta)</option>
                    <option value="id-crescente">ID (menor para maior)</option>
                    <option value="id-decrescente">ID (maior para menor)</option>
                </select>
            </div>

            {/* ABERTAS */}
            <div className="incident-section">
                <div className="incident-section-header"><h2>Ocorrências Abertas</h2></div>
                <div className="incident-list">
                    {ocorrenciasAbertasOrdenadas.map(ocorrencia => (
                        <div key={ocorrencia.id} className="incident-item">
                            <div className="incident-details">
                                <strong>
                                    #{ocorrencia.id}
                                    <span className={`status ${getStatusClass(ocorrencia.status)}`}>{ocorrencia.status}</span>
                                    <span className="prioridade">Prioridade: {ocorrencia.prioridade}</span>
                                </strong>
                                <p>{ocorrencia.chamado.tipo} - {`${ocorrencia.endereco.logradouro}, ${ocorrencia.endereco.numero}`}</p>
                            </div>
                            <div className="incident-time-action">
                                <span>{formatarHorario(ocorrencia.timestamps.abertura)}</span>
                                <a href="#" onClick={(e) => handleVerDetalhes(e, ocorrencia)}>Ver Detalhes da Ocorrência</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FINALIZADAS */}
            <div className="incident-section">
                <div className="incident-section-header"><h2>Ocorrências Finalizadas</h2></div>
                <div className="incident-list">
                    {ocorrenciasFinalizadasOrdenadas.map(ocorrencia => (
                         <div key={ocorrencia.id} className="incident-item">
                            <div className="incident-details">
                                <strong>
                                    #{ocorrencia.id}
                                    <span className={`status ${getStatusClass(ocorrencia.status)}`}>{ocorrencia.status}</span>
                                    <span className="prioridade">Prioridade: {ocorrencia.prioridade}</span>
                                </strong>
                                <p>{ocorrencia.chamado.tipo} - {`${ocorrencia.endereco.logradouro}, ${ocorrencia.endereco.numero}`}</p>
                            </div>
                            <div className="incident-time-action">
                                <span>{formatarHorario(ocorrencia.timestamps.abertura)}</span>
                                <a href="#" onClick={(e) => handleVerDetalhes(e, ocorrencia)}>Ver Detalhes da Ocorrência</a>
                            </div>
                        </div>
                    ))}
                </div>
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
                        {/* TÁ LENDO MEU CODIGO PQ SAFADINHO? */}
export default Relatorio;