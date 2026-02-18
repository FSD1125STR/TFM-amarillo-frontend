import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import { Establishment } from "./pages/Establishment";
import { Tapas } from "./pages/Tapas";
import { AdminPanel } from "./pages/admin/AdminPanel";
import { Dashboard } from "./pages/admin/Dashboard";
import { AdminEstablishments } from "./pages/admin/AdminEstablishments";
import { AdminEstablishmentDetail } from "./pages/admin/AdminEstablishmentDetail";

export default function App() {
   return (
      <> 
         <BrowserRouter>
            <Routes>
               {/* Public routes */}
               <Route path="/" element={<Home />} />
               <Route path="/establishment/:id" element={<Establishment />} />   
               <Route path="/items/:id" element={<Tapas />} />

               {/* Admin routes */}
               <Route path="/admin" element={<AdminPanel />}>
                  <Route index element={<Dashboard />} />
                  <Route path="establishments" element={<AdminEstablishments />} />
                  <Route path="establishments/:id" element={<AdminEstablishmentDetail />} />
               </Route>
            </Routes>
         </BrowserRouter>
      </>
   );
}
