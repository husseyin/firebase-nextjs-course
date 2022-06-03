import { createContext, useContext, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import Login from "./components/Login";
import Loading from "./components/Loading";
import nookies from "nookies";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    return auth.onIdTokenChanged(async (user) => {
      if (!user) {
        console.log("no user");

        setCurrentUser(null);
        setLoading(false);
        nookies.set(undefined, "", token, {});

        return;
      }

      const token = await user.getIdToken();

      console.log("token", token);
      console.log("user", user);

      setCurrentUser(user);
      setLoading(false);
      nookies.set(undefined, "token", token, {});

    });
  }, []);

  if (loading) {
    return <Loading type="bubbles" color="yellowgreen" />;
  }
  if (!currentUser) {
    return <Login />;
  } else {
    return (
      <AuthContext.Provider value={{ currentUser }}>
        {children}
      </AuthContext.Provider>
    );
  }
};

export const useAuth = () => useContext(AuthContext);
