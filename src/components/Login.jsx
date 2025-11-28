import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";   // 👈 IMPORTANTE




export default function Login() {
  // Hook para redirigir
  const navigate = useNavigate(); // 👈

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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================================
  // 3️⃣ SUBMIT LOGIN / REGISTRO
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // VALIDACIÓN BÁSICA COMÚN
      if (!form.email || !form.password)
        throw new Error("Completá email y contraseña.");

      // ================================
      // ⭐ REGISTRO COMPLETO
      // ================================
      if (mode === "register") {
        if (!form.nombre) throw new Error("Ingresá tu nombre.");
        if (!form.apellido) throw new Error("Ingresá tu apellido.");
        if (!form.razon_social) throw new Error("Ingresá tu razón social.");
        if (!form.direccion) throw new Error("Ingresá tu dirección.");

        // ⚠️ Acá ajustá la longitud según cómo quieras guardar el CUIT
        // Si querés 15 caracteres en DB: cambiá a 15 y también el maxLength del input
        if (!form.cuit || form.cuit.length !== 15)
          throw new Error("Ingresá un CUIT válido.");

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

        const passwordHash = await bcrypt.hash(form.password, 10);

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

        alert("Registro exitoso. Bienvenido 👋");

        // 👉 DESPUÉS DEL REGISTRO: REDIRIGIR A /inicio
        navigate("/inicio");
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

      const passwordOk = await bcrypt.compare(
        form.password,
        usuario.password_hash
      );

      if (!passwordOk)
        throw new Error("Email o contraseña incorrectos.");

      console.log("Datos del usuario logueado:", usuario);

      // Ej: guardar sesión en localStorage si querés
      // localStorage.setItem("user", JSON.stringify(usuario));

      // 👉 DESPUÉS DEL LOGIN: REDIRIGIR A /inicio
      navigate("/inicio");

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

      <button onClick={() => setMode("login")}>Login</button>
      <button onClick={() => setMode("register")}>Register</button>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
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
                maxLength={15}           // 👈 ajustá a 15 para que matchee con la validación
                value={form.cuit}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Condición IVA</label>
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
          </>
        )}

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

        {error && <p style={{ color: "red" }}>{error}</p>}

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
