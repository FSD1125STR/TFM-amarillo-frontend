import { useEffect, useState } from "react";
import { api } from "../api/client";

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
        <div style={{ padding: 16 }}>
            <h1>NEXTAPA</h1>
            {error && <p style={{ color: "crimson" }}>Error: {error}</p>}
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}