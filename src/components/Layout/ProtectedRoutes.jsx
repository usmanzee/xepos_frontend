import { Row, Col, Layout, Divider, Typography, Spin } from "antd";
import { Navigate, Outlet } from "react-router-dom";
import { AppSidebar, AppFooter, AppHeader } from "../../components";
import { useSelector } from "react-redux";

const { Title } = Typography;
const { Sider, Content } = Layout;

const ProtectedRoutes = ({ auth, profileLoading, profile }) => {
  const { loading: spinning } = useSelector((state) => state.screenLoader);
  return auth === true ? (
    <Layout hasSider>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "sticky",
          left: 0,
          top: 0,
          bottom: 0,
        }}
        // className="sidebar"
        breakpoint={"lg"}
        theme="light"
        collapsedWidth={0}
        trigger={null}
      >
        <Row
          style={{ marginTop: "10px", alignItems: "center" }}
          justify="center"
        >
          <Col>
            <Title level={5} style={{ marginTop: "12px" }}>
              XEPOS ADMIN
            </Title>
          </Col>
        </Row>
        <Divider style={{ margin: "16px 0px" }} />
        <AppSidebar profileLoading={profileLoading} profile={profile} />
      </Sider>
      <Layout>
        <AppHeader />
        <Spin tip="Loading..." spinning={spinning}>
          <Content style={{ margin: "8px 8px 0", overflow: "initial" }}>
            <div
              style={{
                height: "100%",
              }}
            >
              <Outlet />
            </div>
          </Content>
        </Spin>
        <AppFooter />
      </Layout>
    </Layout>
  ) : (
    <Navigate to="/login" replace />
  );
};
export default ProtectedRoutes;
