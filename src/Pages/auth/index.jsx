import React, { useEffect } from "react";

import { Layout, Row, Col, Typography, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { logoutAction, authAction } from "../../redux/actions";

const { Title } = Typography;
const { Header, Footer, Content } = Layout;

const Auth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const search = location.search;
  let urlParams = new URLSearchParams(search);

  const authLoading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    if (urlParams.get("token")) {
      console.log("AUTH HERE");
      //Do Authentication
      dispatch(logoutAction(navigate));
      dispatch(authAction(urlParams.get("token"), navigate));
    } else {
      // navigate("/unauthorized");
    }
  }, []);
  return (
    <>
      <Layout>
        <Header style={{ background: "#fff" }}></Header>
        <Content style={{ margin: "60px" }}>
          {authLoading ? (
            <Spin tip="Authenticating, please wait...">
              <Row>
                <Col
                  xs={{ span: 24, offset: 0 }}
                  lg={{ span: 6, offset: 9 }}
                  md={{ span: 12 }}
                >
                  <Title className="mb-15">Authenticating</Title>
                  {/* <Title level={5}>Authenticating! Please wait...</Title> */}
                </Col>
              </Row>
            </Spin>
          ) : (
            <Row>
              <Col
                xs={{ span: 24, offset: 0 }}
                lg={{ span: 6, offset: 9 }}
                md={{ span: 12 }}
              >
                <Title className="mb-15">UnAuthorized</Title>
                {/* <Title level={5}>Authenticating! Please wait...</Title> */}
              </Col>
            </Row>
          )}
        </Content>
        <Footer
          style={{
            bottom: "0px",
            position: "fixed",
            width: "100%",
            textAlign: "center",
          }}
        >
          <p> Copyright © 2024</p>
        </Footer>
      </Layout>
    </>
  );
};

export default Auth;
