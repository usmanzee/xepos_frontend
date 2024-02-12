import { message } from "antd";
import types from "../types";
import { API } from "../../api";
import { getToken } from "../../utils/common";

import { handleError } from "../actions";

export const getStaffHolidatByMonthAndServiceCenter =
  (navigate, date, serviceCenterCode) => async (dispatch) => {
    try {
      dispatch({
        type: types.STAFF_HOLIDAYS_BY_MONTH_SERVICE_CENTER_FETCH,
      });
      const config = {
        apiVersion: "baseUrl",
        headers: { Authorization: "Bearer " + getToken() },
      };
      const url = `/api/staffholiday/by-month-servicecenter?date=${date}&serviceCenterCode=${serviceCenterCode}`;

      const response = await API.get(config)(url);
      const data = response.data;
      dispatch({
        type: types.STAFF_HOLIDAYS_BY_MONTH_SERVICE_CENTER_DATA,
        payload: data,
      });
    } catch (error) {
      handleError(error, navigate, dispatch);
      dispatch({
        type: types.STAFF_HOLIDAYS_BY_MONTH_SERVICE_CENTER_ERROR,
      });
    }
  };

export const createDeleteHoliday =
  (navigate, requestData) => async (dispatch) => {
    try {
      dispatch({
        type: types.STAFF_HOLIDAYS_CREATE_DELETE_FETCH,
      });
      const config = {
        apiVersion: "baseUrl",
        headers: {
          Authorization: "Bearer " + getToken(),
          "Content-Type": "multipart/form-data",
        },
      };
      const response = await API.post(config)(
        "/api/staffholiday/create-delete",
        requestData
      );
      const redusData = {
        ...response.data,
        isDelete: requestData.isDelete,
      };
      dispatch({
        type: types.STAFF_HOLIDAYS_CREATE_DELETE_SUCCESS,
        payload: redusData,
      });
      message.success("Staff Holiday Updated Successfully!");
    } catch (error) {
      handleError(error, navigate, dispatch);
      dispatch({
        type: types.STAFF_HOLIDAYS_CREATE_DELETE_ERROR,
      });
    }
  };
