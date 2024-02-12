import * as React from "react";
import "./index.css";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import dayLocaleData from "dayjs/plugin/localeData";
import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Select,
  Steps,
  message,
  theme,
  Typography,
  List,
  Divider,
  Input,
  Descriptions,
  Skeleton,
  AutoComplete,
  Tag,
} from "antd";
import moment from "moment/moment";
import {
  UAEFormatNumber,
  twenty4HourTo12Hour,
} from "../../helpers/helping-functions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createNewBooking,
  getAvailableSlotsFetch,
  searchCustomersByMobileNumber,
  updateBooking,
} from "../../redux/actions";
import ReactDatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowRightOutlined } from "@ant-design/icons";
dayjs.extend(dayLocaleData);

const { Text } = Typography;

const steps = [
  {
    title: "Confirm Date & Time",
  },
  {
    title: "Customer Details",
  },
  {
    title: "Confirm Appointment",
  },
];

const MyContainer = ({ className, children }) => {
  return (
    <div style={{ width: "100%" }}>
      <CalendarContainer className={className}>
        {/* <div style={{ background: "#f0f0f0" }}>What is your favorite day?</div> */}
        <div style={{ position: "relative", width: "100%" }}>{children}</div>
      </CalendarContainer>
    </div>
  );
};

export const AppointmentBookingModal = (props) => {
  const { token } = theme.useToken();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    open,
    onOk,
    onCancel,
    morningSlots,
    afternoonSlots,
    selectedDate,
    setSelectedDate,
    selectedSlot,
    setSelectedSlot,
    selectedServiceCenter,
    availableSlotsLoading,
    availableSlots,
    vehicleModelsLoading,
    vehicleModels,
    serviceAdvisorsLoading,
    serviceAdvisors,
    createBookingLoading,
    createBookingSuccess,
    updateBookingLoading,
    updateBookingSuccess,
    form,
    currentStep,
    setCurrentStep,
    formValues,
    setFormValues,
    isEditing,
    selectedAppointment,
    bookingStatusesLoading,
    bookingStatuses,
    vehicleOperationsLoading,
    vehicleOperations,
    selectedAppointmentOperationIds,
    setSelectedAppointmentOperationIds,
  } = props;

  const { loading: customersLoading, list: customers } = useSelector(
    (state) => state.customersByMobile
  );

  const [selectedVehicleModel, setSelectedVehicleModel] = React.useState(null);
  const [selectedBookingStatus, setSelectedBookingStatus] =
    React.useState(null);
  const [customerOptions, setCustomerOptions] = React.useState([]);
  const [selectedCustomer, setSelectedCustomer] = React.useState(null);

  React.useEffect(() => {
    if (bookingStatuses.length) {
      setSelectedBookingStatus(bookingStatuses[0]);
    }
  }, [bookingStatuses]);

  React.useEffect(() => {
    const options = customers.map((customer) => {
      return {
        customerId: customer.id,
        value: customer.name,
      };
    });
    setCustomerOptions(options);
  }, [customers]);

  const next = async () => {
    if (currentStep === 0) {
      if (!selectedDate) {
        message.error("Please select date!");
        return;
      }
      if (!selectedSlot) {
        message.error("Please select Time Slot!");
        return;
      }
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 1) {
      const validated = await isCustomFormValidated();
      if (validated) {
        const values = form.getFieldsValue();
        console.log(values);
        setFormValues((prevState) => ({
          ...prevState,
          ...values,
        }));
        setCurrentStep(currentStep + 1);
      }
    }
  };
  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const submitForm = async () => {
    const requestData = {
      ...formValues,
      date: moment(selectedDate).format("MMM,DD YYYY"),
      location: selectedServiceCenter.code,
      timeSlot: selectedSlot.code,
      vehicleModel: formValues.vehicleModel.toString(),
      vehicleModelYear: formValues.vehicleModelYear.toString(),
      serviceAdvisorId: formValues.serviceAdvisor
        ? formValues.serviceAdvisor.toString()
        : null,
    };
    if (!isEditing) {
      if (selectedCustomer) {
        requestData["customerId"] = selectedCustomer.id;
      }
      await dispatch(createNewBooking(navigate, requestData));
    } else {
      requestData["isEditing"] = true;
      requestData["id"] = selectedAppointment.id;

      let operationsIdsToAdd = [];
      let operationsIdsToDelete = [];

      if (formValues.vehicleOperationIds.length) {
        formValues.vehicleOperationIds.forEach((id) => {
          if (!selectedAppointmentOperationIds.includes(id)) {
            operationsIdsToAdd.push(id);
          }
        });
      }

      if (formValues.vehicleOperationIds.length) {
        selectedAppointmentOperationIds.forEach((id) => {
          if (!formValues.vehicleOperationIds.includes(id)) {
            operationsIdsToDelete.push(id);
          }
        });
      }
      requestData["vehicleOperationIds"] = operationsIdsToAdd;
      requestData["deleteVehicleOperationIds"] = operationsIdsToDelete;

      await dispatch(updateBooking(navigate, requestData));
    }
    console.log(requestData);
    setSelectedDate(null);
    setSelectedSlot(null);
    setCurrentStep(0);
    form.resetFields();
    onOk();
  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  const contentStyle = {};

  const isCustomFormValidated = React.useCallback(async () => {
    try {
      await form.validateFields();
      console.log("validated");
      // Validation is successful
      return true;
    } catch (errors) {
      // Errors in the fields
      console.log("Not validated: ", errors);
      return false;
    }
  }, [form]);

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
  };

  const fetchAvailableSlot = (date, code) => {
    const fdate = moment(date).format("MMM,DD YYYY");
    dispatch(getAvailableSlotsFetch(navigate, fdate, code));
  };

  const renderSlotsLoading = () => {
    return (
      <List
        grid={{ gutter: 8, column: 4 }}
        dataSource={[1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15]}
        renderItem={(item) => {
          return (
            <List.Item
              style={{
                marginBlockEnd: "8px",
              }}
            >
              <Card
                bodyStyle={{
                  padding: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* <Skeleton.Button active={true} /> */}
                  <Skeleton.Input active={true} size="small" />
                </div>
              </Card>
            </List.Item>
          );
        }}
      />
    );
  };

  const renderSlots = (slots) => {
    const todayDate = moment().format("YYYY-MM-DD");
    const isPassed =
      selectedDate && moment(todayDate).isAfter(moment(selectedDate));

    return (
      <List
        grid={{ gutter: 8, column: 4 }}
        dataSource={slots}
        renderItem={(item) => {
          const availableSlot = availableSlots.find(
            (availableSlot) => availableSlot.code === item.code
          );
          const isAvailable = !isPassed && availableSlot;
          return (
            <List.Item
              key={item.id}
              style={{
                marginBlockEnd: "8px",
              }}
              onClick={() => (isAvailable ? handleSlotClick(item) : null)}
            >
              <Card
                style={{
                  textDecoration: !isAvailable ? "line-through" : "none",
                  cursor: isAvailable ? "pointer" : "not-allowed",
                  // background: isAvailable
                  //   ? selectedSlot && selectedSlot.code === item.code
                  //     ? token.colorPrimary
                  //     : token.colorBgContainer
                  //   : token.colorBgLayout,

                  background:
                    selectedSlot && selectedSlot.code === item.code
                      ? token.colorPrimary
                      : !isAvailable
                      ? token.colorBgLayout
                      : token.colorBgContainer,
                  color: isAvailable
                    ? selectedSlot && selectedSlot.code === item.code
                      ? token.colorWhite
                      : token.colorText
                    : token.colorTextQuaternary,
                }}
                bodyStyle={{
                  padding: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    // justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {selectedSlot && selectedSlot.code === item.code ? (
                    <ArrowRightOutlined
                      style={{
                        marginRight: "8px",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: "15px",
                        width: "15px",
                        borderRadius: "50%",
                        border: "1px dotted",
                        marginRight: "8px",
                      }}
                    ></div>
                  )}

                  {twenty4HourTo12Hour(item.startTime)}
                </div>
              </Card>
            </List.Item>
          );
        }}
      />
    );
  };

  const renderStepOneContent = () => {
    return (
      <>
        <Row gutter={16} style={{ marginTop: "16px" }}>
          <Col span={10}>
            <Card>
              <ReactDatePicker
                selected={selectedDate ? new Date(selectedDate) : new Date()}
                inline
                minDate={moment().toDate()}
                // disabled={true}
                calendarContainer={MyContainer}
                dateFormat="YYYY-MM-DD"
                onChange={(date) => {
                  const formatDate = moment(date).format("YYYY-MM-DD");
                  setSelectedDate(formatDate);
                  setSelectedSlot(null);
                  const code = selectedServiceCenter.code;
                  fetchAvailableSlot(formatDate, code);
                }}
              />
            </Card>
          </Col>
          <Col span={14}>
            <Card>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "8px",
                }}
              >
                <Text strong underline>
                  Morning Slots:
                </Text>
                <Text type="secondary">
                  {availableSlotsLoading
                    ? "-- -- -- --"
                    : `${
                        morningSlots.length &&
                        twenty4HourTo12Hour(morningSlots[0].startTime)
                      } - ${
                        morningSlots.length &&
                        twenty4HourTo12Hour(
                          morningSlots[morningSlots.length - 1].startTime
                        )
                      }`}
                </Text>
              </div>
              <div>
                {availableSlotsLoading
                  ? renderSlotsLoading()
                  : renderSlots(morningSlots)}
              </div>
              <Divider style={{ margin: "6px 0px 8px 0px" }} />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "8px",
                }}
              >
                <Text strong underline>
                  Afternoon Slots:
                </Text>
                <Text type="secondary">
                  {availableSlotsLoading
                    ? "-- -- -- --"
                    : `${
                        afternoonSlots.length &&
                        twenty4HourTo12Hour(afternoonSlots[0].startTime)
                      } - ${
                        afternoonSlots.length &&
                        twenty4HourTo12Hour(
                          afternoonSlots[afternoonSlots.length - 1].startTime
                        )
                      }`}
                </Text>
              </div>
              <div>
                {availableSlotsLoading
                  ? renderSlotsLoading()
                  : renderSlots(afternoonSlots)}
              </div>
            </Card>
          </Col>
        </Row>
      </>
    );
  };

  const renderStepTwoContent = () => {
    return (
      <>
        <Row style={{ marginTop: "16px" }} justify="center">
          <Col span={12} offset={6}>
            <Descriptions>
              {/* <Descriptions.Item label="Service Center">
                Service center 1
              </Descriptions.Item> */}
              <Descriptions.Item label="Date">
                <b> {moment(selectedDate).format("MMM,DD YYYY")}</b>
              </Descriptions.Item>
              <Descriptions.Item label="Slot">
                <b>{twenty4HourTo12Hour(selectedSlot.startTime)}</b>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        <Form
          form={form}
          layout="vertical"
          className="row-col"
          autoComplete="off"
          initialValues={{
            ...(!isEditing &&
              bookingStatuses.length && {
                statusId: bookingStatuses[0].id,
              }),
          }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Divider>Customer Details</Divider>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="Service Advisor"
                    name="serviceAdvisor"
                    type="text"
                    rules={[
                      {
                        required: false,
                        message: "Please select service advisor!",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Service Advisor"
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) => {
                        return (
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e) => {
                        //  onFilterChange('company_id', e);
                      }}
                    >
                      {serviceAdvisors.map((serviceAdvisor) => {
                        return (
                          <Select.Option value={serviceAdvisor.userId}>
                            {serviceAdvisor.userName}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="Customer Mobile"
                    name="customerMobile"
                    type="text"
                    rules={[
                      {
                        required: true,
                        message: "Please input Customer Mobile!",
                      },
                      // {
                      //   len: 9,
                      //   message: "Please enter a valid 9 digits Mobile number",
                      // },
                      {
                        pattern: /^(?:2|3|4|6|7|9|50|51|52|55|56)[0-9]{7}$/,
                        message: "Please enter a valid Mobile number",
                      },
                    ]}
                  >
                    <Input
                      addonBefore="+971"
                      type="number"
                      placeholder="Customer Mobile(9 Digits) e.g; 503817063"
                      count={{
                        show: true,
                        len: 9,
                      }}
                      disabled={customersLoading}
                      onBlur={(e) => {
                        setSelectedCustomer(null);
                        const value = e.target.value;
                        if (
                          form.getFieldError("customerMobile")?.length === 0 &&
                          value !== ""
                        ) {
                          dispatch(
                            searchCustomersByMobileNumber(navigate, value)
                          );
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="Customer Name"
                    name="customerName"
                    type="text"
                    rules={[
                      {
                        required: true,
                        message: "Please input Customer Name!",
                      },
                    ]}
                  >
                    <AutoComplete
                      options={customerOptions}
                      placeholder="Customer Name"
                      filterOption={(inputValue, option) =>
                        option.value
                          .toUpperCase()
                          .indexOf(inputValue.toUpperCase()) !== -1
                      }
                      onSelect={(value, option) => {
                        const customer = customers.find(
                          (item) => item.id === option.customerId
                        );
                        setSelectedCustomer(customer);
                        form.setFieldValue("customerEmail", customer.email);
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="Customer Email"
                    name="customerEmail"
                    type="email"
                    rules={[
                      {
                        required: true,
                        type: "email",
                        message: "Please input a valid Email address",
                      },
                    ]}
                  >
                    <Input placeholder="Customer Email" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Divider>Vehicle Details</Divider>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="Vehicle Registeration Number"
                    name="vehicleRegNo"
                    type="text"
                    rules={[
                      {
                        required: true,
                        message: "Please input Vehicle Registeration Number!",
                      },
                    ]}
                  >
                    <Input placeholder="Vehicle Registeration Number" />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="Vehicle Model"
                    name="vehicleModel"
                    rules={[
                      {
                        required: true,
                        message: "Please select Vehicle Model!",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Vehicle Model"
                      onChange={(value) => {
                        const model = vehicleModels.find(
                          (item) => item.id === value
                        );
                        setSelectedVehicleModel(model);
                      }}
                    >
                      {vehicleModels.map((vehicleModel) => {
                        return (
                          <Select.Option value={vehicleModel.id}>
                            {vehicleModel.desc}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="Vehicle Model Year"
                    name="vehicleModelYear"
                    type="number"
                    rules={[
                      {
                        required: true,
                        message: "Please input Vehicle Model Year!",
                      },
                    ]}
                  >
                    <Input type="number" placeholder="Vehicle Model Year" />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="Milage(KM)"
                    name="KmReading"
                    type="text"
                    rules={[
                      {
                        required: true,
                        message: "Please input Vehicle Milage in Kilo Meter!",
                      },
                    ]}
                  >
                    <Input
                      addonAfter="KM"
                      type="number"
                      placeholder="Vehicle Milage(KM)"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Divider>Booking Operations/Status</Divider>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                name="vehicleOperationIds"
                label="Operations"
                rules={[
                  {
                    required: false,
                    message: "Please select Vehicle Operations",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select Vehicle Operations"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    return (
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  style={{ width: "100%" }}
                >
                  {vehicleOperations.map((operation) => {
                    return (
                      <Select.Option value={operation.id}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text>{operation.name}</Text>
                          <Text type="secondary" italic>
                            {`${operation.timeHours} Hours`}
                          </Text>
                        </div>
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                name="statusId"
                label="Booking Status"
                rules={[
                  {
                    required: true,
                    message: "Please select Booking Status",
                  },
                ]}
              >
                <Select
                  placeholder="Select Booking Status"
                  style={{ width: "100%" }}
                  onChange={(value) => {
                    const status = bookingStatuses.find(
                      (item) => item.id === value
                    );
                    setSelectedBookingStatus(status);
                  }}
                >
                  {bookingStatuses.map((bookingStatus) => {
                    return (
                      <Select.Option value={bookingStatus.id}>
                        {bookingStatus.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </>
    );
  };

  const renderStepThreeContent = () => {
    const divContainer = { display: "flex", justifyContent: "space-between" };
    return (
      <>
        <Row justify="center">
          <Col span={24}>
            <Card
              // title="Confirm Details"
              style={{ marginTop: "20px" }}
            >
              <Divider style={{ margin: "10px 0px" }} orientation="left">
                Date & Time / Location
              </Divider>
              <div style={divContainer}>
                <Text type="secondary">Date & Time:</Text>
                <Text strong>
                  {moment(selectedDate).format("MMM,DD YYYY")} at{" "}
                  {twenty4HourTo12Hour(selectedSlot.startTime)}
                </Text>
              </div>
              <div
                style={{
                  ...divContainer,
                  marginTop: "10px",
                }}
              >
                <Text type="secondary">Service Center:</Text>
                <Text strong>{selectedServiceCenter.name}</Text>
              </div>
              {/* <div
                style={{
                  ...divContainer,
                  marginTop: "10px",
                }}
              >
                <Text type="secondary">Service Provider:</Text>
                <Text strong>Service provider 1</Text>
              </div> */}
              <Divider style={{ margin: "10px 0px" }} orientation="left">
                Customer Details
              </Divider>
              <div style={divContainer}>
                <Text type="secondary">Customer Name:</Text>
                <Text strong>{formValues.customerName}</Text>
              </div>
              <div style={{ ...divContainer, marginTop: "10px" }}>
                <Text type="secondary">Customer Mobile:</Text>
                <Text strong>+971 {formValues.customerMobile}</Text>
              </div>
              <div style={{ ...divContainer, marginTop: "10px" }}>
                <Text type="secondary">Customer Email:</Text>
                <Text strong>{formValues.customerEmail}</Text>
              </div>
              <Divider style={{ margin: "10px 0px" }} orientation="left">
                Vehicle Details
              </Divider>
              <div style={{ ...divContainer, marginTop: "10px" }}>
                <Text type="secondary">Vehicle Registeration No.:</Text>
                <Text strong>{formValues.vehicleRegNo}</Text>
              </div>
              <div style={{ ...divContainer, marginTop: "10px" }}>
                <Text type="secondary">Vehicle Model:</Text>
                <Text strong>
                  {selectedVehicleModel ? selectedVehicleModel.desc : "N/A"}
                </Text>
              </div>
              <div style={{ ...divContainer, marginTop: "10px" }}>
                <Text type="secondary">Vehicle Model Year:</Text>
                <Text strong>{formValues.vehicleModelYear}</Text>
              </div>
              <div style={{ ...divContainer, marginTop: "10px" }}>
                <Text type="secondary">Milage(KM):</Text>
                <Text strong>{UAEFormatNumber(formValues.KmReading)} KM</Text>
              </div>
              <Divider style={{ margin: "10px 0px" }} orientation="left">
                Booking Operations/Status
              </Divider>
              <div style={{ ...divContainer, marginTop: "10px" }}>
                <Text type="secondary">Booking Operations:</Text>
                <div>
                  {formValues.vehicleOperationIds.map((id) => {
                    const operation = vehicleOperations.find(
                      (item) => item.id === id
                    );
                    return (
                      <Tag
                        strong
                        style={{
                          marginInlineEnd: "0px",
                          marginInlineStart: "8px",
                        }}
                      >
                        {`${operation.name}(${operation.timeHours} hr)`}
                      </Tag>
                    );
                  })}
                </div>
              </div>
              <div style={{ ...divContainer, marginTop: "10px" }}>
                <Text type="secondary">Booking Status:</Text>
                <Text strong>{selectedBookingStatus.name}</Text>
              </div>
            </Card>
          </Col>
        </Row>
      </>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderStepOneContent();
      case 1:
        return renderStepTwoContent();
      default:
        return renderStepThreeContent();
    }
  };

  return (
    <>
      <Modal
        title={isEditing ? "Update Appointment" : "Book New Appointment"}
        maskClosable={false}
        open={open}
        onOk={onOk}
        onCancel={() => {
          setSelectedVehicleModel(null);
          if (bookingStatuses.length) {
            setSelectedBookingStatus(bookingStatuses[0]);
          }
          form.resetFields();
          onCancel();
        }}
        width={1200}
        footer={[
          <div
            style={{
              marginTop: 24,
            }}
          >
            {currentStep > 0 && (
              <Button
                style={{
                  margin: "0 8px",
                }}
                onClick={() => prev()}
              >
                Previous
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                Next
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button
                type="primary"
                loading={createBookingLoading || updateBookingLoading}
                onClick={() => submitForm()}
              >
                {isEditing ? "Update" : "Submit"}
              </Button>
            )}
          </div>,
        ]}
      >
        <Steps
          size="small"
          current={currentStep}
          items={items}
          style={{ marginTop: "25px" }}
        />

        <div style={contentStyle}>
          {/* {steps[currentStep].content(morningSlots, afternoonSlots, form)} */}
          {renderStepContent()}
        </div>
      </Modal>
    </>
  );
};
