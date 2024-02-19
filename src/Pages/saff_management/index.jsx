import React, { useEffect } from "react";
import moment from "moment";
import dayjs from "dayjs";

import {
  Row,
  Col,
  Select,
  Table,
  Spin,
  Card,
  DatePicker,
  theme,
  Checkbox,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  getUsersAction,
  getServiceCentersFetch,
  getStaffHolidatByMonthAndServiceCenter,
  createDeleteHoliday,
} from "../../redux/actions";
import {
  getAllDaysInMonth,
  getDaysInWeek,
  padTo2Digits,
} from "../../helpers/helping-functions";

const StaffManagement = () => {
  const dateMonthFormat = "YYYY-MM";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dayRef = React.useRef(null);

  const { loading: profileLoading, data: profile } = useSelector(
    (state) => state.profile
  );
  const { loading: usersLoading, list: users } = useSelector(
    (state) => state.users
  );
  const { loading: staffHolidaysLoading, list: staffHolidays } = useSelector(
    (state) => state.staffHolidays.byMonthAndServiceCenter
  );

  const [selectedYear, setSelectedYear] = React.useState(moment().year());
  const [selectedMonth, setSelectedMonth] = React.useState(
    moment().month() + 1
  );
  const [serviceAdvisors, setServiceAdvisors] = React.useState([]);
  const [selectedServiceCenter, setSelectedServiceCenter] =
    React.useState(null);
  const [monthDates, setMonthDates] = React.useState([]);
  const [tableData, setTableData] = React.useState([]);
  const [monthDatesColumns, setMonthDatesColumns] = React.useState([]);

  useEffect(() => {
    dispatch(getUsersAction(navigate, true));
    dispatch(getServiceCentersFetch(navigate));
  }, []);

  React.useEffect(() => {
    if (profile && profile.serviceCenters.length) {
      setSelectedServiceCenter(profile.serviceCenters[0]);
    }
  }, [profile]);

  React.useEffect(() => {
    if (selectedMonth && selectedYear && selectedServiceCenter) {
      const date = `${padTo2Digits(selectedMonth)}-${selectedYear}`;
      dispatch(
        getStaffHolidatByMonthAndServiceCenter(
          navigate,
          date,
          selectedServiceCenter.code
        )
      );
    }
  }, [selectedMonth, selectedYear, selectedServiceCenter]);

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
      setServiceAdvisors(advisors);
    }
  }, [selectedServiceCenter, users]);

  React.useEffect(() => {
    if (
      serviceAdvisors.length &&
      monthDates.length &&
      selectedServiceCenter &&
      staffHolidays.length
    ) {
      const todayDate = moment().format("YYYY-MM-DD");
      const td = serviceAdvisors.map((serviceAdvisor) => {
        let dataObject = {
          userId: serviceAdvisor.id,
          employeeName: serviceAdvisor.userName,
          roleName: serviceAdvisor.roleName,
        };
        for (const monthDate of monthDates) {
          const isHolidayExists = staffHolidays.find(
            (staffHoliday) =>
              staffHoliday.userId === serviceAdvisor.id &&
              staffHoliday.serviceCenterCode === selectedServiceCenter.code &&
              staffHoliday.date === monthDate.key
          );
          const isSunday = monthDate.dayValue === 0;
          dataObject[monthDate.key] = {
            holidayId: isHolidayExists ? isHolidayExists.id : null,
            date: monthDate.key,
            day: monthDate.dayValue,
            available: !isHolidayExists && !isSunday,
            disabled:
              !moment(todayDate).isSameOrBefore(moment(monthDate.key)) ||
              isSunday,
          };
        }
        return dataObject;
      });

      setTableData(td);
    }
  }, [serviceAdvisors, monthDates, selectedServiceCenter && staffHolidays]);

  React.useEffect(() => {
    renderColumnsCallback(selectedServiceCenter, monthDates);
  }, [selectedServiceCenter, monthDates]);

  const sorter = (a, b) =>
    isNaN(a) && isNaN(b) ? (a || "").localeCompare(b || "") : a - b;

  const renderColumnsCallback = React.useCallback(() => {
    if (selectedServiceCenter && monthDates.length) {
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
          defaultSortOrder: "descend",
          sortDirections: ["descend", "ascend"],
          sorter: (a, b) => a.roleName.localeCompare(b.roleName),
        },
      ]);
      const columns = monthDates.map((date, index) => {
        const currentMonth = moment().month() + 1;
        const currentYear = moment().year();
        let divRef = null;
        if (
          moment().date() - 5 === new Date(date.key).getDate() &&
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
            return (
              <div
                ref={divRef}
                style={{ cursor: "pointer" }}
              >{`${date.value} (${date.dayName})`}</div>
            );
          },
          dataIndex: date.key,
          key: date.key,
          // height: 120,
          width: 80,
          render: (value, row, index) => {
            return {
              data: row,
              props: {},
              children: (
                <>
                  <div style={{ textAlign: "center" }}>
                    <Checkbox
                      disabled={value.disabled}
                      checked={value.available}
                      onChange={(e) => {
                        // console.log(e.target.checked);
                        // console.log(value);
                        // console.log(row);

                        const obj = {
                          ...(value.holidayId && { id: value.holidayId }),
                          userId: row.userId,
                          date: value.date,
                          serviceCenterCode: selectedServiceCenter.code,
                        };
                        handleChangeCheckBox(e.target.checked, obj);
                      }}
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
  }, [selectedServiceCenter, monthDates]);

  React.useEffect(() => {
    if (monthDatesColumns.length && dayRef.current) {
      dayRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "start",
      });
    }
  }, [monthDatesColumns]);

  const handleChangeCheckBox = (newValue, requestObj) => {
    requestObj["isDelete"] = newValue ? true : false;
    console.log(newValue, requestObj);
    dispatch(createDeleteHoliday(navigate, requestObj));
    // form.resetFields();
  };

  return (
    <>
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
                    options={profile.serviceCenters.map((serviceCenter) => {
                      return {
                        value: serviceCenter.code,
                        label: serviceCenter.name,
                      };
                    })}
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
              loading={profileLoading || usersLoading || staffHolidaysLoading}
            />
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default StaffManagement;
