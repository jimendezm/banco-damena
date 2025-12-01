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