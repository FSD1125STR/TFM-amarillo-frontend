

// AdminPanel.jsx
import { NavLink, Outlet } from 'react-router-dom';
import { useAdminSidebar } from '../../hooks/useAdminSidebar.js';
import { Footer } from '../../components/layout/Footer.jsx';
import './styles/admin.css';

export const AdminPanel = () => {
   const { isOpen, close, toggle } = useAdminSidebar();

   return (
      <div className="admin-layout">

         {/* ── Menú superior móvil ── */}
         <nav className="admin-topnav">
            <span className="admin-topnav-brand">⚙️ Admin</span>
            <div className="admin-topnav-links">
               <NavLink to="/admin" end className={({ isActive }) => isActive ? 'active' : ''} onClick={close}>
                  Principal
               </NavLink>
               <NavLink to="/admin/establishments" className={({ isActive }) => isActive ? 'active' : ''} onClick={close}>
                  Establecimientos
               </NavLink>
               <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'active' : ''} onClick={close}>
                  Usuarios
               </NavLink>
            </div>

         </nav>

         {/* ── Hamburger — solo visible en móvil cuando el topnav se desborda ── */}
         <button className="admin-menu-toggle" onClick={toggle} aria-label="Abrir menú">
            {isOpen ? '✕' : '☰'}
         </button>

         {/* ── Overlay ── */}
         <div className={`admin-sidebar-overlay ${isOpen ? 'is-open' : ''}`} onClick={close} />

         {/* ── Sidebar — solo en desktop ── */}
         <aside className={`admin-sidebar ${isOpen ? 'is-open' : ''}`}>
            <h1>⚙️ Panel de Administración</h1>
            <nav>
               <NavLink to="/admin" end className={({ isActive }) => isActive ? 'active' : ''} onClick={close}>
                  Principal
               </NavLink>
               <NavLink to="/admin/establishments" className={({ isActive }) => isActive ? 'active' : ''} onClick={close}>
                  Establecimientos
               </NavLink>
               <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'active' : ''} onClick={close}>
                  Usuarios
               </NavLink>
            </nav>
         </aside>

         {/* ── Main ── */}
         <main className="admin-main">
            <Outlet />
            <Footer />
         </main>

      </div>
   );
};