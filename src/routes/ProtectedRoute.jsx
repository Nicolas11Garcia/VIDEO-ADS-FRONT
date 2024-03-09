import { Layout } from "antd";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { SideBar } from "../components/navegation/SideBar";
import { useAuthContext } from "../context/AuthContext";

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const { Header, Content, Footer, Sider } = Layout;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <div className="block sm:hidden">
        {/* MOVIL */}
        <Header
          style={{
            padding: 0,
            height: 84,
            background: "white",
          }}
          className="border-b"
        >
          <SideBar />
        </Header>
      </div>

      {/* PC TABLET */}
      <Layout className="gap-x-8" style={{ background: "white" }}>
        <div className="hidden sm:block">
          <Sider
            width={257}
            style={{
              background: "white",
              overflow: "auto",
              height: "100vh",
              left: 0,
              top: 0,
              bottom: 0,
            }}
          >
            <SideBar />
          </Sider>
        </div>
        <Content className="mt-[22px] px-6">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
