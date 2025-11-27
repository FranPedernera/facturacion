// Importo React y sus hooks
import React, { useEffect, useState } from "react";
// Importo el cliente de Supabase (OJO con la ruta relativa)
// Desde /components/clientes → subo 2 niveles para llegar a /src
import { supabase } from "../../supabaseClient";

export default function AgregarCliente() {
  // ============================
  // 1️⃣ ESTADO DEL FORMULARIO
  // ============================
  // Acá guardamos lo que el usuario escribe en los inputs
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    razon_social: "",
    es_empresa: false,   // checkbox
    direccion: "",
    cuit: "",
    cuil: "",
    cond_iva_id: "",     // id de la tabla condiciones_iva
  });

  // Lista de condiciones de IVA desde la tabla condiciones_iva
  const [condicionesIVA, setCondicionesIVA] = useState([]);

  // Estado para mostrar errores y mensajes de OK
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  // Estado para indicar que está procesando (mientras llama a Supabase)
  const [loading, setLoading] = useState(false);

  // ==========================================
  // 2️⃣ EFECTO: TRAER CONDICIONES DE IVA UNA VEZ
  // ==========================================
  useEffect(() => {
    const fetchIVA = async () => {
      // Pido todas las filas de la tabla condiciones_iva
      const { data, error } = await supabase
        .from("condiciones_iva")
        .select("*");

      if (error) {
        console.error(error);
        setError("No se pudieron cargar las condiciones de IVA.");
      } else {
        // Guardo las condiciones en el estado para llenar el <select>
        setCondicionesIVA(data);
      }
    };

    fetchIVA();
  }, []); // [] → se ejecuta solo 1 vez al montar el componente

  // ==========================================
  // 3️⃣ MANEJAR CAMBIOS EN LOS INPUTS
  // ==========================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Si el input es un checkbox, uso checked (true/false)
    // Si no, uso value (texto)
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==========================================
  // 4️⃣ MANEJAR EL SUBMIT DEL FORMULARIO
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();    // Evita que se recargue la página
    setError("");          // Limpia error previo
    setOkMsg("");          // Limpia msg OK previo
    setLoading(true);      // Pone estado "cargando"

    try {
      // 4.1) OBTENER USUARIO LOGUEADO DESDE localStorage
      // En el login habíamos guardado algo así:
      // localStorage.setItem("user", JSON.stringify(usuario));
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        throw new Error(
          "No se encontró un usuario logueado. Volvé a iniciar sesión."
        );
      }
      const user = JSON.parse(storedUser); // user.id es el usuario_id

      // 4.2) VALIDACIONES BÁSICAS DEL FORMULARIO

      // Al menos tener razón social o nombre+apellido
      if (!form.razon_social && (!form.nombre || !form.apellido)) {
        throw new Error(
          "Completá razón social o nombre y apellido del cliente."
        );
      }

      // Tu tabla clientes tiene CUIT y CUIL como CHAR(11)
      if (form.cuit && form.cuit.length !== 11) {
        throw new Error("El CUIT debe tener 11 caracteres.");
      }

      if (form.cuil && form.cuil.length !== 11) {
        throw new Error("El CUIL debe tener 11 caracteres.");
      }

      // Si querés obligar a elegir condición de IVA, descomentá esto:
      // if (!form.cond_iva_id) {
      //   throw new Error("Seleccioná una condición de IVA.");
      // }

      // 4.3) INSERTAR EN LA TABLA clientes (Supabase)
      const { error: insertError } = await supabase
        .from("clientes")
        .insert({
          // Relación: este cliente pertenece al usuario logueado
          usuario_id: user.id,

          // Datos del cliente (uso null si viene vacío para campos opcionales)
          nombre: form.nombre || null,
          apellido: form.apellido || null,
          razon_social: form.razon_social || null,
          es_empresa: form.es_empresa,
          direccion: form.direccion || null,
          cuit: form.cuit || null,
          cuil: form.cuil || null,
          cond_iva_id: form.cond_iva_id
            ? Number(form.cond_iva_id)
            : null,
        });

      // Si Supabase devuelve error, lo lanzo para que lo capture el catch
      if (insertError) throw insertError;

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
      // Si err tiene message, la muestro, sino muestro mensaje genérico
      setError(err.message || "Error al guardar el cliente.");
    } finally {
      // Siempre se ejecuta, haya salido bien o mal
      setLoading(false);
    }
  };

  // ==========================================
  // 5️⃣ RENDER DEL FORMULARIO
  // ==========================================
  return (
    <div style={{ padding: "20px" }}>
      <h2>Agregar Cliente</h2>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        {/* Nombre */}
        <div>
          <label>Nombre</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
          />
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
          <label>CUIT (11 dígitos)</label>
          <input
            name="cuit"
            maxLength={11}          // Limito a 11 caracteres
            value={form.cuit}
            onChange={handleChange}
          />
        </div>

        {/* CUIL */}
        <div>
          <label>CUIL (11 dígitos)</label>
          <input
            name="cuil"
            maxLength={11}
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
            {/* Recorro la lista de condiciones traída de Supabase */}
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
