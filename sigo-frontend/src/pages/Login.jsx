import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import logoSigo from '../assets/logosigo.svg';

function Login() {
  const navigate = useNavigate()
  const [matricula, setMatricula] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('http://localhost:8000/api/user/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          matricula: matricula,
          senha: senha
        }),
      });

      if (response.ok) {
        navigate('/dashboard')
      } else {
        const errorMessage = await response.text();
        setError(errorMessage);
      }
    } catch (err) {
      setError(
        'Não foi possível conectar ao servidor. Tente novamente mais tarde.'
      );
    }
  };

  const handleMatriculaChange = (e) => {
    const value = e.target.value;
    const onlyNums = value.replace(/[^0-9]/g,'');
    setMatricula(onlyNums);
  }

  return (
    <div className="page-container">
      <div className="logo-section">
        <img src={logoSigo} alt="Logo do SIGO"/>
        <h2>Sistema Integrado de Gestão de Ocorrências</h2>
        <p>A plataforma integrada que moderniza o registro e a gestão das ocorrências em Pernambuco</p>
      </div>

      <div className="login-section">
        <form onSubmit={handleLogin}>
          <h2>Identifique-se para acessar o sistema</h2>

          <label htmlFor="matricula">Matrícula</label>
          <input 
          id="matricula"
          name="matricula"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Digite sua Matrícula"
          value={matricula} 
          onChange={handleMatriculaChange}
          required
          />

          <label htmlFor="senha">Senha</label>
          <input
          id="senha"
          name="senha"
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit">Entrar</button>
          <p>Primeira vez aqui?  <Link to="/register">Registre-se</Link></p>
          <p className="forgot-password-link">
          <Link to="/forgot-password">Esqueci minha senha</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;