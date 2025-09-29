import React, { useState } from 'react';
import './Configuracoes.css';

function Configuracoes() {
  const [nome, setNome] = useState('Gislany Araujo');
  const [matricula, setMatricula] = useState('12345-6');
  const [email, setEmail] = useState('Gis.Araujo@cbm.pe.gov.br');
  const [cargo, setCargo] = useState('Tenente');

  const [notificacaoIncendio, setNotificacaoIncendio] = useState(true);
  const [notificacaoEmergencia, setNotificacaoEmergencia] = useState(true);
  const [notificacaoTransito, setNotificacaoTransito] = useState(true);
  const [notificacaoOutros, setNotificacaoOutros] = useState(false);
  
  const [Tema, setTema] = useState(false);
  const [leitorDeTela, setLeitorDeTela] = useState(false);
  const [comandoPorVoz, setComandoPorVoz] = useState(false);
  const [tamanhoTexto, setTamanhoTexto] = useState('pequeno');

  return (
    <main className="main-content">
      <div className="configuracoes-container">
        <div className="page-header">
          <h1>Configurações</h1>
          <p>Gerencie preferências e configurações do sistema</p>
        </div>

        {/* Seção: Perfil do Usuário */}
        <section className="settings-section">
          <h2>Perfil do Usuário</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nome">Nome</label>
              <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="matricula">Matrícula</label>
              <input type="text" id="matricula" value={matricula} onChange={(e) => setMatricula(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="cargo">Cargo</label>
              <input type="text" id="cargo" value={cargo} onChange={(e) => setCargo(e.target.value)} />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn-salvar">Salvar Alterações</button>
          </div>
        </section>

        {/* Seção: Segurança */}
        <section className="settings-section">
          <h2>Segurança</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="senha-atual">Senha Atual</label>
              <input type="password" id="senha-atual" />
            </div>
            <div className="form-group"></div> {/* Espaço em branco no grid */}
            <div className="form-group">
              <label htmlFor="nova-senha">Nova Senha</label>
              <input type="password" id="nova-senha" />
            </div>
            <div className="form-group">
              <label htmlFor="confirmar-senha">Confirmar Nova Senha</label>
              <input type="password" id="confirmar-senha" />
            </div>
          </div>
           <div className="form-actions">
            <button className="btn-salvar">Alterar Senha</button>
          </div>
        </section>

        {/* Seção: Notificações */}
        <section className="settings-section">
          <h2>Notificações</h2>
          <div className="toggle-list">
            <div className="toggle-item">
              <span>Incêndio</span>
              <label className="switch">
                <input type="checkbox" checked={notificacaoIncendio} onChange={() => setNotificacaoIncendio(!notificacaoIncendio)} />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="toggle-item">
              <span>Emergência Médica</span>
              <label className="switch">
                <input type="checkbox" checked={notificacaoEmergencia} onChange={() => setNotificacaoEmergencia(!notificacaoEmergencia)} />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="toggle-item">
              <span>Acidentes de Trânsito</span>
              <label className="switch">
                <input type="checkbox" checked={notificacaoTransito} onChange={() => setNotificacaoTransito(!notificacaoTransito)} />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="toggle-item">
              <span>Outros</span>
              <label className="switch">
                <input type="checkbox" checked={notificacaoOutros} onChange={() => setNotificacaoOutros(!notificacaoOutros)} />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </section>

        {/* Seção: Acessibilidade */}
        <section className="settings-section">
          <h2>Acessibilidade</h2>
           <div className="toggle-list">
            <div className="toggle-item">
              <span>Tema</span>
              <label className="switch">
                <input type="checkbox" checked={Tema} onChange={() => setTema(!Tema)} />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="toggle-item">
              <span>Leitores de Tela</span>
              <label className="switch">
                <input type="checkbox" checked={leitorDeTela} onChange={() => setLeitorDeTela(!leitorDeTela)} />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="toggle-item">
              <span>Comando por voz</span>
              <label className="switch">
                <input type="checkbox" checked={comandoPorVoz} onChange={() => setComandoPorVoz(!comandoPorVoz)} />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="toggle-item">
                <label htmlFor="tamanho-texto">Tamanho do Texto</label>
                 <select id="tamanho-texto" value={tamanhoTexto} onChange={(e) => setTamanhoTexto(e.target.value)}>
                    <option value="pequeno">Pequeno</option>
                    <option value="medio">Médio</option>
                    <option value="grande">Grande</option>
                </select>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}

export default Configuracoes;