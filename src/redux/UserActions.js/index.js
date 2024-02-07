import { message } from "antd";
import types from "../types";
import { API } from "../../api";
import { getToken } from "../../utils/common";

import { handleError } from "../actions";

export const getUsersAction =
  (navigate, getAll = false) =>
  async (dispatch) => {
    try {
      dispatch({
        type: types.USERS_FETCH,
      });
      const config = {
        apiVersion: "baseUrl",
        headers: { Authorization: "Bearer " + getToken() },
      };
      const url = getAll ? "/api/user/all" : "/api/user";
      const response = await API.get(config)(url);
      const data = response.data;
      dispatch({
        type: types.USERS_DATA,
        payload: data,
      });
    } catch (error) {
      handleError(error, navigate, dispatch);
      dispatch({
        type: types.USERS_ERROR,
      });
    }
  };

export const getUserDetailAction = (navigate, userId) => async (dispatch) => {
  try {
    dispatch({
      type: types.USER_DETAIL_FETCH,
    });
    const config = {
      apiVersion: "baseUrl",
      headers: { Authorization: "Bearer " + getToken() },
    };
    const url = `/api/user/${userId}`;
    const response = await API.get(config)(url);
    const data = response.data;
    dispatch({
      type: types.USER_DETAIL_DATA,
      payload: data,
    });
  } catch (error) {
    handleError(error, navigate, dispatch);
    dispatch({
      type: types.USER_DETAIL_ERROR,
    });
  }
};

export const addUserAction = (requestData, navigate) => async (dispatch) => {
  try {
    dispatch({
      type: types.ADD_USER_FETCH,
    });
    const config = {
      apiVersion: "baseUrl",
      headers: { Authorization: "Bearer " + getToken() },
    };
    const response = await API.post(config)("/api/user/add", requestData);
    dispatch({
      type: types.ADD_USER_SUCCESS,
      payload: response.data,
    });
    message.success("User Added Successfully.");
  } catch (error) {
    handleError(error, navigate, dispatch);
    dispatch({
      type: types.ADD_USER_ERROR,
    });
  }
};

export const updateUserAction =
  (userId, requestData, navigate) => async (dispatch) => {
    try {
      dispatch({
        type: types.UPDATE_USER_FETCH,
      });
      const config = {
        apiVersion: "baseUrl",
        headers: { Authorization: "Bearer " + getToken() },
      };
      const response = await API.put(config)(
        `/api/user/update/${userId}`,
        requestData
      );
      dispatch({
        type: types.UPDATE_USER_SUCCESS,
        payload: response.data,
      });
      message.success("User Updated Successfully.");
      navigate(-1);
    } catch (error) {
      handleError(error, navigate, dispatch);
      dispatch({
        type: types.UPDATE_USER_ERROR,
      });
    }
  };
