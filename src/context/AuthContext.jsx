import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../axios/axiosInstance";
const MY_AUTH_APP = "SESSION_ACTIVE";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem(MY_AUTH_APP)
      ? localStorage.getItem(MY_AUTH_APP)
      : false
  );
  const [userLogged, setUserLogged] = useState(null);

  const logout = useCallback(function () {
    localStorage.removeItem(MY_AUTH_APP);
    localStorage.removeItem("token");
    localStorage.removeItem("u");
    setUserLogged(null);
    setIsAuthenticated(false);
  }, []);

  const getUser = useCallback(async function () {
    let id_user = localStorage.getItem("u");

    //let response = await axiosInstance.get(`/api/getUserId/${id_user}`);
    let response = await axiosInstance.get(`/users/getUserId/${id_user}`);

    setUserLogged(response.data);
  }, []);

  const login = async (values) => {
    let logged = false;

    await axiosInstance
      //.post("/api/login", values)
      .post("/auth/login", values)
      .then((response) => {
        localStorage.setItem(MY_AUTH_APP, true);

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("u", response.data.usuario);

        setIsAuthenticated(true);

        getUser();

        logged = true;
      })
      .catch((error) => {
        console.log(error);
        if(error.response.data.error === "Usuario deshabilitado"){
          logged = "desactive";
        }
      })
      .finally(function () {});

    return logged;
  };

/*   useEffect(() => {
    async function checkToken() {
      if (localStorage.getItem("token")) {
        await axiosInstance
          .post("/api/validateToken")
          .then((response) => {})
          .catch((error) => {
            localStorage.removeItem("token");
            localStorage.removeItem("u");
            setUserData(null);
            setIsAuthenticated(false);
          })
          .finally(function () {});
      }
    }
    checkToken();
  }, []); */

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token !== null) {
      getUser();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ login, userLogged, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext() {
  return useContext(AuthContext);
}
