import types from "./types";
import axios from "axios";
import { API } from "../api";
import {
  getToken,
  setToken,
  removeToken,
  setAuthToken,
  removeAuthToken,
  getAuthToken,
} from "../utils/common";
import { message } from "antd";

/**
 * Other Actions
 */

export * from "./AuthActions.js";
export * from "./UserActions.js";
export * from "./BookingTransactionActions";
export * from "./CustomerActions";

export const handleError = (error, navigate, dispatch) => {
  if (error.code === 401) {
    removeToken();
    removeAuthToken();
    navigate("/unauthorized");
    // navigate("/login");
  }
  message.error(error.message ? error.message : "Something went wrong.");
};

export const setScreenLoader = (status) => async (dispatch) => {
  try {
    dispatch({
      type: types.SCREEN_LOADER_SET,
      payload: status,
    });
  } catch (error) {
    dispatch({
      type: types.SCREEN_LOADER_SET,
      payload: false,
    });
  }
};

export const getRolesAction = (navigate) => async (dispatch) => {
  try {
    dispatch({
      type: types.ROLES_FETCH,
    });
    const config = {
      apiVersion: "baseUrl",
      headers: { Authorization: "Bearer " + getToken() },
    };
    const response = await API.get(config)("/api/role/all");
    const data = response.data;
    dispatch({
      type: types.ROLES_DATA,
      payload: data,
    });
  } catch (error) {
    handleError(error, navigate, dispatch);
    dispatch({
      type: types.ROLES_ERROR,
    });
  }
};
export const getEmployeesAction = (navigate) => async (dispatch) => {
  try {
    dispatch({
      type: types.EMPLOYEES_FETCH,
    });
    const config = {
      apiVersion: "baseUrl",
      headers: { Authorization: "Bearer " + getToken() },
    };
    const response = await API.get(config)("/api/employee/all");
    const data = response.data;
    dispatch({
      type: types.EMPLOYEES_DATA,
      payload: data,
    });
  } catch (error) {
    handleError(error, navigate, dispatch);
    dispatch({
      type: types.EMPLOYEES_ERROR,
    });
  }
};

export const getServiceCentersFetch = (navigate) => async (dispatch) => {
  try {
    dispatch({
      type: types.SERVICE_CENTERS_FETCH,
    });
    const config = {
      apiVersion: "baseUrl",
      headers: { Authorization: "Bearer " + getToken() },
    };
    const response = await API.get(config)("/api/servicecenter/all");
    const data = response.data;
    dispatch({
      type: types.SERVICE_CENTERS_DATA,
      payload: data,
    });
  } catch (error) {
    handleError(error, navigate, dispatch);
    dispatch({
      type: types.SERVICE_CENTERS_ERROR,
    });
  }
};

export const updateServiceCenter =
  (navigate, requestData) => async (dispatch) => {
    try {
      dispatch({
        type: types.UPDATE_SERVICE_CENTER_FETCH,
      });
      const config = {
        apiVersion: "baseUrl",
        headers: {
          Authorization: "Bearer " + getToken(),
          "Content-Type": "multipart/form-data",
        },
      };
      const response = await API.post(config)(
        "/api/servicecenter/create-update",
        requestData
      );
      dispatch({
        type: types.UPDATE_SERVICE_CENTER_SUCCESS,
        payload: requestData,
      });
      message.success("Service Center Updated Successfully!");
    } catch (error) {
      handleError(error, navigate, dispatch);
      dispatch({
        type: types.UPDATE_SERVICE_CENTER_ERROR,
      });
    }
  };

export const getUserServiceCentersAction = (navigate) => async (dispatch) => {
  try {
    dispatch({
      type: types.USER_SERVICE_CENTERS_FETCH,
    });
    const config = {
      apiVersion: "baseUrl",
      headers: { Authorization: "Bearer " + getToken() },
    };
    const response = await API.get(config)(
      "/api/servicecenter/user_service_centers"
    );
    const data = response.data;
    dispatch({
      type: types.USER_SERVICE_CENTERS_DATA,
      payload: data,
    });
  } catch (error) {
    handleError(error, navigate, dispatch);
    dispatch({
      type: types.USER_SERVICE_CENTERS_ERROR,
    });
  }
};

export const getVehicleModelsFetch = (navigate) => async (dispatch) => {
  try {
    dispatch({
      type: types.VEHICLE_MODELS_FETCH,
    });
    const config = {
      apiVersion: "baseUrl",
      headers: { Authorization: "Bearer " + getToken() },
    };
    const response = await API.get(config)("/api/vehiclemodel/all");
    const data = response.data;
    dispatch({
      type: types.VEHICLE_MODELS_DATA,
      payload: data,
    });
  } catch (error) {
    handleError(error, navigate, dispatch);
    dispatch({
      type: types.VEHICLE_MODELS_ERROR,
    });
  }
};
export const updateVehicleModel =
  (navigate, requestData) => async (dispatch) => {
    try {
      dispatch({
        type: types.UPDATE_VEHICLE_MODEL_FETCH,
      });
      const config = {
        apiVersion: "baseUrl",
        headers: {
          Authorization: "Bearer " + getToken(),
          "Content-Type": "multipart/form-data",
        },
      };
      const response = await API.post(config)(
        "/api/vehiclemodel/create-update",
        requestData
      );
      dispatch({
        type: types.UPDATE_VEHICLE_MODEL_SUCCESS,
        payload: requestData,
      });
      message.success("Vehicle Model Updated Successfully!");
    } catch (error) {
      handleError(error, navigate, dispatch);
      dispatch({
        type: types.UPDATE_VEHICLE_MODEL_ERROR,
      });
    }
  };
export const getSlotsFetch = (navigate) => async (dispatch) => {
  try {
    dispatch({
      type: types.SLOTS_FETCH,
    });
    const config = {
      apiVersion: "baseUrl",
      headers: { Authorization: "Bearer " + getToken() },
    };
    const response = await API.get(config)("/api/timeslot/all");
    const data = response.data;
    dispatch({
      type: types.SLOTS_DATA,
      payload: data,
    });
  } catch (error) {
    handleError(error, navigate, dispatch);
    dispatch({
      type: types.SLOTS_ERROR,
    });
  }
};
export const getBookingStatusesFetch = (navigate) => async (dispatch) => {
  try {
    dispatch({
      type: types.BOOKING_STATUSES_FETCH,
    });
    const config = {
      apiVersion: "baseUrl",
      headers: { Authorization: "Bearer " + getToken() },
    };
    const response = await API.get(config)("/api/bookingstatus/all");
    const data = response.data;
    dispatch({
      type: types.BOOKING_STATUSES_DATA,
      payload: data,
    });
  } catch (error) {
    handleError(error, navigate, dispatch);
    dispatch({
      type: types.BOOKING_STATUSES_ERROR,
    });
  }
};
export const getAvailableSlotsFetch =
  (navigate, date, serviceCenterCode) => async (dispatch) => {
    try {
      dispatch({
        type: types.AVAILABLE_SLOTS_FETCH,
      });
      const config = {
        apiVersion: "baseUrl",
        headers: { Authorization: "Bearer " + getToken() },
      };
      const response = await API.get(config)(
        `/api/timeslot/available?date=${date}&location=${serviceCenterCode}`
      );
      const data = response.data;
      dispatch({
        type: types.AVAILABLE_SLOTS_DATA,
        payload: data,
      });
    } catch (error) {
      handleError(error, navigate, dispatch);
      dispatch({
        type: types.AVAILABLE_SLOTS_ERROR,
      });
    }
  };
export const getServiceAdvisors =
  (navigate, serviceCenterCode) => async (dispatch) => {
    try {
      dispatch({
        type: types.SERVICE_ADVISORS_FETCH,
      });
      const config = {
        apiVersion: "baseUrl",
        headers: { Authorization: "Bearer " + getToken() },
      };
      const response = await API.get(config)(
        `/api/servicecenter/service-advisor?serviceCenterCode=${serviceCenterCode}`
      );
      const data = response.data;
      dispatch({
        type: types.SERVICE_ADVISORS_DATA,
        payload: data,
      });
    } catch (error) {
      handleError(error, navigate, dispatch);
      dispatch({
        type: types.SERVICE_ADVISORS_ERROR,
      });
    }
  };
