import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Space,
  Select,
  message,
  Skeleton,
} from "antd";
import { axiosInstance } from "../../../axios/axiosInstance";

export const ModalCUUsuarios = forwardRef((props, ref) => {
  const [id, setId] = useState("");
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  //Loadings
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [form] = Form.useForm();

  const childFunction = async (id, action) => {
    setOpen(true);
    if (action === "Edit") {
      setId(id);
      setIsEdit(true);
      setIsLoadingData(true);
      form.resetFields();
      await axiosInstance
        .get("/api/getUserId/" + id)
        .then((response) => {
          form.setFieldsValue({
            name: response.data.name,
            lastname: response.data.lastname,
            email: response.data.email,
            role: response.data.role,
          });
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(function () {
          setIsLoadingData(false);
        });
    } else {
      form.resetFields();
      setIsEdit(false)
    }
  };

  useImperativeHandle(ref, () => ({
    childFunction,
  }));

  const createUser = async () => {
    const formValues = form.getFieldsValue();

    const formData = new FormData();
    formData.append("name", formValues.name);
    formData.append("lastname", formValues.lastname);
    formData.append("email", formValues.email);
    formData.append("role", formValues.role);

    setIsLoadingButton(true);

    await axiosInstance
      .post("/api/createUser", formData)
      .then((response) => {
        message.success("Usuario creado con exito");
        form.resetFields();
        setOpen(false);
        props.reloadTable();
      })
      .catch((error) => {
        if (error.response.data.errors.email) {
          message.error("El email ingresado ya existe");
        }
      })
      .finally(function () {
        setIsLoadingButton(false);
      });
  };

  const updateUser = async () => {
    const formValues = form.getFieldsValue();

    const formData = new FormData();
    formData.append("name", formValues.name);
    formData.append("lastname", formValues.lastname);
    formData.append("role", formValues.role);

    setIsLoadingButton(true);

    await axiosInstance
      .put("/api/updateUser/"+id, formData)
      .then((response) => {
        message.success("Usuario editado con exito");
        form.resetFields();
        setOpen(false);
        props.reloadTable();
      })
      .catch((error) => {
        console.log(error.response)
        if (error.response.data.errors.email) {
          message.error("El email ingresado ya existe");
        }
      })
      .finally(function () {
        setIsLoadingButton(false);
      });
  };

  function skeletonsLoading() {
    return (
      <div className="grid grid-cols-1 gap-y-8 pt-4">
        <Skeleton.Input active style={{ width: "100%", height: 48, borderRadius: 12 }} />
        <Skeleton.Input active style={{ width: "100%", height: 48, borderRadius: 12 }} />
        <Skeleton.Input active style={{ width: "100%", height: 48, borderRadius: 12 }} />

        <div className="flex justify-end">
          <Space>
            <Skeleton.Button active style={{ width: 90 , height: 44, borderRadius: 12 }} />
            <Skeleton.Button active style={{ width: 137 , height: 44, borderRadius: 12 }} />
          </Space>
        </div>
      </div>
    );
  }

  return (
    <Modal
      title={isEdit ? "Editar Usuario" : "Agregar Usuario"}
      centered
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
    >
      {isLoadingData ? (
        skeletonsLoading()
      ) : (
        <Form
          form={form}
          className="pt-4"
          layout="vertical"
          onFinish={isEdit ? updateUser : createUser}
        >
          {/* Nombre */}
          <Form.Item
            hasFeedback
            name="name"
            label="Nombre"
            rules={[
              { required: true, message: "Ingresa nombre" },
              { min: 2, message: "Minimo 2 caracteres" },
            ]}
          >
            <Input value="asdsadsadsa" placeholder="Ingresa nombre" />
          </Form.Item>

          {/* Apellido */}
          <Form.Item
            hasFeedback
            name="lastname"
            label="Apellido"
            rules={[
              { required: true, message: "Ingresa apellido" },
              { min: 2, message: "Minimo 2 caracteres" },
            ]}
          >
            <Input value="asdsadsadsa" placeholder="Ingresa apellido" />
          </Form.Item>

          {/* Email */}
          {!isEdit && (
            <Form.Item
              hasFeedback
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Ingresa email" },
                {
                  pattern:
                    /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\[[\t -Z^-~]*])/,
                  message: "Email invalido",
                },
              ]}
            >
              <Input type="email" placeholder="Ingresa email" />
            </Form.Item>
          )}
          {/* Rol */}
          <Form.Item
            hasFeedback
            name="role"
            label="Rol"
            rules={[
              {
                required: true,
                message: "Ingresa el rol del usuario",
              },
            ]}
          >
            <Select
              hasFeedback
              name="role"
              placeholder="Selecciona rol"
              options={[
                {
                  value: "user",
                  label: "Usuario",
                },
                {
                  value: "admin",
                  label: "Administrador",
                },
              ]}
            ></Select>
          </Form.Item>

          {/* Password */}
          {!isEdit && (
            <Form.Item label="Contraseña">
              <p>
                La contraseña se generará automáticamente después de guardar al
                usuario.
              </p>
            </Form.Item>
          )}

          {/* Button */}
          <Form.Item className="m-0 mt-12 p-0 flex justify-end">
            <Space>
              <Button onClick={() => setOpen(false)}>Cancelar</Button>
              <Button loading={isLoadingButton} htmlType="submit">
                {isEdit ? "Editar Usuario" : "Agregar Usuario"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
});
