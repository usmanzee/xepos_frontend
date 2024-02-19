import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { getProfileAction } from "../../redux/actions";
import ProtectedRoutes from "./ProtectedRoutes";
import AddUser from "../../Pages/users/add_user";
import Login from "../../Pages/login";
import Unauthorized from "../../Pages/unauthorized";
import Auth from "../../Pages/auth";
import Bookings from "../../Pages/bookings";
import Dashboard from "../../Pages/dashboard";
import EditUser from "../../Pages/users/edit_user";
import ServiceCenters from "../../Pages/service_centers";
import VehicleModels from "../../Pages/vehicle_models";
import StaffManagement from "../../Pages/saff_management";
import Services from "../../Pages/services";

export const Main = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token") ? true : false;
  const profileLoading = useSelector((state) => state.profile.loading);
  const profile = useSelector((state) => state.profile.data);

  const location = useLocation();
  const search = location.search;
  let urlParams = new URLSearchParams(search);
  const currentUrl = window.location.pathname;

  useEffect(() => {
    if (urlParams.get("token")) {
      const token = urlParams.get("token");
      //Do Authentication
      if (currentUrl !== "/auth") {
        localStorage.setItem("redirectUrl", currentUrl);
        navigate("/auth?token=" + token);
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getProfileAction(navigate));
    }
  }, [isAuthenticated]);

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />
      <Route path="/auth" element={<Auth />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
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
        <Route path="users" element={<AddUser />} />
        <Route path="service-centers" element={<ServiceCenters />} />
        <Route path="vehicle-models" element={<VehicleModels />} />
        <Route path="staff-management" element={<StaffManagement />} />
        <Route path="users/edit/:id" element={<EditUser />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="services" element={<Services />} />
      </Route>
    </Routes>
  );
};
