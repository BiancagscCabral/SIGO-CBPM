import React, { useState } from 'react';
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

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Navigate to="/login" />} />

      <Route element={<Layout/>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registro-ocorrencia" element={<RegistroOcorrencia />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/minhas-ocorrencias" element={<MinhasOcorrencias />} />
      </Route>
    </Routes>
  );
}

export default App;