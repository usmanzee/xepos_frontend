import * as React from "react";
import dayjs from "dayjs";

import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Popover,
  Row,
  Select,
  Spin,
  Table,
  Tooltip,
  Typography,
  theme,
} from "antd";
import moment from "moment/moment";
import { PlusOutlined } from "@ant-design/icons";
import {
  getAllDaysInMonth,
  getDaysInWeek,
  padTo2Digits,
  twenty4HourTo12Hour,
} from "../../helpers/helping-functions";

/**
 * STATIC DATA IMPORTS
 */
import { AppointmentBookingModal, AppointmentsModal } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import {
  getSlotsFetch,
  getBookingTransactions,
  setScreenLoader,
  getServiceAdvisors,
  getVehicleModelsFetch,
  getAvailableSlotsFetch,
  getBookingStatusesFetch,
  getVehicleOprationsAction,
} from "../../redux/actions";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const CustomTableCell = (props, context) => {
  console.log(props);
  return (
    <Tooltip title="Row Tooptip">
      <td {...props} />
    </Tooltip>
  );
};

const BookAppointment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = theme.useToken();
  const dayRef = React.useRef(null);
  const dateFormat = "YYYY-MM-DD";
  const dateMonthFormat = "YYYY-MM";

  const { loading: profileLoading, data: profile } = useSelector(
    (state) => state.profile
  );
  const { loading: timeSlotsLoading, list: timeSlots } = useSelector(
    (state) => state.timeSlots
  );
  const { loading: bookingStatusesLoading, list: bookingStatuses } =
    useSelector((state) => state.bookingStatuses);
  const {
    loading: bookingTransactionsLoading,
    list: bookingTransactions,
    addLoading: createBookingLoading,
    addSuccess: createBookingSuccess,
    updateLoading: updateBookingLoading,
    updateSuccess: updateBookingSuccess,
  } = useSelector((state) => state.bookingTransactions);

  const { loading: availableSlotsLoading, list: availableSlots } = useSelector(
    (state) => state.availableTimeSlots
  );

  const { loading: vehicleModelsLoading, list: vehicleModels } = useSelector(
    (state) => state.vehicleModels
  );

  const { loading: serviceAdvisorsLoading, list: serviceAdvisors } =
    useSelector((state) => state.serviceAdvisors);
  const { loading: vehicleOperationsLoading, list: vehicleOperations } =
    useSelector((state) => state.vehicleOperations);

  const [selectedYear, setSelectedYear] = React.useState(moment().year());
  const [selectedMonth, setSelectedMonth] = React.useState(
    moment().month() + 1
  );
  const [selectedServiceCenter, setSelectedServiceCenter] =
    React.useState(null);
  const [appointmentBookingModalOpen, setAppointmentBookingModalOpen] =
    React.useState(false);
  const [appointmentsModalOpen, setAppointmentsModalOpen] =
    React.useState(false);
  const [monthDates, setMonthDates] = React.useState([]);
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState(null);
  const [selectedDateSlotAppointments, setSelectedDateSlotAppointments] =
    React.useState([]);
  const [selectedAppointmentToUpdate, setSelectedAppointmentToUpdate] =
    React.useState(null);
  const [selectedAppointmentOperationIds, setSelectedAppointmentOperationIds] =
    React.useState([]);

  const [monthDatesColumns, setMonthDatesColumns] = React.useState([
    {
      title: "Slot",
      dataIndex: "slot",
      key: "slot",
    },
  ]);
  const [morningSlots, setMorningSlots] = React.useState([]);
  const [afternoonSlots, setAfternoonSlots] = React.useState([]);
  const [tableData, setTableData] = React.useState([]);

  const [customerForm] = Form.useForm();
  const [currentBookingStep, setCurrentBookingStep] = React.useState(0);
  const [customerFormValues, setCustomerFormValues] = React.useState({
    customerName: "",
    customerMobile: "",
    customerEmail: "",
    vehicleRegNo: "",
    vehicleModel: "",
    vehicleModelYear: "",
    KmReading: "",
    vehicleOperationIds: [],
    statusId: 1,
  });

  const [isEditing, setisEditing] = React.useState(false);

  React.useEffect(() => {
    dispatch(getSlotsFetch(navigate));
    dispatch(getBookingStatusesFetch(navigate));
    dispatch(getVehicleModelsFetch(navigate));
    dispatch(getVehicleOprationsAction(navigate));
  }, []);

  React.useEffect(() => {
    if (profile && profile.serviceCenters.length) {
      setSelectedServiceCenter(profile.serviceCenters[0]);
    }
  }, [profile]);

  React.useEffect(() => {
    if (selectedServiceCenter) {
      dispatch(getServiceAdvisors(navigate, selectedServiceCenter.code));
    }
  }, [selectedServiceCenter]);

  React.useEffect(() => {
    if (selectedMonth && selectedYear && selectedServiceCenter) {
      const date = `${padTo2Digits(selectedMonth)}-${selectedYear}`;
      dispatch(
        getBookingTransactions(navigate, date, selectedServiceCenter.code)
      );
    }
  }, [selectedMonth, selectedYear, selectedServiceCenter]);

  React.useEffect(() => {
    if (appointmentBookingModalOpen && selectedDate && selectedServiceCenter) {
      const code = selectedServiceCenter.code;
      const fdate = moment(selectedDate).format("MMM,DD YYYY");
      dispatch(getAvailableSlotsFetch(navigate, fdate, code));
    }
  }, [appointmentBookingModalOpen, selectedDate, selectedServiceCenter]);

  React.useEffect(() => {
    // const allDatesInMonth = getAllDaysInMonth(selectedMonth, selectedYear);
    const allDatesInMonth = getDaysInWeek(new Date());
    const formatedDatesInMonth = allDatesInMonth.map((date) => {
      return {
        key: `${padTo2Digits(date.getFullYear())}-${padTo2Digits(
          date.getMonth() + 1
        )}-${padTo2Digits(date.getDate())}`,
        value: date.toLocaleDateString([], { month: "short", day: "numeric" }),
        dayValue: date.getDay(),
        dayName: date.toLocaleDateString("en-us", { weekday: "short" }),
      };
    });
    setMonthDates(formatedDatesInMonth);
  }, [selectedMonth, selectedYear]);

  React.useEffect(() => {
    renderColumnsCallback(monthDates);
  }, [monthDates, bookingTransactions]);

  React.useEffect(() => {
    if (monthDatesColumns.length && dayRef.current) {
      dayRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "start",
      });
    }
  }, [monthDatesColumns]);

  React.useEffect(() => {
    if (timeSlots.length) {
      const morningS = [];
      const afternoonS = [];
      for (var timeSlot of timeSlots) {
        const timeArr = timeSlot.startTime.split(":");
        const hours = timeArr[0];
        const mints = timeArr[1];
        if (
          moment({ hour: hours, minute: mints }).isSameOrBefore(
            moment({ hour: "14", minute: "00" })
          )
        ) {
          morningS.push(timeSlot);
        } else {
          afternoonS.push(timeSlot);
        }
      }
      setMorningSlots(morningS);
      setAfternoonSlots(afternoonS);
    }
  }, [timeSlots]);

  React.useEffect(() => {
    if (timeSlots.length && monthDates.length) {
      const todayDate = moment().format("YYYY-MM-DD");
      const td = timeSlots.map((slot) => {
        let dataObject = {
          time: slot.startTime,
        };
        for (const monthDate of monthDates) {
          // const monthDay = new Date(monthDate["value"]).getDate();

          const transactions = bookingTransactions.filter(
            (bookingTransaction) =>
              bookingTransaction.bookingDate === monthDate.key &&
              bookingTransaction.slotCode === slot.code
          );
          dataObject[monthDate.key] = {
            date: monthDate.key,
            slot: slot,
            day: monthDate.dayValue,
            transactions: transactions.length,
            availableSlots:
              selectedServiceCenter &&
              selectedServiceCenter.slotCapacity - transactions.length,
            disabled:
              !moment(todayDate).isSameOrBefore(moment(monthDate.key)) ||
              monthDate.dayValue === 0,
            isAvailable:
              selectedServiceCenter &&
              selectedServiceCenter.slotCapacity > transactions.length,
          };
        }
        return dataObject;
      });

      setTableData(td);
    }
  }, [timeSlots, monthDates, bookingTransactions, selectedServiceCenter]);

  React.useEffect(() => {
    if (selectedAppointmentToUpdate) {
      setisEditing(true);
      const slotCode = selectedAppointmentToUpdate.slotCode;
      const timeSlot = timeSlots.find((item) => item.code === slotCode);
      setSelectedDate(selectedAppointmentToUpdate.bookingDate);
      setSelectedTimeSlot(timeSlot);
      const updateFormValues = {
        serviceAdvisor: selectedAppointmentToUpdate.serviceAdvisorId
          ? Number(selectedAppointmentToUpdate.serviceAdvisorId)
          : null,
        customerName: selectedAppointmentToUpdate.customerName,
        customerMobile: selectedAppointmentToUpdate.customerMobile,
        customerEmail: selectedAppointmentToUpdate.customerEmail,
        vehicleRegNo: selectedAppointmentToUpdate.vehicleRegNumber,
        vehicleModel: Number(selectedAppointmentToUpdate.vehicleModelCode),
        vehicleModelYear: Number(selectedAppointmentToUpdate.vehicleModelYear),
        KmReading: selectedAppointmentToUpdate.kmReading,
        statusId: selectedAppointmentToUpdate.statusId,
      };
      const selectedOperationIds =
        selectedAppointmentToUpdate.vehicleOperations.map(
          (vehicleOperation) => {
            return vehicleOperation.operationId;
          }
        );
      setSelectedAppointmentOperationIds(selectedOperationIds);
      updateFormValues["vehicleOperationIds"] = selectedOperationIds;
      customerForm.setFieldsValue(updateFormValues);

      showAppointmentBookingModal();
    }
  }, [selectedAppointmentToUpdate]);

  const renderColumnsCallback = React.useCallback(() => {
    if (monthDates.length) {
      setMonthDatesColumns([
        {
          title: "Slot",
          dataIndex: "time",
          width: 120,
          key: "time",
          fixed: true,
          render: (value, row, index) => {
            return twenty4HourTo12Hour(value);
          },
        },
      ]);
      console.log("CALL HERE!!!");
      // console.log(monthDates);
      const columns = monthDates.map((date, index) => {
        const currentMonth = moment().month() + 1;
        const currentYear = moment().year();
        let divRef = null;
        if (
          moment().date() - 2 === new Date(date.value).getDate() &&
          currentMonth === selectedMonth &&
          currentYear === selectedYear
        ) {
          divRef = dayRef;
        } else if (
          (currentMonth !== selectedMonth || currentYear !== selectedYear) &&
          index === 0
        ) {
          divRef = dayRef;
        }
        return {
          title: () => {
            return <div ref={divRef}>{`${date.value} (${date.dayName})`}</div>;
          },
          dataIndex: date.key,
          key: date.key,
          // height: 120,
          width: 120,
          render: (value, row, index) => {
            const slotPopoverContent = (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Text>Date: {`${date.value}, ${selectedYear}`}</Text>
                <Text>Time: {twenty4HourTo12Hour(row.time)}</Text>
                <Text>Booked: {value.transactions}</Text>
                {!value.disabled && (
                  <Text>Available: {value.availableSlots}</Text>
                )}
              </div>
            );

            let backgroundColor = token.colorSuccessBgHover;
            if (value.disabled) {
              backgroundColor = token.colorBgContainerDisabled;
            } else {
              if (!value.isAvailable) {
                backgroundColor = token.colorErrorBgHover;
              } else {
                backgroundColor = token.colorSuccessBgHover;
              }
            }

            return {
              data: row,
              props: {
                style: {
                  background: backgroundColor,
                  cursor: "pointer",
                  alignItems: "center",
                  border: `1px dotted ${token.colorBorder}`,
                  // width: "120px",
                },
              },
              children: (
                <Popover
                  overlayStyle={{ whiteSpace: "pre-line" }}
                  placement="top"
                  title="Slot Details"
                  content={slotPopoverContent}
                >
                  <>
                    <div
                      style={{ textAlign: "center" }}
                      onClick={() => {
                        const clickedDate = date.key;
                        const slotCode = value.slot.code;
                        handleAppointmentsViewClick(clickedDate, slotCode);
                      }}
                    >
                      <Badge size="default" count={value.transactions}></Badge>
                    </div>
                    {!value.disabled && value.isAvailable && (
                      <PlusOutlined
                        style={{
                          fontSize: "12px",
                          color: token.colorIcon,
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          padding: "8px",

                          cursor:
                            !value.disabled && value.isAvailable
                              ? "pointer"
                              : "not-allowed",
                        }}
                        onClick={() => {
                          setSelectedDate(date.key);
                          setSelectedTimeSlot(value.slot);
                          // dispatch(setScreenLoader(true));
                          // console.log(selectedDate, selectedTimeSlot);
                          showAppointmentBookingModal();
                        }}
                      />
                    )}
                  </>
                </Popover>
              ),
            };
          },
        };
      });
      setMonthDatesColumns((prev) => [...prev, ...columns]);
    }
  }, [monthDates, bookingTransactions]);

  const handleAppointmentsViewClick = (date, slotCode) => {
    const appointments = bookingTransactions.filter(
      (bookingTransaction) =>
        bookingTransaction.bookingDate === date &&
        bookingTransaction.slotCode === slotCode
    );
    setSelectedDateSlotAppointments(appointments);
    showAppointmentsModal();
  };

  const showAppointmentBookingModal = () => {
    setAppointmentBookingModalOpen(true);
  };

  const handleAppointmentBookingModalOk = () => {
    setCurrentBookingStep(0);
    setisEditing(false);
    setAppointmentBookingModalOpen(false);
  };

  const handleAppointmentBookingCancel = () => {
    setCurrentBookingStep(0);
    setisEditing(false);
    setAppointmentBookingModalOpen(false);
  };
  const showAppointmentsModal = () => {
    setAppointmentsModalOpen(true);
  };

  const handleAppointmentsModalOk = () => {
    setAppointmentsModalOpen(false);
  };

  const handleAppointmentsCancel = () => {
    setAppointmentsModalOpen(false);
  };
  return (
    <>
      <Row>
        <Col span={24}>
          <Card
            title={
              <Title level={3} style={{ marginTop: "0.5em" }}>
                Appointments
              </Title>
            }
            style={{ borderRadius: "8px" }}
          >
            <Row justify="space-between" style={{ marginBottom: "10px" }}>
              <Col span={20}>
                <Row gutter={[4]}>
                  {/* <Col span={6}>
                    <DatePicker
                      defaultValue={dayjs(dayjs(), dateMonthFormat)}
                      onChange={(date, dateString) => {
                        console.log(date, dateString);
                      }}
                      picker="week"
                    />
                  </Col> */}
                  <Col span={6}>
                    <DatePicker
                      style={{ width: "100%" }}
                      allowClear={false}
                      picker="month"
                      defaultValue={dayjs(dayjs(), dateMonthFormat)}
                      format={dateMonthFormat}
                      // disabledDate={(current) => {
                      //   let customDate = moment().format(dateMonthFormat);
                      //   return (
                      //     current && current < moment(customDate, dateMonthFormat)
                      //   );
                      // }}
                      onChange={(date, dateString) => {
                        setSelectedMonth(date.month() + 1);
                        setSelectedYear(date.year());
                      }}
                    />
                  </Col>

                  <Col span={6}>
                    {selectedServiceCenter && (
                      <Select
                        style={{ width: "100%" }}
                        defaultValue={selectedServiceCenter.code}
                        onChange={(value) => {
                          const selected = profile.serviceCenters.find(
                            (item) => item.code === value
                          );
                          setSelectedServiceCenter(selected);
                        }}
                        options={
                          profile &&
                          profile.serviceCenters.map((serviceCenter) => {
                            return {
                              value: serviceCenter.code,
                              label: serviceCenter.name,
                            };
                          })
                        }
                      />
                    )}
                  </Col>
                </Row>
              </Col>
              <Col
                span={4}
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setSelectedDate(moment().format("YYYY-MM-DD"));
                    showAppointmentBookingModal();
                  }}
                >
                  Add Appointment
                </Button>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <Table
                  columns={monthDatesColumns}
                  dataSource={tableData}
                  bordered
                  rowKey="id"
                  size="middle"
                  // scroll={{
                  //   x: 3000,
                  // }}
                  scroll={{ x: "fit-content" }}
                  // components={{
                  //   body: {
                  //     cell: CustomTableCell,
                  //   },
                  // }}
                  loading={{
                    indicator: (
                      <div>
                        <Spin />
                      </div>
                    ),
                    spinning:
                      profileLoading ||
                      timeSlotsLoading ||
                      bookingTransactionsLoading,
                  }}
                  pagination={false}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <AppointmentBookingModal
        open={appointmentBookingModalOpen}
        onOk={handleAppointmentBookingModalOk}
        onCancel={handleAppointmentBookingCancel}
        morningSlots={morningSlots}
        afternoonSlots={afternoonSlots}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedSlot={selectedTimeSlot}
        setSelectedSlot={setSelectedTimeSlot}
        selectedServiceCenter={selectedServiceCenter}
        availableSlotsLoading={availableSlotsLoading}
        availableSlots={availableSlots}
        vehicleModelsLoading={vehicleModelsLoading}
        vehicleModels={vehicleModels}
        serviceAdvisorsLoading={serviceAdvisorsLoading}
        serviceAdvisors={serviceAdvisors}
        createBookingLoading={createBookingLoading}
        createBookingSuccess={createBookingSuccess}
        updateBookingLoading={updateBookingLoading}
        updateBookingSuccess={updateBookingSuccess}
        form={customerForm}
        currentStep={currentBookingStep}
        setCurrentStep={setCurrentBookingStep}
        formValues={customerFormValues}
        setFormValues={setCustomerFormValues}
        isEditing={isEditing}
        selectedAppointment={selectedAppointmentToUpdate}
        bookingStatusesLoading={bookingStatusesLoading}
        bookingStatuses={bookingStatuses}
        vehicleOperationsLoading={vehicleOperationsLoading}
        vehicleOperations={vehicleOperations}
        selectedAppointmentOperationIds={selectedAppointmentOperationIds}
        setSelectedAppointmentOperationIds={setSelectedAppointmentOperationIds}
      />
      <AppointmentsModal
        open={appointmentsModalOpen}
        onOk={handleAppointmentsModalOk}
        onCancel={handleAppointmentsCancel}
        appointments={selectedDateSlotAppointments}
        selectedAppointment={selectedAppointmentToUpdate}
        setSelectedAppointment={setSelectedAppointmentToUpdate}
        bookingStatusesLoading={bookingStatusesLoading}
        bookingStatuses={bookingStatuses}
        updateBookingLoading={updateBookingLoading}
        updateBookingSuccess={updateBookingSuccess}
      />
    </>
  );
};

export default BookAppointment;
