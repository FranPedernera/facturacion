import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Página de Inicio</h1>

      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px", width: "200px" }}>

        <button onClick={() => navigate("/agregar-cliente")}>
          Agregar Cliente
        </button>

        <button onClick={() => navigate("/generar-factura")}>
          Generar Factura
        </button>

        <button onClick={() => navigate("/facturas")}>
          Ver Facturas
        </button>

      </div>
    </div>
  );
}
