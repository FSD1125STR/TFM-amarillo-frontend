

// AdminEstablishments.jsx - Página de administración para listar y gestionar establecimientos
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { establishmentService } from '../../services/establishmentService';
import './styles/admin.css';

export const AdminEstablishments = () => {
   const [establishments, setEstablishments] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [deletingId, setDeletingId] = useState(null); // ID pendiente de confirmar borrado
   const navigate = useNavigate();

   useEffect(() => {
      fetchEstablishments();
   }, []);

   const fetchEstablishments = async () => {
      try {
         setLoading(true);
         const response = await establishmentService.getAll({ includeInactive: true });
         setEstablishments(response.data);
      } catch (err) {
         setError('Error loading establishments', err);
      } finally {
         setLoading(false);
      }
   };

   // Activo/inactivo — temporal, reversible
   const handleToggleActive = async (id, currentActive) => {
      try {
         if (currentActive) {
            await establishmentService.deactivate(id);
         } else {
            await establishmentService.reactivate(id);
         }
         setEstablishments(prev =>
            prev.map(est => est._id === id ? { ...est, active: !currentActive } : est)
         );
      } catch (err) {
         setError('Error al cambiar el estado del establecimiento', err);
      }
   };

   // Borrado definitivo — soft delete, irreversible desde el panel
   const handleDelete = async (id) => {
      try {
         await establishmentService.delete(id);
         setEstablishments(prev => prev.filter(est => est._id !== id));
         setDeletingId(null);
      } catch (err) {
         setError('Error al eliminar el establecimiento', err);
         setDeletingId(null);
      }
   };

   if (loading) {return <p className="admin-loading">Cargando...</p>;}
   if (error) {return <p className="admin-error">{error}</p>;}

   return (
      <div>
         {/* Modal de confirmación de borrado */}
         {deletingId && (
            <div className="admin-modal-overlay">
               <div className="admin-modal">
                  <h3 className="admin-modal-title">¿Eliminar establecimiento?</h3>
                  <p className="admin-modal-body">
                     Esta acción es irreversible. El establecimiento y sus datos desaparecerán de la app.
                  </p>
                  <div className="admin-modal-actions">
                     <button
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        onClick={() => setDeletingId(null)}
                     >
                        Cancelar
                     </button>
                     <button
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => handleDelete(deletingId)}
                     >
                        Sí, eliminar
                     </button>
                  </div>
               </div>
            </div>
         )}

         <div className="admin-page-header">
            <h2>Establecimientos de la App ({establishments.length})</h2>
            <button
               className="admin-btn admin-btn-primary"
               onClick={() => navigate('/admin/establishments/new')}
            >
               + Nuevo establecimiento
            </button>
         </div>

         <div className="admin-table-wrapper">
            <table className="admin-table">
               <thead>
                  <tr>
                     <th>Nombre</th>
                     <th>Tipo</th>
                     <th>Ciudad</th>
                     <th>Provincia</th>
                     <th>Activo</th>
                     <th>Verificado</th>
                     <th>Acción</th>
                  </tr>
               </thead>
               <tbody>
                  {establishments.map((est) => (
                     <tr key={est._id}>
                        <td>{est.name}</td>
                        <td>{est.type}</td>
                        <td>{est.address?.city}</td>
                        <td>{est.address?.province}</td>
                        <td>
                           <span
                              className={`admin-badge ${est.active ? 'admin-badge-success' : 'admin-badge-danger'}`}
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleToggleActive(est._id, est.active)}
                              title={est.active ? 'Click para desactivar' : 'Click para activar'}
                           >
                              {est.active ? 'Activo' : 'Inactivo'}
                           </span>
                        </td>
                        <td>
                           <span className={`admin-badge ${est.verified ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                              {est.verified ? 'Verificado' : 'Pendiente'}
                           </span>
                        </td>
                        <td>
                           <div className="admin-actions">
                              <button
                                 className="admin-btn admin-btn-warning admin-btn-sm"
                                 onClick={() => navigate(`/admin/establishments/${est._id}`)}
                              >
                                 Editar
                              </button>
                              <button
                                 className="admin-btn admin-btn-danger admin-btn-sm"
                                 onClick={() => setDeletingId(est._id)}
                                 title="Eliminar definitivamente"
                              >
                                 Eliminar
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
};