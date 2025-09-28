import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import '../src/pages/Registro'
import Registro from '../src/pages/Registro'
import Login from './pages/Login'
import Restablecer from './pages/Restablecer'
import Recuperacion from './pages/Recuperacion'
import Tarjetas from './pages/Tarjetas'
import Dashboard from './pages/Dashboard'
import Cuentas from './pages/Cuentas';
import Transferencias from './pages/Transferencias';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/registro' element = {<Registro/>} />
        <Route path='/' element = {<Login/>} />
        <Route path='/restablecer' element = {<Restablecer/>} />
        <Route path='/recuperacion' element = {<Recuperacion/>} />
        <Route path="/Tarjetas/:idUsuario" element={<Tarjetas />} />
        <Route path="/Dashboard/:idUsuario" element={<Dashboard />} />
        <Route path="/Cuentas/:idUsuario" element={<Cuentas />} />
        <Route path="/Transferencias/:idUsuario" element={<Transferencias />} />
      </Routes>
    </BrowserRouter>
      
  )
}

export default App
