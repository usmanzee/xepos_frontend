import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Select,
  Divider,
  Table,
  Spin,
  Card,
  Typography,
  Popconfirm,
  InputNumber,
  Input,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  getServiceCentersFetch,
  updateServiceCenter,
} from "../../redux/actions";
import { PageLoader } from "../../components";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  serviceCenter,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const { Title } = Typography;

const ServiceCenters = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (serviceCenter) => serviceCenter.code === editingKey;

  const { loading: serviceCentersLoading, list: serviceCenters } = useSelector(
    (state) => state.serviceCenters
  );
  //   const addUserLoading = useSelector((state) => state.users.addUserLoading);

  useEffect(() => {
    dispatch(getServiceCentersFetch(navigate));
  }, [dispatch, navigate]);

  const handleEdit = (serviceCenter) => {
    form.setFieldsValue({
      name: "",
      slotCapacity: "",
      ...serviceCenter,
    });
    setEditingKey(serviceCenter.code);
  };

  const handleCancel = () => {
    setEditingKey("");
  };

  const handleSave = async (code) => {
    try {
      const values = await form.validateFields();
      const selectedServiceCenter = serviceCenters.find(
        (item) => code === item.code
      );
      if (!selectedServiceCenter) {
        message.error("This is not a valid service center!");
        setEditingKey("");
        return;
      }
      values["code"] = code;
      dispatch(updateServiceCenter(navigate, values));
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const tableColumns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (value, row, index) => {
        return index + 1;
      },
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      editable: false,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      editable: true,
    },
    {
      title: "Capacity",
      dataIndex: "slotCapacity",
      key: "slotCapacity",
      editable: true,
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_, serviceCenter) => {
        const editable = isEditing(serviceCenter);
        return editable ? (
          <span>
            <Button type="link" onClick={() => handleSave(serviceCenter.code)}>
              Save
            </Button>

            <Popconfirm title="Sure to cancel?" onConfirm={handleCancel}>
              <Button type="link">Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <Button
            type="link"
            disabled={editingKey !== ""}
            onClick={() => handleEdit(serviceCenter)}
          >
            Edit
          </Button>
        );
      },
    },
  ];

  const mergedColumns = tableColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (serviceCenter) => ({
        serviceCenter,
        inputType: col.dataIndex === "slotCapacity" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(serviceCenter),
      }),
    };
  });

  return (
    <>
      <Card
        title={<Title level={4}>Service Centers</Title>}
        style={{ borderRadius: "8px" }}
      >
        <Row>
          <Col md={{ span: 24, offset: 0 }}>
            <Form form={form} component={false}>
              <Table
                components={{
                  body: {
                    cell: EditableCell,
                  },
                }}
                bordered
                dataSource={serviceCenters}
                columns={mergedColumns}
                pagination={false}
                rowClassName="editable-row"
                rowKey="code"
                loading={{
                  indicator: (
                    <div>
                      <Spin />
                    </div>
                  ),
                  spinning: serviceCentersLoading,
                }}
              />
            </Form>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default ServiceCenters;
