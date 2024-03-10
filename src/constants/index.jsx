import React from "react";
import {
  HomeOutlined,
  UserAddOutlined,
  FundProjectionScreenOutlined,
} from "@ant-design/icons";

export const roles = [{ id: 1, name: "ADMIN" }];

export const pgRoutes = (roleId) => {
  const adminRoutes = [
    { name: "Dashboard", path: "/", icon: <HomeOutlined /> },
    {
      name: "Companies",
      path: "/companies",
      icon: <FundProjectionScreenOutlined />,
    },
    { name: "Employees", path: "/employees", icon: <UserAddOutlined /> },
  ];

  switch (roleId) {
    case 1:
      return adminRoutes;
    case 2:
    default:
      return adminRoutes;
  }
};
