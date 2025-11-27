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
            id: data?.data?.id || null

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