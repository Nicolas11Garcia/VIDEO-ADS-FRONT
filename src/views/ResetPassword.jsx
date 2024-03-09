import { Alert, Button, Form, Input } from "antd";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../axios/axiosInstance";

export const ResetPassword = () => {
  //Password view button
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisibleConfirmed, setPasswordVisibleConfirmed] =
    useState(false);
  //Button Loading
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  //Token
  const { token } = useParams();
  //Alert error
  const [isErrorAlert, setIsErrorAlert] = useState(false);
  const [textErrorAlert, setTextErrorAlert] = useState("");
  //Alert success
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);
  const [textSuccessAlert, setTextSuccessAlert] = useState("");

  const [form] = Form.useForm();

  const resetPassword = async () => {
    const formValues = form.getFieldsValue();

    const formData = new FormData();
    formData.append("token", token);
    formData.append("password", formValues.password);
    formData.append("password_confirmation", formValues.passwordConfirmed);

    setIsLoadingButton(true);

    await axiosInstance
      .post("/api/resetPassword", formData)
      .then((response) => {
        setIsSuccessAlert(true);
        setIsErrorAlert(false);
        setTextSuccessAlert("Contraseña cambiada con exito");
      })
      .catch((error) => {
        setIsErrorAlert(true);
        setIsSuccessAlert(false);
        setTextErrorAlert(
          "El enlace no es válido o expiró, debes solicitar un nuevo enlace."
        );
      })
      .finally(function () {
        setIsLoadingButton(false);
      });
  };

  return (
    <Form
      form={form}
      className="max-w-[400px] mx-auto pt-12"
      layout="vertical"
      onFinish={resetPassword}
    >
      <h2 className="text-4xl font-bold text-center mb-6">
        Cambio de contraseña
      </h2>

      {/*ALERTS*/}
      {isErrorAlert && (
        <Alert
          className="mb-2"
          message={textErrorAlert}
          type="error"
          showIcon
        />
      )}

      {isSuccessAlert && (
        <Alert
          className="mb-2"
          message={textSuccessAlert}
          type="success"
          showIcon
        />
      )}

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

      {/* Confirmed Password */}
      <Form.Item
        name="passwordConfirmed"
        label="Confirm Password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Por favor confirma tu contraseña",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Las contrasñeas no coinciden"));
            },
          }),
        ]}
      >
        <Input.Password
          visibilityToggle={{
            visible: passwordVisible,
            onVisibleChange: setPasswordVisibleConfirmed,
          }}
          placeholder="Confirma tu contraseña"
        />
      </Form.Item>

      {/* Button */}
      <Form.Item className="mt-6">
        <Button loading={isLoadingButton} htmlType="submit">
          Enviar
        </Button>
      </Form.Item>
    </Form>
  );
};
