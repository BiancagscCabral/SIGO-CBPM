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

  // Estados para modal e carregamento
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Mapeamento dos tipos de ocorrência e seus subtipos
  const subtipoOptions = {
    "aph": ["Parada cardíaca", "Convulsão", "Ferimento grave", "Intoxicação"],
    "incendio": ["Residencial", "Comercial", "Vegetação", "Veículo"],
    "acidente_transito": ["Colisão", "Atropelamento", "Capotamento", "Queda de motocicleta"],
    "outros": ["Queda de árvore", "Alagamento", "Animal ferido", "Resgate"]
  };

  // referência para o componente de assinatura
  const sigCanvas = useRef({});

  // Auto-preenchimento dos dados do usuário
  useEffect(() => {
    if (userProfile) {
      setNomeSolicitante(userProfile.nome || "");
      setMatricula(userProfile.matricula || "");
    }
  }, [userProfile]);

  // Função para lidar com mudança no tipo de ocorrência
  const handleTipoChange = (e) => {
    const selectedTipo = e.target.value;
    setTipoOcorrencia(selectedTipo);
    setSubtipoOcorrencia(""); // Reset subtipo when tipo changes
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
        if (file.size <= 10 * 1024 * 1024) { // 10MB
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

  // Função para remover foto
  const removeFoto = (indexToRemove) => {
    setFotos(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Função para gerenciar vídeos
  const handleVideosChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = [];
    
    selectedFiles.forEach(file => {
      if (file.type.startsWith('video/')) {
        if (file.size <= 50 * 1024 * 1024) { // 50MB
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

  // Função para remover vídeo
  const removeVideo = (indexToRemove) => {
    setVideos(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Função para enviar dados ao backend
  const enviarParaBackend = async (dados) => {
    try {
      // Preparar FormData para arquivos grandes (vídeos)
      const formData = new FormData();
      
      // Adicionar dados JSON
      formData.append('dados', JSON.stringify(dados));
      
      // Adicionar arquivos de vídeo separadamente
      videos.forEach((video, index) => {
        formData.append(`video_${index}`, video);
      });
      
      // Adicionar arquivos de foto separadamente (opcional, se preferir não usar base64)
      fotos.forEach((foto, index) => {
        formData.append(`foto_${index}`, foto);
      });

      // Configurar endpoint do backend
      const response = await fetch('/api/ocorrencias', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Incluir cookies na requisição
        headers: {
          // Não definir Content-Type aqui, deixe o browser definir automaticamente para FormData
        }
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const resultado = await response.json();
      console.log("Resposta do backend:", resultado);
      
      return resultado;
    } catch (error) {
      console.error("Erro ao enviar para o backend:", error);
      throw error;
    }
  };

  // Função para resetar o formulário
  const resetarFormulario = () => {
    // Manter apenas os dados do usuário logado
    setNomeSolicitante(userProfile?.nome || "");
    setMatricula(userProfile?.matricula || "");
    
    // Limpar outros campos
    setEndereco("");
    setPontoReferencia("");
    setGps("");
    setTipoOcorrencia("");
    setSubtipoOcorrencia("");
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

  // Função para salvar localmente
  const salvarLocalmente = async () => {
    // Validação robusta dos campos obrigatórios
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
        solicitante: {
          nome: nomeSolicitante,
          matricula: matricula
        },
        localizacao: {
          endereco: endereco,
          pontoReferencia: pontoReferencia || null,
          coordenadas: gps || null
        },
        ocorrencia: {
          tipo: tipoOcorrencia,
          subtipo: subtipoOcorrencia,
          descricao: descricaoInicial,
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
      { campo: nomeSolicitante, nome: 'nomeSolicitante', label: 'Nome do Solicitante' },
      { campo: matricula, nome: 'matricula', label: 'Matrícula' },
      { campo: endereco, nome: 'endereco', label: 'Endereço da Ocorrência' },
      { campo: tipoOcorrencia, nome: 'tipoOcorrencia', label: 'Tipo de Ocorrência' },
      { campo: subtipoOcorrencia, nome: 'subtipoOcorrencia', label: 'Subtipo de Ocorrência' },
      { campo: descricaoInicial, nome: 'descricaoInicial', label: 'Descrição Inicial' }
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
      // Preparar dados da assinatura
      const assinaturaData = sigCanvas.current.isEmpty()
        ? null
        : sigCanvas.current.toDataURL();

      // Converter arquivos para base64 (para fotos pequenas) ou preparar para FormData
      const fotosData = await Promise.all(
        fotos.map(async (foto) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve({
                nome: foto.name,
                tamanho: foto.size,
                tipo: foto.type,
                dados: e.target.result // base64
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
        // Para vídeos, não convertemos para base64 devido ao tamanho
        // Eles serão enviados via FormData separadamente
      }));

      // Estrutura JSON completa para o backend
      const ocorrenciaData = {
        // Dados do solicitante
        solicitante: {
          nome: nomeSolicitante,
          matricula: matricula
        },
        
        // Localização
        localizacao: {
          endereco: endereco,
          pontoReferencia: pontoReferencia || null,
          coordenadas: gps || null
        },
        
        // Dados da ocorrência
        ocorrencia: {
          tipo: tipoOcorrencia,
          subtipo: subtipoOcorrencia,
          descricao: descricaoInicial,
          codigoViatura: codigoViatura || null,
          membrosEquipe: membrosEquipe || null
        },
        
        // Anexos
        anexos: {
          fotos: fotosData,
          videos: videosData,
          quantidadeFotos: fotos.length,
          quantidadeVideos: videos.length
        },
        
        // Assinatura
        assinatura: assinaturaData,
        
        // Metadados
        metadata: {
          dataRegistro: new Date().toISOString(),
          versaoFormulario: "1.0",
          navegador: navigator.userAgent,
          dispositivoMovel: /Mobi|Android/i.test(navigator.userAgent)
        }
      };

      console.log("DADOS JSON PARA BACKEND:", JSON.stringify(ocorrenciaData, null, 2));
      
      // Enviar para o backend
      try {
        const resultado = await enviarParaBackend(ocorrenciaData);
        setSuccessMessage("Ocorrência registrada com sucesso!");
        setShowSuccessModal(true);
        
      } catch (backendError) {
        console.error("Erro no envio:", backendError);
        alert("Erro ao enviar ocorrência para o servidor. Tente novamente ou salve localmente.");
      }
      
    } catch (error) {
      console.error("Erro ao processar dados:", error);
      alert("Erro ao processar os dados do formulário.");
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
              <label htmlFor="nomeSolicitante">Nome do Solicitante *</label>
              <input type="text" id="nomeSolicitante" name="nomeSolicitante" placeholder="Nome Completo" value={nomeSolicitante} onChange={(e) => setNomeSolicitante(e.target.value)} required />
            </div>

            <div className="form-group full-width">
              <label htmlFor="matricula">Matrícula *</label>
              <input type="text" id="matricula" name="matricula" placeholder="Matrícula" value={matricula} onChange={(e) => setMatricula(e.target.value)} required />
            </div>

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
                <option value="aph">Atendimento Pré-Hospitalar (APH)</option>
                <option value="incendio">Incêndio</option>
                <option value="acidente_transito">Acidente de Trânsito</option>
                <option value="outros">Outros</option>
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
                  <option key={subtipo} value={subtipo}>{subtipo}</option>
                ))}
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
              <textarea id="descricaoInicial" name="descricaoInicial" rows="5" placeholder="Descreva os detalhes da ocorrência" value={descricaoInicial} onChange={(e) => setDescricaoInicial(e.target.value)} required></textarea>
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