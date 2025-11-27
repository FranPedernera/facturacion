import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import bcrypt from "bcryptjs";

export default function Login() {

  // Estado para saber si estamos en modo LOGIN o REGISTRO
  const [mode, setMode] = useState("login");

  // Estado del formulario
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",  // solo registro
    nombre: "",
    apellido: "",
    razon_social: "",
    direccion: "",
    cuit: "",
    cond_iva_id: "",     // select de AFIP
  });

  // Lista de condiciones IVA traídas desde SUPABASE
  const [condicionesIVA, setCondicionesIVA] = useState([]);

  // Manejo general de errores y carga
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ================================
  // 1️⃣ TRAER CONDICIONES IVA DESDE SUPABASE
  // ================================
  useEffect(() => {
    const fetchIVA = async () => {
      // Trae todas las filas de la tabla condiciones_iva
      const { data, error } = await supabase
        .from("condiciones_iva")
        .select("*");

      if (!error) setCondicionesIVA(data);
      else console.error(error);
    };

    fetchIVA();
  }, []);

  // ================================
  // 2️⃣ MANEJAR CAMBIOS DE INPUTS
  // ================================
  const handleChange = (e) => {
    // Actualiza el estado del form dinámicamente según el "name"
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================================
  // 3️⃣ SUBMIT LOGIN / REGISTRO
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();      // Evita recarga de página
    setError("");            // limpia errores anteriores
    setLoading(true);        // muestra estado cargando

    try {
      // VALIDACIÓN BÁSICA COMÚN
      if (!form.email || !form.password)
        throw new Error("Completá email y contraseña.");

      // ================================
      // ⭐ REGISTRO COMPLETO
      // ================================
      if (mode === "register") {

        // Validaciones obligatorias para tu tabla "usuarios"
        if (!form.nombre) throw new Error("Ingresá tu nombre.");
        if (!form.apellido) throw new Error("Ingresá tu apellido.");
        if (!form.razon_social) throw new Error("Ingresá tu razón social.");
        if (!form.direccion) throw new Error("Ingresá tu dirección.");

        if (!form.cuit || form.cuit.length !== 13)
          throw new Error("Ingresá un CUIT válido de 11 dígitos.");

        if (!form.cond_iva_id)
          throw new Error("Seleccioná tu condición de IVA.");

        if (form.password !== form.confirmPassword)
          throw new Error("Las contraseñas no coinciden.");

        // Ver si ya existe ese email
        const { data: existing } = await supabase
          .from("usuarios")
          .select("id")
          .eq("email", form.email)
          .maybeSingle();

        if (existing) throw new Error("Ese email ya está registrado.");

        // Hashear contraseña antes de guardarla
        const passwordHash = await bcrypt.hash(form.password, 10);

        // Insertar el usuario COMPLETO en tu tabla
        const { error: insertError } = await supabase
          .from("usuarios")
          .insert({
            email: form.email,
            password_hash: passwordHash,
            nombre: form.nombre,
            apellido: form.apellido,
            razon_social: form.razon_social,
            direccion: form.direccion,
            cuit: form.cuit,
            cond_iva_id: Number(form.cond_iva_id),
          });

        if (insertError) throw insertError;

        alert("Registro exitoso. Ya podés iniciar sesión.");
        setMode("login"); // cambia automáticamente a login
        return;
      }

      // ================================
      // ⭐ LOGIN (busca en tabla usuarios)
      // ================================
      const { data: usuario, error: selError } = await supabase
        .from("usuarios")
        .select("*")
        .eq("email", form.email)
        .single();

      if (selError || !usuario)
        throw new Error("Email o contraseña incorrectos.");

      // Comparar password ingresada vs hash en base
      const passwordOk = await bcrypt.compare(
        form.password,
        usuario.password_hash
      );

      if (!passwordOk)
        throw new Error("Email o contraseña incorrectos.");

      // ✔ LOGIN EXITOSO
      alert(`Bienvenido, ${usuario.nombre}!`);
      console.log("Datos del usuario logueado:", usuario);

      // Aquí podrías guardar al usuario en contexto o localStorage
      // Ejemplo: localStorage.setItem("user", JSON.stringify(usuario));

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // 4️⃣ RENDER DEL COMPONENTE
  // ================================
  return (
    <div style={{ padding: "20px" }}>
      <h2>{mode === "login" ? "Iniciar sesión" : "Crear cuenta"}</h2>

      {/* Botones para cambiar de modo */}
      <button onClick={() => setMode("login")}>Login</button>
      <button onClick={() => setMode("register")}>Register</button>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>

        {/* ======================= */}
        {/* CAMPOS SOLO PARA REGISTRO */}
        {/* ======================= */}
        {mode === "register" && (
          <>
            <div>
              <label>Nombre</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} />
            </div>

            <div>
              <label>Apellido</label>
              <input name="apellido" value={form.apellido} onChange={handleChange} />
            </div>

            <div>
              <label>Razón Social</label>
              <input
                name="razon_social"
                value={form.razon_social}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Dirección</label>
              <input
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>CUIT</label>
              <input
                name="cuit"
                maxLength={13}
                value={form.cuit}
                onChange={handleChange}
              />
            </div>

            {/* SELECT CONDICIÓN IVA DESDE SUPABASE */}
            <div>
              <label>Condición IVA</label>
              <select
                name="cond_iva_id"
                value={form.cond_iva_id}
                onChange={handleChange}
              >
                <option value="">Seleccionar</option>

                {/* Genera dinámicamente las opciones desde la DB */}
                {condicionesIVA.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.descripcion}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* ======================= */}
        {/* CAMPOS LOGIN + REGISTRO */}
        {/* ======================= */}
        <div>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Contraseña</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        {mode === "register" && (
          <div>
            <label>Repetir contraseña</label>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>
        )}

        {/* Mostrar errores */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Botón enviar */}
        <button type="submit" disabled={loading}>
          {loading
            ? "Procesando..."
            : mode === "login"
            ? "Entrar"
            : "Registrarme"}
        </button>
      </form>
    </div>
  );
}
