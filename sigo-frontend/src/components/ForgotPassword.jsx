import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header'; 
import './ForgotPassword.css';
import { useNavigate } from 'react-router-dom'; // Importa o hook

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate(); // Inicialize o hook

  const handleSubmit = (e) => {
    e.preventDefault();
    // lógica  de enviar o email
    console.log(`Simulando envio de token para ${email}`);

    // NAVEGA para a nova página e envia o email
    navigate('/verify-code', { state: { email: email } });
  };
  
  return (
    //  Ccontainer principal para a página inteir
    <div className="forgot-password-page"> 
      <Header />
      <main className="forgot-password-content"> {/* Container para centralizar o card */}
        <div className="form-card">
          <h2>Recuperação de Senha</h2>
          <p className="subtitle">Digite seu email para receber as instruções de recuperação</p>

          <form onSubmit={handleSubmit} className="forgot-password-form">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Recuperar Senha</button>
          </form>

          <p className="back-to-login">
            Lembrou da senha? <Link to="/login">Faça o login</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default ForgotPasswordPage;