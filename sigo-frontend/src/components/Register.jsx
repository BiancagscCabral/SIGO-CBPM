import React from 'react';
import {useNavigate} from 'react-router-dom';
import './Register.css';
import logoSigo from '../assets/logosigo.svg';

function Register() {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  const handleBackToLoginClick = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="page-container">
      <div className="logo-section">
        <img src={logoSigo} alt="Logo do SIGO"/>
        <h2>Sistema Integrado de Gestão de Ocorrências</h2>
        <p>A plataforma integrada que moderniza o registro e a gestão das ocorrências em Pernambuco</p>
      </div>

      <div className="register-section">
        <form onSubmit={handleRegister}>
          <h2>Cadastre-se no Sistema</h2>
          
          <label>Nome Completo</label>
          <input type="text" placeholder="Digite seu nome completo" />

          <label>Matrícula</label>
          <input type="text" placeholder="Digite sua matrícula" />

          <label>E-mail</label>
          <input type="email" placeholder="Digite seu e-mail" />

          <label>Senha</label>
          <input type="password" placeholder="Digite sua senha" />

          <label>Confirmar Senha</label>
          <input type="password" placeholder="Confirme sua senha" />

          <button type="submit">Cadastrar</button>
          <p>Já possui conta? <a href="#" onClick={handleBackToLoginClick}>Faça login</a></p>
        </form>
      </div>
    </div>
  );
}

export default Register;