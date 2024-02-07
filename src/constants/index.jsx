import React from "react";
import {
  HomeOutlined,
  UserAddOutlined,
  TableOutlined,
  DatabaseOutlined,
  CarOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";

export const pgRoutes = (isAdmin) => {
  const routes = [{ name: "Dashboard", path: "/", icon: <HomeOutlined /> }];
  const adminRoutes = [
    { name: "Dashboard", path: "/", icon: <HomeOutlined /> },
    { name: "Users", path: "/users", icon: <UserAddOutlined /> },
    {
      name: "Vehicle Models",
      path: "/vehicle-models",
      icon: <CarOutlined />,
    },
    {
      name: "Service Centers",
      path: "/service-centers",
      icon: <DatabaseOutlined />,
    },
    {
      name: "Staff Management",
      path: "/staff-management",
      icon: <UserSwitchOutlined />,
    },

    { name: "Bookings", path: "/bookings", icon: <TableOutlined /> },
  ];

  return isAdmin ? adminRoutes : routes;
};
