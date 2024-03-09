import { BrowserRouter, Route, Routes } from "react-router-dom";
//Diseño
import { ConfigProvider } from "antd";
import 'video-react/dist/video-react.css';

//PATH ROUTES
import {
  LOGIN,
  LOGOUT,
  PRIVATE,
  REGISTER,
  REQUERSTRESETPASSWORD,
  RESETPASSWORD,
  USUARIOSPRIVATE,
  VERVIDEO,
  VIDEOSPRIVATE
} from "./routes/Paths";

//AuthProvider
import { AuthProvider } from "./context/AuthContext";

//Public Views
import { Login } from "./views/Login";
import { Register } from "./views/Register";
import { RequestResetPassword } from "./views/RequestResetPassword";

//Private Views
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { ResetPassword } from "./views/ResetPassword";
import { Logout } from "./views/private/Logout";
import { Private } from "./views/private/Private";
import { Usuarios } from "./views/private/Usuarios";
import { VideosPrivate } from "./views/private/VideosPrivate";
import { Home } from "./views/Home";
import { VideoDetalles } from "./views/VideoDetalles";

function App() {
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "Inter",
            colorText: "#1F1F1F"
          },
          components: {
            Menu: {
              itemSelectedBg: "#C6D4FF",
              itemSelectedColor: "#1E40AF",
              colorBgElevated: "#1E40AF",
            },
            Input: {
              colorPrimary: "#1E40AF",
              colorBorder: "#D1D5DB",
              colorTextPlaceholder: "#9CA3AF",
              algorithm: true, // Enable algorithm
              paddingBlock: 12,
              paddingInline: 16,
              borderRadius: 12,
            },
            Select: {
              colorPrimary: "#1E40AF",
              colorBorder: "#D1D5DB",
              colorTextPlaceholder: "#9CA3AF",
              algorithm: true, // Enable algorithm
              paddingBlock: 12,
              paddingInline: 16,
              borderRadius: 12,
            },
            Button: {
              borderRadius: 12,
              defaultHoverBorderColor: null,
              defaultHoverBg: null,
              defaultShadow: null,
              defaultHoverColor: null,
            }

          },
        }}
      >
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home/>}></Route>
              <Route path={LOGIN} element={<Login />}></Route>
              <Route path={REGISTER} element={<Register />}></Route>
              <Route
                path={REQUERSTRESETPASSWORD}
                element={<RequestResetPassword />}
              ></Route>
              <Route path={RESETPASSWORD} element={<ResetPassword />}></Route>
              <Route path={VERVIDEO} element={<VideoDetalles/>}/>

              <Route path={PRIVATE} element={<ProtectedRoute />}>
                <Route path={PRIVATE} element={<Private />}></Route>
                <Route path={LOGOUT} element={<Logout />}></Route>
                <Route path={USUARIOSPRIVATE} element={<Usuarios />}></Route>
                <Route path={VIDEOSPRIVATE} element={<VideosPrivate />}></Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ConfigProvider>
    </>
  );
}

export default App;
