import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Solicitando recuperação para o email: ${email}`);
    
    // Navega para a página de verificação, passando o email no estado da rota
    navigate('/verify-code', { state: { email } });
  };
  
  return (
    <div className="forgot-password-page"> 
      <main className="forgot-password-content">
        <div className="form-card">
          <h2>Recuperação de Senha</h2>
          <p className="subtitle">Digite seu email para receber as instruções de recuperação.</p>

          <form onSubmit={handleSubmit} className="forgot-password-form">
            {/* Wrapper para agrupar os campos que terão o recuo */}
            <div className="form-fields-wrapper">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Botão fora do wrapper para ocupar 100% da largura */}
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