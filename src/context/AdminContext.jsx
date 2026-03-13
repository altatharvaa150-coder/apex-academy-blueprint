import { createContext, useContext, useState } from "react";

const AdminContext = createContext(null);

const ADMIN_PASSWORD = "admin123"; // Simple password — teacher sets this

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);

  const login = (password) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => setIsAdmin(false);

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
