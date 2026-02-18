// This file contains the admin page for establishments, where you can list, create, edit and delete establishments.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { establishmentService } from '../../services/establishmentService';
import './admin.css';

export const AdminEstablishments = () => {
   const [establishments, setEstablishments] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const navigate = useNavigate();

   useEffect(() => {
      fetchEstablishments();
   }, []);

   const fetchEstablishments = async () => {
      try {
         setLoading(true);
         const response = await establishmentService.getAll();
         setEstablishments(response.data);
      } catch (err) {
         setError('Error loading establishments');
      } finally {
         setLoading(false);
      }
   };

   const handleDelete = async (id) => {
      if (!confirm('Seguro que quieres eliminar este establecimiento?')) {return;}
      try {
         await establishmentService.delete(id);
         fetchEstablishments();
      } catch (err) {
         setError('Error deleting establishment');
      }
   };

   if (loading) {return <p className="admin-loading">Loading...</p>;}
   if (error) {return <p className="admin-error">{error}</p>;}

   return (
      <div>
         <div className="admin-page-header">
            <h2>Establishments</h2>
            <button
               className="admin-btn admin-btn-primary"
               onClick={() => navigate('/admin/establishments/new')}
            >
               + New establishment
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
                     <th>Acciones</th>
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
                           <span className={`admin-badge ${est.active ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                              {est.active ? 'Yes' : 'No'}
                           </span>
                        </td>
                        <td>
                           <span className={`admin-badge ${est.verified ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                              {est.verified ? 'Yes' : 'Pending'}
                           </span>
                        </td>
                        <td>
                           <div className="admin-actions">
                              <button
                                 className="admin-btn admin-btn-warning"
                                 onClick={() => navigate(`/admin/establishments/${est._id}`)}
                              >
                                 Edit
                              </button>
                              <button
                                 className="admin-btn admin-btn-danger"
                                 onClick={() => handleDelete(est._id)}
                              >
                                 Delete
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