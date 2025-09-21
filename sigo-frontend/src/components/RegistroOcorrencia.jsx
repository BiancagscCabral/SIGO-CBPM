import React, { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas"; // Biblioteca de assinatura
import "./RegistroOcorrencia.css";
import icon_gps from "../assets/icon_gps.svg";
import icon_gpsb from "../assets/icon_gpsb.svg";
import pen from "../assets/pen.svg";
import camera1 from "../assets/camera1.svg";
import video from "../assets/video.svg";
import save from "../assets/save.svg";
import send from "../assets/send.svg";
import lixo from "../assets/lixo.svg";

function RegistroOcorrencia() {
  const [nomeSolicitante, setNomeSolicitante] = useState("");
  const [matricula, setMatricula] = useState("");
  const [endereco, setEndereco] = useState("");
  const [pontoReferencia, setPontoReferencia] = useState("");
  const [gps, setGps] = useState("");
  const [tipoOcorrencia, setTipoOcorrencia] = useState("");
  const [subtipoOcorrencia, setSubtipoOcorrencia] = useState("");
  const [codigoViatura, setCodigoViatura] = useState("");
  const [membrosEquipe, setMembrosEquipe] = useState("");
  const [descricaoInicial, setDescricaoInicial] = useState("");
  const [fotos, setFotos] = useState([]);
  const [videos, setVideos] = useState([]);

  // referência para o componente de assinatura
  const sigCanvas = useRef({});

  // Função para limpar a assinatura
  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const assinaturaData = sigCanvas.current.isEmpty()
      ? "Assinatura em branco"
      : sigCanvas.current.toDataURL();

    const ocorrenciaData = {
      nomeSolicitante, matricula, endereco, pontoReferencia, gps, tipoOcorrencia,
      subtipoOcorrencia, codigoViatura, membrosEquipe, descricaoInicial,
      fotos: fotos.map((f) => f.name),
      videos: videos.map((v) => v.name),
      assinatura: assinaturaData,
    };
    console.log("DADOS FINAIS DA OCORRÊNCIA:", ocorrenciaData);
    alert("Ocorrência enviada! Verifique o console do navegador.");
  };

  return (
    <div className="page-container occurrence-page">

      <div className="page-title-section">
        <h1>Registrar Nova Ocorrência</h1>
        <p>Cadastre uma nova ocorrência no sistema</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="occurrence-form">
          <h2 className="form-section-title">Informações da Ocorrência</h2>

          <div className="form-group full-width">
            <label htmlFor="nomeSolicitante">Nome do Solicitante *</label>
            <input type="text" id="nomeSolicitante" placeholder="Nome Completo" value={nomeSolicitante} onChange={(e) => setNomeSolicitante(e.target.value)} required />
          </div>
          
          <div className="form-group full-width">
            <label htmlFor="matricula">Matrícula *</label>
            <input type="text" id="matricula" placeholder="Matrícula" value={matricula} onChange={(e) => setMatricula(e.target.value)} required />
          </div>
          
          <div className="form-group full-width">
            <label htmlFor="endereco">Endereço da Ocorrência *</label>
            <input type="text" id="endereco" placeholder="Rua, número, bairro" value={endereco} onChange={(e) => setEndereco(e.target.value)} required />
          </div>
          
          <div className="form-group full-width">
            <label htmlFor="pontoReferencia">Ponto de Referência</label>
            <input type="text" id="pontoReferencia" placeholder="Próximo a..." value={pontoReferencia} onChange={(e) => setPontoReferencia(e.target.value)} />
          </div>
          
          <div className="form-group full-width">
            <label htmlFor="gps"><img src={icon_gps} alt="icone do gps" />Localização GPS</label>
            <div className="input-with-button">
              <input type="text" id="gps" placeholder="Aguardando captura..." value={gps} onChange={(e) => setGps(e.target.value)} readOnly />
              <button type="button" className="btn-capture">
                <img src={icon_gpsb} alt="icone do gps black" />Capturar
              </button>
            </div>
          </div>
          
          <div className="form-group full-width">
            <label htmlFor="tipoOcorrencia">Tipos de Ocorrência *</label>
            <select id="tipoOcorrencia" value={tipoOcorrencia} onChange={(e) => setTipoOcorrencia(e.target.value)} required>
              <option value="">Selecione o tipo</option>
              <option value="incendio">Incêndio</option>
              <option value="resgate">Resgate</option>
              <option value="aph">Atendimento Pré-Hospitalar (APH)</option>
              <option value="prevencao">Prevenção</option>
            </select>
          </div>
          
          <div className="form-group full-width">
            <label htmlFor="subtipoOcorrencia">Subtipo de Ocorrência *</label>
            <select id="subtipoOcorrencia" value={subtipoOcorrencia} onChange={(e) => setSubtipoOcorrencia(e.target.value)} required>
              <option value="">Selecione o subtipo</option>
              <option value="residencial">Residencial</option>
              <option value="veicular">Veicular</option>
              <option value="terrestre">Terrestre</option>
              <option value="aquatico">Aquático</option>
            </select>
          </div>
          
          <div className="form-group full-width">
            <label htmlFor="codigoViatura">Código da Viatura *</label>
            <input type="text" id="codigoViatura" placeholder="Ex: VRT-0303" value={codigoViatura} onChange={(e) => setCodigoViatura(e.target.value)} required />
          </div>
          
          <div className="form-group full-width">
            <label htmlFor="membrosEquipe">Membros da Equipe *</label>
            <input type="text" id="membrosEquipe" placeholder="Ex: João Gabriel, Carla Santana" value={membrosEquipe} onChange={(e) => setMembrosEquipe(e.target.value)} required />
          </div>
          
          <div className="form-group full-width">
            <label htmlFor="descricaoInicial">Descrição Inicial *</label>
            <textarea id="descricaoInicial" rows="5" placeholder="Descreva os detalhes da ocorrência" value={descricaoInicial} onChange={(e) => setDescricaoInicial(e.target.value)} required></textarea>
          </div>
          
          {/* Container para alinhar os uploads lado a lado */}
          <div className="upload-row">
            <div className="form-group half-width">
              <div className="upload-box">
                <label htmlFor="fotosInput" className="upload-label">
                  <span><img src={camera1} alt="camera" />Adicionar Fotos</span>
                  <small>Máximo 10MB por foto</small>
                </label>
                <input type="file" id="fotosInput" multiple accept="image/*" onChange={(e) => setFotos([...e.target.files])} />
              </div>
            </div>
            <div className="form-group half-width">
              <div className="upload-box">
                <label htmlFor="videosInput" className="upload-label">
                  <span><img src={video} alt="video" />Adicionar Vídeos</span>
                  <small>Máximo 50MB por vídeo</small>
                </label>
                <input type="file" id="videosInput" multiple accept="video/*" onChange={(e) => setVideos([...e.target.files])} />
              </div>
            </div>
          </div>
          
          {/* Assinatura Digital */}
          <div className="form-group full-width">
            <label><img src={pen} alt="caneta" />Assinatura Digital</label>
            <div className="signature-box">
              <SignatureCanvas ref={sigCanvas} penColor="black" canvasProps={{ className: "signature-canvas" }} />
              <div className="signature-actions">
                <small>Use o mouse para assinar</small>
                <button type="button" onClick={clearSignature} className="btn-clear-signature">
                  <img src={lixo} alt="lixeira" /> Limpar
                </button>
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-secondary">
              <img src={save} alt="salvar" />Salvar Localmente
            </button>
            <button type="submit" className="btn-primary">
              <img src={send} alt="enviar" />Enviar Online
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistroOcorrencia;