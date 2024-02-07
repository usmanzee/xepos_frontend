import { combineReducers } from "redux";
import types from "./types";

import { initialState } from "./initial_state";

const authReducer = (state = initialState.auth, action) => {
  switch (action.type) {
    case types.AUTH_FETCH:
      return {
        ...state,
        loading: true,
      };
    case types.AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
      };
    case types.AUTH_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
};
const screenLoaderReducer = (state = initialState.screenLoader, action) => {
  switch (action.type) {
    case types.SCREEN_LOADER_SET:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

const loginReducer = (state = initialState.login, action) => {
  switch (action.type) {
    case types.USER_LOGIN_FETCH:
      return {
        ...state,
        loading: true,
      };
    case types.USER_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
      };
    case types.USER_LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
};

// const logoutReducer = (state = initialState.login, action) => {
//   switch (action.type) {
//     case types.USER_LOGOUT_FETCH:
//       return {
//         ...state,
//         loading: true,
//       };
//     case types.USER_LOGOUT_SUCCESS:
//       return {
//         ...state,
//         loading: false,
//         success: false,
//       };
//     case types.USER_LOGOUT_ERROR:
//       return {
//         ...state,
//         loading: false,
//         error: true,
//       };
//     default:
//       return state;
//   }
// };

const profileReducer = (state = initialState.profile, action) => {
  switch (action.type) {
    case types.USER_PROFILE_FETCH:
      return {
        ...state,
        loading: true,
      };
    case types.USER_PROFILE_DATA:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case types.USER_PROFILE_ERROR:
      return {
        ...state,
        loading: false,
      };
    case types.USER_PROFILE_RESET:
      return {
        ...state,
        data: null,
      };
    default:
      return state;
  }
};

const usersReducer = (state = initialState.users, action) => {
  switch (action.type) {
    case types.USERS_FETCH:
      return {
        ...state,
        loading: true,
      };
    case types.USERS_DATA:
      return {
        ...state,
        loading: false,
        list: action.payload,
      };
    case types.USERS_ERROR:
      return {
        ...state,
        loading: false,
      };
    case types.ADD_USER_FETCH:
      return {
        ...state,
        addUserLoading: true,
      };
    case types.ADD_USER_SUCCESS:
      return {
        ...state,
        addUserLoading: false,
        addUserSuccess: true,
        list: [...state.list, action.payload],
      };
    case types.ADD_USER_ERROR:
      return {
        ...state,
        addUserLoading: false,
        addUserError: false,
      };
    case types.UPDATE_USER_FETCH:
      return {
        ...state,
        updateUserLoading: true,
      };
    case types.UPDATE_USER_SUCCESS:
      return {
        ...state,
        updateUserLoading: false,
        updateUserSuccess: true,
        userDetail: action.payload,
        // list: [...state.list, action.payload],
      };
    case types.UPDATE_USER_ERROR:
      return {
        ...state,
        updateUserLoading: false,
        updateUserError: false,
      };
    case types.USER_DETAIL_FETCH:
      return {
        ...state,
        userDetailLoading: true,
      };
    case types.USER_DETAIL_DATA:
      return {
        ...state,
        userDetailLoading: false,
        userDetail: action.payload,
      };
    case types.USER_DETAIL_ERROR:
      return {
        ...state,
        userDetailLoading: false,
      };
    default:
      return state;
  }
};

const rolesReducer = (state = initialState.roles, action) => {
  switch (action.type) {
    case types.ROLES_FETCH:
      return {
        ...state,
        loading: true,
      };
    case types.ROLES_DATA:
      return {
        ...state,
        loading: false,
        list: action.payload,
      };
    case types.ROLES_ERROR:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};
const employeesReducer = (state = initialState.employees, action) => {
  switch (action.type) {
    case types.EMPLOYEES_FETCH:
      return {
        ...state,
        loading: true,
      };
    case types.EMPLOYEES_DATA:
      return {
        ...state,
        loading: false,
        list: action.payload,
      };
    case types.EMPLOYEES_ERROR:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

const serviceCentersReducer = (state = initialState.serviceCenters, action) => {
  switch (action.type) {
    case types.SERVICE_CENTERS_FETCH:
      return {
        ...state,
        loading: true,
      };
    case types.SERVICE_CENTERS_DATA:
      return {
        ...state,
        loading: false,
        list: action.payload,
      };
    case types.SERVICE_CENTERS_ERROR:
      return {
        ...state,
        loading: false,
      };
    case types.UPDATE_SERVICE_CENTER_FETCH:
      return {
        ...state,
        updateLoading: true,
      };
    case types.UPDATE_SERVICE_CENTER_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        updateSuccess: true,
        list: state.list.map((item) =>
          item.code === action.payload.code ? action.payload : item
        ),
      };
    case types.UPDATE_SERVICE_CENTER_ERROR:
      return {
        ...state,
        updateLoading: false,
        updateError: false,
      };
    default:
      return state;
  }
};

const userServiceCentersReducer = (
  state = initialState.userServiceCenters,
  action
) => {
  switch (action.type) {
    case types.USER_SERVICE_CENTERS_FETCH:
      return {
        ...state,
        loading: true,
      };
    case types.USER_SERVICE_CENTERS_DATA:
      return {
        ...state,
        loading: false,
        list: action.payload,
      };
    case types.USER_SERVICE_CENTERS_ERROR:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

const vehicleModelsReducer = (state = initialState.vehicleModels, action) => {
  switch (action.type) {
    case types.VEHICLE_MODELS_FETCH:
      return {
        ...state,
        loading: true,
      };
    case types.VEHICLE_MODELS_DATA:
      return {
        ...state,
        loading: false,
        list: action.payload,
      };
    case types.VEHICLE_MODELS_ERROR:
      return {
        ...state,
        loading: false,
      };
    case types.UPDATE_VEHICLE_MODEL_FETCH:
      return {
        ...state,
        updateLoading: true,
      };
    case types.UPDATE_VEHICLE_MODEL_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        updateSuccess: true,
        list: state.list.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case types.UPDATE_VEHICLE_MODEL_ERROR:
      return {
        ...state,
        updateLoading: false,
        updateError: false,
      };
    default:
      return state;
  }
};
const slotsReducer = (state = initialState.timeSlots, action) => {
  switch (action.type) {
    case types.SLOTS_FETCH:
      return {
        ...state,
        loading: true,
      };
    case types.SLOTS_DATA:
      return {
        ...state,
        loading: false,
        list: action.payload,
      };
    case types.SLOTS_ERROR:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

const bookingStatusesReducer = (
  state = initialState.bookingStatuses,
  action
) => {
  switch (action.type) {
    case types.BOOKING_STATUSES_FETCH:
      return {
        ...state,
        loading: true,
      };
    case types.BOOKING_STATUSES_DATA:
      return {
        ...state,
        loading: false,
        list: action.payload,
      };
    case types.BOOKING_STATUSES_ERROR:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};
const availableSlotsReducer = (
  state = initialState.availableTimeSlots,
  action
) => {
  switch (action.type) {
    case types.AVAILABLE_SLOTS_FETCH:
      return {
        ...state,
        loading: true,
      };
    case types.AVAILABLE_SLOTS_DATA:
      return {
        ...state,
        loading: false,
        list: action.payload,
      };
    case types.AVAILABLE_SLOTS_ERROR:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

const bookingTransactionsReducer = (
  state = initialState.bookingTransactions,
  action
) => {
  switch (action.type) {
    case types.BOOKING_TRANSACTIONS_FETCH:
      return {
        ...state,
        loading: true,
      };
    case types.BOOKING_TRANSACTIONS_DATA:
      return {
        ...state,
        loading: false,
        list: action.payload,
      };
    case types.BOOKING_TRANSACTIONS_ERROR:
      return {
        ...state,
        loading: false,
      };
    case types.BOOKING_TRANSACTION_CREATE_FETCH:
      return {
        ...state,
        addLoading: true,
      };
    case types.BOOKING_TRANSACTION_CREATE_SUCCESS:
      return {
        ...state,
        addLoading: false,
        addSuccess: true,
        list: [...state.list, action.payload],
      };
    case types.BOOKING_TRANSACTION_CREATE_ERROR:
      return {
        ...state,
        addLoading: false,
        addError: false,
      };
    case types.BOOKING_TRANSACTION_UPDATE_FETCH:
      return {
        ...state,
        updateLoading: true,
      };
    case types.BOOKING_TRANSACTION_UPDATE_SUCCESS:
      let newList = state.list;
      if (action.payload.statusId === 6) {
        newList = state.list.filter((item) => item.id !== action.payload.id);
      } else {
        newList = state.list.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      }
      return {
        ...state,
        updateLoading: false,
        updateSuccess: true,
        list: newList,
      };
    case types.BOOKING_TRANSACTION_UPDATE_ERROR:
      return {
        ...state,
        updateLoading: false,
        updateError: false,
      };
    default:
      return state;
  }
};

const serviceAdvisorsReducer = (
  state = initialState.serviceAdvisors,
  action
) => {
  switch (action.type) {
    case types.SERVICE_ADVISORS_FETCH:
      return {
        ...state,
        loading: true,
      };
    case types.SERVICE_ADVISORS_DATA:
      return {
        ...state,
        loading: false,
        list: action.payload,
      };
    case types.SERVICE_ADVISORS_ERROR:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

const customersByMobileReducer = (
  state = initialState.customersByMobile,
  action
) => {
  switch (action.type) {
    case types.SEARCH_CUSTOMERS_BY_MOBILE_FETCH:
      return {
        ...state,
        loading: true,
      };
    case types.SEARCH_CUSTOMERS_BY_MOBILE_DATA:
      return {
        ...state,
        loading: false,
        list: action.payload,
      };
    case types.SEARCH_CUSTOMERS_BY_MOBILE_ERROR:
      return {
        ...state,
        loading: false,
      };
    case types.SEARCH_CUSTOMERS_BY_MOBILE_RESET:
      return initialState;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  auth: authReducer,
  login: loginReducer,
  profile: profileReducer,
  users: usersReducer,
  employees: employeesReducer,
  roles: rolesReducer,
  userServiceCenters: userServiceCentersReducer,
  serviceCenters: serviceCentersReducer,
  vehicleModels: vehicleModelsReducer,
  timeSlots: slotsReducer,
  bookingStatuses: bookingStatusesReducer,
  availableTimeSlots: availableSlotsReducer,
  bookingTransactions: bookingTransactionsReducer,
  screenLoader: screenLoaderReducer,
  serviceAdvisors: serviceAdvisorsReducer,
  customersByMobile: customersByMobileReducer,
});

export default rootReducer;