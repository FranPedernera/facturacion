import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-gray-900 text-white fixed top-0 left-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <h1 className="text-2xl font-semibold tracking-wide">
          ARCA <span className="text-blue-400">Facturación</span>
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-sm font-medium">
          <a href="/dashboard" className="hover:text-blue-400 transition">Dashboard</a>
          <a href="/clients" className="hover:text-blue-400 transition">Clientes</a>
          <a href="/invoices" className="hover:text-blue-400 transition">Facturas</a>
          <a href="/reports" className="hover:text-blue-400 transition">Reportes</a>
        </div>

        {/* Mobile button */}
        <button
          className="md:hidden w-8 h-8 flex items-center justify-center"
          onClick={() => setOpen(!open)}
        >
          {/* Icono hamburguesa */}
          {!open ? (
            <div className="space-y-1.5">
              <span className="block w-6 h-0.5 bg-white"></span>
              <span className="block w-6 h-0.5 bg-white"></span>
              <span className="block w-6 h-0.5 bg-white"></span>
            </div>
          ) : (
            // Icono X
            <div className="relative w-6 h-6">
              <span className="absolute top-3 left-0 w-6 h-0.5 bg-white rotate-45"></span>
              <span className="absolute top-3 left-0 w-6 h-0.5 bg-white -rotate-45"></span>
            </div>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-gray-800 px-6 py-4 space-y-4 animate-fade-down">
          <a href="/dashboard" className="block hover:text-blue-400">Dashboard</a>
          <a href="/clients" className="block hover:text-blue-400">Clientes</a>
          <a href="/invoices" className="block hover:text-blue-400">Facturas</a>
          <a href="/reports" className="block hover:text-blue-400">Reportes</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
