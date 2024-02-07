import React from "react";

import { Layout, Button, Row, Col, Typography, Form, Input } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginAction } from "../../redux/actions";

const { Title } = Typography;
const { Header, Footer, Content } = Layout;

const Login = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const onFinish = (values) => {
    const payload = {
      strDomain: "standarduser",
      strUsername: values.email,
      strPassword: values.password,
    };
    dispatch(loginAction(payload, navigate));
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Layout>
        <Header style={{ background: "#fff" }}></Header>
        <Content style={{ margin: "60px" }}>
          <Row>
            <Col
              xs={{ span: 24, offset: 0 }}
              lg={{ span: 6, offset: 9 }}
              md={{ span: 12 }}
            >
              <Title className="mb-15">Sign In</Title>
              <Title level={5}>Enter your email and password to sign in</Title>
              <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                className="row-col"
              >
                <Form.Item
                  label="Email"
                  name="email"
                  type="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email!",
                    },
                  ]}
                >
                  <Input placeholder="Email" />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  type="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input.Password placeholder="Password" />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                  >
                    Login
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
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

export default Login;
