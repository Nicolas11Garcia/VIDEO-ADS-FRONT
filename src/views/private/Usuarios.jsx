import { Button, Popconfirm, Space, Table, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../../axios/axiosInstance";
import { CheckIcon } from "../../components/ui/icons/CheckIcon";
import { DeleteIcon } from "../../components/ui/icons/DeleteIcon";
import { EditIcon } from "../../components/ui/icons/EditIcon";
import { ModalCUUsuarios } from "../../components/ui/modals/ModalCUUsuarios";

export const Usuarios = () => {
  const childRef = useRef(null);
  const [data, setData] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      width: 230,
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Apellido",
      dataIndex: "lastname",
      key: "lastname",
      width: 230,
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 390,
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Rol",
      dataIndex: "role",
      key: "role",
      width: 200,
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Estado",
      dataIndex: "active",
      key: "active",
      render: (text) => {
        if (text === "active") {
          return (
            <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-green-500 text-white">
              Activado
            </span>
          );
        } else {
          return (
            <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-red-500 text-white">
              Desactivado
            </span>
          );
        }
      },
    },
    {
      title: "Acciones",
      dataIndex: "id",
      key: "id",
      render: (id, record) => (
        <Space size="middle">
          {/*Editar*/}
          <button onClick={() => childRef.current.childFunction(id, "Edit")}>
            <EditIcon color="#eab308" />
          </button>
          {record.active === "active" ? (
            //Desactivar
            <Popconfirm
              title="¿Estas segur@ que deseas desactivar este usuario?"
              okText="Desactivar"
              cancelButtonProps={{ borderRadius: 12 }}
              cancelText="Cancelar"
              okButtonProps={{
                style: { backgroundColor: "#ef4444" },
              }}
              onConfirm={() => {
                changeStatusAccountUser(id);
              }}
            >
              <button>
                <DeleteIcon color="#ef4444" />
              </button>
            </Popconfirm>
          ) : (
            //Activar
            <Popconfirm
              title="¿Estas segur@ que deseas activar este usuario?"
              okText="Activar"
              cancelText="Cancelar"
              okButtonProps={{
                style: { backgroundColor: "#22c55e" },
              }}
              onConfirm={() => {
                changeStatusAccountUser(id);
              }}
            >
              <button>
                <CheckIcon color="#22c55e" />
              </button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const changeStatusAccountUser = async (id) => {
    message.loading("Cambiando estado del usuario...");
    await axiosInstance
      .put("/api/changeStatusUser/" + id)
      .then((response) => {
        message.destroy();
        message.success(`El estado del usuario se ha cambiado correctamente.`);
        getUsers();
      })
      .catch((error) => {
        message.error(`El estado de usuario no se ha podido cambiar.`);
      });
  };

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    setLoadingTable(true);
    await axiosInstance
      .get("/api/getUsers")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {})
      .finally(function () {
        setLoadingTable(false);
      });
  };

  return (
    <>
      <div className="flex justify-between gap-4 mb-12 flex-wrap items-center">
        <h2 className="text-4xl font-bold">Usuarios</h2>
        <div className="flex w-full sm:w-fit justify-end ">
          <Button
            color="primary"
            onClick={() => childRef.current.childFunction(null, "Agregar")}
          >
            Agregar Usuario
          </Button>
        </div>
      </div>
      <ModalCUUsuarios ref={childRef} reloadTable={getUsers} />
      <Table
        columns={columns}
        dataSource={data}
        loading={loadingTable}
        scroll={{
          x: "100%",
        }}
      />
    </>
  );
};
