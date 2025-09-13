import React from 'react';
import './Login.css';
import logoSigo from '../assets/logosigo.svg';

function Login({ onRegister }) {
  return (
    <div className="page-container">
      <div className="logo-section">
        <img src={logoSigo} alt="Logo do SIGO"/>
        <h2>Sistema Integrado de Gestão de Ocorrências</h2>
        <p>A plataforma integrada que moderniza o registro e a gestão das ocorrências em Pernambuco</p>
      </div>

      <div className="login-section">
        <h2>Digite sua Matrícula para acessar o sistema</h2>
        <label>Matrícula</label>
        <input type="text" placeholder="Digite sua Matrícula" />

        <label>Senha</label>
        <input type="password" placeholder="Digite sua Senha"/>

        <button type="submit">Entrar</button>
        <p>Primeira vez aqui? <a href="#" onClick={onRegister}>Registre-se</a></p>
      </div>
    </div>
  );
}

export default Login;