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

import { getVehicleModelsFetch, updateVehicleModel } from "../../redux/actions";

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

const VehicleModels = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState(null);
  const isEditing = (vehicleModel) => vehicleModel.id === editingKey;

  const { loading: vehicleModelsLoading, list: vehicleModels } = useSelector(
    (state) => state.vehicleModels
  );
  //   const addUserLoading = useSelector((state) => state.users.addUserLoading);

  useEffect(() => {
    dispatch(getVehicleModelsFetch(navigate));
  }, [dispatch, navigate]);

  const handleEdit = (vehicleModel) => {
    form.setFieldsValue({
      desc: "",
      ...vehicleModel,
    });
    setEditingKey(vehicleModel.id);
  };

  const handleCancel = () => {
    setEditingKey(null);
  };

  const handleSave = async (id) => {
    try {
      console.log(id);
      const values = await form.validateFields();
      const selectedVehicleModel = vehicleModels.find((item) => id === item.id);
      if (!selectedVehicleModel) {
        message.error("This is not a valid Vehicle Model!");
        setEditingKey(null);
        return;
      }
      setEditingKey(null);
      values["id"] = id;
      dispatch(updateVehicleModel(navigate, values));
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const tableColumns = [
    // {
    //   title: "#",
    //   dataIndex: "id",
    //   key: "id",
    //   render: (value, row, index) => {
    //     return index + 1;
    //   },
    // },
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      editable: false,
    },
    {
      title: "Name",
      dataIndex: "desc",
      key: "desc",
      editable: true,
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_, vehicleModel) => {
        const editable = isEditing(vehicleModel);
        return editable ? (
          <span>
            <Button type="link" onClick={() => handleSave(vehicleModel.id)}>
              Save
            </Button>

            <Popconfirm title="Sure to cancel?" onConfirm={handleCancel}>
              <Button type="link">Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <Button
            type="link"
            disabled={editingKey !== null}
            onClick={() => handleEdit(vehicleModel)}
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
      onCell: (vehicleModel) => ({
        vehicleModel,
        inputType: col.dataIndex === "slotCapacity" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(vehicleModel),
      }),
    };
  });

  return (
    <>
      <Card
        title={<Title level={4}>Vehicle Models</Title>}
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
                dataSource={vehicleModels}
                columns={mergedColumns}
                pagination={false}
                rowClassName="editable-row"
                rowKey="id"
                loading={{
                  indicator: (
                    <div>
                      <Spin />
                    </div>
                  ),
                  spinning: vehicleModelsLoading,
                }}
              />
            </Form>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default VehicleModels;
