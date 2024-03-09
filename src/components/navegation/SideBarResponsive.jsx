import React, { useState } from "react";
import { Button, Drawer, Menu } from "antd";
import { DataUser } from "./DataUser";
import { useNavigate } from "react-router-dom";

export const SideBarResponsive = ({
  name,
  lastName,
  email,
  links,
  defaultOpenKeys,
}) => {
  const [open, setOpen] = useState(false);
  let navigate = useNavigate();

  const onClick = (e) => {
    navigate(e.key);
    setOpen(false);

  };

  //Desabilitar scroll al abrir el menu responsive
  const handleOpen = () => {
    setOpen(true);
    document.body.classList.add("overflow-hidden"); // Agrega la clase de Tailwind para deshabilitar el scroll
  };

  const handleClose = () => {
    setOpen(false);
    document.body.classList.remove("overflow-hidden"); // Elimina la clase de Tailwind para habilitar el scroll
  };

  return (
    <>
      {/* Button - Logo (Version movil) */}
      <div className="flex justify-between sm:hidden items-center px-6 h-[84px]">
        <div className="text-center">
          <a className="text-2xl font-bold">Logo</a>
        </div>
        <Button className="" type="primary" onClick={handleOpen}>
          Open
        </Button>
      </div>

      {/* Open menu */}
      <Drawer
        placement="left"
        onClose={handleClose}
        width={276}
        open={open}
        getContainer={false}
      >
        <div className="m-auto min-h-[calc(100dvh-50px)] flex flex-col justify-between">
          <Menu
            onClick={onClick}
            style={{
              width: 256,
            }}
            className="mt-6"
            defaultSelectedKeys={[location.pathname]}
            defaultOpenKeys={defaultOpenKeys}
            mode="inline"
            items={links}
          ></Menu>
          {/* Usuario Data Section */}
          <DataUser name={name} lastName={lastName} email={email} />
        </div>
      </Drawer>
    </>
  );
};
