import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authAPI } from "../api/services";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null"),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    authAPI
      .me()
      .then((res) => {
        const u = res.data.data || res.data.user;
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token, user: u } = res.data.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (name, email, password, profession) => {
    const res = await authAPI.register({ name, email, password, profession });
    const { token, user: u } = res.data.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const isAdmin = user?.role === "admin";
  const isEditor = user?.role === "editor";
  const isUser = user?.role === "user";

  const requestEditorRole = useCallback(
    async (profession) => {
      const res = await authAPI.requestEditor({ profession });
      const updated = { ...user, editorRequest: res.data.data.editorRequest };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      return res.data;
    },
    [user],
  );

  const updateAvatar = useCallback(
    async (file) => {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await authAPI.uploadAvatar(formData);
      const updated = { ...user, avatar: res.data.data.avatar };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    },
    [user],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        requestEditorRole,
        updateAvatar,
        isAdmin,
        isEditor,
        isUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
