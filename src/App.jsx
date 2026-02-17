import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Establishment from "./pages/Establishment";

export default function App() {
   return (
      <> 
         <BrowserRouter>
            <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/establishment/:id" element={<Establishment />} />   
            </Routes>
         </BrowserRouter>
      </>
   );

}
