import { Button, Popconfirm, Space, Table, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { Player } from "video-react";
import { axiosInstance } from "../../axios/axiosInstance";
import { DeleteIcon } from "../../components/ui/icons/DeleteIcon";
import { EditIcon } from "../../components/ui/icons/EditIcon";
import { ModalCUVideos } from "../../components/ui/modals/ModalCUVideos";
import { BASE_URL } from "../../constants/BaseURL";

export const VideosPrivate = () => {
  const childRef = useRef(null);
  const [data, setData] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);

  const columns = [
    {
      title: "Título",
      dataIndex: "titulo",
      key: "titulo",
      render: (text) => (
        <p>{text === "null" || text == null ? "Sin título" : text}</p>
      ),
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      render: (text) => (
        <p>{text === "null" || text == null ? "Sin descripción" : text}</p>
      ),
    },
    {
      title: "Video",
      dataIndex: "ruta_video",
      key: "ruta_video",
      render: (text) => (
        <Player fluid={false} width={300} height={200} playsInline src={BASE_URL + text} />
      ),
    },
    {
      title: "Acciones",
      dataIndex: "_id",
      key: "_id",
      render: (_id, record) => (
        <Space size="middle">
          {/*Editar*/}
          <button onClick={() => childRef.current.childFunction(_id, "Edit")}>
            <EditIcon color="#eab308" />
          </button>
          {/* Eliminar */}
          <Popconfirm
            title="¿Estas segur@ que deseas eliminar este video?"
            okText="Eliminar"
            cancelButtonProps={{ borderRadius: 12 }}
            cancelText="Cancelar"
            okButtonProps={{
              style: { backgroundColor: "#ef4444" },
            }}
            onConfirm={() => {
              deleteVideo(_id);
            }}
          >
            <button>
              <DeleteIcon color="#ef4444" />
            </button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getVideos();
  }, []);

  const deleteVideo = async (_id) => {
    message.loading("Eliminando video...");
    await axiosInstance
      .delete("/videos/deleteVideo/" + _id)
      .then((response) => {
        message.destroy();
        message.success(`El video se ha eliminado correctamente.`);
        getVideos();
      })
      .catch((error) => {
        console.log(error)
        message.error(`El video no se ha podido cambiar.`);
      });
  };

  const getVideos = async () => {
    setLoadingTable(true);
    await axiosInstance
      //.get("/api/getVideos")
      .get("/videos/getVideos")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(function () {
        setLoadingTable(false);
      });
  };

  return (
    <>
      <div className="flex justify-between gap-4 mb-12 flex-wrap items-center">
        <h2 className="text-4xl font-bold">Videos</h2>
        <div className="flex w-full sm:w-fit justify-end ">
          <Button
            className="text-white bg-primary border-none"
            onClick={() => childRef.current.childFunction(null, "Agregar")}
          >
            Agregar video
          </Button>
        </div>
      </div>
      <ModalCUVideos ref={childRef} reloadTable={getVideos} />
      <Table
        columns={columns}
        dataSource={data}
        loading={loadingTable}
        scroll={{
          x: 1000, // Establece un ancho mínimo de 800px
        }}
      />
    </>
  );
};
