// utils/auth.ts

// Save token to localStorage
export const saveToken = (token: string) => {
  localStorage.setItem("token", token);
};

// Retrieve token from localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// Check if user is logged in (token exists)
export const isLoggedIn = () => !!getToken();

// Remove token (logout)
export const logout = () => {
  localStorage.removeItem("token");
};
