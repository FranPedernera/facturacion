import { XIcon } from "@heroicons/react/outline";

const Sidebar = ({ open, onClose }) => {
  return (
    <div className={`fixed inset-0 z-40 flex ${open ? "" : "pointer-events-none"}`}>
      
      {/* Fondo oscuro */}
      <div 
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 
          ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Contenido */}
      <aside
        className={`relative bg-gray-900 w-64 h-full shadow-xl transform transition-transform duration-300 
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <span className="text-lg font-semibold text-white">Menú</span>
          <button onClick={onClose}>
            <XIcon className="w-6 h-6 text-white" />
          </button>
        </div>

        <nav className="flex flex-col gap-4 p-5 text-gray-300">
          <a href="/dashboard" className="hover:text-blue-400">Dashboard</a>
          <a href="/clients" className="hover:text-blue-400">Clientes</a>
          <a href="/invoices" className="hover:text-blue-400">Facturas</a>
          <a href="/reports" className="hover:text-blue-400">Reportes</a>
          <a href="/settings" className="hover:text-blue-400">Configuración</a>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
