import React, { useState, useEffect } from "react";
import moment from "moment";

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

const AddUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

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

  useEffect(() => {
    dispatch(getUsersAction(navigate, true));
    dispatch(getEmployeesAction(navigate));
    dispatch(getRolesAction(navigate));
    dispatch(getServiceCentersFetch(navigate));
  }, []);

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

  const usersTableColumns = [
    {
      title: "User ID",
      dataIndex: "id",
      key: "id",
      defaultSortOrder: "descend",
      sorter: {
        compare: (a, b) => a.id - b.id,
      },
    },
    {
      title: "Employee Id",
      dataIndex: "employeeId",
      key: "employeeId",
    },
    {
      title: "Name",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (value, row, index) => {
        return row.email ? row.email : "N/A";
      },
    },
    {
      title: "Service Centers",
      dataIndex: "serviceCenters",
      key: "serviceCenters",
      render: (value, row, index) => {
        return row.serviceCenters.length
          ? row.serviceCenters.map((company) => <Tag>{company.code}</Tag>)
          : "N/A";
      },
    },
    {
      title: "Role",
      dataIndex: "roleName",
      key: "roleName",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      fixed: "right",
      width: 100,
      render: (_, row) => (
        <Button
          type="link"
          onClick={() => {
            navigate(`/users/edit/${row.id}`);
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <>
      <div>
        {usersLoading &&
        rolesLoading &&
        employeesLoading &&
        serviceCentersLoading ? (
          <PageLoader />
        ) : (
          <div>
            <Card style={{ borderRadius: "8px" }}>
              <Row>
                <Col
                  xs={{ span: 24, offset: 0 }}
                  sm={{ span: 18, offset: 3 }}
                  md={{ span: 12, offset: 6 }}
                  lg={{ span: 12, offset: 6 }}
                  xl={{ span: 12, offset: 6 }}
                >
                  <Divider>
                    <h1 style={{ fontSize: "24px", fontWeight: "600" }}>
                      Add New User
                    </h1>
                  </Divider>
                </Col>
              </Row>
              <Row justify="space-between">
                <Col
                  xs={{ span: 24, offset: 0 }}
                  sm={{ span: 18, offset: 3 }}
                  md={{ span: 12, offset: 6 }}
                  lg={{ span: 12, offset: 6 }}
                  xl={{ span: 12, offset: 6 }}
                >
                  <Form
                    layout="vertical"
                    form={form}
                    onFinish={onFormSubmit}
                    autoComplete="off"
                  >
                    <Row gutter={16}>
                      <Col span={16}>
                        <Form.Item
                          name="emp_id"
                          label="Employee"
                          rules={[
                            {
                              required: true,
                              message: "Please select Employee",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Select Employee"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => {
                              return (
                                option.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              );
                            }}
                          >
                            {employees.map((employee) => {
                              return (
                                <Select.Option value={employee.employeeId}>
                                  {`${employee.employeeId} - ${employee.name}`}
                                </Select.Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name="role_id"
                          label="Role"
                          rules={[
                            {
                              required: true,
                              message: "Please select Role",
                            },
                          ]}
                        >
                          <Select>
                            {roles.map((role) => {
                              return (
                                <Select.Option value={role.id}>
                                  {role.name}
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
                          name="servicecenter_codes"
                          label="Service Centers"
                          rules={[
                            {
                              required: true,
                              message: "Please select Service Centers",
                            },
                          ]}
                        >
                          <Select
                            mode="multiple"
                            placeholder="Select Service Centers"
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
                            {serviceCenters.map((serviceCenter) => {
                              return (
                                <Select.Option
                                  key={serviceCenter.code}
                                  // value={company.id}
                                >
                                  {serviceCenter.name}
                                </Select.Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          //   block
                          loading={addUserLoading}
                          onClick={() => handleSubmitClick()}
                        >
                          Submit
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Col>
                <Col
                  xs={{ span: 24, offset: 0 }}
                  sm={{ span: 18, offset: 0 }}
                  md={{ span: 12, offset: 0 }}
                  lg={{ span: 12, offset: 0 }}
                  xl={{ span: 12, offset: 0 }}
                ></Col>
              </Row>
            </Card>

            <Card style={{ borderRadius: "8px" }}>
              <Row>
                <Col md={{ span: 24, offset: 0 }}>
                  <Table
                    bordered
                    dataSource={users}
                    columns={usersTableColumns}
                    pagination={false}
                    rowKey="user_id"
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

export default AddUser;
