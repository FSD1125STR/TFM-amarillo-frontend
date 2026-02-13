import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from "./pages/Home";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import Establishment from "./pages/Establishment";

export default function App() {
   return (
        <AuthProvider>
         <BrowserRouter>
            <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/login" element={<LoginPage />} />
               <Route path="/register" element={<RegisterPage />} />
               <Route path="/establishment/:id" element={<Establishment />} />   
            </Routes>
         </BrowserRouter>
      </AuthProvider>
   );
}