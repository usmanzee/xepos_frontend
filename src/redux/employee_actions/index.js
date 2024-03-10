import { message } from "antd";
import types from "../types";
import { API } from "../../api";
import { getToken } from "../../utils/common";

import { handleError } from "../actions";

export const getEmployeesAction =
  (navigate, page = 1) =>
  async (dispatch) => {
    try {
      dispatch({
        type: types.EMPLOYEES_FETCH,
      });
      const config = {
        apiVersion: "baseUrl",
        headers: { Authorization: "Bearer " + getToken() },
      };
      const url = `/api/employees?page=${page}`;
      const response = await API.get(config)(url);
      // const data = response.data;
      dispatch({
        type: types.EMPLOYEES_DATA,
        payload: response,
      });
    } catch (error) {
      handleError(error, navigate, dispatch);
      dispatch({
        type: types.EMPLOYEES_ERROR,
      });
    }
  };

export const getEmployeeDetailAction =
  (navigate, userId) => async (dispatch) => {
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

export const addEmployeeAction =
  (navigate, requestData) => async (dispatch) => {
    try {
      dispatch({
        type: types.ADD_EMPLOYEE_FETCH,
      });
      const config = {
        apiVersion: "baseUrl",
        headers: { Authorization: "Bearer " + getToken() },
      };
      const response = await API.post(config)("/api/employees", requestData);
      dispatch({
        type: types.ADD_EMPLOYEE_SUCCESS,
        payload: response.data,
      });
      message.success("Employee Added Successfully.");
    } catch (error) {
      handleError(error, navigate, dispatch);
      dispatch({
        type: types.ADD_EMPLOYEE_ERROR,
      });
    }
  };

export const updateEmployeeAction =
  (navigate, id, requestData) => async (dispatch) => {
    try {
      dispatch({
        type: types.UPDATE_EMPLOYEE_FETCH,
      });
      const config = {
        apiVersion: "baseUrl",
        headers: { Authorization: "Bearer " + getToken() },
      };
      const response = await API.put(config)(
        `/api/employees/${id}`,
        requestData,
      );
      dispatch({
        type: types.UPDATE_EMPLOYEE_SUCCESS,
        payload: response.data,
      });
      message.success("Employee Updated Successfully.");
    } catch (error) {
      handleError(error, navigate, dispatch);
      dispatch({
        type: types.UPDATE_EMPLOYEE_ERROR,
      });
    }
  };
export const deleteEmployeeAction = (navigate, id) => async (dispatch) => {
  try {
    dispatch({
      type: types.DELETE_EMPLOYEE_FETCH,
    });
    const config = {
      apiVersion: "baseUrl",
      headers: { Authorization: "Bearer " + getToken() },
    };
    await API.delete(config)(`/api/employees/${id}`);
    dispatch({
      type: types.DELETE_EMPLOYEE_SUCCESS,
      payload: id,
    });
    message.success("Employee Deleted Successfully.");
  } catch (error) {
    handleError(error, navigate, dispatch);
    dispatch({
      type: types.DELETE_EMPLOYEE_ERROR,
    });
  }
};
