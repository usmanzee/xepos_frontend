import { message } from "antd";
import types from "../types";
import { API } from "../../api";
import {
  getToken,
  setToken,
  removeToken,
  setAuthToken,
  removeAuthToken,
} from "../../utils/common";

import { handleError } from "../actions";

export const authAction = (authToken, navigate) => async (dispatch) => {
  try {
    dispatch({
      type: types.AUTH_FETCH,
    });
    const config = {
      apiVersion: "baseUrl",
    };
    const response = await API.post(config)("/api/auth", { token: authToken });

    setToken(response.data.token);
    setAuthToken(authToken);
    dispatch({
      type: types.AUTH_SUCCESS,
    });
    const redirectUrl =
      response.data.redirectUrl && response.data.redirectUrl !== ""
        ? response.data.redirectUrl
        : localStorage.getItem("redirectUrl") || null;
    if (redirectUrl) {
      localStorage.removeItem("redirectUrl");
      navigate(decodeURIComponent(redirectUrl));
    } else {
      navigate("/");
    }
    message.success("Logged In.");
  } catch (error) {
    dispatch({
      type: types.AUTH_ERROR,
    });
    handleError(error, navigate, dispatch);
  }
};

export const loginAction = (requestData, navigate) => async (dispatch) => {
  try {
    dispatch({
      type: types.USER_LOGIN_FETCH,
    });
    const config = {
      apiVersion: "baseUrl",
    };
    const response = await API.post(config)("/api/auth/login", requestData);
    setToken(response.accessToken);
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
  navigate("/unauthorized");
  // navigate("/login");
  // message.success("Session has expired.");
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
    const response = await API.get(config)("/api/user/profile");
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
