import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import Registro from './pages/Registro'
import Login from './pages/Login'
import Restablecer from './pages/Restablecer'
import Recuperacion from './pages/Recuperacion'
import Layout from './components/Layout';
import PaginaPrincipal from './pages/PaginaPrincipal';
import Cuentas from './pages/Cuentas';
import Tarjetas from './pages/Tarjetas';
import Transferencias from './pages/Transferencias';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas sin layout */}
        <Route path='/registro' element={<Registro/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/restablecer' element={<Restablecer/>} />
        <Route path='/recuperacion' element={<Recuperacion/>} />
        <Route path='/' element={<Navigate to="/login" replace />} />
        
        {/* Rutas protegidas CON layout */}
        <Route path="/dashboard" element={<Layout><PaginaPrincipal /></Layout>} />
        <Route path="/dashboard/cuentas" element={<Layout><Cuentas /></Layout>} />
        <Route path="/dashboard/tarjetas" element={<Layout><Tarjetas /></Layout>} />
        <Route path="/dashboard/transferencias" element={<Layout><Transferencias /></Layout>} />
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App