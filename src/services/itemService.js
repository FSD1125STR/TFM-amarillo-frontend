//ItemService.js - Servicio para manejar operaciones relacionadas con items (tapas) en el frontend


import { api } from './api';

export const itemService = {
   getByEstablishment: async (establishmentId, filters = {}) => {
      try {
         const params = new URLSearchParams();
      
         if (filters.type) {params.append('type', filters.type);}
         if (filters.available !== undefined) {params.append('available', filters.available);}
         if (filters.featured !== undefined) {params.append('featured', filters.featured);}
      
         const queryString = params.toString();
         const url = `/items/establishment/${establishmentId}${queryString ? `?${queryString}` : ''}`;
      
         const response = await api.get(url);
         return response.data;
      } catch (error) {
         console.error('Error al obtener items:', error);
         throw error;
      }
   },

   getById: async (itemId) => {
      try {
         const response = await api.get(`/items/${itemId}`);
         return response.data;
         
      } catch (error) {
         console.error('Error al obtener item:', error);
         throw error;
      }
   },

   create: async (itemData) => {
      try {
         const response = await api.post('/items', itemData);
         return response.data;
      } catch (error) {
         console.error('Error al crear item:', error);
         throw error;
      }
   }
}; 
