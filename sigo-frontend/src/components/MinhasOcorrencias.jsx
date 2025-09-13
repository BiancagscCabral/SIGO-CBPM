import React, { useState } from 'react';
import './MinhasOcorrencias.css';

const getStatusClass = (status) => {
  if (status === 'Em andamento') return 'status-andamento';
  if (status === 'Reforço Solicitado') return 'status-reforco';
  if (status === 'Finalizada') return 'status-finalizada';
  return '';
};

const dadosIniciaisMinhasOcorrencias = [
    { id: '037', status: 'Em andamento', tipo: 'Vazamento de gás', endereco: 'Rua das Pitangas, 88', horario: '16:05' },
    { id: '008', status: 'Finalizada', tipo: 'Alagamento', endereco: 'Rua da Harmonia, 355', horario: '09:45' },
    { id: '014', status: 'Reforço Solicitado', tipo: 'Incêndio Residencial', endereco: 'Rua das Flores, 123', horario: '14:30' },
    { id: '032', status: 'Finalizada', tipo: 'Incêndio Residencial', endereco: 'Rua do Sol, 500', horario: '11:00' },
];

function MinhasOcorrencias() {
  const [ocorrencias, setOcorrencias] = useState(dadosIniciaisMinhasOcorrencias);

  const handleEdit = (ocorrenciaId) => {
    alert(`Editar ocorrência ${ocorrenciaId}`);
    // Edição
  };

  const handleReport = (ocorrenciaId) => {
    alert(`Gerar relatório para ocorrência ${ocorrenciaId}`);
    // Navegar para relatório ou geraria um PDF
  };

  return (
    <div className="minhas-ocorrencias-container">
      <div className="minhas-ocorrencias-header">
        <h1>MINHAS OCORRÊNCIAS</h1>
      </div>

      <div className="minhas-ocorrencias-actions">
        <a href="#">Ver Todas</a>
      </div>

      <div className="ocorrencia-list">
        {ocorrencias.map((ocorrencia) => (
          <div key={ocorrencia.id} className="ocorrencia-item">
            <div className="ocorrencia-details">
              <strong>
                #{ocorrencia.id}
                <span className={`status ${getStatusClass(ocorrencia.status)}`}>
                  {ocorrencia.status}
                </span>
              </strong>
              <p>{ocorrencia.tipo}</p>
              <p className="endereco">{ocorrencia.endereco}</p>
            </div>
            
            <div className="ocorrencia-actions-time">
                <span className="horario">{ocorrencia.horario}</span>
                <a href="#">Ver Detalhes da Ocorrência</a>
                <div className="item-buttons">
                    <button 
                        className="btn btn-editar" 
                        onClick={() => handleEdit(ocorrencia.id)}
                    >
                        📝 Editar
                    </button>
                    <button 
                        className="btn btn-relatorio"
                        onClick={() => handleReport(ocorrencia.id)}
                    >
                        📄 Relatório de Ocorrência
                    </button>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MinhasOcorrencias;