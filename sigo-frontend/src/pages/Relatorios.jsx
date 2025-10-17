import React, { useState, useEffect } from 'react';
import './Relatorios.css';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

// --- DEFINIÇÃO DA ROTA DA API ---
// quando você for criar a rota, se o nome for diferente, mudar aqui.
const RELATORIOS_API_URL = '/api/relatorios/stats'; // Este é o nosso "contrato" com o backend



const AnalyticsCard = ({ value, title, change, changeText }) => {
  const changeValue = parseFloat(change);
  const isPositive = changeValue >= 0;
  const changeIcon = isPositive ? <FiArrowUp /> : <FiArrowDown />;
  const changeColor = isPositive ? '#4caf50' : '#f44336';

  return (
    <div className="analytics-card">
      <span className="analytics-value">{value}</span>
      <span className="analytics-title">{title}</span>
      {changeText && (
        <span className="analytics-change" style={{ color: changeColor }}>
          {changeIcon} {change} {changeText}
        </span>
      )}
    </div>
  );
};

const AvailableReportCard = ({ title, description, count }) => (
  <div className="available-report-card">
    <h4>{title}</h4>
    <p>{description}</p>
    <a href="#" className="report-count">{count} ocorrências</a>
  </div>
);



function Relatorios() {
 
  const [tipoRelatorio, setTipoRelatorio] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [formato, setFormato] = useState('');

  const [kpiData, setKpiData] = useState([]);
  const [availableReports, setAvailableReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Usando a rota que defini 
        const response = await fetch(RELATORIOS_API_URL);

        if (!response.ok) {
          throw new Error('A rota da API ainda não está pronta ou falhou.');
        }

        const data = await response.json();
        
        setKpiData(data.kpis || []); 
        setAvailableReports(data.reports || []);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGerarRelatorio = async (e) => {
    e.preventDefault();
    
  };

  return (
    <main className="main-content">
      <div className="relatorios-header">
        <h1>Relatórios e Estatísticas</h1>
        <p>Visualize dados e gere relatórios detalhados</p>
      </div>

      {/* Seção 1: Painel de Estatísticas */}
      <section className="analytics-grid">
        {isLoading && <p>Carregando estatísticas...</p>}
        {error && <p className="error-message">Erro ao carregar: {error}</p>}
        {!isLoading && !error && kpiData.map((kpi, index) => (
          <AnalyticsCard 
            key={index}
            value={kpi.value}
            title={kpi.title}
            change={kpi.change}
            changeText={kpi.changeText}
          />
        ))}
      </section>

      {/* Seção 2: Gerador de Relatório */}
      <section className="report-generator">
        <h3>Gerar Novo Relatório</h3>
        <p>Personalize e gere relatórios específicos</p>
        <form className="report-form" onSubmit={handleGerarRelatorio}>
          <div className="form-group">
            <label>Tipo de Relatório</label>
            <select value={tipoRelatorio} onChange={(e) => setTipoRelatorio(e.target.value)} required>
              <option value="" disabled>Selecione o tipo</option>
              <option value="equipes">Por Equipes</option>
              <option value="tipo_ocorrencia">Por Tipo de Ocorrência</option>
               <option value="analise_geografica">Análise Geográfica</option>
               <option value="analise_temporal">Análise Temporal</option>


            </select>
          </div>
          <div className="form-group">
            <label>Período</label>
            <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} required>
              <option value="" disabled>Selecione o período</option>
              <option value="hoje">Hoje</option>
              <option value="ultima_semana">Última Semana</option>
              <option value="ultimo_mes">Último Mês</option>
              <option value="ultimo_trimestre">Último Trimestre</option>
              <option value="personalizado">Último Ano</option>
            </select>
          </div>
          <div className="form-group">
            <label>Formato</label>
            <select value={formato} onChange={(e) => setFormato(e.target.value)} required>
              <option value="" disabled>Formato de saída</option>
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
               <option value="csv">CSV</option>
            </select>
          </div>
          
          <div className="form-group">
          <label>&nbsp;</label> 
          <button type="submit" className="btn-gerar">Gerar Relatório</button>
          </div>
        </form>
      </section>

      {/* Seção 3: Relatórios Disponíveis */}
      
      <section className="available-reports">
        <h3>Relatórios Disponíveis</h3>
        <p>Acesse relatórios gerados anteriormente</p>
        <div className="available-reports-grid">
          {isLoading && <p>Carregando...</p>}
          {error && <p className="error-message">Erro ao carregar: {error}</p>}
          {!isLoading && !error && availableReports.map((report, index) => (
            <AvailableReportCard 
              key={index}
              title={report.title}
              description={report.description}
              count={report.count}
            />
          ))}
        </div>
      </section>

      
    </main>
  );
}

export default Relatorios;