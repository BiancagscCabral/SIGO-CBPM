{/* (SE GI APAGAR MEUS COMENTS VOU ME MATA) */}
import React, { useState } from 'react';
import './Relatorios.css';

import iconeAlerta from '../assets/Alert.png';
import iconeProgresso from '../assets/Progress.png';
import iconeSucesso from '../assets/Success.png';
import iconeEquipes from '../assets/Teams.png';

const dadosIniciaisDasOcorrencias = [
    { id: '006', status: 'Em andamento', tipo: 'Alagamento', endereco: 'Rua da Moeda, 100', horario: '13:15' },
    { id: '014', status: 'Reforço Solicitado', tipo: 'Incêndio Residencial', endereco: 'Rua das Flores, 123', horario: '14:30' },
    { id: '025', status: 'Reforço Solicitado', tipo: 'Acidente de Trânsito', endereco: 'Av. Principal, 456', horario: '14:33' },
    { id: '007', status: 'Finalizada', tipo: 'Resgate em Altura', endereco: 'Sertãozinho, 789', horario: '12:45' },
    { id: '032', status: 'Finalizada', tipo: 'Incêndio Residencial', endereco: 'Rua do Sol, 500', horario: '11:00' },  
    { id: '037', status: 'Em andamento', tipo: 'Vazamento de gás', endereco: 'Rua das Pitangas, 88', horario: '16:05' },
    { id: '012', status: 'Em andamento', tipo: 'Captura de animal', endereco: 'Av. Beira Rio, 2010', horario: '15:50' },
    { id: '024', status: 'Finalizada', tipo: 'Acidente de Trânsito', endereco: 'Cruzamento da Caxangá, 700', horario: '10:20' },
    { id: '008', status: 'Finalizada', tipo: 'Alagamento', endereco: 'Rua da Harmonia, 355', horario: '09:45' },
    { id: '022', status: 'Finalizada', tipo: 'Incêndio Residencial', endereco: 'Praça de Casa Forte, 112', horario: '08:15' },
];

const getStatusClass = (status) => {
  if (status === 'Em andamento') return 'status-andamento';
  if (status === 'Reforço Solicitado') return 'status-reforco';
  if (status === 'Finalizada') return 'status-finalizada';
  return '';
};

function Relatorio() {
  const [ocorrencias, setOcorrencias] = useState(dadosIniciaisDasOcorrencias);

{/* CÁLCULO */}
  const totalAbertas = ocorrencias.filter(o => o.status !== 'Finalizada').length;
  const totalEmAndamento = ocorrencias.filter(o => o.status === 'Em andamento').length;
  const totalFinalizadas = ocorrencias.filter(o => o.status === 'Finalizada').length;

  return (
    <div className="relatorio-container">
      <div className="relatorio-header">
        <h1>RELATÓRIOS</h1>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <span>Ocorrências Abertas</span>
            <strong>{totalAbertas}</strong>
          </div>
          <img src={iconeAlerta} alt="Ícone de alerta" className="stat-icon" />
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <span>Em Andamento</span>
            <strong>{totalEmAndamento}</strong>
          </div>
          <img src={iconeProgresso} alt="Ícone de ocorrência em progresso" className="stat-icon" />
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <span>Finalizadas Hoje</span>
            <strong>{totalFinalizadas}</strong>
          </div>
          <img src={iconeSucesso} alt="Ícone de sucesso" className="stat-icon" />
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <span>Equipes Ativas</span>
            {/* número estático (dados equipes) */}
            <strong>6</strong>
          </div>
          <img src={iconeEquipes} alt="Ícone de equipes" className="stat-icon" />
        </div>
      </div>

      {/* OCORRÊNCIAS ABERTAS - (DINÂMICO) */}
      <div className="incident-section">
        <div className="incident-section-header">
          <h2>Ocorrências Abertas</h2>
          <a href="#">Ver Todas</a>
        </div>
        <div className="incident-list">
          {ocorrencias
            .filter(ocorrencia => ocorrencia.status !== 'Finalizada')
            .map(ocorrencia => (
              <div key={ocorrencia.id} className="incident-item">
                <div className="incident-details">
                  <strong>
                    #{ocorrencia.id}
                    <span className={`status ${getStatusClass(ocorrencia.status)}`}>
                      {ocorrencia.status}
                    </span>
                  </strong>
                  <p>{ocorrencia.tipo} - {ocorrencia.endereco}</p>
                </div>
                <div className="incident-time-action">
                  <span>{ocorrencia.horario}</span>
                  <a href="#">Ver Detalhes da Ocorrência</a>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* OCORRÊNCIAS FINALIZADAS - (DINÂMICO) */}
      <div className="incident-section">
        <div className="incident-section-header">
          <h2>Ocorrências Finalizadas</h2>
          <a href="#">Ver Todas</a>
        </div>
        <div className="incident-list">
          {ocorrencias
            .filter(ocorrencia => ocorrencia.status === 'Finalizada')
            .map(ocorrencia => (
              <div key={ocorrencia.id} className="incident-item">
                <div className="incident-details">
                   <strong>
                    #{ocorrencia.id}
                    <span className={`status ${getStatusClass(ocorrencia.status)}`}>
                      {ocorrencia.status}
                    </span>
                  </strong>
                  <p>{ocorrencia.tipo} - {ocorrencia.endereco}</p>
                </div>
                <div className="incident-time-action">
                  <span>{ocorrencia.horario}</span>
                  <a href="#">Ver Detalhes da Ocorrência</a>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Relatorio;