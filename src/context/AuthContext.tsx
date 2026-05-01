import { createContext, useContext,  useEffect,  useState } from "react";

interface AuthContextType {
  user: any;
  token: string | null;
  isLoggedIn: boolean;
  loginUser: (user: any, token: string) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const isLoggedIn = !!token;

  const loginUser = (userData: any, jwt: string) => {
    setUser(userData);
    setToken(jwt);
    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(userData)); 
  };

  const logoutUser = async () => {
    try {
      await fetch("http://localhost:3000/users/sign_out", {
        method: "DELETE",
        headers: {
          Authorization: token || "",
        },
      });
    } catch (err) {
      console.log("Logout API failed");
    }

    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isLoggedIn, loginUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;