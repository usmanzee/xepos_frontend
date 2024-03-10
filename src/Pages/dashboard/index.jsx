import React from "react";
import { Card, Col, Row, Typography, theme } from "antd";
import { FileDoneOutlined, UsergroupAddOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Dashboard = () => {
  const { token } = theme.useToken();

  return (
    <>
      <Row>
        <Col span={24}>
          <Row gutter={8}>This is Dashboardd</Row>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
