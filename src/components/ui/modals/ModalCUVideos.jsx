import {
  Button,
  Form,
  Input,
  Modal,
  Skeleton,
  Space,
  Upload,
  message,
} from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { axiosInstance } from "../../../axios/axiosInstance";
import { BASE_URL } from "../../../constants/BaseURL";
import { useAuthContext } from "../../../context/AuthContext";
import { UploadIcon } from "../icons/UploadIcon";
import { UsersIcon } from "../icons/UsersIcon";
import { Player } from "video-react";

export const ModalCUVideos = forwardRef((props, ref) => {
  const { isAuthenticated, userLogged } = useAuthContext();
  const [id, setId] = useState("");
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  //Loadings
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  //Video
  const [videoViewEdit, setVideoViewEdit] = useState(""); //sirve para mostrar el video que quiere editar
  const [hiddenViewVideoEdit, setHiddenViewVideoEdit] = useState(true); //ocultar el video cuando se suba otro
  //Upload antd
  const [uploadedVideo, setUploadedVideo] = useState();

  const [form] = Form.useForm();

  const childFunction = async (id, action) => {
    setOpen(true);
    if (action === "Edit") {
      setId(id);
      setIsEdit(true);
      setHiddenViewVideoEdit(false);
      setIsLoadingData(true);
      setUploadedVideo(null);

      form.resetFields();
      await axiosInstance
      //.get("/api/getVideoId/" + id)
        .get("/videos/getVideoId/" + id)
        .then((response) => {
          form.setFieldsValue({
            titulo: response.data.titulo,
            descripcion: response.data.descripcion,
          });
          setVideoViewEdit(response.data.ruta_video);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(function () {
          setIsLoadingData(false);
        });
    } else {
      form.resetFields();
      setIsEdit(false);
      setHiddenViewVideoEdit(true);
    }
  };

  useImperativeHandle(ref, () => ({
    childFunction,
  }));

  const createUser = async () => {
    if (uploadedVideo === null) {
      return message.error("Ingres video");
    }

    const formValues = form.getFieldsValue();

    const formData = new FormData();
    formData.append("titulo", formValues.titulo);
    formData.append("descripcion", formValues.descripcion);
    formData.append("ruta_video", uploadedVideo);
    formData.append("id_usuario", userLogged.id);

    setIsLoadingButton(true);

    await axiosInstance
      //.post("/api/createVideo", formData, {
      .post("/videos/createVideo", formData, {
      headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        message.success("Video agregado con exito");
        form.resetFields();
        setOpen(false);
        props.reloadTable();
      })
      .catch((error) => {
        console.log(error.response);
      })
      .finally(function () {
        setIsLoadingButton(false);
      });
  };

  const updateUser = async () => {
    const formValues = form.getFieldsValue();

    const formData = new FormData();
    formData.append("titulo", formValues.titulo);
    formData.append("descripcion", formValues.descripcion);
    formData.append("id_usuario", userLogged.id);
    formData.append("ruta_video", uploadedVideo);

    setIsLoadingButton(true);

    await axiosInstance
      //.post("/api/updateVideo/" + id, formData, {
      .put("/videos/updateVideo/" + id, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        message.success("Video editado con exito");
        form.resetFields();
        setOpen(false);
        props.reloadTable();
      })
      .catch((error) => {
        console.log(error.response);
        return message.error("El video no se pudo editar");
      })
      .finally(function () {
        setIsLoadingButton(false);
      });
  };

  function skeletonsLoading() {
    return (
      <div className="grid grid-cols-1 gap-y-8 pt-4">
        <Skeleton.Input
          active
          style={{ width: "100%", height: 48, borderRadius: 12 }}
        />
        <Skeleton.Input
          active
          style={{ width: "100%", height: 48, borderRadius: 12 }}
        />
        <Skeleton.Input
          active
          style={{ width: 180, height: 48, borderRadius: 12 }}
        />
        <Skeleton.Image
          active
          style={{ width: '100%', height: 265, borderRadius: 12 }}
        />

        <div className="flex justify-end">
          <Space>
            <Skeleton.Button
              active
              style={{ width: 90, height: 44, borderRadius: 12 }}
            />
            <Skeleton.Button
              active
              style={{ width: 137, height: 44, borderRadius: 12 }}
            />
          </Space>
        </div>
      </div>
    );
  }

  //Imagen Antd
  const fileProps = {
    name: "file",
    listType: "picture",
    multiple: false,
    beforeUpload: (file) => {
      return false;
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        try {
          let reader = new FileReader();
          reader.readAsDataURL(info.file);
          setUploadedVideo(info.file);
          setHiddenViewVideoEdit(true);
        } catch (error) {
          setUploadedVideo(null);
          setHiddenViewVideoEdit(true);
        }
      }
    },
    onPreview: () => false, // Devolver false para evitar la redirección
  };

  return (
    <Modal
      title={isEdit ? "Editar Video" : "Agregar Video"}
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
          {/* Titulo */}
          <Form.Item name="titulo" label="Título">
            <Input placeholder="Ingresa título" />
          </Form.Item>

          {/* Descripcion */}
          <Form.Item name="descripcion" label="Descripción">
            <Input.TextArea placeholder="Ingresa descripción" />
          </Form.Item>

          {/* Video */}
          <Form.Item
            hasFeedback
            name="video"
            label="Video"
            rules={isEdit ? [] : [{ required: true, message: "Ingresa video" }]}
          >
            <Space
              direction="vertical"
              className="w-full"
              style={{
                width: "100%",
              }}
              size="large"
            >
              <Upload
                icon={<UsersIcon color="#eab308" />}
                {...fileProps}
                maxCount={1}
                accept=".mp4"
              >
                <Button
                  className="flex"
                  icon={<UploadIcon size={20} color="#1F1F1F" />}
                >
                  Subir video
                </Button>
              </Upload>
            </Space>
          </Form.Item>
          {!hiddenViewVideoEdit && (
            <Player fluid={false} height={300} width={"100%"} playsInline src={BASE_URL + videoViewEdit} />
          )}

          {/* Button */}
          <Form.Item className="m-0 mt-12 p-0 flex justify-end">
            <Space>
              <Button onClick={() => setOpen(false)}>Cancelar</Button>
              <Button
                className="bg-primary text-white border-none"
                loading={isLoadingButton}
                htmlType="submit"
              >
                {isEdit ? "Editar Video" : "Agregar Video"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
});
