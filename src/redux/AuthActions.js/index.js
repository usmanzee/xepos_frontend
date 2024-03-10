import { message } from "antd";
import types from "../types";
import { API } from "../../api";
import {
  getToken,
  setToken,
  removeToken,
  removeAuthToken,
} from "../../utils/common";

import { handleError } from "../actions";

export const loginAction = (requestData, navigate) => async (dispatch) => {
  try {
    dispatch({
      type: types.USER_LOGIN_FETCH,
    });
    const config = {
      apiVersion: "baseUrl",
    };
    const response = await API.post(config)("/api/login", requestData);
    setToken(response.access_token);
    dispatch({
      type: types.USER_LOGIN_SUCCESS,
    });
    navigate("/");
    message.success("Logged In.");
  } catch (error) {
    dispatch({
      type: types.USER_LOGIN_ERROR,
    });
    handleError(error, navigate, dispatch);
  }
};
export const logoutAction = (navigate) => async (dispatch) => {
  removeToken();
  removeAuthToken();
};
export const logoutClickAction = (navigate) => async (dispatch) => {
  removeToken();
  navigate("/login");
};

export const getProfileAction = (navigate) => async (dispatch) => {
  try {
    dispatch({
      type: types.USER_PROFILE_FETCH,
    });
    const config = {
      apiVersion: "baseUrl",
      headers: { Authorization: "Bearer " + getToken() },
    };
    const response = await API.get(config)("/api/profile");
    dispatch({
      type: types.USER_PROFILE_DATA,
      payload: response.data,
    });
  } catch (error) {
    handleError(error, navigate, dispatch);
    dispatch({
      type: types.USER_PROFILE_ERROR,
    });
  }
};
