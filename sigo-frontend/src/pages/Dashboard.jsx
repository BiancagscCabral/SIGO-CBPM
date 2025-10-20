import { useState, useEffect } from 'react';
import { FaFire, FaClock, FaRegClock, FaUsers } from 'react-icons/fa';
import { FiFilePlus, FiClipboard, FiFileText, FiSettings, FiArrowUp } from 'react-icons/fi';
import { IoDocumentTextOutline } from "react-icons/io5";
import { LuFilePlus } from "react-icons/lu";
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useOcorrencias } from '../contexts/OcorrenciasContext';

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
      title="Ocorrências"
      description="Visualizar ocorrências registradas no sistema"
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
  const { fetchUserProfile } = useUser();
  const { ocorrencias } = useOcorrencias();

  const defaultStats = {
    totalOcorrencias: '--',
    ocorrenciasHoje: '--',
    emAndamento: '--',
    equipesAtivas: '--',
    percentChange: null,
  };

  const [dashboardData, setDashboardData] = useState(defaultStats);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para calcular estatísticas das ocorrências locais
  const calcularEstatisticasLocais = () => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const totalOcorrencias = ocorrencias.length;
    
    const ocorrenciasHoje = ocorrencias.filter(ocorrencia => {
      const dataOcorrencia = new Date(ocorrencia.timestamps.abertura);
      dataOcorrencia.setHours(0, 0, 0, 0);
      return dataOcorrencia.getTime() === hoje.getTime();
    }).length;
    
    const emAndamento = ocorrencias.filter(ocorrencia => 
      ocorrencia.status === 'Em andamento' || ocorrencia.status === 'Reforço Solicitado'
    ).length;
    
    const equipesUnicas = new Set();
    ocorrencias.forEach(ocorrencia => {
      if (ocorrencia.isLocal) return;
      ocorrencia.equipes?.forEach(equipe => {
        if (equipe.id) equipesUnicas.add(equipe.id);
      });
    });
    
    return {
      totalOcorrencias,
      ocorrenciasHoje,
      emAndamento,
      equipesAtivas: equipesUnicas.size
    };
  };

  useEffect(() => {
    console.log('Dashboard: Forçando atualização do perfil do usuário...');
    fetchUserProfile();
  }, []);

  // Atualizar estatísticas quando as ocorrências mudarem
  useEffect(() => {
    const estatisticasLocais = calcularEstatisticasLocais();
    setDashboardData(prev => ({
      ...prev,
      totalOcorrencias: estatisticasLocais.totalOcorrencias,
      ocorrenciasHoje: estatisticasLocais.ocorrenciasHoje,
      emAndamento: estatisticasLocais.emAndamento,
      equipesAtivas: `${estatisticasLocais.equipesAtivas}/${estatisticasLocais.equipesAtivas}`
    }));
  }, [ocorrencias]);

  useEffect(() => {
    const fetchData = async () => {
      const API_URL = '/api/dashboard/stats'; 
      
      try {
        const response = await fetch(API_URL, {
          credentials: 'include',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          // Combinar dados do backend com estatísticas locais
          const estatisticasLocais = calcularEstatisticasLocais();
          
          setDashboardData({
            totalOcorrencias: (data.totalOcorrencias || 0) + estatisticasLocais.totalOcorrencias,
            ocorrenciasHoje: (data.ocorrenciasHoje || 0) + estatisticasLocais.ocorrenciasHoje,
            emAndamento: (data.emAndamento || 0) + estatisticasLocais.emAndamento,
            equipesAtivas: `${((data.equipesAtivas || 0) + estatisticasLocais.equipesAtivas)}/${((data.equipesAtivas || 0) + estatisticasLocais.equipesAtivas)}`,
            percentChange: data.percentChange || null,
          });
        } else {
          throw new Error(`Falha ao buscar dados: ${response.statusText}`);
        }

      } catch (err) {
        console.error("Erro ao buscar dados do dashboard:", err);
        
        // Se der erro no backend, usar apenas dados locais
        const estatisticasLocais = calcularEstatisticasLocais();
        
        setDashboardData({
          totalOcorrencias: estatisticasLocais.totalOcorrencias,
          ocorrenciasHoje: estatisticasLocais.ocorrenciasHoje,
          emAndamento: estatisticasLocais.emAndamento,
          equipesAtivas: `${estatisticasLocais.equipesAtivas}/${estatisticasLocais.equipesAtivas}`,
          percentChange: null,
        });
        
        setError("Exibindo apenas dados locais. Verifique a conexão para dados completos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [ocorrencias]);

  const handleRegistroClick = () => {
    navigate('/registro-ocorrencia');
  }

  return (
    <main className="main-content">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        {isLoading && <p>Carregando dados das estatísticas...</p>}
        {error && <p style={{ color: '#f44336' }}>{error}</p>}
        {!isLoading && !error && <p>Bem Vindo ao Sistema Integrado de Gestão de Ocorrências</p>}
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