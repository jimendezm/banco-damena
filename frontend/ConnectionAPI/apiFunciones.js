const API_KEY = '$2b$10$cscnlmoOwCR4EKSkiq7TBuwQTOO9LTFM.iRTdKOFxXP9bcFmQRIZK'
export async function IniciarSesion(username_or_email, password){

    try{
        const response = await fetch("https://bdproyectoweb-3.onrender.com/api/v1/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY
            },
            body: JSON.stringify({
                username_or_email,
                password
            })
        });
        const data = await response.json();
        return {
            success: response.ok,
            status: data.status,
            message: data.message,
            token: data?.data?.token || null,
            expiresIn: data?.data?.expiresIn || null,
            id: data?.data?.id || null,
            identificacion: data?.data?.identificacion || null

        }
    }catch(error){
        console.error("Error en IniciarSesion():", error);
        return { success: false, message: "No se pudo conectar con el servidor." };
    }
}

export async function RegistrarUsuario(tipo_identificacion, identificacion, nombre, apellido, correo, telefono, usuario, contrasena, rol){
    console.log("ok");
    try{
        const response = await fetch("https://bdproyectoweb-3.onrender.com/api/v1/users/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY
            },
            body: JSON.stringify({
                tipo_identificacion,
                identificacion,
                nombre,
                apellido,
                correo,
                telefono,
                usuario,
                contrasena,
                rol
            })
        });
        const data = await response.json();
        return {
            success: response.ok,
            status: data.status,
            message: data.message,
            userId: data?.data?.userId || null,
        }

    }catch(error){
        console.error("Error en RegistrarUsuario: ", error);
        return { success: false, message: "No se pudo conectar con el servidor." };
    }
}

export async function ObtenerDatosUsuario(userId, token){
    try{
        const response = await fetch(`https://bdproyectoweb-3.onrender.com/api/v1/users/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY,
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        console.log("Respuesta de ObtenerDatosUsuario:", data.nombre);
        return {
            success: response.ok,
            status: data.status,
            message: data.message,
            userData: data || null,
        }
        
    }catch(error){
        console.error("Error en ObtenerDatosUsuario: ", error);
        return { success: false, message: "No se pudo conectar con el servidor." };
    }
}
export async function ObtenerTarjetasUsuario(userId, token){
    try{
        const response = await fetch(`https://bdproyectoweb-3.onrender.com/api/v1/cards`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY,
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        return {
            success: response.ok,
            status: data.status,
            message: data.message,
            tarjetas: data.data.cards || null,
        }
        
    }catch(error){
        console.error("Error en ObtenerTarjetasUsuario: ", error);
        return { success: false, message: "No se pudo conectar con el servidor." };
    }
}

export async function generateOTP(idTarjeta, token){
    try{

        const response = await fetch(`https://bdproyectoweb-3.onrender.com/api/v1/cards/${idTarjeta}/otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY,
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                
            })
        });
        const data = await response.json();
        return {
            success: response.ok,
            status: data.status,
            message: data.message,
            otp: data.data.otp || null,
        }
        
    }catch(error){
        console.error("Error en generateOTP: ", error);
        return { success: false, message: "No se pudo conectar con el servidor." };
    }
}

export async function ValidarOTP(email, otp, token){
    try{
        const response = await fetch(`https://bdproyectoweb-3.onrender.com/api/v1/auth/verify-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY,
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                email,
                otp
            })
        });
        const data = await response.json();
        return {
            success: response.ok,
            status: data.status,
            message: data.message,
            valid: data.data.valid || null,
        }
        
    }catch(error){
        console.error("Error en ValidarOTP: ", error);
        return { success: false, message: "No se pudo conectar con el servidor." };
    }
}


export async function ObtenerTransaccionesTarjeta(idTarjeta, token){
    console.log("ObtenerTransaccionesTarjeta llamado con idTarjeta:", idTarjeta);
    try{
        const response = await fetch(`https://bdproyectoweb-3.onrender.com/api/v1/cards/${idTarjeta}/movements`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY,
                "Authorization": `Bearer ${token}`
            }
        });
        console.log("Respuesta de ObtenerTransaccionesTarjeta:", response);
        const data = await response.json();
        return {
            success: response.ok,
            movimientos: data.data.items || null,
        }
        
    }catch(error){
        console.error("Error en ObtenerTransaccionesTarjeta: ", error);
        return { success: false, message: "No se pudo conectar con el servidor." };
    }
}
export async function ObtenerCuentasUsuario(idCuenta,token) {
    try {
        idCuenta = idCuenta || "";
        const response = await fetch(`https://bdproyectoweb-3.onrender.com/api/v1/accounts/${idCuenta}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY,
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        console.log("Respuesta de ObtenerCuentasUsuario:", data);
        return {
            success: response.ok,
            status: data.status,
            message: data.message,
            cuentas: data.data || null,
        };
        
    } catch(error) {
        console.error("Error en ObtenerCuentasUsuario: ", error);
        return { success: false, message: "No se pudo conectar con el servidor." };
    }
}

export async function ObtenerDetallesCuenta(idCuenta,token) {
    try {
        const response = await fetch(`https://bdproyectoweb-3.onrender.com/api/v1/accounts/${idCuenta}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY,
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        console.log("Respuesta de ObtenerDetallesCuenta:", data);
        return {
            success: response.ok,
            status: data.status,
            message: data.message,
            cuenta: data.data || null,
        };
        
    } catch(error) {
        console.error("Error en ObtenerDetallesCuenta: ", error);
        return { success: false, message: "No se pudo conectar con el servidor." };
    }
}

export async function BuscarCuentasTerceros(searchTerm, token) {
    try {
        const response = await fetch(`https://bdproyectoweb-3.onrender.com/api/v1/accounts/search?q=${encodeURIComponent(searchTerm)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY,
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        return {
            success: response.ok,
            status: data.status,
            message: data.message,
            cuentas: data.data || null,
        };
        
    } catch(error) {
        console.error("Error en BuscarCuentasTerceros: ", error);
        return { success: false, message: "No se pudo conectar con el servidor." };
    }
}

export async function CrearTransferenciaInterna(transferData, token) {
    try {
        const response = await fetch("https://bdproyectoweb-3.onrender.com/api/v1/transfers/internal", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY,
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(transferData)
        });
        const data = await response.json();
        return {
            success: response.ok,
            status: data.status,
            message: data.message,
            data: data.data || null,
            error_code: data.error_code || null,
            http_code: data.http_code || null
        };
        
    } catch(error) {
        console.error("Error en CrearTransferenciaInterna: ", error);
        return { 
            success: false, 
            message: "No se pudo conectar con el servidor.",
            http_code: 500,
            error_code: 'NETWORK_ERROR'
        };
    }
}