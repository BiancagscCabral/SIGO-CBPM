import { useState } from 'react';
import './Relatorios.css';
import { FiArrowUp } from 'react-icons/fi';

const AnalyticsCard = ({ value, title, change, changeColor }) => (
  <div className="analytics-card">
    <span className="analytics-value">{value}</span>
    <span className="analytics-title">{title}</span>
    <span className="analytics-change" style={{ color: changeColor }}>
      <FiArrowUp /> {change}
    </span>
  </div>
);

const AvailableReportCard = ({ title, description, count }) => (
  <div className="available-report-card">
    <h4>{title}</h4>
    <p>{description}</p>
    <span className="report-count">{count} ocorrências</span>
  </div>
);

function Relatorios() {
  const [tipoRelatorio, setTipoRelatorio] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [formato, setFormato] = useState('');

  const handleGerarRelatorio = (e) => {
    e.preventDefault();
    alert(`Gerando relatório do tipo "${tipoRelatorio}" para o período "${periodo}" no formato "${formato}".`);
  };

  return (
    <main className="main-content">
      <div className="relatorios-header">
        <h1>Relatórios e Estatísticas</h1>
        <p>Visualize dados e gere relatórios detalhados</p>
      </div>

      <section className="analytics-grid">
        <AnalyticsCard 
          value="8min 32s"
          title="Tempo Médio de Resposta"
          change="-12% vs período anterior"
          changeColor="#f44336"
        />
        <AnalyticsCard 
          value="94.2%"
          title="Taxa de Resolução"
          change="+3.1% vs período anterior"
          changeColor="#4caf50"
        />
        <AnalyticsCard 
          value="12.4"
          title="Ocorrências/Dia"
          change="+5.8% vs período anterior"
          changeColor="#4caf50"
        />
        <AnalyticsCard 
          value="8/12"
          title="Equipes Ativas"
          change="" 
        />
      </section>

      <section className="report-generator">
        <h3>Gerar Novo Relatório</h3>
        <p>Personalize e gere relatórios específicos</p>
        <form className="report-form" onSubmit={handleGerarRelatorio}>
          <div className="form-group">
            <label>Tipo de Relatório</label>
            <select value={tipoRelatorio} onChange={(e) => setTipoRelatorio(e.target.value)}>
              <option value="" disabled>Selecione o tipo</option>
              <option value="equipes">Por Equipes</option>
              <option value="tipo_ocorrencia">Por Tipo de Ocorrência</option>
              <option value="analise_geografica">Análise Geográfica</option>
              <option value="analise_temporal">Análise Temporal</option>
            </select>
          </div>
          <div className="form-group">
            <label>Período</label>
            <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
              <option value="" disabled>Selecione o período</option>
              <option value="hoje">Hoje</option>
              <option value="ultima_semana">Última Semana</option>
              <option value="ultimo_mes">Último Mês</option>
              <option value="ultimo_trimestre">Último Trimestre</option>
              <option value="ultimo_ano">Último Ano</option>
            </select>
          </div>
          <div className="form-group">
            <label>Formato</label>
            <select value={formato} onChange={(e) => setFormato(e.target.value)}>
              <option value="" disabled>Formato de saída</option>
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
          <div className='form-group button-container'>
            <button type="submit" className="btn-gerar">Gerar Relatório</button>
          </div>
        </form>
      </section>
      
      <section className="available-reports">
        <h3>Relatórios Disponíveis</h3>
        <p>Acesse relatórios gerados anteriormente</p>
        <div className="available-reports-grid">
          <AvailableReportCard 
            title="Relatório Mensal"
            description="Resumo completo das ocorrências do mês"
            count="89"
          />
          <AvailableReportCard 
            title="Relatório de Equipe"
            description="Performance e estatísticas por equipe"
            count="156"
          />
          <AvailableReportCard 
            title="Relatório por Tipo"
            description="Análise detalhada por tipo de ocorrência"
            count="267"
          />
        </div>
      </section>
    </main>
  );
}

export default Relatorios;