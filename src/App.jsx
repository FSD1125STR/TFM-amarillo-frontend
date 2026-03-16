import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from "./pages/Home";
import { AllEstablishment } from "./pages/AllEstablishment";
import { Establishment } from "./pages/Establishment";
import { AllTapas } from "./pages/AllTapas";
import { Tapas } from "./pages/Tapas";
import { AdminPanel } from "./pages/admin/AdminPanel";
import { Dashboard } from "./pages/admin/Dashboard";
import { AdminEstablishments } from "./pages/admin/AdminEstablishments";
import { AdminEstablishmentDetail } from "./pages/admin/AdminEstablishmentDetail";
import { ItemAdmin } from './pages/admin/ItemAdmin';
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { HostLoginPage } from "./pages/auth/HostLoginPage";
import { HostRegisterPage } from "./pages/auth/HostRegisterPage";
import { HostDashboard } from "./pages/host/HostDashboard";
import { ForbiddenPage } from "./pages/ForbiddenPage";
import { PublicOnlyRoute } from "./components/routes/PublicOnlyRoute";
import { AdminRoute } from "./components/routes/AdminRoute";
import { HostRoute } from "./components/routes/HostRoute";

export function App() {
   return (
      <>
         <BrowserRouter>
            <Routes>
               {/* Rutas públicas reales */}
               <Route path="/" element={<Home />} />
               <Route path="/establishments" element={<AllEstablishment />} />
               <Route path="/establishment/:slug" element={<Establishment />} />
               <Route path="/items" element={<AllTapas />} />
               <Route path="/items/:slug" element={<Tapas />} />

               {/* Auth: solo accesibles si NO estás logueado */}
               <Route path="/login" element={
                  <PublicOnlyRoute>
                     <LoginPage />
                  </PublicOnlyRoute>
               } />

               <Route path="/register" element={
                  <PublicOnlyRoute>
                     <RegisterPage />
                  </PublicOnlyRoute>
               } />

               <Route path="/host/login" element={
                  <PublicOnlyRoute>
                     <HostLoginPage />
                  </PublicOnlyRoute>
               } />

               <Route path="/host/register" element={
                  <PublicOnlyRoute>
                     <HostRegisterPage />
                  </PublicOnlyRoute>
               } />

               <Route path="/host/dashboard" element={
                  <HostRoute>
                     <HostDashboard />
                  </HostRoute>
               } />

               <Route path="/403" element={<ForbiddenPage />} />

               {/* Admin: protegido por login */}
               <Route path="/admin" element={
                  <AdminRoute>
                     <AdminPanel />
                  </AdminRoute>
               }>
                  <Route index element={<Dashboard />} />
                  <Route path="establishments" element={<AdminEstablishments />} />
                  <Route path="establishments/:id" element={<AdminEstablishmentDetail />} />
                  <Route path="items/:id" element={<ItemAdmin />} />
               </Route>
            </Routes>
         </BrowserRouter>
      </>
   );
}
