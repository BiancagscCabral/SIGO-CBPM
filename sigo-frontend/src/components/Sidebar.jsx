import { NavLink, useNavigate } from 'react-router-dom';
import { FiGrid, FiFilePlus, FiClipboard, FiFileText, FiSettings, FiUsers, FiChevronsLeft, FiChevronsRight, FiLogOut } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { verificarAcessoPainelAdministrativo, verificarAcessoRelatorios } from '../utils/permissions';
import './Sidebar.css';
import logoSigo from '../assets/logosigo.svg';

const Sidebar = ({ isOpen, toggle }) => {
    const navigate = useNavigate();
    const { userProfile } = useUser();
    const [permissions, setPermissions] = useState({
      relatorios: false,
      painelAdministrativo: false
    });
    
    const handleLogout = () => {
        navigate('/login');
    };

    const checkPermissions = () => {
      const userRole = userProfile.user_role;
      console.log('Sidebar: Verificando permissões para o cargo:', userRole);
      
      const newPermissions = {
        relatorios: verificarAcessoRelatorios(userRole),
        painelAdministrativo: verificarAcessoPainelAdministrativo(userRole)
      };
      
      console.log('Sidebar: Novas permissões calculadas:', newPermissions);
      setPermissions(newPermissions);
    };

    useEffect(() => {
      console.log('Sidebar: UserProfile mudou:', {
        id: userProfile.id,
        role: userProfile.user_role,
        name: userProfile.full_name
      });
      
      if (userProfile.user_role) {
        checkPermissions();
      } else {
        console.log('Sidebar: Sem role, removendo permissões');
        setPermissions({
          relatorios: false,
          painelAdministrativo: false
        });
      }
    }, [userProfile]); 
    
    useEffect(() => {
      console.log('Sidebar: Permissões atualizadas:', permissions);
    }, [permissions]); 

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div>
        <div className="sidebar-header">
            <button className="toggle-btn" onClick={toggle}>
            {isOpen ? <FiChevronsLeft /> : <FiChevronsRight />}
          </button>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className="nav-item">
            <FiGrid className="nav-icon" />
            {isOpen && <span className="nav-text">Dashboard</span>}
          </NavLink>
          <NavLink to="/registro-ocorrencia" className="nav-item">
            <FiFilePlus className="nav-icon" />
            {isOpen && <span className="nav-text">Registrar Ocorrência</span>}
          </NavLink>
          <NavLink to="/minhas-ocorrencias" className="nav-item">
            <FiClipboard className="nav-icon" />
            {isOpen && <span className="nav-text">Ocorrências</span>}
          </NavLink>
          {permissions.relatorios && (
            <NavLink to="/relatorios" className="nav-item">
              <FiFileText className="nav-icon" />
              {isOpen && <span className="nav-text">Relatórios</span>}
            </NavLink>
          )}
          <NavLink to="/configuracoes" className="nav-item">
            <FiSettings className="nav-icon" />
            {isOpen && <span className="nav-text">Configurações</span>}
          </NavLink>
          {permissions.painelAdministrativo && (
            <NavLink to="/painel-administrativo" className="nav-item">
              <FiUsers className="nav-icon" />
              {isOpen && <span className="nav-text">Painel Administrativo</span>}
            </NavLink>
          )}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div onClick={handleLogout} className="nav-item logout-item">
          <FiLogOut className="nav-icon" />
          {isOpen && <span className="nav-text">Sair</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;