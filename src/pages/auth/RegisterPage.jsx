import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Container from '../../components/layout/Container';
import RegisterFlow from '../../components/auth/RegisterFlow';

export default function RegisterPage() {
   return (
      <>
         <Header />
         <Container>
            <div className="min-h-[calc(100vh-280px)] flex items-center justify-center px-4 py-8">
               <div className="w-full max-w-lg">
                  {/* Título principal */}
                  <div className="text-center mb-8">
                     <h1 className="text-3xl font-bold text-white">Crear Cuenta</h1>
                     <p className="mt-2 text-neutral-400">
                Únete a la comunidad nexTapa
                     </p>
                  </div>

                  {/* Flujo de registro */}
                  <RegisterFlow />

                  {/* Link a login */}
                  <div className="text-center mt-8">
                     <p className="text-neutral-400 text-sm">
                ¿Ya tienes cuenta?{' '}
                        <Link 
                           to="/login" 
                           className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
                        >
                  Inicia sesión aquí
                        </Link>
                     </p>
                  </div>
               </div>
            </div>
         </Container>
         <Footer />
      </>
   );
}