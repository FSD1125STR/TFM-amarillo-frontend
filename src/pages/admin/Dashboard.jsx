// src/pages/admin/Dashboard.jsx
import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Store, UtensilsCrossed, Users, ChefHat, TrendingUp, CheckCircle, XCircle } from 'lucide-react';


const StatCard = ({ icon: Icon, label, value, color, sub }) => (
   <div className="admin-stat-card">
      <div className={`admin-stat-icon ${color}`}>
         <Icon size={20} />
      </div>
      <div className="admin-stat-body">
         <p className="admin-stat-label">{label}</p>
         <p className="admin-stat-value">
            {value === null ? <span className="admin-stat-loading" /> : value}
         </p>
         {sub && <p className="admin-stat-sub">{sub}</p>}
      </div>
   </div>
);

export const Dashboard = () => {
   const [stats, setStats] = useState(null);
   const [error, setError] = useState(false);

   useEffect(() => {
      api.get('/admin/stats')
         .then(res => setStats(res.data.data))
         .catch(() => setError(true));
   }, []);

   const v = (key) => stats ? (stats[key] ?? 0) : null;

   return (
      <div className="admin-dashboard">
         <div className="admin-page-header">
            <h2 className="admin-title">Dashboard</h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
               Bienvenido al panel de administración
            </p>
         </div>

         {error && (
            <div className="admin-alert admin-alert-error" style={{ marginBottom: 16 }}>
               No se pudieron cargar las estadísticas. Comprueba el endpoint <code>/admin/stats</code>.
            </div>
         )}

         <div className="admin-stats-grid">
            <StatCard
               icon={Store}
               label="Establecimientos"
               value={v('establishments')}
               color="stat-blue"
               sub={stats ? `${stats.establishmentsActive ?? 0} activos · ${stats.establishmentsPending ?? 0} pendientes` : null}
            />
            <StatCard
               icon={UtensilsCrossed}
               label="Tapas"
               value={v('items')}
               color="stat-orange"
               sub={stats ? `${stats.itemsActive ?? 0} activas` : null}
            />
            <StatCard
               icon={Users}
               label="Usuarios"
               value={v('users')}
               color="stat-green"
               sub={stats ? `${stats.clients ?? 0} clientes` : null}
            />
            <StatCard
               icon={ChefHat}
               label="Hosteleros"
               value={v('hosteleros')}
               color="stat-purple"
               sub={stats ? `${stats.hostelerosVerified ?? 0} verificados` : null}
            />
         </div>

         {/* Mini resumen verificaciones pendientes */}
         {stats && (stats.establishmentsPending > 0 || stats.hostelerosVerified < stats.hosteleros) && (
            <div className="admin-section" style={{ marginTop: 24 }}>
               <p className="admin-section-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <TrendingUp size={14} /> Pendiente de revisión
               </p>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {stats.establishmentsPending > 0 && (
                     <div className="admin-pending-row">
                        <XCircle size={14} className="stat-orange-icon" />
                        <span>{stats.establishmentsPending} establecimiento{stats.establishmentsPending !== 1 ? 's' : ''} sin verificar</span>
                     </div>
                  )}
                  {stats.hosteleros - stats.hostelerosVerified > 0 && (
                     <div className="admin-pending-row">
                        <XCircle size={14} className="stat-purple-icon" />
                        <span>{stats.hosteleros - stats.hostelerosVerified} hostelero{stats.hosteleros - stats.hostelerosVerified !== 1 ? 's' : ''} sin verificar</span>
                     </div>
                  )}
               </div>
            </div>
         )}

         {stats && stats.establishmentsPending === 0 && stats.hostelerosVerified >= stats.hosteleros && (
            <div className="admin-section" style={{ marginTop: 24 }}>
               <div className="admin-pending-row">
                  <CheckCircle size={14} style={{ color: '#16a34a' }} />
                  <span style={{ color: '#16a34a', fontWeight: 600 }}>Todo al día, sin pendientes</span>
               </div>
            </div>
         )}
      </div>
   );
};