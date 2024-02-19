import * as React from "react";

import { Button, Modal, Select, Space, Table } from "antd";
import {
  UAEFormatNumber,
  twenty4HourTo12Hour,
} from "../../helpers/helping-functions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateBooking } from "../../redux/BookingTransactionActions";
import moment from "moment";

export const AppointmentsModal = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    open,
    onOk,
    onCancel,
    appointments,
    setAppointments,
    selectedAppointment,
    setSelectedAppointment,
    bookingStatusesLoading,
    bookingStatuses,
    updateBookingLoading,
    updateBookingSuccess,
  } = props;

  const [appointmentToUpdate, setAppointmentToUpdate] = React.useState(null);
  const [updatedStatusId, setUpdatedStatusId] = React.useState(null);

  React.useEffect(() => {
    if (updateBookingSuccess && appointmentToUpdate && updatedStatusId) {
      const newList = appointments.map((item) =>
        item.id === appointmentToUpdate.id
          ? {
              ...item,
              statusId: updatedStatusId,
            }
          : item
      );
      setAppointments(newList);
    }
  }, [updateBookingSuccess]);

  const handleStatusChange = async (newStatusId, appointment) => {
    setAppointmentToUpdate(appointment);
    setUpdatedStatusId(newStatusId);
    const requestData = {
      ...appointment,
      date: moment(appointment.bookingDate).format("MMM,DD YYYY"),
      location: appointment.locationCode,
      timeSlot: appointment.slotCode,
      vehicleModel: appointment.vehicleModelCode.toString(),
      vehicleModelYear: appointment.vehicleModelYear.toString(),
      vehicleRegNo: appointment.vehicleRegNumber.toString(),
      statusId: newStatusId,
    };
    await dispatch(updateBooking(navigate, requestData));
  };

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
    // {
    //   title: "Status",
    //   dataIndex: "statusId",
    //   key: "statusId",
    // },
    {
      title: "Booking Status",
      dataIndex: "statusId",
      key: "statusId",
      fixed: "right",
      width: 200,
      render: (value, row) => {
        return (
          <Select
            style={{ width: "100%" }}
            defaultValue={row.statusId}
            disabled={row.statusId === 5}
            onChange={(newValue) => handleStatusChange(newValue, row)}
          >
            {bookingStatuses.map((item) => {
              return <Select.Option value={item.id}>{item.name}</Select.Option>;
            })}
          </Select>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      render: (row, value) => {
        return (
          <Space size="middle">
            <Button
              type="link"
              onClick={() => {
                var now = new Date().getTime();
                setSelectedAppointment({ ...row, uuid: now });
                onOk();
              }}
            >
              Update
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Modal
        title="Bookings"
        maskClosable={false}
        open={open}
        onOk={() => {
          setAppointments([]);
          onOk();
        }}
        onCancel={() => {
          setAppointments([]);
          onCancel();
        }}
        width={1200}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <Table
          bordered
          rowKey="id"
          size="middle"
          scroll={{ x: "fit-content" }}
          columns={columns}
          dataSource={appointments}
          pagination={false}
          loading={bookingStatusesLoading || updateBookingLoading}
        />
      </Modal>
    </>
  );
};
