import { Menu } from "antd";
import React, { useEffect, useState } from "react";
import { SideBarResponsive } from "./SideBarResponsive";
//Routes
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import {
  LOGOUT,
  USUARIOSPRIVATE,
  VIDEOSPRIVATE
} from "../../routes/Paths";
import { LoadingScreen } from "../ui/LoadingScreen";
import { LogoutIcon } from "../ui/icons/LogoutIcon";
import { UsersIcon } from "../ui/icons/UsersIcon";
import { DataUser } from "./DataUser";
import { VideoIcon } from "../ui/icons/VideoIcon";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const links = [
  //
  getItem(
    //Nombre del
    <p className="title_menu_item">Videos</p>,
    VIDEOSPRIVATE,
    //Icons
    <div className="contenedor_icon_menu_item">
      <VideoIcon color="blue" className="tamaño_icon_menu_item" />
    </div>
  ),
];

const childParentMapping = {};
links.forEach((parent) => {
  if (parent.children) {
    parent.children.forEach((child) => {
      childParentMapping[child.key] = parent.key;
    });
  }
});

export const SideBar = ({ children }) => {
  let navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userLogged } = useAuthContext();
  const [name, setName] = useState("");
  const [lastName, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [isLoadingScreen, setisLoadingScreen] = useState(false);

  useEffect(() => {
    setisLoadingScreen(true);

    if (isAuthenticated) {
      if (userLogged != null) {
        setName(userLogged.name);
        setLastname(userLogged.lastname);
        setEmail(userLogged.email);
        setisLoadingScreen(false);
      }
    }
  }, [isAuthenticated, userLogged, navigate]);

  const defaultOpenKeys = location.pathname
    ? [childParentMapping[location.pathname]]
    : [];

  const onClick = (e) => {
    navigate(e.key);
  };

  if (isLoadingScreen) {
    return <LoadingScreen />;
  }

  return (
    <>
      {/* Menu pc, tablet */}
      <div
        className="hidden sm:flex min-h-[100dvh] fixed
       flex-col justify-between border-r border-gray-300"
      >
        <div>
          <div className="mt-6 mb-4 text-center pb-6 border-b border-gray-300">
            <a className="text-2xl font-bold">Logo</a>
          </div>
          <Menu
            onClick={onClick}
            style={{
              width: 256,
            }}
            className="px-2"
            defaultSelectedKeys={[location.pathname]}
            defaultOpenKeys={defaultOpenKeys}
            mode="inline"
            items={links}
          ></Menu>
        </div>


        {/* Usuario Data Section, Cerrar Sesión */}
        <div className="px-2">
          <Link to={LOGOUT} className="hover:bg-[#F0F0F0] cursor-pointer flex items-center rounded-[12px] h-[40px] mb-4 ">
            <div className="flex gap-2 items-center pl-[24px]">
              <div className="contenedor_icon_menu_item">
                <LogoutIcon size={24} color="blue" className="tamaño_icon_menu_item" />
              </div>
              <p className="title_menu_item text-black">Cerrar sesión</p>
            </div>
          </Link>
          <DataUser name={name} lastName={lastName} email={email} />
        </div>
      </div>

      {/* Menu movil */}
      <SideBarResponsive
        name={name}
        lastName={lastName}
        email={email}
        links={links}
        defaultOpenKeys={defaultOpenKeys}
      />
    </>
  );
};
