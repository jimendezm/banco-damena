export function ValidateTime() {
    const loginTime = localStorage.getItem("loginTime");
    
    if (!loginTime) return false;

    const now = Date.now();
    const elapsed = now - parseInt(loginTime, 10);
    const ONE_HOUR = 60 * 60 * 1000;

    if (elapsed > ONE_HOUR) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("loginTime");
        localStorage.removeItem("identificacion");
        return false;
    }

    return true;
}
