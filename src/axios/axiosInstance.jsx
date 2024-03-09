import axios from "axios";
import { LOGOUT } from "../routes/Paths";

//Desarrollo
//export const baseURL = "http://127.0.0.1:8000";

//Desarrollo Nodejs
//export const baseURL = "http://localhost:3000";

// Producción
export const baseURL = "https://video-ads-back-node.onrender.com";

async function getAccessToken() {
  return localStorage.getItem("token");
}

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

//añadir el token en cada peticion
axiosInstance.interceptors.request.use(
  async (req) => {
    const access_token = await getAccessToken();

    if (access_token) {
      req.headers["Authorization"] = "Bearer " + access_token;
    }

    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//Funcion que ejecuta algo cuando la respuesta de la api son las que estan dentro de los if
axiosInstance.interceptors.response.use(
  (response) => {
    if (
      response.data.message === "Token expirado" ||
      response.data.message === "Token inválido" ||
      response.data.message === "Token no encontrado"
    ) {
      window.location.href = LOGOUT;
    }
    return response;
  },
  async (error) => {
    if (
      error.response.data.message === "Token expirado" ||
      error.response.data.message === "Token inválido" ||
      error.response.data.message === "Token inválido"
    ) {
      window.location.href = LOGOUT;
    } else {
    }
    return Promise.reject(error);
  }
);
