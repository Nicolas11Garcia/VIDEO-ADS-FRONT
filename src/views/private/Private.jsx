import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {  VIDEOSPRIVATE } from "../../routes/Paths";

export const Private = () => {
  //navigate
  const navigate = useNavigate();

  useEffect(() => {
    return navigate(VIDEOSPRIVATE);
  }, []);

  return <div>Cargando...</div>;
};
