import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import AppTest from './AppTest';


export default function App() {

   return (
      <>
      <div>
            <nav style={{ padding: 16 }}>
               <Link to="/">Home</Link>
            </nav>

            <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/test" element={<AppTest />} />
            </Routes>
         </div>
      </>
   );
}
