// src/services/reservationService.js
import { api } from "./api";

export const reservationService = {

  // ── Cliente ───────────────────────────────────────────────────────────────

  // Crear una nueva reserva
  // POST /api/reservations
  create: async ({ establishmentId, date, time, guests, notes }) => {
    try {
      const response = await api.post("/reservations", {
        establishmentId,
        date,
        time,
        guests: Number(guests),
        notes: notes?.trim() || "",
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear reserva:", error);
      throw error;
    }
  },

  // Ver mis reservas (cliente)
  // GET /api/reservations/my
  getMy: async () => {
    try {
      const response = await api.get("/reservations/my");
      return response.data;
    } catch (error) {
      console.error("Error al obtener mis reservas:", error);
      throw error;
    }
  },

  // Cancelar una reserva propia
  // PATCH /api/reservations/:id/cancel
  cancel: async (id) => {
    try {
      const response = await api.patch(`/reservations/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error("Error al cancelar reserva:", error);
      throw error;
    }
  },

  // ── Establecimiento ───────────────────────────────────────────────────────

  // Ver reservas de un establecimiento
  // GET /api/reservations/establishment/:id
  getByEstablishment: async (establishmentId) => {
    try {
      const response = await api.get(`/reservations/establishment/${establishmentId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener reservas del establecimiento:", error);
      throw error;
    }
  },

  // Confirmar una reserva
  // PATCH /api/reservations/:id/confirm
  confirm: async (id) => {
    try {
      const response = await api.patch(`/reservations/${id}/confirm`);
      return response.data;
    } catch (error) {
      console.error("Error al confirmar reserva:", error);
      throw error;
    }
  },

  // Rechazar una reserva con motivo opcional
  // PATCH /api/reservations/:id/reject
  reject: async (id, rejectionReason = "") => {
    try {
      const response = await api.patch(`/reservations/${id}/reject`, { rejectionReason });
      return response.data;
    } catch (error) {
      console.error("Error al rechazar reserva:", error);
      throw error;
    }
  },

  // Completar reserva e introducir importe → genera cupón automáticamente
  // PATCH /api/reservations/:id/complete
  complete: async (id, totalAmount) => {
    try {
      const response = await api.patch(`/reservations/${id}/complete`, {
        totalAmount: Number(totalAmount),
      });
      return response.data;
    } catch (error) {
      console.error("Error al completar reserva:", error);
      throw error;
    }
  },
};