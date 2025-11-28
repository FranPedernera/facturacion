import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import Login from './components/Login';
import Home from './components/Home'; // <- tendrás que crear este componente
import AgregarCliente from './components/clientes/AgregarCliente';
import MostrarClientes from './components/clientes/MostrarClientes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta del login */}
        <Route path="/" element={<Login />} />

        {/* Ruta de inicio luego del login */}
        <Route path="/inicio" element={<Home />} />

        <Route path="agregar-cliente" element={<AgregarCliente/>} />

        <Route path="mostrar-clientes" element={<MostrarClientes/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
