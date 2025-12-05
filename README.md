# Banco Damena - Plataforma de Banca Digital

## 📋 Descripción del Proyecto

**Banco Damena** es una aplicación web de banca digital desarrollada con **React** en el frontend y un backend API REST. La plataforma ofrece a los usuarios una interfaz moderna y segura para gestionar sus cuentas, tarjetas y realizar operaciones financieras básicas.

---

## 🎯 Objetivos Logrados

### ✅ Autenticación y Autorización
- **Login seguro**: Implementación de autenticación con credenciales (usuario/contraseña)
- **Tokens JWT**: Integración con API para manejo seguro de sesiones
- **Recuperación de contraseña**: Funcionalidad completa de recuperación y restablecimiento de contraseña
- **Registro de usuarios**: Sistema de registro con validaciones
- **Gestión de sesiones**: Control de tiempo de sesión y cierre automático por inactividad
- **Almacenamiento seguro**: Tokens y datos de usuario en localStorage con validaciones

### ✅ Conexión con API
- **Integración API REST**: Conexión exitosa con backend en endpoints principales
- **Funciones centralizadas**: Módulo `apiFunciones.js` con todas las peticiones HTTP
- **Manejo de errores**: Respuestas de error controladas y alertas al usuario
- **Headers seguros**: Configuración correcta de headers con autorización Bearer Token
- **Endpoints funcionales**:
  - `POST /login` - Autenticación de usuarios
  - `POST /register` - Registro de nuevos usuarios
  - `POST /forgot-password` - Recuperación de contraseña
  - `GET /cuentas` - Obtener cuentas del usuario
  - `GET /tarjetas` - Obtener tarjetas del usuario
  - `GET /usuario` - Obtener datos del usuario

### ✅ Validaciones Completas
- **Validación de campos**: Email, contraseña, usuario en formularios
- **Reglas de contraseña**: Mínimo de caracteres, combinación de mayúsculas, minúsculas y números
- **Validación de tokens**: Verificación de token al cargar la aplicación
- **Validación de sesión**: Control de tiempo de inactividad
- **Mensajes de error claros**: Feedback visual al usuario sobre errores de validación
- **Validación de datos del servidor**: Manejo de respuestas inválidas o vacías

### ✅ Dashboard y Interfaz
- **Dashboard principal**: Panel con resumen de cuentas y tarjetas
- **Página de Cuentas**: Visualización de todas las cuentas con saldos
- **Página de Tarjetas**: Gestión completa de tarjetas de débito/crédito
- **Sidebar navegable**: Menú lateral con acceso a todas las secciones
- **Diseño responsivo**: Estilos CSS modulares y adaptables
- **Sistema de alertas**: Componentes Alert y AlertConfirm para notificaciones

### ✅ Seguridad
- **Limpieza de sesión**: Eliminación de datos al logout
- **Rutas protegidas**: Layout con validación de autenticación
- **Control de permisos**: Verificación de usuario autenticado
- **Validación de tiempo de sesión**: Cierre automático de sesión expirada

---

## ❌ Objetivos No Logrados

### 🔴 Transferencias Interbancarias
- **Estado del backend**: ✅ Implementado completamente en el servidor
- **Estado del frontend**: ❌ No finalizado

#### Detalles del problema:
- **Endpoint disponible**: `POST /transferencias` está funcional en el backend
- **Falta de implementación frontend**: 
  - El componente `Transferencias.jsx` está creado pero no tiene la lógica de conexión
  - No hay función en `apiFunciones.js` para conectar con el endpoint de transferencias
  - Falta integración del formulario con los datos del usuario (cuentas origen/destino)
  - No hay validación de saldo disponible antes de la transferencia
  - Falta gestión de errores específicos para transferencias

#### Pasos para completar la implementación:
1. Crear función `realizarTransferencia()` en `ConnectionAPI/apiFunciones.js`
2. Implementar formulario en `pages/Transferencias.jsx` con campos:
   - Cuenta origen (select con cuentas del usuario)
   - Cuenta destino (input IBAN o número de cuenta)
   - Monto de transferencia
   - Concepto
3. Agregar validaciones:
   - Verificar saldo suficiente
   - Validar formato IBAN
   - Validar que no sea la misma cuenta
4. Implementar manejo de respuestas y alertas
5. Actualizar saldos tras transferencia exitosa

#### Código de ejemplo para `apiFunciones.js`:
```javascript
export const RealizarTransferencia = async (cuentaOrigen, cuentaDestino, monto, concepto) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/transferencias`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    cuentaOrigen,
                    cuentaDestino,
                    monto,
                    concepto
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error en la transferencia");
        }

        return await response.json();
    } catch (error) {
        console.error("Error al realizar transferencia:", error);
        throw error;
    }
};
```

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 19.1.1** - Librería de UI
- **React Router DOM 7.9.3** - Enrutamiento
- **Vite 7.2.6** - Build tool y dev server
- **React Icons 5.5.0** - Iconos
- **CSS Modules** - Estilos encapsulados
- **Dotenv 17.2.3** - Variables de entorno

### Backend (Referencia)
- API REST con autenticación JWT
- Endpoints para autenticación, cuentas, tarjetas y transferencias

---

## 📁 Estructura del Proyecto

```
banco-damena/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Registro.jsx
│   │   │   ├── Recuperacion.jsx
│   │   │   ├── Restablecer.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Cuentas.jsx
│   │   │   ├── Tarjetas.jsx
│   │   │   └── Transferencias.jsx (⚠️ Pendiente de completar)
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Alert.jsx
│   │   │   └── AlertConfirm.jsx
│   │   ├── services/
│   │   │   └── userService.js
│   │   ├── styles/
│   │   │   └── (archivos CSS modulares)
│   │   └── App.jsx
│   ├── ConnectionAPI/
│   │   └── apiFunciones.js
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🚀 Instrucciones de Instalación

### Requisitos previos
- Node.js v18 o superior
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>

# Navegar al directorio frontend
cd banco-damena/frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear archivo .env en la raíz de frontend
echo "VITE_API_URL=http://localhost:3000/api" > .env
```

### Ejecutar en desarrollo
```bash
npm run dev
```

### Construir para producción
```bash
npm run build
```

---

## 📝 Características Principales

### Autenticación
- ✅ Inicio de sesión con usuario/contraseña
- ✅ Registro de nuevos usuarios
- ✅ Recuperación de contraseña
- ✅ Restablecimiento de contraseña
- ✅ Manejo de tokens JWT

### Gestión de Cuentas
- ✅ Visualización de cuentas bancarias
- ✅ Consulta de saldos
- ✅ Historial de movimientos (backend)

### Gestión de Tarjetas
- ✅ Visualización de tarjetas
- ✅ Información de tarjetas (últimos 4 dígitos, tipo)
- ✅ Estado de la tarjeta

### Transferencias
- ❌ Transferencias interbancarias (No completado en frontend)
- ⚠️ Backend implementado, falta conexión y formulario

---

## 🔐 Seguridad

### Implementaciones de seguridad incluidas:
- Autenticación con JWT
- Headers de autorización en peticiones
- Validación de tokens en frontend
- Control de sesiones
- Limpieza de datos sensibles al logout
- Validaciones en formularios
- Manejo seguro de errores

### Recomendaciones para producción:
- Implementar HTTPS obligatorio
- Configurar CORS correctamente
- Usar cookies HttpOnly para tokens (opcional, más seguro que localStorage)
- Implementar rate limiting en backend
- Validar todas las entradas en servidor
- Usar variables de entorno para URLs sensibles

---

## 🐛 Problemas Conocidos y Limitaciones

1. **Transferencias interbancarias**: No está completamente integrada en el frontend (ver sección de "Objetivos No Logrados")
2. **Almacenamiento local**: Se usa localStorage; considerar mejorar con cookies seguras
3. **Caché de datos**: No hay implementación de caché, cada recarga de página consulta la API
4. **Validación en tiempo real**: Algunas validaciones solo ocurren al enviar el formulario

---

## 📞 Soporte y Contacto

Para reportar bugs o sugerencias, contactar al equipo de desarrollo.

---

## 📄 Licencia

Este proyecto es propiedad de Banco Damena. Todos los derechos reservados.

---

## ✏️ Última actualización

**Fecha**: 5 de diciembre de 2025  
**Versión**: 1.0.0  
**Estado**: En desarrollo

---

## 🎓 Notas para el equipo de desarrollo

### Próximas prioridades:
1. ⚠️ **Completar transferencias interbancarias** (HIGH PRIORITY)
2. Implementar histórico de transacciones
3. Mejorar sistema de notificaciones
4. Agregar autenticación multi-factor (2FA)
5. Optimizar rendimiento con React Query o SWR

### Recursos útiles:
- Documentación de API: Consultar en backend
- Guía de estilos: Ver carpeta `styles/`
- Componentes reutilizables: Ver carpeta `components/`
