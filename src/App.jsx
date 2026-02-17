import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Establishment from "./pages/Establishment";
import Tapas from "./pages/Tapas";

export default function App() {
   return (
      <> 
         <BrowserRouter>
            <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/establishment/:id" element={<Establishment />} />   
               <Route path="/tapas/:id" element={<Tapas />} />
            </Routes>
         </BrowserRouter>
    </>
   )

}
