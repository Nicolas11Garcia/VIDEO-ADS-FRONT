import { Alert, Button, Form, Input } from "antd";
import React, { useState } from "react";
import { axiosInstance } from "../axios/axiosInstance";

export const RequestResetPassword = () => {
  const [form] = Form.useForm();
  //Button Loading
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  //Alert error
  const [isErrorAlert, setIsErrorAlert] = useState(false);
  const [textErrorAlert, setTextErrorAlert] = useState("");
  //Alert success
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);
  const [textSuccessAlert, setTextSuccessAlert] = useState("");

  const requestResetPassword = async () => {
    const formValues = form.getFieldsValue();

    const formData = new FormData();
    formData.append("email", formValues.email);

    setIsLoadingButton(true);

    await axiosInstance
      .post("/api/sendResetLink", formData)
      .then((response) => {
        setIsSuccessAlert(true);
        setIsErrorAlert(false);
        setTextSuccessAlert("Correo enviado, revisa tu bandeja de entrada");
      })
      .catch((error) => {
        setIsErrorAlert(true);
        setIsSuccessAlert(false);
        setTextErrorAlert("El correo no se encuentra en nuestros registros");
      })
      .finally(function () {
        setIsLoadingButton(false);
      });
  };

  return (
    <>
      <Form
        form={form}
        className="max-w-[400px] mx-auto pt-12"
        layout="vertical"
        onFinish={requestResetPassword}
      >
        <h2 className="text-4xl font-bold text-center">
          ¿Olvidaste tu contraseña?
        </h2>
        <p className="mb-6">
          Si el correo electrónico ingresado es válido te llegara un enlace en
          la bandeja de entrada, tienes 1 hora para utilizar el enlace!.
        </p>

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

        {/* Button */}
        <Form.Item className="mt-6">
          <Button loading={isLoadingButton} htmlType="submit">
            Enviar
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
