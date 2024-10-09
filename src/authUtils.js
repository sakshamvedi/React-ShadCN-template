// authUtils.js

export const getUserData = () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
};

export const isAuthenticated = () => {
    return !!getUserData();
};

export const logout = () => {
    localStorage.removeItem('userData');
    // Additional logout logic (e.g., redirecting to login page)
};