import React, { useState } from "react";
import LayoutAuth from "../../components/layout/LayoutAuth";


export default function Auth() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Completá email y contraseña.");
      return;
    }

    if (mode === "register") {
      if (!form.name) {
        setError("Completá tu nombre.");
        return;
      }

      if (form.password !== form.confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }

      console.log("REGISTRO:", form);
      return;
    }

    console.log("LOGIN:", form);
  };

  return (
    <LayoutAuth>
      <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-xl mt-10">
        
        <h2 className="text-2xl font-semibold text-center mb-6">
          {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </h2>

        {/* Botones login/register */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded 
              ${mode === "login" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 rounded 
              ${mode === "register" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {mode === "register" && (
            <div>
              <label className="font-medium">Nombre</label>
              <input
                className="w-full p-2 border rounded mt-1"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Tu nombre"
              />
            </div>
          )}

          <div>
            <label className="font-medium">Email</label>
            <input
              className="w-full p-2 border rounded mt-1"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="ejemplo@mail.com"
            />
          </div>

          <div>
            <label className="font-medium">Contraseña</label>
            <input
              className="w-full p-2 border rounded mt-1"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="font-medium">Repetir contraseña</label>
              <input
                className="w-full p-2 border rounded mt-1"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mt-3"
          >
            {mode === "login" ? "Entrar" : "Registrarme"}
          </button>
        </form>
      </div>
    </LayoutAuth>
  );
}
