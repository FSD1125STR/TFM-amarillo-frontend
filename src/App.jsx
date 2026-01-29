import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'

export default function App() {

  return (
    <>
      <div>
        <nav style={{ padding: 16 }}>
          <Link to="/">Home</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </>
  )
}
