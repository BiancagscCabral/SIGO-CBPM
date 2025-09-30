
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import RegistroOcorrencia from './components/RegistroOcorrencia'; 
import Layout from './components/Layout';
import Relatorios from './components/Relatorios';
import MinhasOcorrencias from './components/MinhasOcorrencias';
import Configuracoes from './components/Configuracoes';
import ForgotPassword from './components/ForgotPassword';
import VerifyPage from './components/VerifyPage'; 

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-code" element={<VerifyPage />} /> 

      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registro-ocorrencia" element={<RegistroOcorrencia />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/minhas-ocorrencias" element={<MinhasOcorrencias />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
      </Route>
    </Routes>
  );
}

export default App;