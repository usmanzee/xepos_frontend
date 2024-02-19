import React from "react";
import {
  HomeOutlined,
  UserAddOutlined,
  TableOutlined,
  DatabaseOutlined,
  CarOutlined,
  UserSwitchOutlined,
  FundProjectionScreenOutlined,
} from "@ant-design/icons";

export const roles = [
  { id: 1, name: "ADMIN" },
  { id: 2, name: "USER" },
  { id: 3, name: "SERVICE_ADVISOR" },
  { id: 4, name: "SERVICE_TECHNICIAN" },
];

export const pgRoutes = (roleId) => {
  const userRoutes = [
    { name: "Dashboard", path: "/", icon: <HomeOutlined /> },
    {
      name: "Services",
      path: "/services",
      icon: <FundProjectionScreenOutlined />,
    },
    { name: "Bookings", path: "/bookings", icon: <TableOutlined /> },
  ];
  const adminRoutes = [
    { name: "Dashboard", path: "/", icon: <HomeOutlined /> },
    {
      name: "Services",
      path: "/services",
      icon: <FundProjectionScreenOutlined />,
    },
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

  switch (roleId) {
    case 1:
      return adminRoutes;
    case 2:
      return userRoutes;
    case 3:
      return userRoutes;
    case 4:
      return userRoutes;
    default:
      return userRoutes;
  }
};
