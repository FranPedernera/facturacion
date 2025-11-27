import React, { useState } from "react";

// Componente funcional Login
export default function Login() {
  // Estado para saber si estamos en modo "login" o "register"
  const [mode, setMode] = useState("login"); // "login" | "register"

  // Estado del formulario: guardamos los valores de los inputs
  const [form, setForm] = useState({
    name: "",            // solo se usa en registro
    email: "",
    password: "",
    confirmPassword: "", // solo se usa en registro
  });

  // Estado para mostrar mensajes de error
  const [error, setError] = useState("");

  // Maneja el cambio de cualquier input del formulario
  const handleChange = (e) => {
    // e.target.name es el "name" del input (email, password, etc.)
    // e.target.value es lo que el usuario escribe
    setForm({
      ...form,                  // copiamos el estado anterior
      [e.target.name]: e.target.value, // actualizamos solo el campo que cambió
    });
  };

  // Maneja el envío del formulario (click en el botón submit)
  const handleSubmit = (e) => {
    // Evita que el formulario recargue la página
    e.preventDefault();
    // Limpiamos errores anteriores
    setError("");

    // Validaciones básicas para ambos modos
    if (!form.email || !form.password) {
      setError("Completá email y contraseña.");
      return; // cortamos la ejecución
    }

    // Lógica cuando estamos en modo "register"
    if (mode === "register") {
      // Validar que haya nombre
      if (!form.name) {
        setError("Completá tu nombre.");
        return;
      }

      // Validar que las contraseñas coincidan
      if (form.password !== form.confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }

      // Acá iría la llamada a tu API / Supabase para registrarse
      console.log("REGISTRO:", form);
      return;
    }

    // Lógica cuando estamos en modo "login"
    // Acá iría tu lógica real de login (Supabase, API, etc.)
    console.log("LOGIN:", form);
  };

  // JSX que se renderiza en pantalla
  return (
    <div>
      {/* Título que cambia según el modo */}
      <h2>{mode === "login" ? "Iniciar sesión" : "Crear cuenta"}</h2>

      {/* Botones para cambiar entre Login y Register */}
      <div>
        <button type="button" onClick={() => setMode("login")}>
          Login
        </button>
        <button type="button" onClick={() => setMode("register")}>
          Register
        </button>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        {/* Campo Nombre solo se muestra en modo registro */}
        {mode === "register" && (
          <div>
            <label>Nombre</label>
            <br />
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Tu nombre"
            />
          </div>
        )}

        {/* Campo Email */}
        <div>
          <label>Email</label>
          <br />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="ejemplo@mail.com"
          />
        </div>

        {/* Campo Contraseña */}
        <div>
          <label>Contraseña</label>
          <br />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
        </div>

        {/* Campo Repetir contraseña solo en registro */}
        {mode === "register" && (
          <div>
            <label>Repetir contraseña</label>
            <br />
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>
        )}

        {/* Mostrar error si existe */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Botón de enviar. El texto cambia según el modo */}
        <button type="submit">
          {mode === "login" ? "Entrar" : "Registrarme"}
        </button>
      </form>
    </div>
  );
}
