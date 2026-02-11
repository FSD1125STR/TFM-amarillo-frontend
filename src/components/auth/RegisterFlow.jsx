

import { useState } from 'react';
import useMultiStepForm from '../../hooks/useMultiStepForm';

import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom'; 
import EmailStep from './EmailStep';
import UserTypeStep from './UserTypeStep';
import ClientDataStep from './ClientDataStep';
import HosteleroDataStep from './HosteleroDataStep';
import EstablishmentStep from './EstablishmentStep';

/**
 * COMPONENTE PRINCIPAL DEL FLUJO DE REGISTRO
 * 
 * Orquesta el proceso de registro multi-step:
 * 1. Captura email
 * 2. Selecciona tipo de usuario
 * 3. Completa datos personales (cliente o hostelero)
 * 4. Añade establecimiento (solo hosteleros)
 * 
 * Muestra progreso visual y maneja navegación entre pasos
 */
export default function RegisterFlow() {
   const navigate = useNavigate(); // 👈 NUEVO
   const { register: registerUser } = useAuth(); // 👈 NUEVO (renombramos para evitar conflicto)
  
   const {
      currentStep,
      totalSteps,
      steps,
      formData,
      currentStepInfo,
      progress,
      isFirstStep,
      isLastStep,
      goToNextStep,
      goToPreviousStep,
      updateFormData,
      updateEstablishmentData,
      getDataForSubmit,
      resetForm,
   } = useMultiStepForm();

   const [isSubmitting, setIsSubmitting] = useState(false);
   const [submitError, setSubmitError] = useState(null);

   const handleStepComplete = (stepData) => {
      updateFormData(stepData);
      goToNextStep();
   };

   const handleFinalSubmit = async (finalStepData) => {
      try {
         setIsSubmitting(true);
         setSubmitError(null);

         // Actualizamos con los datos del último paso
         updateFormData(finalStepData);

         // Preparamos los datos para el backend
         const dataToSend = getDataForSubmit();
      
         console.log('📤 Datos a enviar al backend:', dataToSend);

         //  USA LA FUNCIÓN REAL DEL CONTEXTO
         await registerUser(dataToSend);

         console.log('✅ Registro exitoso!');
      
         // Reset del formulario
         resetForm();
      
         // Redirigir al home
         navigate('/');
      
      } catch (error) {
         console.error('❌ Error en el registro:', error);
         setSubmitError(error.message || 'Hubo un error al crear tu cuenta');
      } finally {
         setIsSubmitting(false);
      }
   };

   // ... resto del código igual (renderCurrentStep, etc.)
  
   const renderCurrentStep = () => {
      if (currentStep === 0) {
         return (
            <EmailStep
               initialData={{ email: formData.email }}
               onNext={handleStepComplete}
            />
         );
      }

      if (currentStep === 1) {
         return (
            <UserTypeStep
               initialData={{ tipoUsuario: formData.tipoUsuario }}
               onNext={handleStepComplete}
               onBack={goToPreviousStep}
            />
         );
      }

      if (currentStep === 2) {
         const isHostelero = formData.tipoUsuario === 'hostelero';
      
         if (isHostelero) {
            return (
               <HosteleroDataStep
                  initialData={{
                     nombre: formData.nombre,
                     apellidos: formData.apellidos,
                     nombreComercial: formData.nombreComercial,
                     password: formData.password,
                     confirmPassword: formData.confirmPassword,
                  }}
                  onNext={handleStepComplete}
                  onBack={goToPreviousStep}
               />
            );
         } else {
            return (
               <ClientDataStep
                  initialData={{
                     nombre: formData.nombre,
                     apellidos: formData.apellidos,
                     password: formData.password,
                     confirmPassword: formData.confirmPassword,
                  }}
                  onNext={isLastStep ? handleFinalSubmit : handleStepComplete}
                  onBack={goToPreviousStep}
                  isLastStep={isLastStep}
                  isSubmitting={isSubmitting}
               />
            );
         }
      }

      if (currentStep === 3) {
         return (
            <EstablishmentStep
               initialData={formData.establecimiento}
               onNext={handleFinalSubmit}
               onBack={goToPreviousStep}
               isSubmitting={isSubmitting}
            />
         );
      }

      return null;
   };

   return (
      <div className="w-full space-y-6">
         <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
               <span className="text-neutral-400">
            Paso {currentStep + 1} de {totalSteps}
               </span>
               <span className="text-neutral-400">
                  {Math.round(progress)}% completado
               </span>
            </div>

            <div className="w-full bg-neutral-700 h-2 rounded-full overflow-hidden">
               <div
                  className="bg-orange-500 h-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
               />
            </div>

            <div className="text-center">
               <h2 className="text-2xl font-bold text-white">
                  {currentStepInfo.title}
               </h2>
               <p className="text-neutral-400 mt-1">
                  {currentStepInfo.description}
               </p>
            </div>
         </div>

         <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700">
            {renderCurrentStep()}
         </div>

         {submitError && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
               <p className="text-red-500 text-sm">{submitError}</p>
            </div>
         )}

         <div className="flex justify-center gap-2">
            {steps.map((step, index) => (
               <div
                  key={step.id}
                  className={`h-2 rounded-full transition-all duration-300 ${
                     index === currentStep
                        ? 'w-8 bg-orange-500'
                        : index < currentStep
                           ? 'w-2 bg-orange-500/50'
                           : 'w-2 bg-neutral-700'
                  }`}
               />
            ))}
         </div>
      </div>
   );
}