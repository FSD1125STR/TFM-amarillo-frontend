

// AdminPanel.jsx
import { NavLink, Outlet } from 'react-router-dom';
import { useAdminSidebar } from '../../hooks/useAdminSidebar.js';
import './styles/admin.css';

export const AdminPanel = () => {
   const { isOpen, close, toggle } = useAdminSidebar();

   return (
      <div className="admin-layout">

         {/* Hamburger — solo visible en móvil vía CSS */}
         <button className="admin-menu-toggle" onClick={toggle} aria-label="Abrir menú">
            {isOpen ? "✕" : "☰"}
         </button>

         {/* Overlay oscuro al abrir sidebar */}
         <div className={`admin-sidebar-overlay ${isOpen ? "is-open" : ""}`} onClick={close} />

         {/* Sidebar */}
         <aside className={`admin-sidebar ${isOpen ? "is-open" : ""}`}>
            <h1>⚙️ Panel de Administración</h1>
            <nav>
               <NavLink to="/admin" end className={({ isActive }) => isActive ? "active" : ""}
                  onClick={close}>
                  Principal
               </NavLink>
               <NavLink to="/admin/establishments" className={({ isActive }) => isActive ? "active" : ""}
                  onClick={close}>
                  Establecimientos
               </NavLink>
               <NavLink to="/admin/users" className={({ isActive }) => isActive ? "active" : ""}
                  onClick={close}>
                  Usuarios
               </NavLink>
            </nav>
         </aside>

         {/* Main content */}
         <main className="admin-main">
            <Outlet />
         </main>

      </div>
   );
};