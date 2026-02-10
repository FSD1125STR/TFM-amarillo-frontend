import { useEffect, useState } from "react";
import { api } from "../api/client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
    const [data, setData] = useState(null)
    const [error, setError] = useState("")

    useEffect(() => {
        api
            .get("/health")
            .then((res) => setData(res.data))
            .catch((e) => setError(e.message))
    }, [])
    
 return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
      
      <Navbar />

      <main className="max-w-md mx-auto pb-28">
        <div className="p-4">
          <h2 className="text-xl font-bold">Home</h2>
          <p className="text-slate-500">
            Contenido principal de la app aquí
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}