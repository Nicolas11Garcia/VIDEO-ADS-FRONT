import React, { useState } from "react";
import { BASE_URL } from "../../../constants/BaseURL";
import { Link } from "react-router-dom";
import { GOTOVIDEO } from "../../../routes/Paths";
import { Player } from "video-react";

export const CardVideo = ({ id, rutaVideo, titulo }) => {
  return (
    <Link to={GOTOVIDEO + id}>
      <Player playsInline src={BASE_URL + rutaVideo} />
    </Link>
  );
};
