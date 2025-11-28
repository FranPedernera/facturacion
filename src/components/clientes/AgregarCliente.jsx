// Importo React y sus hooks
import React, { useEffect, useState } from "react";
// Importo el cliente de Supabase (solo para la base de datos, NO usamos supabase.auth)
import { supabase } from "../../supabaseClient";

export default function AgregarCliente() {
  // =====================================================
  // 1️⃣ ESTADO DEL FORMULARIO (LO QUE ESCRIBE EL USUARIO)
  // =====================================================
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    razon_social: "",
    es_empresa: false, // checkbox
    direccion: "",
    cuit: "",
    cuil: "",
    cond_iva_id: "", // id de la tabla condiciones_iva (FK)
  });

  // Lista de condiciones de IVA traídas desde la tabla condiciones_iva
  const [condicionesIVA, setCondicionesIVA] = useState([]);

  // Estado para mostrar errores y mensajes de OK
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  // Estado para indicar que estamos guardando (lo podés usar para deshabilitar el botón)
  const [loading, setLoading] = useState(false);

  // =====================================================
  // 2️⃣ EFECTO: TRAER CONDICIONES DE IVA AL MONTAR EL COMPONENTE
  // =====================================================
  useEffect(() => {
    const fetchIVA = async () => {
      const { data, error } = await supabase
        .from("condiciones_iva")
        .select("*");

      if (error) {
        console.error(error);
        setError("No se pudieron cargar las condiciones de IVA.");
      } else {
        setCondicionesIVA(data);
      }
    };

    fetchIVA();
  }, []); // [] → se ejecuta solo una vez al cargar la vista

  // =====================================================
  // 3️⃣ MANEJAR CAMBIOS EN LOS INPUTS DEL FORMULARIO
  // =====================================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Si es checkbox, usamos checked; si no, usamos value
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =====================================================
  // 4️⃣ MANEJAR EL SUBMIT DEL FORMULARIO (CLICK EN "GUARDAR CLIENTE")
  // =====================================================
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que recargue la página
    setError("");
    setOkMsg("");
    setLoading(true);

    try {
      // 4.1) OBTENER USUARIO LOGUEADO DESDE LOCALSTORAGE
      // 👉 Recordá que en el login hiciste:
      // localStorage.setItem("user", JSON.stringify(usuario));
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        throw new Error("No hay un usuario logueado. Volvé a iniciar sesión.");
      }

      const user = JSON.parse(storedUser);

      // Validación básica por si por algún motivo no tiene id
      if (!user.id) {
        throw new Error(
          "El usuario logueado no tiene un ID válido. Revisá la tabla 'usuarios'."
        );
      }

      const usuarioId = user.id; // 👈 ESTE ES EL ID DEL USUARIO DUEÑO DEL CLIENTE

      // 4.2) VALIDACIONES BÁSICAS DEL FORMULARIO

      // Debe tener:
      //  - Razón social
      //        o
      //  - Nombre Y Apellido
      if (!form.razon_social && (!form.nombre || !form.apellido)) {
        throw new Error(
          "Completá razón social o nombre y apellido del cliente."
        );
      }

      // Validar longitud de CUIT/CUIL (podés ajustar según tu modelo)
      if (form.cuit && form.cuit.length > 15) {
        throw new Error("El CUIT no puede tener más de 15 caracteres.");
      }

      if (form.cuil && form.cuil.length > 15) {
        throw new Error("El CUIL no puede tener más de 15 caracteres.");
      }

      // 4.3) INSERTAR EN LA TABLA clientes (Supabase)
      const { error: insertError } = await supabase.from("clientes").insert({
        // 🔹 Relación: este cliente pertenece al usuario logueado
        usuario_id: usuarioId,

        // 🔹 Datos del cliente
        nombre: form.nombre || null,
        apellido: form.apellido || null,
        razon_social: form.razon_social || null,
        es_empresa: form.es_empresa,
        direccion: form.direccion || null,
        cuit: form.cuit || null,
        cuil: form.cuil || null,

        // Si no seleccionó nada, mandamos null para la FK
        cond_iva_id: form.cond_iva_id ? Number(form.cond_iva_id) : null,
      });

      if (insertError) {
        console.error(insertError);
        throw new Error("Error al insertar el cliente en la base de datos.");
      }

      // 4.4) Si todo salió bien
      setOkMsg("Cliente agregado correctamente ✅");

      // Limpio el formulario
      setForm({
        nombre: "",
        apellido: "",
        razon_social: "",
        es_empresa: false,
        direccion: "",
        cuit: "",
        cuil: "",
        cond_iva_id: "",
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al guardar el cliente.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // 5️⃣ RENDER DEL FORMULARIO (LO QUE SE VE EN PANTALLA)
  // =====================================================
  return (
    <div style={{ padding: "20px" }}>
      <h2>Agregar Cliente</h2>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        {/* Nombre */}
        <div>
          <label>Nombre</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} />
        </div>

        {/* Apellido */}
        <div>
          <label>Apellido</label>
          <input
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
          />
        </div>

        {/* Razón Social */}
        <div>
          <label>Razón Social</label>
          <input
            name="razon_social"
            value={form.razon_social}
            onChange={handleChange}
          />
        </div>

        {/* Checkbox: es empresa */}
        <div>
          <label>
            <input
              type="checkbox"
              name="es_empresa"
              checked={form.es_empresa}
              onChange={handleChange}
            />
            &nbsp;Es empresa
          </label>
        </div>

        {/* Dirección */}
        <div>
          <label>Dirección</label>
          <input
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
          />
        </div>

        {/* CUIT */}
        <div>
          <label>CUIT (hasta 15 caracteres)</label>
          <input
            name="cuit"
            maxLength={15}
            value={form.cuit}
            onChange={handleChange}
          />
        </div>

        {/* CUIL */}
        <div>
          <label>CUIL (hasta 15 caracteres)</label>
          <input
            name="cuil"
            maxLength={15}
            value={form.cuil}
            onChange={handleChange}
          />
        </div>

        {/* Select Condición de IVA */}
        <div>
          <label>Condición de IVA</label>
          <select
            name="cond_iva_id"
            value={form.cond_iva_id}
            onChange={handleChange}
          >
            <option value="">Seleccionar</option>
            {condicionesIVA.map((c) => (
              <option key={c.id} value={c.id}>
                {c.descripcion}
              </option>
            ))}
          </select>
        </div>

        {/* Mensaje de error */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Mensaje de éxito */}
        {okMsg && <p style={{ color: "green" }}>{okMsg}</p>}

        {/* Botón de submit */}
        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar Cliente"}
        </button>
      </form>
    </div>
  );
}
