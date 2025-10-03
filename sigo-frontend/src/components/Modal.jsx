import './Modal.css';

function Modal({ ocorrencia, onClose }) {
  if (!ocorrencia) {
    return null;
  }

  const formatarTimestampCompleto = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalhes da Ocorrência #{ocorrencia.id}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="info-section">
            <h4>Status e Prioridade</h4>
            <p><strong>Status:</strong> {ocorrencia.status}</p>
            <p><strong>Prioridade:</strong> {ocorrencia.prioridade}</p>
          </div>
          <div className="info-section">
            <h4>Horários</h4>
            <p><strong>Abertura:</strong> {formatarTimestampCompleto(ocorrencia.timestamps.abertura)}</p>
            <p><strong>Chegada no Local:</strong> {formatarTimestampCompleto(ocorrencia.timestamps.chegadaNoLocal)}</p>
            <p><strong>Finalização:</strong> {formatarTimestampCompleto(ocorrencia.timestamps.finalizacao)}</p>
          </div>
          <div className="info-section">
            <h4>Endereço</h4>
            <p>{`${ocorrencia.endereco.logradouro}, ${ocorrencia.endereco.numero}`}</p>
            <p>{`${ocorrencia.endereco.bairro}, ${ocorrencia.endereco.cidade} - ${ocorrencia.endereco.uf}`}</p>
            {ocorrencia.endereco.pontoReferencia && <p><em>Ref: {ocorrencia.endereco.pontoReferencia}</em></p>}
          </div>
          <div className="info-section">
            <h4>Detalhes do Chamado</h4>
            <p><strong>Tipo:</strong> {ocorrencia.chamado.tipo}</p>
            <p><strong>Detalhes:</strong> {ocorrencia.chamado.detalhes}</p>
            {ocorrencia.chamado.solicitante && <p><strong>Solicitante:</strong> {`${ocorrencia.chamado.solicitante.nome} - ${ocorrencia.chamado.solicitante.telefone}`}</p>}
          </div>
          <div className="info-section">
            <h4>Equipes Designadas</h4>
            {ocorrencia.equipes.map(equipe => (
              <div key={equipe.id} className="equipe-item">
                <p><strong>Viatura {equipe.id}</strong> ({equipe.viatura})</p>
                <p>Líder: {equipe.lider} | Efetivo: {equipe.efetivo}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;