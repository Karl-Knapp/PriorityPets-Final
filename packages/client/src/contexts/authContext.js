import { createContext, useState, useEffect } from "react";

export const authContext = createContext();

const getUser = localStorage.getItem("PriorityUser");

let initialAuthState;

if (getUser === null) {
  initialAuthState = {
    isAuthenticated: false,
    user: null,
  };
} else {
  initialAuthState = JSON.parse(getUser);
}

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(initialAuthState);

  useEffect(() => {
    localStorage.setItem("PriorityUser", JSON.stringify(auth));

    return () => {};
  }, [auth]);

  return <authContext.Provider value={{ auth, setAuth }}>{children}</authContext.Provider>;
};

export default AuthProvider;
