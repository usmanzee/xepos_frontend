import React from "react";
import dayjs from "dayjs";
import {
  Avatar,
  Card,
  Col,
  DatePicker,
  Row,
  Select,
  Table,
  Typography,
  theme,
} from "antd";
import {
  UAEFormatNumber,
  padTo2Digits,
  twenty4HourTo12Hour,
} from "../../helpers/helping-functions";
import {
  ClockCircleOutlined,
  DatabaseOutlined,
  FileDoneOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  getBookingTransactions,
  getBookingTransactionsByMonth,
} from "../../redux/BookingTransactionActions";
import { getBookingStatusesFetch } from "../../redux/actions";

const { Title, Text } = Typography;

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const dateMonthFormat = "YYYY-MM";

  const { loading: profileLoading, data: profile } = useSelector(
    (state) => state.profile
  );
  const { byMonthAndServiceCenter: byMonthAndServiceCenterBookings } =
    useSelector((state) => state.bookingTransactions);
  const { loading: bookingTransactionsLoading, list: bookingTransactions } =
    byMonthAndServiceCenterBookings;

  const [selectedYear, setSelectedYear] = React.useState(moment().year());
  const [selectedMonth, setSelectedMonth] = React.useState(
    moment().month() + 1
  );
  const [selectedServiceCenter, setSelectedServiceCenter] =
    React.useState(null);

  const { loading: bookingStatusesLoading, list: bookingStatuses } =
    useSelector((state) => state.bookingStatuses);

  React.useEffect(() => {
    dispatch(getBookingStatusesFetch(navigate));
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
        getBookingTransactions(navigate, date, selectedServiceCenter.code)
      );
    }
  }, [dispatch, navigate, selectedMonth, selectedYear, selectedServiceCenter]);

  React.useEffect(() => {
    const intervalCall = setInterval(() => {
      const date = `${padTo2Digits(selectedMonth)}-${selectedYear}`;
      dispatch(
        getBookingTransactions(navigate, date, selectedServiceCenter.code, true)
      );
    }, 5000);
    return () => {
      clearInterval(intervalCall);
    };
  }, [dispatch, navigate, selectedMonth, selectedYear, selectedServiceCenter]);

  const columns = [
    {
      title: "Booking Date",
      dataIndex: "bookingDate",
      key: "bookingDate",
    },
    {
      title: "Booking Time",
      dataIndex: "slotStartTime",
      key: "slotStartTime",
      render: (value) => {
        return twenty4HourTo12Hour(value);
      },
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Customer Mobile",
      dataIndex: "customerMobile",
      key: "customerMobile",
    },
    {
      title: "Customer Email",
      dataIndex: "customerEmail",
      key: "customerEmail",
    },
    {
      title: "Vehicle Reg. Number",
      dataIndex: "vehicleRegNumber",
      key: "vehicleRegNumber",
    },
    {
      title: "Vehicle Model",
      dataIndex: "vehicleModelName",
      key: "vehicleModelName",
    },
    {
      title: "Vehicle Model Year",
      dataIndex: "vehicleModelYear",
      key: "vehicleModelYear",
    },
    {
      title: "Vehicle Milage(KM)",
      dataIndex: "kmReading",
      key: "kmReading",
      render: (value) => {
        return `${UAEFormatNumber(value)} KM`;
      },
    },
    {
      title: "Booking Created At",
      dataIndex: "bookingDateTime",
      key: "bookingDateTime",
    },
    {
      title: "Booking Created By",
      dataIndex: "bookingBy",
      key: "bookingBy",
    },
    {
      title: "Status",
      dataIndex: "statusName",
      key: "statusName",
    },
  ];

  const cardLoader = () => {
    return (
      <Card loading={true}>
        <Card.Meta
          avatar={
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
          }
          title="Card title"
          description="This is the description"
        />
      </Card>
    );
  };
  return (
    <>
      <Row gutter={[4]} style={{ marginBottom: "8px" }}>
        <Col span={6}>
          <DatePicker
            style={{ width: "100%" }}
            allowClear={false}
            picker="month"
            defaultValue={dayjs(dayjs(), dateMonthFormat)}
            format={dateMonthFormat}
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
      <Row>
        <Col span={24}>
          <Row gutter={8}>
            {bookingTransactionsLoading ? (
              [1, 2, 3, 4, 5, 6].map(() => {
                return <Col span={4}>{cardLoader()}</Col>;
              })
            ) : (
              <>
                <Col span={4}>
                  <Card
                    title={
                      <>
                        {/* <DatabaseOutlined
                          style={{ color: token.colorPrimary }}
                        /> */}
                        <Text
                          strong
                          style={{
                            // marginLeft: "5px",
                            fontSize: 16,
                          }}
                        >
                          Total Bookings
                        </Text>
                      </>
                    }
                    bordered={false}
                  >
                    <div>
                      <Title
                        level={3}
                        style={{
                          marginTop: "0px",
                          marginBottom: "2px",
                          color: token.colorPrimary,
                        }}
                      >
                        {bookingTransactions.length}
                      </Title>
                      <Text type="secondary">Total Bookings</Text>
                    </div>
                  </Card>
                </Col>
                {bookingStatuses.map((item) => {
                  const bookings = bookingTransactions.filter(
                    (transaction) => transaction.statusId === item.id
                  );
                  return (
                    item.id !== 4 && (
                      <Col span={4}>
                        <Card
                          title={
                            <>
                              {/* <ClockCircleOutlined
                                style={{ color: token.colorWarningText }}
                              /> */}
                              <Text
                                strong
                                style={{
                                  // marginLeft: "5px",
                                  fontSize: 14,
                                }}
                              >
                                {item.name}
                              </Text>
                            </>
                          }
                          bordered={false}
                        >
                          <Title
                            level={3}
                            style={{
                              marginTop: "0px",
                              marginBottom: "2px",
                              color: token.colorWarningText,
                            }}
                          >
                            {bookings.length}
                          </Title>

                          <Text type="secondary">{item.name}</Text>
                        </Card>
                      </Col>
                    )
                  );
                })}
              </>
            )}

            {/* <Col span={6}>
              <Card
                title={
                  <>
                    <FileDoneOutlined
                      style={{ color: token.colorSuccessText }}
                    />
                    <Text strong style={{ marginLeft: "5px", fontSize: 16 }}>
                      Scheduled
                    </Text>
                  </>
                }
                bordered={false}
              >
                <Title
                  level={3}
                  style={{
                    marginTop: "0px",
                    marginBottom: "2px",
                    color: token.colorSuccessText,
                  }}
                >
                  59
                </Title>
                <Text type="secondary">Scheduled</Text>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                title={
                  <>
                    <UsergroupAddOutlined
                      style={{ color: token.colorInfoText }}
                    />
                    <Text strong style={{ marginLeft: "5px", fontSize: 16 }}>
                      New Customers
                    </Text>
                  </>
                }
                bordered={false}
              >
                <Title
                  level={3}
                  style={{
                    marginTop: "0px",
                    marginBottom: "2px",
                    color: token.colorInfoText,
                  }}
                >
                  10
                </Title>
                <Text type="secondary">Customers</Text>
              </Card>
            </Col> */}
            {/* <Col span={6}>
              <Card title="Follow Up Customers" bordered={false}>
                <Title
                  level={3}
                  style={{
                    marginTop: "0px",
                    marginBottom: "2px",
                    color: token.colorInfoText,
                  }}
                >
                  41
                </Title>
                <Text type="secondary">Follow Ups</Text>
              </Card>
            </Col> */}
          </Row>
        </Col>
      </Row>
      <Row style={{ marginTop: "8px" }}>
        <Col span={24}>
          <Card
            title={
              <>
                <DatabaseOutlined /> <Text>Bookings</Text>{" "}
              </>
            }
            bordered={false}
          >
            <Table
              bordered
              rowKey="id"
              size="middle"
              columns={columns}
              dataSource={bookingTransactions}
              loading={bookingTransactionsLoading}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
