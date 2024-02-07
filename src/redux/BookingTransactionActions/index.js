import { message } from "antd";
import types from "../types";
import { API } from "../../api";
import { getToken } from "../../utils/common";

import { handleError } from "../actions";

export const getBookingTransactions =
  (navigate, date, serviceCenterCode) => async (dispatch) => {
    try {
      dispatch({
        type: types.BOOKING_TRANSACTIONS_FETCH,
      });
      const config = {
        apiVersion: "baseUrl",
        headers: { Authorization: "Bearer " + getToken() },
      };
      const url = `/api/bookingtransaction/by-date-servicecenter?date=${date}&serviceCenterCode=${serviceCenterCode}`;

      const response = await API.get(config)(url);
      const data = response.data;
      dispatch({
        type: types.BOOKING_TRANSACTIONS_DATA,
        payload: data,
      });
    } catch (error) {
      handleError(error, navigate, dispatch);
      dispatch({
        type: types.BOOKING_TRANSACTIONS_ERROR,
      });
    }
  };

export const createNewBooking = (navigate, requestData) => async (dispatch) => {
  try {
    dispatch({
      type: types.BOOKING_TRANSACTION_CREATE_FETCH,
    });
    const config = {
      apiVersion: "baseUrl",
      headers: {
        Authorization: "Bearer " + getToken(),
        "Content-Type": "multipart/form-data",
      },
    };
    const response = await API.post(config)(
      "/api/bookingtransaction/create",
      requestData
    );
    dispatch({
      type: types.BOOKING_TRANSACTION_CREATE_SUCCESS,
      payload: response.data,
    });
    message.success("Booking Created Successfully!");
  } catch (error) {
    handleError(error, navigate, dispatch);
    dispatch({
      type: types.BOOKING_TRANSACTION_CREATE_ERROR,
    });
  }
};
export const updateBooking = (navigate, requestData) => async (dispatch) => {
  try {
    dispatch({
      type: types.BOOKING_TRANSACTION_UPDATE_FETCH,
    });
    const config = {
      apiVersion: "baseUrl",
      headers: {
        Authorization: "Bearer " + getToken(),
        "Content-Type": "multipart/form-data",
      },
    };
    const response = await API.put(config)(
      "/api/bookingtransaction/update",
      requestData
    );
    dispatch({
      type: types.BOOKING_TRANSACTION_UPDATE_SUCCESS,
      payload: response.data,
    });
    message.success("Booking Updated Successfully!");
  } catch (error) {
    handleError(error, navigate, dispatch);
    dispatch({
      type: types.BOOKING_TRANSACTION_UPDATE_ERROR,
    });
  }
};
