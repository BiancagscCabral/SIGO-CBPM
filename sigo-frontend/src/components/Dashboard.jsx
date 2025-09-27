import React, { useState, useEffect } from 'react';
import { FaFire, FaClock, FaRegClock, FaUsers } from 'react-icons/fa';
import { FiFilePlus, FiClipboard, FiFileText, FiSettings, FiArrowUp } from 'react-icons/fi';
import { IoDocumentTextOutline } from "react-icons/io5";
import { LuFilePlus } from "react-icons/lu";
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ icon, value, title, subtext, increase, iconBgColor }) => (
  <div className="stat-card">
    <div className="stat-card-info">
      <h2>{value}</h2>
      <p>{title}</p>
      {increase && <span className="increase"><FiArrowUp /> {increase}</span>}
      {subtext && <p>{subtext}</p>}
    </div>
    <div className="icon" style={{ color: iconBgColor }}>
      {icon}
    </div>
  </div>
);

const QuickAccessCard = ({ icon, title, description, bgColor, linkText = "Clique para acessar", onClick }) => (
  <div className="quick-access-card" onClick={onClick}>
    <div className={`icon-background ${bgColor}`}>
      <div className="icon">{icon}</div>
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
    <span className="link">{linkText}</span>
  </div>
);

const QuickAccessSection = ({ navigate, handleRegistroClick }) => (
  <section className="quick-access-grid">
    <QuickAccessCard
      icon={<LuFilePlus />}
      title="Registrar Ocorrência"
      description="Cadastrar nova ocorrência no sistema"
      bgColor="bg-red"
      onClick={handleRegistroClick}
    />
    <QuickAccessCard
      icon={<FiClipboard />}
      title="Minhas Ocorrências"
      description="Visualizar ocorrências registradas por mim"
      bgColor="bg-blue"
      onClick={() => navigate('/minhas-ocorrencias')}
    />
    <QuickAccessCard
      icon={<IoDocumentTextOutline />}
      title="Relatórios"
      description="Gerar relatórios e estatísticas"
      bgColor="bg-orange"
      onClick={() => navigate('/relatorios')}
    />
    <QuickAccessCard
      icon={<FiSettings />}
      title="Configurações"
      description="Configurar sistema e preferências"
      bgColor="bg-gray"
      linkText="Configurar"
      onClick={() => navigate('/configuracoes')}
    />
  </section>
);

function Dashboard() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState ({
    totalOcorrencias: '...',
    ocorrenciasHoje: '...',
    emAndamento: '...',
    equipesAtivas: '...',
    percentChange: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect (() => {
    const fetchData = async () => {
      const API_URL = 'http://localhost:8080/api/dashboard/stats';
      
      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Falha ao buscar dados: ${response.statusText}`);
        }
        const data = await response.json();

        setDashboardData({
          totalOcorrencias: data.totalOcorrencias.value || 'N/A',
          ocorrenciasHoje: data.ocorrenciasHoje.value || 'N/A',
          emAndamento: data.emAndamento.value || 'N/A',
          equipesAtivas: data.equipesAtivas.value || 'N/A',
          percentChange: data.totalOcorrencias.increase || null,
        });

        setIsLoading(false);
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard:", err);
        setError("Não foi possível carregar os dados. Verifique a conexão.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRegistroClick = () => {
    navigate('/registro-ocorrencia');
  }

  if (isLoading) {
    return (
      <main className="main-content">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Carregando dados das estatísticas</p>
        </div>
        <QuickAccessSection navigate={navigate} handleRegistroClick={handleRegistroClick} />
      </main>
    );
  }

  if (error) {
    return (
      <main className="main-content">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p style={{ color: '#f44336' }}>Erro: {error}</p>
        </div>
        <QuickAccessSection navigate={navigate} handleRegistroClick={handleRegistroClick} />
      </main>
    );
  }

  return (
    <main className="main-content">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
          <p>Bem Vindo ao Sistema Integrado de Gestão de Ocorrências</p>
      </div>
      <section className="stats-grid">
        <StatCard 
          icon={<FaFire />}
          value={dashboardData.totalOcorrencias}
          title="Total de Ocorrências"
          increase={dashboardData.percentChange}
          iconBgColor="#f44336"
        />
        <StatCard 
          icon={<FaClock />}
          value={dashboardData.ocorrenciasHoje}
          title="Ocorrências Hoje"
          subtext="Últimas 24 horas"
          iconBgColor="#ff9800"
        />
        <StatCard 
          icon={<FaRegClock />}
          value={dashboardData.emAndamento}
          title="Em Andamento"
          subtext="Requer atenção"
          iconBgColor="#2196f3"
        />
        <StatCard 
          icon={<FaUsers />}
          value={dashboardData.equipesAtivas}
          title="Equipes Ativas"
          subtext="Disponíveis para atendimento"
          iconBgColor="#4caf50"
        />
      </section>
      <QuickAccessSection navigate={navigate} handleRegistroClick={handleRegistroClick}/>
    </main>
  );
}

export default Dashboard;