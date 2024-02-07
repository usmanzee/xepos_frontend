import React, { useState } from "react";
import {
  Row,
  Col,
  Layout,
  Drawer,
  Dropdown,
  Button,
  Avatar,
  Skeleton,
  Space,
} from "antd";
import {
  MenuOutlined,
  LogoutOutlined,
  UserOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { AppSidebar } from "./AppSidebar";
import "./header.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutClickAction } from "../../redux/actions";
import userImage from "../../assets/images/user.png";

const { Header } = Layout;
export const AppHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const profileLoading = useSelector((state) => state.profile.loading);
  const profile = useSelector((state) => state.profile.data);

  const items = [
    {
      label: profileLoading ? <Skeleton.Button /> : profile && profile.userName,
      key: "1",
      icon: <UserOutlined style={{ fontSize: "14px" }} />,
    },

    {
      type: "divider",
    },
    {
      label: "logout",
      key: "2",
      icon: <LogoutOutlined style={{ fontSize: "14px" }} />,
      onClick: () => {
        dispatch(logoutClickAction(navigate));
      },
    },
  ];

  return (
    <>
      <Header className="header">
        <Row justify="space-between" className="header-menu">
          <Space>
            <Col>
              <Button
                className="menu"
                type="primary"
                icon={<MenuOutlined />}
                onClick={() => setVisible(true)}
              />
            </Col>
          </Space>
          <Col>
            <Dropdown
              menu={{
                items,
              }}
              trigger={["click"]}
            >
              <Row>
                <Col>
                  <Avatar shape="circle">{userImage}</Avatar>
                </Col>
                <Col>
                  <DownOutlined style={{ marginLeft: "4px", fontSize: "14" }} />
                </Col>
              </Row>
            </Dropdown>
          </Col>
        </Row>

        <Drawer
          title="Booking App"
          placement="left"
          onClick={() => setVisible(false)}
          onClose={() => setVisible(false)}
          open={visible}
        >
          <AppSidebar profileLoading={profileLoading} profile={profile} />
        </Drawer>
      </Header>
    </>
  );
};
