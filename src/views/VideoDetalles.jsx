import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Player } from "video-react";
import { axiosInstance } from "../axios/axiosInstance";
import { LoadingScreen } from "../components/ui/LoadingScreen";
import { BASE_URL_NORMAL, BASE_URL } from "../constants/BaseURL";

export const VideoDetalles = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    getVideo();
  }, []);

  const getVideo = async () => {
    setLoadingScreen(true);
    await axiosInstance
      .get(BASE_URL_NORMAL + "/videos/getVideoId/" + id)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
        //navigate("/404");
      })
      .finally(function () {
        setLoadingScreen(false);
      });
  };

  if (loadingScreen) {
    return <LoadingScreen />;
  }

  return (
    <div className="px-6 max-w-[1000px] mx-auto mt-12">
      <div>
        <Player fluid={false} width={"full"} height={500} playsInline src={BASE_URL + data.ruta_video} />

        <h1 className="text-2xl font-medium mt-4">{data.titulo === "null" ? '' : data.titulo}</h1>
        <p className="text-gray-600 mt-2">{data.descripcion === "" || data.descripcion === "undefined"  ? 'Sin descripción' : data.descripcion}</p>
      </div>

      <div className="flex justify-center ">
        <Link
          to={"/"}
          className="inline-flex max-w-[200px] text-center text-white p-3 rounded-xl bg-primary animate-bounce mt-12"
        >
          Ver más videos
        </Link>
      </div>
    </div>
  );
};
