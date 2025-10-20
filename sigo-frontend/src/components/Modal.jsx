import React from 'react';
import './Modal.css';
import { useUser } from '../contexts/UserContext';

function Modal({ ocorrencia, onClose }) {
  if (!ocorrencia) return null;

  const { userProfile } = useUser();

  const formatarTimestampCompleto = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  const formatEndereco = (e) => {
    if (!e) return 'Não disponível';
    if (e.formatted && e.formatted.trim()) return e.formatted;
    const street = [e.logradouro, e.numero].filter(Boolean).join(', ').trim();
    const bairro = e.bairro ? e.bairro.trim() : '';
    const cidadeUf = [e.cidade, e.uf].filter(Boolean).join('/').trim();
    const cep = e.cep ? `CEP: ${e.cep}` : '';
    const parts = [];
    if (street) parts.push(street);
    if (bairro) parts.push(bairro);
    if (cidadeUf) parts.push(cidadeUf);
    if (cep) parts.push(cep);
    return parts.join(', ') || 'Não disponível';
  };

  const categoriaLabelMap = {
    'fire': 'Incêndio',
    'medic_emergency': 'Emergência Médica',
    'traffic_accident': 'Acidente de Trânsito',
    'other': 'Outro'
  };

  const subcategoriaLabelMap = {
    'residential': 'Residencial',
    'comercial': 'Comercial',
    'vegetation': 'Vegetação',
    'vehicle': 'Veículo',
    'heart_stop': 'Parada cardíaca',
    'seizure': 'Convulsão',
    'serious_injury': 'Ferimento grave',
    'intoxication': 'Intoxicação',
    'pre_hospital_care': 'Atendimento Pré-Hospitalar',
    'collision': 'Colisão',
    'run_over': 'Atropelamento',
    'rollover': 'Capotamento',
    'motorcycle_crash': 'Queda de motocicleta',
    'tree_crash': 'Queda de árvore',
    'flood': 'Alagamento',
    'injured_animal': 'Animal ferido'
  };

  const displayTipo = () => {
    const tipoToken = ocorrencia.chamado?.tipoToken || '';
    const tipoRaw = ocorrencia.chamado?.tipo || '';
    if (tipoToken && categoriaLabelMap[tipoToken]) return categoriaLabelMap[tipoToken];
    if (categoriaLabelMap[tipoRaw]) return categoriaLabelMap[tipoRaw];
    return tipoRaw || 'Não informado';
  };

  const displaySubtipo = () => {
    const subtipoToken = ocorrencia.chamado?.subtipoToken || '';
    const subtipoRaw = ocorrencia.chamado?.subtipo || '';
    if (subtipoToken && subcategoriaLabelMap[subtipoToken]) return subcategoriaLabelMap[subtipoToken];
    if (subcategoriaLabelMap[subtipoRaw]) return subcategoriaLabelMap[subtipoRaw];
    return subtipoRaw || '';
  };

  const isAutor = () => {
    const usuarioIdMeta = ocorrencia.metadata?.usuarioId || ocorrencia.metadata?.usuario_id || ocorrencia.metadata?.applicant_id || null;
    if (!usuarioIdMeta) return false;
    const current = userProfile?.id || null;
    return current && String(current) === String(usuarioIdMeta);
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
            <p><strong>Status:</strong> {ocorrencia.status || 'N/A'}</p>
            <p><strong>Prioridade:</strong> {ocorrencia.prioridade || 'N/A'}</p>
          </div>
          <div className="info-section">
            <h4>Horários</h4>
            <p><strong>Abertura:</strong> {formatarTimestampCompleto(ocorrencia.timestamps?.abertura)}</p>
            <p><strong>Chegada no Local:</strong> {formatarTimestampCompleto(ocorrencia.timestamps?.chegadaNoLocal)}</p>
            <p><strong>Finalização:</strong> {formatarTimestampCompleto(ocorrencia.timestamps?.finalizacao)}</p>
          </div>
          <div className="info-section">
            <h4>Endereço</h4>
            <p>{formatEndereco(ocorrencia.endereco)}</p>
            {ocorrencia.chamado?.pontoReferencia && <p><em>Ref: {ocorrencia.chamado.pontoReferencia}</em></p>}
          </div>
          <div className="info-section">
            <h4>Detalhes do Chamado</h4>
            <p><strong>Tipo:</strong> {displayTipo()}</p>
            {displaySubtipo() && <p><strong>Subtipo:</strong> {displaySubtipo()}</p>}
            <p><strong>Detalhes:</strong> {ocorrencia.chamado?.detalhes || 'N/A'}</p>
            {ocorrencia.chamado?.solicitante?.nome && <p><strong>Solicitante:</strong> {ocorrencia.chamado.solicitante.nome}</p>}
            <p><strong>Registrado por:</strong> {isAutor() ? 'Você' : (ocorrencia.metadata?.nomeUsuario || ocorrencia.metadata?.usuarioId || ocorrencia.metadata?.usuario_id || ocorrencia.metadata?.applicant_id || 'N/A')}</p>
          </div>
          <div className="info-section">
            <h4>Equipes Designadas</h4>
            {(ocorrencia.equipes || []).map(equipe => (
              <div key={equipe.id} className="equipe-item">
                <p><strong>Viatura {equipe.id}</strong>{equipe.viatura ? ` (${equipe.viatura})` : ''}</p>
                <p>Líder: {equipe.lider || 'N/A'} | Efetivo: {equipe.efetivo || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;