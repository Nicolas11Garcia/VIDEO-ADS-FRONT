import { useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";

export const Logout = () => {
  const { logout } = useAuthContext();

  var ubicacionPrincipal = "/";
  useEffect(() => {
    logout();
  }, []);
  return null;
};
