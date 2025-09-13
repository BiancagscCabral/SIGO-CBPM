import React from 'react';
import './Relatorios.css';
{/* (SE GI APAGAR MEUS COMENTS VOU ME MATA) */}
{/* IMPORT ICONS */}
import iconeAlerta from '../assets/Alert.png';
import iconeProgresso from '../assets/Progress.png';
import iconeSucesso from '../assets/Success.png';
import iconeEquipes from '../assets/Teams.png';

function Relatorio() {
  return (
    <div className="relatorio-container">
      {/* CABEÇALHO DO TÍTULO */}
      <div className="relatorio-header">
        <h1>RELATÓRIOS</h1>
      </div>

      {/* GRID DE ESTATÍSTICAS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <span>Ocorrências Abertas</span>
            <strong>12</strong>
          </div>
          <img src={iconeAlerta} alt="Ícone de alerta" className="stat-icon" />
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <span>Em Andamento</span>
            <strong>8</strong>
          </div>
          <img src={iconeProgresso} alt="Ícone de ocorrência em progresso" className="stat-icon" />
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <span>Finalizadas Hoje</span>
            <strong>24</strong>
          </div>
          <img src={iconeSucesso} alt="Ícone de sucesso" className="stat-icon" />
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <span>Equipes Ativas</span>
            <strong>6</strong>
          </div>
          <img src={iconeEquipes} alt="Ícone de equipes" className="stat-icon" />
        </div>
      </div>

      {/* OCORRÊNCIAS ABERTAS */}
      <div className="incident-section">
        <div className="incident-section-header">
          <h2>Ocorrências Abertas</h2>
          <a href="#">Ver Todas</a>
        </div>
        <div className="incident-list">

          <div className="incident-item">
            <div className="incident-details">
              <strong>#001 <span className="status status-andamento">Em andamento</span></strong>
              <p>Incêndio Residencial - Rua das Flores, 123</p>
            </div>
            <div className="incident-time-action">
                <span>14:30</span>
                <a href="#">Ver Detalhes da Ocorrência</a>
            </div>
          </div>

          <div className="incident-item">
            <div className="incident-details">
              <strong>#002 <span className="status status-andamento">Em andamento</span></strong>
              <p>Acidente de Trânsito - Av. Principal, 456</p>
            </div>
            <div className="incident-time-action">
                <span>13:15</span>
                <a href="#">Ver Detalhes da Ocorrência</a>
            </div>
          </div>

          <div className="incident-item">
            <div className="incident-details">
              <strong>#003 <span className="status status-reforco">Reforço Solicitado</span></strong>
              <p>Resgate em Altura - Sertãozinho, 789</p>
            </div>
            <div className="incident-time-action">
                <span>12:45</span>
                <a href="#">Ver Detalhes da Ocorrência</a>
            </div>

          </div>
        </div>
      </div>

      {/* OCORRÊNCIAS FINALIZADAS */}
      <div className="incident-section">
        <div className="incident-section-header">
          <h2>Ocorrências Finalizadas</h2>
          <a href="#">Ver Todas</a>
        </div>
        <div className="incident-list">
            
           <div className="incident-item">
            <div className="incident-details">
              <strong>#001 <span className="status status-finalizada">Finalizada</span></strong>
              <p>Incêndio Residencial - Rua das Flores, 123</p>
            </div>
            <div className="incident-time-action">
                <span>14:30</span>
                <a href="#">Ver Detalhes da Ocorrência</a>
            </div>
          </div>
          
          <div className="incident-item">
            <div className="incident-details">
              <strong>#002 <span className="status status-finalizada">Finalizada</span></strong>
              <p>Incêndio Residencial - Rua das Flores, 123</p>
            </div>
            <div className="incident-time-action">
                <span>14:30</span>
                <a href="#">Ver Detalhes da Ocorrência</a>
            </div>
          </div>

          <div className="incident-item">
            <div className="incident-details">
              <strong>#003 <span className="status status-finalizada">Finalizada</span></strong>
              <p>Incêndio Residencial - Rua das Flores, 123</p>
            </div>
            <div className="incident-time-action">
                <span>14:30</span>
                <a href="#">Ver Detalhes da Ocorrência</a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Relatorio;