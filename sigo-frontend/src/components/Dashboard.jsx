import React, { useState } from 'react';
import { FaFire, FaClock, FaRegClock, FaUsers } from 'react-icons/fa';
import { FiFilePlus, FiClipboard, FiFileText, FiSettings, FiArrowUp } from 'react-icons/fi';
import { IoDocumentTextOutline } from "react-icons/io5";
import { LuFilePlus } from "react-icons/lu";
import './Dashboard.css';

const StatCard = ({ icon, value, title, subtext, increase, iconBgColor }) => (
  <div className="stat-card">
    <div className="stat-card-info">
      <h2>{value}</h2>
      <p>{title}</p>
      {increase && <span className="increase"><FiArrowUp /> {increase}</span>}
      {subtext && <p>{subtext}</p>}
    </div>
    <div className="icon" style={{ color: iconBgColor }}>
      {icon}
    </div>
  </div>
);

const QuickAccessCard = ({ icon, title, description, bgColor, linkText = "Clique para acessar" }) => (
  <div className="quick-access-card">
    <div className={`icon-background ${bgColor}`}>
      <div className="icon">{icon}</div>
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
    <span className="link">{linkText}</span>
  </div>
);

function Dashboard() {
    return (
        <main className="main-content">
          <div className="dashboard-header">
            <h1>Dashboard</h1>
            <p>Bem Vindo ao Sistema Integrado de Gestão de Ocorrências</p>
          </div>
            <section className="stats-grid">
                <StatCard 
                icon={<FaFire />}
                value="1.247"
                title="Total de Ocorrências"
                increase="+2.5% desde o mês passado"
                iconBgColor="#f44336"
                />
                <StatCard 
                icon={<FaClock />}
                value="23"
                title="Ocorrências Hoje"
                subtext="Últimas 24 horas"
                iconBgColor="#ff9800"
                />
                <StatCard 
                icon={<FaRegClock />}
                value="8"
                title="Em Andamento"
                subtext="Requer atenção"
                iconBgColor="#2196f3"
                />
                <StatCard 
                icon={<FaUsers />}
                value="12"
                title="Equipes Ativas"
                subtext="Disponíveis para atendimento"
                iconBgColor="#4caf50"
                />
            </section>

            <section className="quick-access-grid">
                <QuickAccessCard
                icon={<LuFilePlus />}
                title="Registrar Ocorrência"
                description="Cadastrar nova ocorrência no sistema"
                bgColor="bg-red"
                />
                <QuickAccessCard
                icon={<FiClipboard />}
                title="Minhas Ocorrências"
                description="Visualizar ocorrências registradas por mim"
                bgColor="bg-blue"
                />
                <QuickAccessCard
                icon={<IoDocumentTextOutline />}
                title="Relatórios"
                description="Gerar relatórios e estatísticas"
                bgColor="bg-orange"
                />
                <QuickAccessCard
                icon={<FiSettings />}
                title="Configurações"
                description="Configurar sistema e preferências"
                bgColor="bg-gray"
                linkText="Configurar"
                />
            </section>
        </main>
    );
}

export default Dashboard;