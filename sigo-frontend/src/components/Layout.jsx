import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useSpeech } from '../hooks/useSpeech';
import './Layout.css';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    useSpeech();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

  return (
    <div className="app-layout">
      <Header />
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
      <div className={`main-content-area ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;