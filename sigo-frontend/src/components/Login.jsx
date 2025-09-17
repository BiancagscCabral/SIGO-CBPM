import React from 'react';
import {useNavigate} from 'react-router-dom';
import './Login.css';
import logoSigo from '../assets/logosigo.svg';

function Login() {
  const navigate = useNavigate();
  
  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  return (
    <div className="page-container">
      <div className="logo-section">
        <img src={logoSigo} alt="Logo do SIGO"/>
        <h2>Sistema Integrado de Gestão de Ocorrências</h2>
        <p>A plataforma integrada que moderniza o registro e a gestão das ocorrências em Pernambuco</p>
      </div>

      <div className="login-section">
        <form onSubmit={handleLogin}>
          <h2>Identifique-se com sua matrícula para continuar</h2>
          <label>Matrícula</label>
          <input type="text" placeholder="Digite sua Matrícula" />

          <label>Senha</label>
          <input type="password" placeholder="Digite sua Senha"/>

          <button type="submit">Entrar</button>
          <p>Primeira vez aqui? <a href="#" onClick={handleRegisterClick}>Registre-se</a></p>
        </form>
      </div>
    </div>
  );
}

export default Login;