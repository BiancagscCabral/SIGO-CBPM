import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from './Header'; //NAO PEGAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
import './VerifyPage.css'; 



function VerifyPage() {
  const location = useLocation();
  // Pega o email enviado da página anterior
  const email = location.state?.email || 'seuemail@gmail.com';

  const [code, setCode] = useState(['', '', '', '']);
  const inputsRef = useRef([]); // Referência para os inputs

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value) || value === '') { // Aceita apenas números ou campo vazio
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Foca no próximo input se um número for digitado
      if (value && index < 3) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const verificationCode = code.join('');
    if (verificationCode.length === 4) {
      // Aqui viria a lógica para verificar o token com o backend
      alert(`Código ${verificationCode} verificado com sucesso!`);
      // Ex: navigate('/reset-password');
    } else {
      alert('Por favor, preencha todos os campos do código.');
    }
  };

  return (
    <div className="verify-page-container">
      <div className="form-card"> 
       
        <h2 className="verify-title">Email Enviado!</h2>
        <p className="subtitle">Enviamos um código de recuperação para <br/><strong>{email}</strong></p>

        <form onSubmit={handleSubmit} className="verify-code-form">
          <label htmlFor="code-input-0">Preencha o código</label>
          <div className="code-inputs">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-input-${index}`}
                ref={el => inputsRef.current[index] = el} // Adiciona a referência ao input
                type="text"
                inputMode="numeric" 
                maxLength="1"
                value={digit}
                onChange={(e) => handleInputChange(e, index)}
                required
              />
            ))}
          </div>
          <button type="submit">Verificar</button>
          <button type="button" className="btn-resend">Enviar novamente</button>
        </form>

        <p className="help-text">
          Não recebeu o email? Verifique sua pasta de spam ou <a href="#">tente novamente</a>
        </p>
      </div>
    </div>
  );
}

export default VerifyPage;