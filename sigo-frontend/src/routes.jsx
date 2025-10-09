import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RegistroOcorrencia from './pages/RegistroOcorrencia'; 
import Layout from './components/Layout';
import Relatorios from './pages/Relatorios';
import MinhasOcorrencias from './pages/MinhasOcorrencias';
import Configuracoes from './pages/Configuracoes';
import PainelAdministrativo from './pages/PainelAdministrativo';
import ForgotPassword from './pages/ForgotPassword';
import VerifyPage from './pages/VerifyPage'; 

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-code" element={<VerifyPage />} /> 

      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registro-ocorrencia" element={<RegistroOcorrencia />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/minhas-ocorrencias" element={<MinhasOcorrencias />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/painel-administrativo" element={<PainelAdministrativo />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;