import { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
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
  const { userProfile } = useUser();
  const navigate = useNavigate();
  
  const [endereco, setEndereco] = useState("");
  const [pontoReferencia, setPontoReferencia] = useState("");
  const [gps, setGps] = useState("");
  const [tipoOcorrencia, setTipoOcorrencia] = useState("");
  const [subtipoOcorrencia, setSubtipoOcorrencia] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [codigoViatura, setCodigoViatura] = useState("");
  const [membrosEquipe, setMembrosEquipe] = useState("");
  const [descricaoInicial, setDescricaoInicial] = useState("");
  const [fotos, setFotos] = useState([]);
  const [videos, setVideos] = useState([]);

  // Estados para modal e carregamento
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const subtipoOptions = {
    "medic_emergency": [
      { value: "heart_stop", label: "Parada cardíaca" },
      { value: "seizure", label: "Convulsão" },
      { value: "serious_injury", label: "Ferimento grave" },
      { value: "intoxication", label: "Intoxicação" },
      { value: "pre_hospital_care", label: "Atendimento Pré-Hospitalar" }
    ],
    "fire": [
      { value: "residential", label: "Residencial" },
      { value: "comercial", label: "Comercial" },
      { value: "vegetation", label: "Vegetação" },
      { value: "vehicle", label: "Veículo" }
    ],
    "traffic_accident": [
      { value: "collision", label: "Colisão" },
      { value: "run_over", label: "Atropelamento" },
      { value: "rollover", label: "Capotamento" },
      { value: "motorcycle_crash", label: "Queda de motocicleta" }
    ],
    "other": [
      { value: "tree_crash", label: "Queda de árvore" },
      { value: "flood", label: "Alagamento" },
      { value: "injured_animal", label: "Animal ferido" }
    ]
  };

  const sigCanvas = useRef({});

  // Função para lidar com mudança no tipo de ocorrência
  const handleTipoChange = (e) => {
    const selectedTipo = e.target.value;
    setTipoOcorrencia(selectedTipo);
    setSubtipoOcorrencia(""); 
  };

  // Função para capturar localização usando Navigator Geolocation
  const captureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Preencher apenas as coordenadas no campo GPS
          setGps(`${latitude}, ${longitude}`);
          
          // Fazer geocoding reverso para obter o endereço formatado
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            
            if (data && data.address) {
              // Extrair informações específicas do endereço
              const address = data.address;
              let enderecoFormatado = '';
              
              // Construir endereço formatado: Rua, Número, Bairro, CEP
              if (address.road || address.street) {
                enderecoFormatado += address.road || address.street;
              }
              
              if (address.house_number) {
                enderecoFormatado += `, ${address.house_number}`;
              }
              
              if (address.neighbourhood || address.suburb || address.city_district) {
                const bairro = address.neighbourhood || address.suburb || address.city_district;
                enderecoFormatado += `, ${bairro}`;
              }
              
              if (address.postcode) {
                enderecoFormatado += `, CEP: ${address.postcode}`;
              }
              
              // Se conseguiu formar um endereço estruturado, usar ele
              if (enderecoFormatado.trim()) {
                setEndereco(enderecoFormatado);
              } else if (data.display_name) {
                // Fallback para o endereço completo se não conseguir extrair partes específicas
                setEndereco(data.display_name);
              }
            } else if (data.display_name) {
              setEndereco(data.display_name);
            }
          } catch (error) {
            console.error("Erro ao fazer geocoding reverso:", error);
            // Não mostrar erro ao usuário, pois as coordenadas já foram capturadas
          }
        },
        (error) => {
          console.error("Erro ao capturar localização:", error);
          alert("Erro ao capturar localização. Verifique se a localização está habilitada.");
        }
      );
    } else {
      alert("Geolocalização não é suportada por este navegador.");
    }
  };

  // Função para gerenciar fotos
  const handleFotosChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = [];
    
    selectedFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        if (file.size <= 10 * 1024 * 1024) { 
          validFiles.push(file);
        } else {
          alert(`A foto ${file.name} é muito grande. Máximo 10MB.`);
        }
      } else {
        alert(`${file.name} não é um arquivo de imagem válido.`);
      }
    });
    
    setFotos(prev => [...prev, ...validFiles]);
  };

  const removeFoto = (indexToRemove) => {
    setFotos(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleVideosChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = [];
    
    selectedFiles.forEach(file => {
      if (file.type.startsWith('video/')) {
        if (file.size <= 50 * 1024 * 1024) { 
          validFiles.push(file);
        } else {
          alert(`O vídeo ${file.name} é muito grande. Máximo 50MB.`);
        }
      } else {
        alert(`${file.name} não é um arquivo de vídeo válido.`);
      }
    });
    
    setVideos(prev => [...prev, ...validFiles]);
  };

  const removeVideo = (indexToRemove) => {
    setVideos(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Função para resetar o formulário
  const resetarFormulario = () => {
    setEndereco("");
    setPontoReferencia("");
    setGps("");
    setTipoOcorrencia("");
    setSubtipoOcorrencia("");
    setPrioridade("");
    setCodigoViatura("");
    setMembrosEquipe("");
    setDescricaoInicial("");
    setFotos([]);
    setVideos([]);
    
    // Limpar assinatura
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

  // Função para salvar localmente (para uso offline)
  const salvarLocalmente = async () => {
    if (!validarCamposObrigatorios()) {
      return;
    }

    setIsLoading(true);

    try {
      // Preparar dados da assinatura
      const assinaturaData = sigCanvas.current.isEmpty()
        ? null
        : sigCanvas.current.toDataURL();

      // Converter fotos para base64
      const fotosData = await Promise.all(
        fotos.map(async (foto) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve({
                nome: foto.name,
                tamanho: foto.size,
                tipo: foto.type,
                dados: e.target.result
              });
            };
            reader.readAsDataURL(foto);
          });
        })
      );

      const videosData = videos.map((video) => ({
        nome: video.name,
        tamanho: video.size,
        tipo: video.type,
      }));

      // Estrutura para salvamento local
      const ocorrenciaLocal = {
        id: Date.now(),
        localizacao: {
          endereco: endereco,
          pontoReferencia: pontoReferencia || null,
          coordenadas: gps || null
        },
        ocorrencia: {
          tipo: tipoOcorrencia,
          subtipo: subtipoOcorrencia,
          prioridade: prioridade,
          descricao: descricaoInicial || null,
          codigoViatura: codigoViatura || null,
          membrosEquipe: membrosEquipe || null
        },
        anexos: {
          fotos: fotosData,
          videos: videosData,
          quantidadeFotos: fotos.length,
          quantidadeVideos: videos.length
        },
        assinatura: assinaturaData,
        metadata: {
          dataRegistro: new Date().toISOString(),
          versaoFormulario: "1.0",
          status: "pendente_envio"
        }
      };

      // Salvar no localStorage
      const ocorrenciasSalvas = JSON.parse(localStorage.getItem('ocorrencias_offline') || '[]');
      ocorrenciasSalvas.push(ocorrenciaLocal);
      localStorage.setItem('ocorrencias_offline', JSON.stringify(ocorrenciasSalvas));

      setSuccessMessage("Ocorrência salva localmente com sucesso!");
      setShowSuccessModal(true);

    } catch (error) {
      console.error("Erro ao salvar localmente:", error);
      alert("Erro ao salvar a ocorrência localmente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Função para registrar nova ocorrência
  const registrarNova = () => {
    resetarFormulario();
    setShowSuccessModal(false);
  };

  // Função para voltar ao dashboard
  const voltarDashboard = () => {
    navigate('/dashboard');
  };

  // Função para validar campos obrigatórios
  const validarCamposObrigatorios = () => {
    const camposObrigatorios = [
      { campo: endereco, nome: 'endereco', label: 'Endereço da Ocorrência' },
      { campo: tipoOcorrencia, nome: 'tipoOcorrencia', label: 'Tipo de Ocorrência' },
      { campo: subtipoOcorrencia, nome: 'subtipoOcorrencia', label: 'Subtipo de Ocorrência' },
      { campo: prioridade, nome: 'prioridade', label: 'Prioridade' }
    ];

    const camposVazios = camposObrigatorios.filter(item => !item.campo.trim());

    if (camposVazios.length > 0) {
      // Adicionar classe de erro aos campos vazios
      camposVazios.forEach(item => {
        const elemento = document.querySelector(`[name="${item.nome}"]`);
        if (elemento) {
          elemento.classList.add('form-error');
          // Remover a classe após 3 segundos
          setTimeout(() => {
            elemento.classList.remove('form-error');
          }, 3000);
        }
      });

      // Focar no primeiro campo vazio
      const primeiroElemento = document.querySelector(`[name="${camposVazios[0].nome}"]`);
      if (primeiroElemento) {
        primeiroElemento.focus();
      }

      // Mostrar alerta com lista dos campos vazios
      alert(`Por favor, preencha os seguintes campos obrigatórios:\n${camposVazios.map(item => `- ${item.label}`).join('\n')}`);
      return false;
    }

    return true;
  };

  // Função para limpar a assinatura
  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validação robusta dos campos obrigatórios
    if (!validarCamposObrigatorios()) {
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      const tipoParaCategoria = {
        "medic_emergency": "medic_emergency",
        "fire": "fire", 
        "traffic_accident": "traffic_accident",
        "other": "other"
      };

      let locationArray = [];
      if (gps) {
        const coords = gps.split(',').map(coord => parseFloat(coord.trim()));
        if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
          locationArray = coords;
        }
      }

      const participantesArray = membrosEquipe ? membrosEquipe.split(',').map(nome => nome.trim()) : [];


      formData.append('categoria', tipoParaCategoria[tipoOcorrencia] || tipoOcorrencia);
      formData.append('subcategoria', subtipoOcorrencia);
      formData.append('descricao', descricaoInicial || '');
      formData.append('pontoDeReferencia', pontoReferencia || '');
      formData.append('codigoViatura', codigoViatura || '');
      
      locationArray.forEach(coord => {
        formData.append('gps', coord.toString());
      });
      
      participantesArray.forEach(participante => {
        formData.append('participantes', participante);
      });

      console.log("📋 Dados sendo enviados:");
      for (let [key, value] of formData.entries()) {
        console.log(`   ${key}: ${value}`);
      }

      const response = await fetch('/api/occurrence/new', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
      }

      const resultado = await response.json();
      console.log("✅ Resposta do backend:", resultado);
      
      setSuccessMessage(`Ocorrência registrada com sucesso! ID: ${resultado.id}`);
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error("❌ Erro ao enviar ocorrência:", error);
      alert(`Erro ao enviar ocorrência: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main-content">
      <div className="registro-ocorrencia-container">

        <div className="page-header">
          <h1>Registrar Nova Ocorrência</h1>
          <p>Cadastre uma nova ocorrência no sistema</p>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="occurrence-form">
            <h2 className="form-section-title">Informações da Ocorrência</h2>

            <div className="form-group full-width">
              <label htmlFor="endereco">Endereço da Ocorrência *</label>
              <input type="text" id="endereco" name="endereco" placeholder="Será preenchido automaticamente com a captura GPS" value={endereco} onChange={(e) => setEndereco(e.target.value)} required />
            </div>

            <div className="form-group full-width">
              <label htmlFor="pontoReferencia">Ponto de Referência</label>
              <input type="text" id="pontoReferencia" placeholder="Próximo a..." value={pontoReferencia} onChange={(e) => setPontoReferencia(e.target.value)} />
            </div>

            <div className="form-group full-width">
              <label htmlFor="gps"><img src={icon_gps} alt="icone do gps" />Coordenadas GPS</label>
              <div className="input-with-button">
                <input type="text" id="gps" placeholder="Latitude, Longitude" value={gps} onChange={(e) => setGps(e.target.value)} readOnly />
                <button type="button" className="btn-capture" onClick={captureLocation}>
                  <img src={icon_gpsb} alt="icone do gps black" />Capturar
                </button>
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="tipoOcorrencia">Tipos de Ocorrência *</label>
              <select id="tipoOcorrencia" name="tipoOcorrencia" value={tipoOcorrencia} onChange={handleTipoChange} required>
                <option value="">Selecione o tipo</option>
                <option value="medic_emergency">Emergência Médica</option>
                <option value="fire">Incêndio</option>
                <option value="traffic_accident">Acidente de Trânsito</option>
                <option value="other">Outros</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="subtipoOcorrencia">Subtipo de Ocorrência *</label>
              <select 
                id="subtipoOcorrencia" 
                name="subtipoOcorrencia"
                value={subtipoOcorrencia} 
                onChange={(e) => setSubtipoOcorrencia(e.target.value)} 
                required
                disabled={!tipoOcorrencia}
              >
                <option value="">Selecione o subtipo</option>
                {tipoOcorrencia && subtipoOptions[tipoOcorrencia]?.map((subtipo) => (
                  <option key={subtipo.value} value={subtipo.value}>{subtipo.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="prioridade">Prioridade *</label>
              <select id="prioridade" name="prioridade" value={prioridade} onChange={(e) => setPrioridade(e.target.value)} required>
                <option value="">Selecione a prioridade</option>
                <option value="alta">Alta - Situação crítica, risco iminente</option>
                <option value="media">Média - Situação que requer atenção</option>
                <option value="baixa">Baixa - Situação estável, não urgente</option>
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
              <label htmlFor="descricaoInicial">Descrição Inicial</label>
              <textarea id="descricaoInicial" name="descricaoInicial" rows="5" placeholder="Descreva os detalhes da ocorrência (pode ser preenchido posteriormente)" value={descricaoInicial} onChange={(e) => setDescricaoInicial(e.target.value)}></textarea>
            </div>

            <div className="upload-row">
              <div className="form-group">
                <div className="upload-box">
                  <label htmlFor="fotosInput" className="upload-label">
                    <span><img src={camera1} alt="camera" />Adicionar Fotos</span>
                    <small>Máximo 10MB por foto</small>
                  </label>
                  <input type="file" id="fotosInput" multiple accept="image/*" onChange={handleFotosChange} />
                </div>
                {fotos.length > 0 && (
                  <div className="files-list">
                    <h4>Fotos selecionadas ({fotos.length}):</h4>
                    {fotos.map((foto, index) => (
                      <div key={index} className="file-item">
                        <span>{foto.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFoto(index)}
                          className="btn-remove-file"
                          title="Remover foto"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="form-group">
                <div className="upload-box">
                  <label htmlFor="videosInput" className="upload-label">
                    <span><img src={video} alt="video" />Adicionar Vídeos</span>
                    <small>Máximo 50MB por vídeo</small>
                  </label>
                  <input type="file" id="videosInput" multiple accept="video/*" onChange={handleVideosChange} />
                </div>
                {videos.length > 0 && (
                  <div className="files-list">
                    <h4>Vídeos selecionados ({videos.length}):</h4>
                    {videos.map((video, index) => (
                      <div key={index} className="file-item">
                        <span>{video.name}</span>
                        <button
                          type="button"
                          onClick={() => removeVideo(index)}
                          className="btn-remove-file"
                          title="Remover vídeo"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

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
              <button 
                type="button" 
                className="btn-secondary"
                onClick={salvarLocalmente}
                disabled={isLoading}
              >
                <img src={save} alt="salvar" />
                {isLoading ? 'Salvando...' : 'Salvar Localmente'}
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isLoading}
              >
                <img src={send} alt="enviar" />
                {isLoading ? 'Enviando...' : 'Enviar Online'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Modal de Sucesso */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Ocorrência Registrada</h3>
            <p>{successMessage}</p>
            <div className="modal-actions">
              <button 
                onClick={registrarNova}
                className="btn-secondary"
              >
                Registrar Nova
              </button>
              <button 
                onClick={voltarDashboard}
                className="btn-primary"
              >
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default RegistroOcorrencia;