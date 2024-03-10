import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  Table,
  Card,
  Typography,
  Drawer,
  Popconfirm,
  Space,
  Form,
  Input,
  message,
  Select,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addEmployeeAction,
  deleteEmployeeAction,
  updateEmployeeAction,
  getEmployeesAction,
  getAllCompaniesAction,
} from "../../redux/actions";

const { Title } = Typography;

const Employees = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const {
    loading,
    list: employees,
    pagination,
    addLoading,
    addSuccess,
    updateLoading,
    updateSuccess,
    deleteLoading,
    deleteSuccess,
  } = useSelector((state) => state.employees);

  const { allLoading, allList: allCompanies } = useSelector(
    (state) => state.companies,
  );

  useEffect(() => {
    dispatch(getAllCompaniesAction(navigate));
  }, [dispatch, navigate]);

  useEffect(() => {
    dispatch(getEmployeesAction(navigate));
  }, [dispatch, navigate]);

  useEffect(() => {
    if (addSuccess) {
      resetFields();
    }
  }, [form, addSuccess]);

  useEffect(() => {
    if (updateSuccess) {
      resetFields();
    }
  }, [form, updateSuccess]);

  const showFormDrawer = () => {
    setOpen(true);
  };
  const onFormDrawerClose = () => {
    if (addLoading || updateLoading) {
      message.warning("Please wait while the request is processing...");
      return false;
    }
    setOpen(false);
    resetFields();
  };

  const resetFields = () => {
    setSelectedEmployee(null);
    setSelectedImage(null);
    form.resetFields();
    setOpen(false);
  };

  const handlePaginationChange = (page) => {
    dispatch(getEmployeesAction(navigate, page.current));
  };

  const handleAddSubmitClick = () => {
    form.submit();
  };

  const onAddFormSubmit = (values) => {
    // const requestObj = {
    //   name: values.name,
    //   email: values.email,
    //   website: values.website,
    // };
    // const formData = new FormData();
    // for (const name in requestObj) {
    //   if (requestObj[name]) {
    //     formData.append(name, requestObj[name]);
    //   }
    // }
    console.log(values);
    if (!selectedEmployee) {
      //   if (selectedImage) {
      //     formData.append("logo", selectedImage);
      //   }
      dispatch(addEmployeeAction(navigate, values));
    } else {
      //   formData.append("_method", "PUT");
      //   console.log(selectedImage);
      //   if (selectedImage && selectedImage.uid !== "-1") {
      //     formData.append("logo", selectedImage);
      //   }
      //   formData.append("removeImage", selectedImage ? 0 : 1);
      dispatch(updateEmployeeAction(navigate, selectedEmployee.id, values));
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      defaultSortOrder: "descend",
      // sorter: {
      //   compare: (a, b) => a.id - b.id,
      // },
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
      render: (value) => {
        return value ? value : "N/A";
      },
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
      render: (value) => {
        return value ? value : "N/A";
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (value) => {
        return value ? value : "N/A";
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (value) => {
        return value ? value : "N/A";
      },
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      render: (value) => {
        return value ? value.name : "N/A";
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      fixed: "right",
      render: (_, row) => (
        <div>
          <Button
            disabled={deleteLoading}
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedEmployee(row);
              form.setFieldsValue({
                first_name: row.first_name,
                last_name: row.last_name,
                email: row.email,
                phone: row.phone,
                ...(row.company && { company_id: row.company.id }),
              });
              showFormDrawer();
            }}
          />
          <Popconfirm
            title="Delete Employee"
            description="Are you sure to delete this employee?"
            onConfirm={() => {
              dispatch(deleteEmployeeAction(navigate, row.id));
            }}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <Button
              disabled={deleteLoading}
              type="primary"
              danger
              icon={<DeleteOutlined />}
              style={{ marginLeft: "8px" }}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <Card
        title={
          <>
            <Row justify="space-between" style={{ alignItems: "center" }}>
              <Col>
                <Title level={5}>Employees</Title>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={showFormDrawer}
                >
                  Add Employee
                </Button>
              </Col>
            </Row>
          </>
        }
        style={{ borderRadius: "8px" }}
      >
        <Row>
          <Col md={{ span: 24, offset: 0 }}>
            <Table
              bordered
              dataSource={employees}
              columns={columns}
              rowKey="id"
              pagination={pagination}
              onChange={handlePaginationChange}
              loading={{
                spinning: loading,
              }}
            />
          </Col>
        </Row>
      </Card>

      <Drawer
        title="Add New Employee"
        placement="right"
        width={500}
        onClose={onFormDrawerClose}
        open={open}
        maskClosable={false}
        extra={
          <Space>
            <Button
              onClick={onFormDrawerClose}
              disabled={addLoading || updateLoading}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => {
                handleAddSubmitClick();
              }}
              loading={addLoading || updateLoading}
            >
              {!selectedEmployee ? "Submit" : "Update"}
            </Button>
          </Space>
        }
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={onAddFormSubmit}
          // autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="first_name"
                label="First Name"
                rules={[
                  {
                    required: true,
                    message: "First name is required.",
                  },
                ]}
              >
                <Input placeholder="First Name" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="last_name"
                label="Last Name"
                rules={[
                  {
                    required: true,
                    message: "Last name is required.",
                  },
                ]}
              >
                <Input placeholder="Last Name" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  {
                    required: false,
                    type: "email",
                    message: "Please input a valid email.",
                  },
                ]}
              >
                <Input placeholder="Email Address" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  {
                    required: false,
                    // type: "number",
                    message: "Please input a phone number.",
                  },
                ]}
              >
                <Input type="number" placeholder="Phone Number" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="company_id"
                label="Select Company"
                rules={[
                  {
                    required: true,
                    message: "Please select company.",
                  },
                ]}
              >
                <Select
                  placeholder="Select Company"
                  style={{
                    width: "100%",
                  }}
                  //   onChange={handleChange}
                  options={allCompanies.map((company) => {
                    return {
                      label: company.name,
                      value: company.id,
                    };
                  })}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};

export default Employees;
