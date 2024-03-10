const authState = {
  loading: false,
  success: false,
  error: false,
};

const screenLoaderState = {
  loading: false,
};

const loginState = {
  loading: false,
  success: false,
  error: false,
};

const profileState = {
  loading: false,
  data: null,
};

const companiesState = {
  allLoading: false,
  allList: [],
  loading: false,
  list: [],
  pagination: {},
  detailLoading: false,
  detail: null,
  addLoading: false,
  addSuccess: false,
  addError: false,
  updateLoading: false,
  updateSuccess: false,
  updateError: false,
  deleteLoading: false,
  deleteSuccess: false,
  deleteError: false,
};
const employeesState = {
  loading: false,
  list: [],
  pagination: {},
  detailLoading: false,
  detail: null,
  addLoading: false,
  addSuccess: false,
  addError: false,
  updateLoading: false,
  updateSuccess: false,
  updateError: false,
  deleteLoading: false,
  deleteSuccess: false,
  deleteError: false,
};

const usersState = {
  loading: false,
  list: [],
  userDetailLoading: false,
  userDetail: null,
  addUserLoading: false,
  addUserSuccess: false,
  addUserError: false,
  updateUserLoading: false,
  updateUserSuccess: false,
  updateUserError: false,
};

const rolesState = {
  loading: false,
  list: [],
};

const serviceCentersState = {
  loading: false,
  list: [],
  updateLoading: false,
  updateSuccess: false,
};

const userServiceCentersState = {
  loading: false,
  list: [],
};

const vehicleModelsState = {
  loading: false,
  list: [],
  updateLoading: false,
  updateSuccess: false,
};

const timeSlotsState = {
  loading: false,
  list: [],
};

const bookingStatusesState = {
  loading: false,
  list: [],
};

const availableTimeSlotsState = {
  loading: false,
  list: [],
};

const bookingTransactionsState = {
  loading: false,
  list: [],
  byMonthAndServiceCenter: {
    loading: false,
    list: [],
  },
  byMonth: {
    loading: false,
    list: [],
  },
  byTodayAndServiceCenter: {
    loading: false,
    list: [],
  },
  addLoading: false,
  addSuccess: false,
  addError: false,
  updateLoading: false,
  updateSuccess: false,
  updateError: false,
};

const serviceCenterStaffState = {
  loading: false,
  list: [],
};

const customersByMobileState = {
  loading: false,
  list: [],
};

const staffHolidaysState = {
  byMonthAndServiceCenter: {
    loading: false,
    list: [],
  },
  addDeleteLoading: false,
  addDeleteSuccess: false,
};

const vehicleOperationsState = {
  loading: false,
  list: [],
};

const initialState = {
  auth: authState,
  screenLoader: screenLoaderState,
  login: loginState,
  profile: profileState,
  companies: companiesState,
  users: usersState,
  roles: rolesState,
  employees: employeesState,
  serviceCenters: serviceCentersState,
  userServiceCenters: userServiceCentersState,
  vehicleModels: vehicleModelsState,
  bookingStatuses: bookingStatusesState,
  timeSlots: timeSlotsState,
  availableTimeSlots: availableTimeSlotsState,
  bookingTransactions: bookingTransactionsState,
  serviceCenterStaff: serviceCenterStaffState,
  customersByMobile: customersByMobileState,
  staffHolidays: staffHolidaysState,
  vehicleOperations: vehicleOperationsState,
};

export { initialState };
