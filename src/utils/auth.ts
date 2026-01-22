export const getToken = () => {
  return localStorage.getItem("jwt");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
};

export const isLoggedIn = () => {
  return !!getToken();
};

export const logout = () => {
  localStorage.removeItem("jwt");
  localStorage.removeItem("currentUser");
};
