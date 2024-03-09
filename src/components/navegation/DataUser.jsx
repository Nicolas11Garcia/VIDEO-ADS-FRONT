import { Avatar, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LoadingScreen } from "../ui/LoadingScreen";

export const DataUser = ({ name, lastName, email }) => {
  return (
    <>
      <div className="flex items-center border-t gap-2 py-5 px-4 border-gray-300">
        <Avatar className="bg-[#f56a00]">{name[0]}</Avatar>
        <div>
          <p className="font-medium text-sm">{`${name} ${lastName}`}</p>

          <Tooltip
            placement="top"
            className="cursor-pointer"
            title={email}
          >
            <p className="font-medium text-xs text-grayCustom">
              {" "}
              {email.length > 14 ? `${email.slice(0, 24)}...` : email}
            </p>
          </Tooltip>
        </div>
      </div>
    </>
  );
};
