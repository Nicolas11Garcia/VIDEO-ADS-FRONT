import { Alert, Button, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { clearUrl } from "../helpers/clearUrl";
import { PRIVATE } from "../routes/Paths";

export const Login = () => {
  //navigate
  const navigate = useNavigate();
  //Context
  const { login, isAuthenticated } = useAuthContext();
  //View password button
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [form] = Form.useForm();
  //Button Loading
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  //Recien registrado el usuario
  const [recentlyRegistered, setRecentlyRegistered] = useState(false);
  //Alert error
  const [isErrorAlert, setIsErrorAlert] = useState(false);
  const [textErrorAlert, setTextErrorAlert] = useState("");
  //Alert success
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);
  const [textSuccessAlert, setTextSuccessAlert] = useState("");

  //Login
  const handleButtonLogin = async () => {
    const formValues = form.getFieldsValue();

    const formData = new FormData();

    formData.append("email", formValues.email);
    formData.append("password", formValues.password);

    setIsLoadingButton(true);

    const responseLogin = await login(formData);
    setIsLoadingButton(false);

    if (!responseLogin) {
      console.log("CREDENCIALES INCORRECTAS");
      return;
    } else if (responseLogin === "desactive") {
      console.log("USUARIO DESHABILITADO");
      return;
    }

    navigate(PRIVATE);
  };

  //Si ingresa al login desde la url pero esta autenticado que lo redirija al private
  useEffect(() => {
    if (isAuthenticated) {
      navigate(PRIVATE);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Función para obtener el valor del parámetro 'i' de la URL para decirle que se registro correctamente
    const getParamI = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const paramIValue = searchParams.get("i");

      if (paramIValue === "1") {
        clearUrl("i");
        setRecentlyRegistered(true);
      }
    };
    // Llama a la función para obtener el valor del parámetro 'i' al cargar la página
    getParamI();
  }, []);

  return (
    <>
      <Form
        form={form}
        className="max-w-[400px] mx-auto pt-12"
        layout="vertical"
        onFinish={handleButtonLogin}
      >
        <h2 className="text-4xl font-bold text-center mb-6">Iniciar sesión</h2>
        {recentlyRegistered && (
          <Alert
            className="mb-2"
            message="Usuario creado con exito"
            type="success"
            showIcon
          />
        )}

        {/* Email */}
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Ingresa tu email" },
            {
              pattern:
                /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\[[\t -Z^-~]*])/,
              message: "Email invalido",
            },
          ]}
        >
          <Input type="email" placeholder="Ingresa tu email" />
        </Form.Item>
        {/* Password */}
        <Form.Item
          name="password"
          label="Contraseña"
          rules={[
            { required: true, message: "Ingresa tu contraseña" },
            { min: 8, message: "Minimo 8 caracteres" },
          ]}
        >
          <Input.Password
            visibilityToggle={{
              visible: passwordVisible,
              onVisibleChange: setPasswordVisible,
            }}
            placeholder="Ingresa tu contraseña"
          />
        </Form.Item>
        {/* Button */}
        <Form.Item className="mt-6">
          <Button
            className="w-full h-[48px] bg-primary text-white hover:bg-black"
            loading={isLoadingButton}
            htmlType="submit"
          >
            Enviar
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
