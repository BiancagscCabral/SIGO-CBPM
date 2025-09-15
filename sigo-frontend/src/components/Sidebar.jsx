import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiGrid, FiFilePlus, FiClipboard, FiFileText, FiSettings, FiChevronsLeft, FiChevronsRight, FiLogOut } from 'react-icons/fi';
import './Sidebar.css';
import logoSigo from '../assets/logosigo.svg';

const Sidebar = ({ isOpen, toggle }) => {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        navigate('/login');
    };

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
            {isOpen && <span className="nav-text">Minhas Ocorrências</span>}
          </NavLink>
          <NavLink to="/relatorios" className="nav-item">
            <FiFileText className="nav-icon" />
            {isOpen && <span className="nav-text">Relatórios</span>}
          </NavLink>
          <NavLink to="/configuracoes" className="nav-item">
            <FiSettings className="nav-icon" />
            {isOpen && <span className="nav-text">Configurações</span>}
          </NavLink>
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