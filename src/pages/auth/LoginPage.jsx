import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Container from '../../components/layout/Container';
import LoginForm from '../../components/auth/LoginForm';

export default function LoginPage() {
   return (
      <>
         <Header />
         <Container>
            <div className="min-h-[calc(100vh-280px)] flex items-center justify-center px-4 py-8">
               <div className="w-full max-w-md">
                  {/* Header de la página */}
                  <div className="text-center mb-8">
                     <h1 className="text-3xl font-bold text-white">Iniciar Sesión</h1>
                     <p className="mt-2 text-neutral-400">
                Bienvenido de vuelta a nexTapa
                     </p>
                  </div>

                  {/* Card del formulario */}
                  <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700">
                     <LoginForm />
                  </div>
               </div>
            </div>
         </Container>
         <Footer />
      </>
   );
}