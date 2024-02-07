import React from "react";
import { Menu, Divider, Skeleton } from "antd";
import { Link, useLocation } from "react-router-dom";
import { pgRoutes } from "../../constants";

export const AppSidebar = (props) => {
  const location = useLocation();
  const { profileLoading, profile } = props;

  const renderNavItems = () => (data, index) => {
    return (
      <React.Fragment key={"f-" + data.path}>
        <Menu.Item key={data.path} icon={data.icon}>
          <Link to={data.path}>{data.name}</Link>
        </Menu.Item>
      </React.Fragment>
    );
  };

  const renderMenuLoading = () => {
    return (
      <>
        <Menu.Item key={1}>
          <Skeleton active={true} />
        </Menu.Item>
        <Menu.Item key={2}>
          <Skeleton active={true} />
        </Menu.Item>
        <Menu.Item key={3}>
          <Skeleton active={true} />
        </Menu.Item>
        <Menu.Item key={4}>
          <Skeleton active={true} />
        </Menu.Item>
      </>
    );
  };
  return (
    <>
      <Menu
        className="sidebar-menu"
        mode="inline"
        defaultSelectedKeys={[`${location.pathname}`]}
      >
        {profileLoading
          ? renderMenuLoading()
          : pgRoutes(profile).map(renderNavItems())}
        <Divider style={{ margin: "16px 0px" }} />
      </Menu>
    </>
  );
};
