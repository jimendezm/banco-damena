export function ValidateTime(){
    const loginTime = localStorage.getItem("loginTime");
    // Comprobar expiración
    const now = Date.now();
    const elapsed = now - parseInt(loginTime, 10);

    const ONE_HOUR = 60 * 60 * 1000;

    if (elapsed > ONE_HOUR) {
        // Sesión vencida → limpiar y redirigir
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("loginTime");
        return false;
    }
    return true
}