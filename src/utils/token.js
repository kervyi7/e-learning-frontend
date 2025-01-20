export const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

// Функция для получения пользователя из токена
export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = decodeToken(token);
    if (decoded) {
      return {
        firstName: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"],
        lastName: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"],
        role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        username: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      };
    }
  }
  return null;
};