import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import Registro from './pages/Registro'
import Login from './pages/Login'
import Restablecer from './pages/Restablecer'
import Recuperacion from './pages/Recuperacion'
import UnifiedLayout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/registro' element={<Registro/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/restablecer' element={<Restablecer/>} />
        <Route path='/recuperacion' element={<Recuperacion/>} />
        <Route path='/' element={<Navigate to="/login" replace />} />
        <Route path="/dashboard/*" element={<UnifiedLayout />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App