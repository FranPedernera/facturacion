import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function MostrarClientes() {
  // Estado donde se guardan los clientes
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar clientes al montar el componente
  useEffect(() => {
    const traerClientes = async () => {
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error al traer clientes:", error);
      } else {
        setClientes(data);
      }

      setLoading(false);
    };

    traerClientes();
  }, []);

  if (loading) return <p>Cargando...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Lista de clientes</h1>

      {clientes.length === 0 ? (
        <p>No hay clientes cargados.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Apellido</th>
              <th style={thStyle}>Razón Social</th>
              <th style={thStyle}>Es empresa</th>
              <th style={thStyle}>Dirección</th>
              <th style={thStyle}>CUIT</th>
              <th style={thStyle}>CUIL</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id}>
                <td style={tdStyle}>{c.nombre}</td>
                <td style={tdStyle}>{c.apellido}</td>
                <td style={tdStyle}>{c.razon_social}</td>
                <td style={tdStyle}>{c.es_empresa ? "Sí" : "No"}</td>
                <td style={tdStyle}>{c.direccion}</td>
                <td style={tdStyle}>{c.cuit}</td>
                <td style={tdStyle}>{c.cuil}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Estilos para mejorar la lectura sin usar CSS externo
const thStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  background: "#f0f0f0",
  fontWeight: "bold",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "center",
};
