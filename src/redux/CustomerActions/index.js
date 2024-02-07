import { message } from "antd";
import types from "../types";
import { API } from "../../api";
import { getToken } from "../../utils/common";

import { handleError } from "../actions";

export const searchCustomersByMobileNumber =
  (navigate, mobileNumber) => async (dispatch) => {
    try {
      dispatch({
        type: types.SEARCH_CUSTOMERS_BY_MOBILE_FETCH,
      });
      const config = {
        apiVersion: "baseUrl",
        headers: { Authorization: "Bearer " + getToken() },
      };
      const url = `/api/customer/mobile-number?mobileNumber=${mobileNumber}`;

      const response = await API.get(config)(url);
      const data = response.data;
      dispatch({
        type: types.SEARCH_CUSTOMERS_BY_MOBILE_DATA,
        payload: data,
      });
    } catch (error) {
      handleError(error, navigate, dispatch);
      dispatch({
        type: types.SEARCH_CUSTOMERS_BY_MOBILE_ERROR,
      });
    }
  };
