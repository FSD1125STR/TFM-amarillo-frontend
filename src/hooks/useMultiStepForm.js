import { useState } from 'react';

/**
 * HOOK PERSONALIZADO PARA FORMULARIO MULTI-STEP
 * 
 * Maneja la lógica de navegación y almacenamiento de datos
 * en un formulario de múltiples pasos.
 * 
 * FLUJO DE PASOS:
 * 1. Email (todos)
 * 2. Tipo de usuario (todos)
 * 3. Datos personales (cliente o hostelero, según elección)
 * 4. Datos del establecimiento (solo hosteleros)
 * 
 * @returns {Object} Estado y funciones para controlar el formulario
 */
export default function useMultiStepForm() {
   // ============================================
   // ESTADO
   // ============================================
  
   /**
   * Paso actual del formulario (0-indexed)
   * 0: Email
   * 1: Tipo de usuario
   * 2: Datos personales
   * 3: Establecimiento (solo hosteleros)
   */
   const [currentStep, setCurrentStep] = useState(0);
  
   /**
   * Datos acumulados de todos los pasos
   * Se va llenando conforme el usuario avanza
   */
   const [formData, setFormData] = useState({
      email: '',
      tipoUsuario: '', // 'cliente' o 'hostelero'
      nombre: '',
      apellidos: '',
      password: '',
      confirmPassword: '',
      nombreComercial: '', // Solo hosteleros
      establecimiento: {
         nombre: '',
         tipo: '',
         descripcion: '',
         direccion: '',
         codigoPostal: '',
         ciudad: '',
         provincia: '',
         telefono: '',
      // Más adelante añadiremos coordenadas de Mapbox
      // latitud: null,
      // longitud: null,
      },
   });

   // ============================================
   // CONFIGURACIÓN DE PASOS
   // ============================================
  
   /**
   * Define los pasos del formulario según el tipo de usuario
   * Los clientes tienen 3 pasos, los hosteleros 4
   */
   const getSteps = () => {
      const baseSteps = [
         { id: 'email', title: 'Tu email', description: 'Empecemos con tu correo' },
         { id: 'userType', title: 'Tipo de cuenta', description: '¿Qué tipo de usuario eres?' },
         { id: 'personalData', title: 'Datos personales', description: 'Cuéntanos sobre ti' },
      ];

      // Si es hostelero, añadimos el paso del establecimiento
      if (formData.tipoUsuario === 'hostelero') {
         baseSteps.push({
            id: 'establishment',
            title: 'Tu establecimiento',
            description: 'Información de tu local',
         });
      }

      return baseSteps;
   };

   const steps = getSteps();
   const totalSteps = steps.length;

   // ============================================
   // HELPERS
   // ============================================
  
   /**
   * Verifica si estamos en el primer paso
   */
   const isFirstStep = currentStep === 0;
  
   /**
   * Verifica si estamos en el último paso
   */
   const isLastStep = currentStep === totalSteps - 1;
  
   /**
   * Obtiene información del paso actual
   */
   const getCurrentStepInfo = () => steps[currentStep];
  
   /**
   * Calcula el progreso en porcentaje (para barra de progreso)
   */
   const getProgress = () => {
      return ((currentStep + 1) / totalSteps) * 100;
   };

   // ============================================
   // FUNCIONES DE NAVEGACIÓN
   // ============================================
  
   /**
   * Avanza al siguiente paso
   * IMPORTANTE: Siempre debe llamarse DESPUÉS de validar el paso actual
   */
   const goToNextStep = () => {
      if (!isLastStep) {
         setCurrentStep((prev) => prev + 1);
         // Scroll al inicio para móviles
         window.scrollTo({ top: 0, behavior: 'smooth' });
      }
   };
  
   /**
   * Retrocede al paso anterior
   */
   const goToPreviousStep = () => {
      if (!isFirstStep) {
         setCurrentStep((prev) => prev - 1);
         window.scrollTo({ top: 0, behavior: 'smooth' });
      }
   };
  
   /**
   * Salta a un paso específico (útil para debugging o navegación directa)
   */
   const goToStep = (stepIndex) => {
      if (stepIndex >= 0 && stepIndex < totalSteps) {
         setCurrentStep(stepIndex);
         window.scrollTo({ top: 0, behavior: 'smooth' });
      }
   };

   // ============================================
   // FUNCIONES DE GESTIÓN DE DATOS
   // ============================================
  
   /**
   * Actualiza los datos del formulario de forma parcial
   * Hace merge con los datos existentes
   * 
   * @param {Object} newData - Nuevos datos a añadir/actualizar
   * 
   * Ejemplo de uso:
   * updateFormData({ email: 'test@example.com' })
   */
   const updateFormData = (newData) => {
      setFormData((prev) => ({
         ...prev,
         ...newData,
      }));
   };
  
   /**
   * Actualiza datos anidados del establecimiento
   * 
   * @param {Object} establishmentData - Datos del establecimiento
   * 
   * Ejemplo de uso:
   * updateEstablishmentData({ nombre: 'Bar Pepe', tipo: 'bar' })
   */
   const updateEstablishmentData = (establishmentData) => {
      setFormData((prev) => ({
         ...prev,
         establecimiento: {
            ...prev.establecimiento,
            ...establishmentData,
         },
      }));
   };
  
   /**
   * Resetea todo el formulario al estado inicial
   * Útil después de un registro exitoso o para empezar de nuevo
   */
   const resetForm = () => {
      setCurrentStep(0);
      setFormData({
         email: '',
         tipoUsuario: '',
         nombre: '',
         apellidos: '',
         password: '',
         confirmPassword: '',
         nombreComercial: '',
         establecimiento: {
            nombre: '',
            tipo: '',
            descripcion: '',
            direccion: '',
            codigoPostal: '',
            ciudad: '',
            provincia: '',
            telefono: '',
         },
      });
   };

   // ============================================
   // PREPARACIÓN DE DATOS PARA EL BACKEND
   // ============================================
  
   /**
   * Formatea los datos para enviar al backend
   * Elimina campos innecesarios según el tipo de usuario
   * 
   * @returns {Object} Datos listos para enviar a la API
   */
   const getDataForSubmit = () => {
      // Concatenamos nombre y apellidos para el campo 'name' del backend
      const fullName = `${formData.nombre} ${formData.apellidos}`.trim();
    
      const baseData = {
         name: fullName, // ← Backend espera 'name', no 'nombre'
         email: formData.email,
         password: formData.password,
         role: formData.tipoUsuario, // 'cliente' o 'hostelero'
      };

      // Si es hostelero, añadimos datos adicionales
      // NOTA: Por ahora el backend solo guarda los datos básicos
      // El establecimiento se implementará en una siguiente fase
      if (formData.tipoUsuario === 'hostelero') {
         return {
            ...baseData,
            // TODO: Implementar guardado de establecimiento en el backend
            // nombreComercial: formData.nombreComercial,
            // establecimiento: {...}
         };
      }

      // Si es cliente, solo devolvemos los datos básicos
      return baseData;
   };

   // ============================================
   // RETURN DEL HOOK
   // ============================================
  
   return {
      // Estado actual
      currentStep,
      totalSteps,
      steps,
      formData,
    
      // Información del paso actual
      currentStepInfo: getCurrentStepInfo(),
      progress: getProgress(),
    
      // Banderas de navegación
      isFirstStep,
      isLastStep,
    
      // Funciones de navegación
      goToNextStep,
      goToPreviousStep,
      goToStep,
    
      // Funciones de gestión de datos
      updateFormData,
      updateEstablishmentData,
      resetForm,
    
      // Preparación para envío
      getDataForSubmit,
   };
}
