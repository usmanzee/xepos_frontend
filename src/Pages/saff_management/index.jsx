import React, { useState, useEffect } from "react";
import moment from "moment";
import dayjs from "dayjs";

import {
  Row,
  Col,
  Form,
  Button,
  Select,
  Divider,
  Table,
  message,
  Spin,
  Card,
  Popconfirm,
  Tag,
  DatePicker,
  theme,
  Checkbox,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  getUsersAction,
  getRolesAction,
  getEmployeesAction,
  addUserAction,
  getServiceCentersFetch,
} from "../../redux/actions";
import { PageLoader } from "../../components";
import {
  getAllDaysInMonth,
  getDaysInWeek,
  padTo2Digits,
} from "../../helpers/helping-functions";

const StaffManagement = () => {
  const dateMonthFormat = "YYYY-MM";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = theme.useToken();

  const [form] = Form.useForm();

  const { loading: profileLoading, data: profile } = useSelector(
    (state) => state.profile
  );

  const usersLoading = useSelector((state) => state.users.loading);
  const users = useSelector((state) => state.users.list);

  const rolesLoading = useSelector((state) => state.roles.loading);
  const roles = useSelector((state) => state.roles.list);

  const employeesLoading = useSelector((state) => state.employees.loading);
  const employees = useSelector((state) => state.employees.list);

  const { loading: serviceCentersLoading, list: serviceCenters } = useSelector(
    (state) => state.serviceCenters
  );

  const addUserLoading = useSelector((state) => state.users.addUserLoading);

  const [selectedYear, setSelectedYear] = React.useState(moment().year());
  const [selectedMonth, setSelectedMonth] = React.useState(
    moment().month() + 1
  );
  const [serviceAdvisors, setServiceAdvisors] = React.useState([]);
  const [selectedServiceCenter, setSelectedServiceCenter] =
    React.useState(null);

  const [monthDates, setMonthDates] = React.useState([]);
  const [tableData, setTableData] = React.useState([]);
  const [monthDatesColumns, setMonthDatesColumns] = React.useState([
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      key: "employeeName",
      fixed: "left",
      width: 150,
    },
    {
      title: "Type/Role",
      dataIndex: "roleName",
      key: "roleName",
      fixed: "left",
      width: 170,
    },
  ]);

  useEffect(() => {
    dispatch(getUsersAction(navigate, true));
    dispatch(getEmployeesAction(navigate));
    dispatch(getRolesAction(navigate));
    dispatch(getServiceCentersFetch(navigate));
  }, []);

  React.useEffect(() => {
    if (profile && profile.serviceCenters.length) {
      setSelectedServiceCenter(profile.serviceCenters[0]);
    }
  }, [profile]);

  React.useEffect(() => {
    const allDatesInMonth = getAllDaysInMonth(selectedMonth, selectedYear);
    // const allDatesInMonth = getDaysInWeek(new Date());
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
    if (selectedServiceCenter && users.length) {
      const advisors = users.filter((user) => {
        const userHasServiceCenter = user.serviceCenters.findIndex(
          (serviceCenter) => {
            return serviceCenter.code === selectedServiceCenter.code;
          }
        );
        return (
          userHasServiceCenter !== -1 &&
          (user.roleId === 3 || user.roleId === 4)
        );
      });
      // .map((item) => {
      //   return {
      //     ...item,
      //     available: true,
      //   };
      // });
      setServiceAdvisors(advisors);
    }
  }, [selectedServiceCenter, users]);

  React.useEffect(() => {
    if (serviceAdvisors.length && monthDates.length) {
      const todayDate = moment().format("YYYY-MM-DD");
      const td = serviceAdvisors.map((serviceAdvisor) => {
        let dataObject = {
          // time: slot.startTime,
          employeeName: serviceAdvisor.userName,
          roleName: serviceAdvisor.roleName,
        };
        for (const monthDate of monthDates) {
          // const monthDay = new Date(monthDate["value"]).getDate();

          dataObject[monthDate.key] = {
            date: monthDate.key,
            // slot: slot,
            day: monthDate.dayValue,
            // transactions: transactions.length,
            // availableSlots:
            //   selectedServiceCenter &&
            //   selectedServiceCenter.slotCapacity - transactions.length,
            // disabled:
            //   !moment(todayDate).isSameOrBefore(moment(monthDate.key)) ||
            //   monthDate.dayValue === 0,
            // isAvailable:
            //   selectedServiceCenter &&
            //   selectedServiceCenter.slotCapacity > transactions.length,
            available: true,
          };
        }
        return dataObject;
      });

      setTableData(td);
    }
  }, [serviceAdvisors, monthDates, selectedServiceCenter]);

  React.useEffect(() => {
    renderColumnsCallback(monthDates);
  }, [monthDates]);

  const renderColumnsCallback = React.useCallback(() => {
    if (monthDates.length) {
      console.log("CALL HERE!!!");

      setMonthDatesColumns([
        {
          title: "Employee Name",
          dataIndex: "employeeName",
          key: "employeeName",
          fixed: "left",
          width: 150,
        },
        {
          title: "Type/Role",
          dataIndex: "roleName",
          key: "roleName",
          fixed: "left",
          width: 170,
        },
      ]);
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
          // divRef = dayRef;
        } else if (
          (currentMonth !== selectedMonth || currentYear !== selectedYear) &&
          index === 0
        ) {
          // divRef = dayRef;
        }
        return {
          title: () => {
            // return <div ref={divRef}>{`${date.value} (${date.dayName})`}</div>;
            return <div ref={divRef}>{`${date.value}`}</div>;
          },
          dataIndex: date.key,
          key: date.key,
          // height: 120,
          width: 80,
          render: (value, row, index) => {
            // const slotPopoverContent = (
            //   <div style={{ display: "flex", flexDirection: "column" }}>
            //     <Text>Date: {`${date.value}, ${selectedYear}`}</Text>
            //     <Text>Time: {twenty4HourTo12Hour(row.time)}</Text>
            //     <Text>Booked: {value.transactions}</Text>
            //     {!value.disabled && (
            //       <Text>Available: {value.availableSlots}</Text>
            //     )}
            //   </div>
            // );

            // let backgroundColor = token.colorSuccessBgHover;
            // if (value.disabled) {
            //   backgroundColor = token.colorBgContainerDisabled;
            // } else {
            //   if (!value.isAvailable) {
            //     backgroundColor = token.colorErrorBgHover;
            //   } else {
            //     backgroundColor = token.colorSuccessBgHover;
            //   }
            // }

            return {
              data: row,
              props: {
                style: {
                  // background: backgroundColor,
                  cursor: "pointer",
                  alignItems: "center",
                  border: `1px dotted ${token.colorBorder}`,
                  // width: "120px",
                },
              },
              children: (
                <>
                  <div
                    style={{ textAlign: "center" }}
                    onClick={() => {
                      console.log(value);
                      console.log(row);
                      // const clickedDate = date.key;
                      // const slotCode = value.slot.code;
                      // handleAppointmentsViewClick(clickedDate, slotCode);
                    }}
                  >
                    <Checkbox
                      checked={value.available}
                      onChange={() => {}}
                    ></Checkbox>
                  </div>
                </>
              ),
            };
          },
        };
      });
      setMonthDatesColumns((prev) => [...prev, ...columns]);
    }
  }, [monthDates]);

  const handleSubmitClick = () => {
    form.submit();
  };

  const onFormSubmit = (values) => {
    const selectedEmployee = users.find(
      (user) => user.employeeId === values.employeeId
    );
    if (selectedEmployee)
      return message.error("This Employee has already been added.");

    dispatch(addUserAction(values, navigate));
    form.resetFields();
  };

  return (
    <>
      <div>
        {profileLoading &&
        usersLoading &&
        rolesLoading &&
        employeesLoading &&
        serviceCentersLoading ? (
          <PageLoader />
        ) : (
          <div>
            <Card
              title="Staff Management (Availability)"
              style={{ borderRadius: "8px" }}
            >
              <Row justify="space-between" style={{ marginBottom: "10px" }}>
                <Col span={20}>
                  <Row gutter={[4]}>
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
                          options={profile.serviceCenters.map(
                            (serviceCenter) => {
                              return {
                                value: serviceCenter.code,
                                label: serviceCenter.name,
                              };
                            }
                          )}
                        />
                      )}
                    </Col>
                  </Row>
                </Col>
                {/* <Col
                span={4}
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    // setSelectedDate(moment().format("YYYY-MM-DD"));
                    showAppointmentBookingModal();
                  }}
                >
                  Add Appointment
                </Button>
              </Col> */}
              </Row>
              <Row>
                <Col md={{ span: 24, offset: 0 }}>
                  <Table
                    bordered
                    // dataSource={serviceAdvisors}
                    // columns={usersTableColumns}
                    columns={monthDatesColumns}
                    dataSource={tableData}
                    pagination={false}
                    rowKey="user_id"
                    scroll={{ x: "fit-content" }}
                    loading={{
                      indicator: (
                        <div>
                          <Spin />
                        </div>
                      ),
                      spinning: usersLoading,
                    }}
                  />
                </Col>
              </Row>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default StaffManagement;
