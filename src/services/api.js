

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Crear instancia de axios con configuración base
const api = axios.create({
   baseURL: API_URL,
   headers: {
      'Content-Type': 'application/json'
   }
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
   // Si la respuesta es exitosa, la devolvemos tal cual
   response => response,
   //Si no error
   error => {
      console.error(' Error en API:', error.response?.data || error.message);
      return Promise.reject(error);
   }
);

// ============================================
// SERVICIO DE ESTABLECIMIENTOS
// ============================================
export const establishmentService = {
  
   // Obtener TODOS los establecimientos
   getAll: async () => {
      try {
         const response = await api.get('/establishment');
         return response.data; 
        
      }catch(error){
         console.error('error al obterer los estableciminestos',error);
      }
   },
  
   // Obtener UN establecimiento por ID
   getById: async (id) => {
      try {
         const response = await api.get(`/establishment/${id}`);
         return response.data; // { success: true, data: {...} }
      } catch (error) {
         console.error('error al obterer establecimiento por id',error);
      }
   }
};

// Exportar también la instancia de axios por si la necesitas
export default api;