import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';
import logoSigo from '../assets/logosigo.svg';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    matricula: '',
    telefone: '',
    email: '',
    senha: '',
    confirma_senha: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    const onlyNums = value.replace(/[^0-9]/g, '');
    setFormData((prevData) => ({
      ...prevData,
      [name]: onlyNums,
    }));
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.senha !== formData.confirma_senha) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData),
      });

      const responseText = await response.text();

      if (response.ok) {
        setSuccess(responseText + ' Você será redirecionado para o login.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(responseText);
      }
    } catch (err) {
      setError('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="page-container">
      <div className="logo-section">
        <img src={logoSigo} alt="Logo do SIGO" />
        <h2>Sistema Integrado de Gestão de Ocorrências</h2>
        <p>A plataforma integrada que moderniza o registro e a gestão das ocorrências em Pernambuco</p>
      </div>

      <div className="register-section">
        <form onSubmit={handleRegister}>
          <h2>Cadastre-se no Sistema</h2>
          
          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input
              type="text"
              id="nome"
              name="nome"
              placeholder="Digite seu nome completo"
              value={formData.nome || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="matricula">Matrícula</label>
              <input
                type="text"
                id="matricula"
                name="matricula"
                inputMode="numeric"
                placeholder="Digite sua matrícula"
                value={formData.matricula || ''}
                onChange={handleNumericChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="telefone">Telefone</label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                inputMode="numeric"
                placeholder="Digite seu telefone"
                value={formData.telefone || ''}
                onChange={handleNumericChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Digite seu e-mail"
              value={formData.email || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="senha">Senha</label>
              <input
                type="password"
                id="senha"
                name="senha"
                placeholder="Digite sua senha"
                value={formData.senha || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmar_senha">Confirmar Senha</label>
              <input
                type="password"
                id="confirmar_senha"
                name="confirma_senha"
                placeholder="Confirme sua senha"
                value={formData.confirma_senha || ''}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <button type="submit">Cadastrar</button>
          <p>Já possui conta? <Link to="/login">Faça login</Link></p>
        </form>
      </div>
    </div>
  );
}

export default Register;