import { message } from "antd";
import types from "../types";
import { API } from "../../api";
import { getToken } from "../../utils/common";

import { handleError } from "../actions";

export const getAllCompaniesAction = (navigate) => async (dispatch) => {
  try {
    dispatch({
      type: types.ALL_COMPANIES_FETCH,
    });
    const config = {
      apiVersion: "baseUrl",
      headers: { Authorization: "Bearer " + getToken() },
    };
    const url = `/api/companies-all`;
    const response = await API.get(config)(url);
    const data = response.data;
    dispatch({
      type: types.ALL_COMPANIES_DATA,
      payload: data,
    });
  } catch (error) {
    handleError(error, navigate, dispatch);
    dispatch({
      type: types.ALL_COMPANIES_ERROR,
    });
  }
};

export const getCompaniesAction =
  (navigate, page = 1) =>
  async (dispatch) => {
    try {
      dispatch({
        type: types.COMPANIES_FETCH,
      });
      const config = {
        apiVersion: "baseUrl",
        headers: { Authorization: "Bearer " + getToken() },
      };
      const url = `/api/companies?page=${page}`;
      const response = await API.get(config)(url);
      // const data = response.data;
      dispatch({
        type: types.COMPANIES_DATA,
        payload: response,
      });
    } catch (error) {
      handleError(error, navigate, dispatch);
      dispatch({
        type: types.COMPANIES_ERROR,
      });
    }
  };

export const getCompanyDetailAction =
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

export const addCompanyAction = (navigate, requestData) => async (dispatch) => {
  try {
    dispatch({
      type: types.ADD_COMPANY_FETCH,
    });
    const config = {
      apiVersion: "baseUrl",
      headers: { Authorization: "Bearer " + getToken() },
    };
    const response = await API.post(config)("/api/companies", requestData);
    dispatch({
      type: types.ADD_COMPANY_SUCCESS,
      payload: response.data,
    });
    message.success("Company Added Successfully.");
  } catch (error) {
    handleError(error, navigate, dispatch);
    dispatch({
      type: types.ADD_COMPANY_ERROR,
    });
  }
};

export const updateCompanyAction =
  (navigate, id, requestData) => async (dispatch) => {
    try {
      dispatch({
        type: types.UPDATE_COMPANY_FETCH,
      });
      const config = {
        apiVersion: "baseUrl",
        headers: { Authorization: "Bearer " + getToken() },
      };
      const response = await API.post(config)(
        `/api/companies/${id}`,
        requestData,
      );
      dispatch({
        type: types.UPDATE_COMPANY_SUCCESS,
        payload: response.data,
      });
      message.success("Company Updated Successfully.");
    } catch (error) {
      handleError(error, navigate, dispatch);
      dispatch({
        type: types.UPDATE_COMPANY_ERROR,
      });
    }
  };
export const deleteCompanyAction = (navigate, id) => async (dispatch) => {
  try {
    dispatch({
      type: types.DELETE_COMPANY_FETCH,
    });
    const config = {
      apiVersion: "baseUrl",
      headers: { Authorization: "Bearer " + getToken() },
    };
    await API.delete(config)(`/api/companies/${id}`);
    dispatch({
      type: types.DELETE_COMPANY_SUCCESS,
      payload: id,
    });
    message.success("Company Deleted Successfully.");
  } catch (error) {
    handleError(error, navigate, dispatch);
    dispatch({
      type: types.DELETE_COMPANY_ERROR,
    });
  }
};
