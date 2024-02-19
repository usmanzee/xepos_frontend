import React from "react";
import "./index.css";
import { Card, Col, Image, Radio, Row, Select, Table, Typography } from "antd";
import {
  UAEFormatNumber,
  twenty4HourTo12Hour,
} from "../../helpers/helping-functions";
import {
  DatabaseOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getBookingTransactionsByDateAndServiceCenter } from "../../redux/BookingTransactionActions";
import { getBookingStatusesFetch } from "../../redux/actions";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import processGIF from "../../assets/images/process_1.gif";
import moment from "moment";

const { Text } = Typography;

const Services = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleFullScreen = useFullScreenHandle();

  const { loading: profileLoading, data: profile } = useSelector(
    (state) => state.profile
  );
  const { byTodayAndServiceCenter: byTodayAndServiceCenterBookings } =
    useSelector((state) => state.bookingTransactions);
  const { loading: bookingTransactionsLoading, list: bookingTransactions } =
    byTodayAndServiceCenterBookings;

  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const [todayDate] = React.useState(moment().format("DD-MM-YYYY"));
  //   const [todayDate] = React.useState("15-02-2024");
  const [selectedServiceCenter, setSelectedServiceCenter] =
    React.useState(null);

  const [filteredTransactions, setFilteredTransactions] = React.useState(null);

  React.useEffect(() => {
    dispatch(getBookingStatusesFetch(navigate));
  }, [dispatch, navigate]);

  React.useEffect(() => {
    if (profile && profile.serviceCenters.length) {
      setSelectedServiceCenter(profile.serviceCenters[0]);
    }
  }, [profile]);

  React.useEffect(() => {
    if (todayDate && selectedServiceCenter) {
      dispatch(
        getBookingTransactionsByDateAndServiceCenter(
          navigate,
          todayDate,
          selectedServiceCenter.code
        )
      );
    }
  }, [dispatch, navigate, todayDate, selectedServiceCenter]);

  React.useEffect(() => {
    const intervalCall = setInterval(() => {
      dispatch(
        getBookingTransactionsByDateAndServiceCenter(
          navigate,
          todayDate,
          selectedServiceCenter.code,
          true
        )
      );
    }, 5000);
    return () => {
      clearInterval(intervalCall);
    };
  }, [dispatch, navigate, todayDate, selectedServiceCenter]);

  React.useEffect(() => {
    if (bookingTransactions.length) {
      //   setSelectedServiceCenter(profile.serviceCenters[0]);
      const sortedTransaction = bookingTransactions
        .filter(
          (transaction) =>
            transaction.statusId !== 5 || transaction.statusId !== 6
        )
        .sort((a, b) => b.statusId - a.statusId);
      setFilteredTransactions(sortedTransaction);
    } else {
      setFilteredTransactions([]);
    }
  }, [bookingTransactions]);

  const columns = [
    // {
    //   title: "Booking Date",
    //   dataIndex: "bookingDate",
    //   key: "bookingDate",
    // },
    {
      title: "Booking ID",
      dataIndex: "id",
      key: "id",
      render: (value, row) => {
        return row.statusId === 3 ? (
          <>
            {/* <Radio checked={true}>{value}</Radio> */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image width={20} src={processGIF} />
              <div style={{ marginLeft: "5px" }}>{value}</div>
            </div>
          </>
        ) : (
          value
        );
      },
      //   render(value, row) {
      //     return {
      //       props: {
      //         style: {
      //           background: row.statusId === 3 ? "red" : "white",
      //         },
      //       },
      //       children: value,
      //     };
      //   },
    },
    {
      title: "Booking Time",
      dataIndex: "slotStartTime",
      key: "slotStartTime",
      render: (value) => {
        return twenty4HourTo12Hour(value);
      },

      //   render(value, row) {
      //     return {
      //       props: {
      //         style: {
      //           background: row.statusId === 3 ? "red" : "white",
      //         },
      //       },
      //       children: twenty4HourTo12Hour(value),
      //     };
      //   },
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
    // {
    //   title: "Booking Created At",
    //   dataIndex: "bookingDateTime",
    //   key: "bookingDateTime",
    // },
    // {
    //   title: "Booking Created By",
    //   dataIndex: "bookingBy",
    //   key: "bookingBy",
    // },
    {
      title: "Status",
      dataIndex: "statusName",
      key: "statusName",
      //   defaultSortOrder: "descend",
      //   sorter: {
      //     compare: (a, b) => a.statusName - b.statusName,
      //   },
    },
  ];

  return (
    <>
      <Row gutter={[4]} style={{ marginBottom: "8px" }}>
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
      <FullScreen
        handle={handleFullScreen}
        onChange={(state, handle) => {
          setIsFullScreen(state);
        }}
      >
        <Row>
          <Col span={24}>
            <Card
              style={{ height: isFullScreen ? "100vh" : "100%" }}
              title={
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <DatabaseOutlined /> <Text>Today Bookings</Text>
                  </div>
                  {isFullScreen ? (
                    <FullscreenExitOutlined
                      style={{ fontSize: 20, cursor: "pointer" }}
                      onClick={handleFullScreen.exit}
                    />
                  ) : (
                    <FullscreenOutlined
                      style={{ fontSize: 20, cursor: "pointer" }}
                      onClick={handleFullScreen.enter}
                    />
                  )}
                </div>
              }
              bordered={false}
            >
              <Table
                bordered
                rowKey="id"
                size="middle"
                columns={columns}
                dataSource={filteredTransactions}
                loading={profileLoading || bookingTransactionsLoading}
                pagination={false}
                rowClassName={(record, index) =>
                  record.statusId === 1
                    ? "customer-awaiting"
                    : record.statusId === 2
                    ? "customer-arrived"
                    : record.statusId === 3
                    ? "in-proces-row"
                    : ""
                }
                onRow={(record) => {
                  return {
                    props: {
                      style: { backgroundColor: "red" },
                    },
                    onDoubleClick: () => {
                      // setActiveRecord(record);
                      // setIsModalVisible(true);
                      console.log(record);
                    },
                  };
                }}
              />
            </Card>
          </Col>
        </Row>
      </FullScreen>
    </>
  );
};

export default Services;
