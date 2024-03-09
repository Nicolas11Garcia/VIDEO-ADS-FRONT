import React, { useEffect, useState } from "react";
import { axiosInstance } from "../axios/axiosInstance";
import { CardVideo } from "../components/ui/videos/CardVideo";
import { LoadingScreen } from "../components/ui/LoadingScreen";

export const Home = () => {
  const [data, setData] = useState([]);
  const [loadingScreen, setLoadingScreen] = useState(false);

  useEffect(() => {
    getVideos();
  }, []);

  const getVideos = async () => {
    setLoadingScreen(true);
    await axiosInstance
      .get("/videos/getVideos")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {})
      .finally(function () {
        setLoadingScreen(false);
      });
  };

  const links = data.map((item, index) => (
    <CardVideo id={item._id} titulo={item.titulo} rutaVideo={item.ruta_video}  key={index}  />
  ));

  return (
    <>
      <div className="my-12 px-6">
        <h1 className="font-bold text-4xl md:text-5xl text-center">
          Ultimos videos virales
        </h1>
      </div>

      {loadingScreen ? (
        <LoadingScreen />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  px-6 gap-6">{links}</div>
      )}
    </>
  );
};
