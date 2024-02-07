import React from "react";
import { Card, Col, Row, Table, Typography, theme } from "antd";
import {
  UAEFormatNumber,
  twenty4HourTo12Hour,
} from "../../helpers/helping-functions";
import {
  ClockCircleOutlined,
  DatabaseOutlined,
  FileDoneOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const Dashboard = () => {
  const { token } = theme.useToken();

  const data = [
    {
      id: 9,
      bookingDate: "2024-01-02",
      slotCode: "05",
      slotStartTime: "09:20:00",
      slotEndTime: "09:40:00",
      slotName: "09:20 to 09:40",
      locationCode: "MG10",
      customerName: "sathish",
      customerMobile: "0527801493",
      customerEmail: "satkkd@gmail.com",
      vehicleRegNumber: "SHJ2 13259",
      vehicleModelCode: "2",
      vehicleModelYear: "2021",
      kmReading: "40,000",
      bookingSource: "API",
      bookingDateTime: "05/01/2024 12:15:00 PM",
      bookingBy: "system",
      vehicleModelName: "MG 7",
    },
    {
      id: 10,
      bookingDate: "2024-01-02",
      slotCode: "06",
      slotStartTime: "09:40:00",
      slotEndTime: "10:00:00",
      slotName: "09:40 to 10:00",
      locationCode: "MG10",
      customerName: "sathish",
      customerMobile: "0527801493",
      customerEmail: "satkkd@gmail.com",
      vehicleRegNumber: "SHJ2 13259",
      vehicleModelCode: "2",
      vehicleModelYear: "2021",
      kmReading: "40,000",
      bookingSource: "API",
      bookingDateTime: "05/01/2024 12:22:57 PM",
      bookingBy: "system",
      vehicleModelName: "MG 7",
    },
    {
      id: 23,
      bookingDate: "2024-01-25",
      slotCode: "01",
      slotStartTime: "08:00:00",
      slotEndTime: "08:20:00",
      slotName: "08:00 to 08:20",
      locationCode: "MG10",
      customerName: "M Usman",
      customerMobile: "123456789",
      customerEmail: "usman@ali-sons.com",
      vehicleRegNumber: "reg-123",
      vehicleModelCode: "1",
      vehicleModelYear: "2020",
      kmReading: "20000",
      bookingSource: "API",
      bookingDateTime: "25/01/2024 4:37:27 PM",
      bookingBy: "system",
      vehicleModelName: "MG 7",
    },
    {
      id: 24,
      bookingDate: "2024-01-25",
      slotCode: "02",
      slotStartTime: "08:20:00",
      slotEndTime: "08:40:00",
      slotName: "08:20 to 08:40",
      locationCode: "MG10",
      customerName: "M Usman",
      customerMobile: "123456789",
      customerEmail: "usman@ali-sons.com",
      vehicleRegNumber: "reg-123",
      vehicleModelCode: "1",
      vehicleModelYear: "2020",
      kmReading: "20000",
      bookingSource: "API",
      bookingDateTime: "25/01/2024 4:38:59 PM",
      bookingBy: "system",
      vehicleModelName: "MG 7",
    },
    {
      id: 25,
      bookingDate: "2024-01-25",
      slotCode: "08",
      slotStartTime: "10:20:00",
      slotEndTime: "10:40:00",
      slotName: "10:20 to 10:40",
      locationCode: "MG10",
      customerName: "M Usman",
      customerMobile: "123456789",
      customerEmail: "usman@ali-sons.com",
      vehicleRegNumber: "reg-123",
      vehicleModelCode: "1",
      vehicleModelYear: "2020",
      kmReading: "20000",
      bookingSource: "API",
      bookingDateTime: "25/01/2024 6:39:28 PM",
      bookingBy: "system",
      vehicleModelName: "MG 7",
    },
    {
      id: 26,
      bookingDate: "2024-01-25",
      slotCode: "08",
      slotStartTime: "10:20:00",
      slotEndTime: "10:40:00",
      slotName: "10:20 to 10:40",
      locationCode: "MG10",
      customerName: "M Usman",
      customerMobile: "123456789",
      customerEmail: "usman@ali-sons.com",
      vehicleRegNumber: "reg-123",
      vehicleModelCode: "1",
      vehicleModelYear: "2020",
      kmReading: "20000",
      bookingSource: "API",
      bookingDateTime: "25/01/2024 6:39:30 PM",
      bookingBy: "system",
      vehicleModelName: "MG 7",
    },
    {
      id: 27,
      bookingDate: "2024-01-25",
      slotCode: "08",
      slotStartTime: "10:20:00",
      slotEndTime: "10:40:00",
      slotName: "10:20 to 10:40",
      locationCode: "MG10",
      customerName: "M Usman",
      customerMobile: "123456789",
      customerEmail: "usman@ali-sons.com",
      vehicleRegNumber: "reg-123",
      vehicleModelCode: "1",
      vehicleModelYear: "2020",
      kmReading: "20000",
      bookingSource: "API",
      bookingDateTime: "25/01/2024 6:39:31 PM",
      bookingBy: "system",
      vehicleModelName: "MG 7",
    },
    {
      id: 31,
      bookingDate: "2024-01-30",
      slotCode: "01",
      slotStartTime: "08:00:00",
      slotEndTime: "08:20:00",
      slotName: "08:00 to 08:20",
      locationCode: "MG10",
      customerName: "M Usman",
      customerMobile: "123456789",
      customerEmail: "usman@ali-sons.com",
      vehicleRegNumber: "reg-123",
      vehicleModelCode: "1",
      vehicleModelYear: "2020",
      kmReading: "20000",
      bookingSource: "API",
      bookingDateTime: "30/01/2024 11:05:37 AM",
      bookingBy: "system",
      vehicleModelName: "MG 7",
    },
    {
      id: 8,
      bookingDate: "2024-01-02",
      slotCode: "04",
      slotStartTime: "09:00:00",
      slotEndTime: "09:20:00",
      slotName: "09:00 to 09:20",
      locationCode: "MG10",
      customerName: "sathish",
      customerMobile: "0527801493",
      customerEmail: "satkkd@gmail.com",
      vehicleRegNumber: "SHJ2 13259",
      vehicleModelCode: "2",
      vehicleModelYear: "2020",
      kmReading: "40,000",
      bookingSource: "API",
      bookingDateTime: "05/01/2024 11:54:25 AM",
      bookingBy: "system",
      vehicleModelName: "MG 7",
    },
    {
      id: 12,
      bookingDate: "2024-01-22",
      slotCode: "01",
      slotStartTime: "08:00:00",
      slotEndTime: "08:20:00",
      slotName: "08:00 to 08:20",
      locationCode: "MG10",
      customerName: "M Usman",
      customerMobile: "123456789",
      customerEmail: "usman@ali-sons.com",
      vehicleRegNumber: "reg-123",
      vehicleModelCode: "1",
      vehicleModelYear: "2020",
      kmReading: "20000",
      bookingSource: "API",
      bookingDateTime: "22/01/2024 4:49:29 PM",
      bookingBy: "system",
      vehicleModelName: "MG 7",
    },
    {
      id: 15,
      bookingDate: "2024-01-25",
      slotCode: "02",
      slotStartTime: "08:20:00",
      slotEndTime: "08:40:00",
      slotName: "08:20 to 08:40",
      locationCode: "MG10",
      customerName: "M Usman",
      customerMobile: "123456789",
      customerEmail: "usman@ali-sons.com",
      vehicleRegNumber: "reg-123",
      vehicleModelCode: "1",
      vehicleModelYear: "2020",
      kmReading: "20000",
      bookingSource: "API",
      bookingDateTime: "25/01/2024 4:24:50 PM",
      bookingBy: "system",
      vehicleModelName: "MG 7",
    },
    {
      id: 11,
      bookingDate: "2024-01-02",
      slotCode: "20",
      slotStartTime: "14:20:00",
      slotEndTime: "14:40:00",
      slotName: "14:20 to 14:40",
      locationCode: "MG10",
      customerName: "sathish",
      customerMobile: "0527801493",
      customerEmail: "satkkd@gmail.com",
      vehicleRegNumber: "SHJ2 13259",
      vehicleModelCode: "2",
      vehicleModelYear: "2021",
      kmReading: "40,000",
      bookingSource: "API",
      bookingDateTime: "05/01/2024 1:11:01 PM",
      bookingBy: "system",
      vehicleModelName: "MG 7",
    },
  ];

  const columns = [
    {
      title: "Date",
      dataIndex: "bookingDate",
      key: "bookingDate",
    },
    {
      title: "Time Slot",
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
      title: "Vehicle Reg Number",
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
      title: "Booking DateTime",
      dataIndex: "bookingDateTime",
      key: "bookingDateTime",
    },
    {
      title: "Booking By",
      dataIndex: "bookingBy",
      key: "bookingBy",
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    // },
  ];

  return (
    <>
      <Row gutter={16}>
        <Col span={24}>
          <Row gutter={16}>
            <Col span={6}>
              <Card
                title={
                  <>
                    <DatabaseOutlined style={{ color: token.colorPrimary }} />
                    <Text strong style={{ marginLeft: "5px", fontSize: 16 }}>
                      Total Appointments
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
                    100
                  </Title>
                  <Text type="secondary">Total Appointments</Text>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                title={
                  <>
                    <ClockCircleOutlined
                      style={{ color: token.colorWarningText }}
                    />
                    <Text strong style={{ marginLeft: "5px", fontSize: 16 }}>
                      In-Process
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
                  10
                </Title>

                <Text type="secondary">In-Process</Text>
              </Card>
            </Col>
            <Col span={6}>
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
            </Col>
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
      <Row gutter={16} style={{ marginTop: "16px" }}>
        <Col span={24}>
          <Card
            title={
              <>
                <DatabaseOutlined /> <Text>Today Appointments</Text>{" "}
              </>
            }
            bordered={false}
          >
            <Table
              bordered
              rowKey="id"
              size="middle"
              columns={columns}
              dataSource={data}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
