import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RegistroOcorrencia from './pages/RegistroOcorrencia'; 
import Layout from './components/Layout';
import Relatorios from './pages/Relatorios';
import Ocorrencias from './pages/Ocorrencias';
import Configuracoes from './pages/Configuracoes';
import PainelAdministrativo from './pages/PainelAdministrativo';
import ForgotPassword from './pages/ForgotPassword';
import VerifyPage from './pages/VerifyPage';
import ProtectedRoute from './components/ProtectedRoute';
import { CARGOS } from './utils/permissions'; 

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
        <Route 
          path="/relatorios" 
          element={
            <ProtectedRoute allowedRoles={[CARGOS.ANALISTA, CARGOS.CAPITAO, CARGOS.ADMINISTRADOR, CARGOS.DESENVOLVEDOR]}>
              <Relatorios />
            </ProtectedRoute>
          } 
        />
        <Route path="/minhas-ocorrencias" element={<Ocorrencias />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route 
          path="/painel-administrativo" 
          element={
            <ProtectedRoute allowedRoles={[CARGOS.ADMINISTRADOR, CARGOS.DESENVOLVEDOR]}>
              <PainelAdministrativo />
            </ProtectedRoute>
          } 
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;