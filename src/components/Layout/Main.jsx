import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { getProfileAction } from "../../redux/actions";
import ProtectedRoutes from "./ProtectedRoutes";
import AddUser from "../../Pages/employees/add_user";
import Login from "../../Pages/login";
import Dashboard from "../../Pages/dashboard";
import EditUser from "../../Pages/employees/edit_user";
import Companies from "../../Pages/companies";
import AddUpdateCompany from "../../Pages/companies/add_update";
import Employees from "../../Pages/employees";

export const Main = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token") ? true : false;
  const profileLoading = useSelector((state) => state.profile.loading);
  const profile = useSelector((state) => state.profile.data);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getProfileAction(navigate));
    }
  }, [dispatch, navigate, isAuthenticated]);

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoutes
            auth={isAuthenticated}
            profileLoading={profileLoading}
            profile={profile}
          />
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="companies" element={<Companies />} />
        <Route path="employees" element={<Employees />} />
      </Route>
    </Routes>
  );
};
