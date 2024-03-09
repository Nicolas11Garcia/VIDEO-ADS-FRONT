import { Alert, Button, Form, Input, Space } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../axios/axiosInstance";
import { LOGIN } from "../routes/Paths";

export const Register = () => {
  const navigate = useNavigate();
  //Password view button
  const [passwordVisible, setPasswordVisible] = useState(false);
  //Button Loading
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  //Alert error
  const [isErrorAlert, setIsErrorAlert] = useState(false);
  const [textErrorAlert, setTextErrorAlert] = useState("");

  const [form] = Form.useForm();

  const createUser = async () => {
    const formValues = form.getFieldsValue();

    const formData = new FormData();
    formData.append("name", formValues.name);
    formData.append("lastname", formValues.lastname);
    formData.append("email", formValues.email);
    formData.append("password", formValues.password);
    formData.append("password_confirmation", formValues.password);

    setIsLoadingButton(true);

    await axiosInstance
      .post("/api/register", formData)
      .then((response) => {
        navigate(LOGIN + '?i=1');
      })
      .catch((error) => {
        if (error.response.data.errors.email) {
          setIsErrorAlert(true);
          setTextErrorAlert("El email ya existe, intenta con otro");
        }
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
      onFinish={createUser}
    >
      <h2 className="text-4xl font-bold text-center mb-6">Registro</h2>

      {isErrorAlert && (
        <Alert
          className="mb-2"
          message={textErrorAlert}
          type="error"
          showIcon
        />
      )}

      {/* Name */}
      <Form.Item
        name="name"
        label="Nombre"
        rules={[
          { required: true, message: "Ingresa tu nombre" },
          { min: 2, message: "Minimo 2 caracteres" },
        ]}
      >
        <Input placeholder="Ingresa tu nombre" />
      </Form.Item>
      {/* Lastname */}
      <Form.Item
        name="lastname"
        label="Apellido"
        rules={[
          { required: true, message: "Ingresa tu apellido" },
          { min: 2, message: "Minimo 2 caracteres" },
          { whitespace: true, message: "Espacios no permitidos" },
        ]}
      >
        <Input placeholder="Ingresa tu apellido" />
      </Form.Item>
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
        <Space>
          <Button loading={isLoadingButton} htmlType="submit">
            Enviar
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
