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
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  getUsersAction,
  getUserDetailAction,
  getRolesAction,
  getServiceCentersFetch,
  updateUserAction,
} from "../../redux/actions";

const EditUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const [form] = Form.useForm();

  const [selectedCompanyIds, setSelectedCompanyIds] = useState([]);

  const usersLoading = useSelector((state) => state.users.loading);
  const users = useSelector((state) => state.users.list);

  const rolesLoading = useSelector((state) => state.roles.loading);
  const roles = useSelector((state) => state.roles.list);

  const { loading: serviceCentersLoading, list: serviceCenters } = useSelector(
    (state) => state.serviceCenters
  );

  const userDetailLoading = useSelector(
    (state) => state.users.userDetailLoading
  );
  const userDetail = useSelector((state) => state.users.userDetail);
  const updateUserLoading = useSelector(
    (state) => state.users.updateUserLoading
  );

  useEffect(() => {
    dispatch(getUsersAction(navigate, true));
    dispatch(getServiceCentersFetch(navigate));
    dispatch(getRolesAction(navigate));
  }, []);

  useEffect(() => {
    dispatch(getUserDetailAction(navigate, params.id));
  }, []);

  useEffect(() => {
    if (userDetail) {
      const selectedCentersCodesData = userDetail.serviceCenters.map(
        (serviceCenter) => {
          return serviceCenter.code;
        }
      );
      setSelectedCompanyIds(selectedCentersCodesData);
      userDetail["role_id"] = userDetail.roleId;
      userDetail["servicecenter_codes"] = selectedCentersCodesData;
      form.setFieldsValue(userDetail);
    }
  }, [userDetail]);

  const onFormSubmit = (values) => {
    const selectedEmployee = users.find(
      (user) => user.employeeId === values.employeeId
    );
    if (selectedEmployee)
      return message.error("This Employee has already been added.");

    let centerCodesToAdd = [];
    let centerCodesToDelete = [];

    if (values.servicecenter_codes.length) {
      values.servicecenter_codes.forEach((companyId) => {
        if (!selectedCompanyIds.includes(companyId)) {
          centerCodesToAdd.push(companyId);
        }
      });
    }

    if (values.servicecenter_codes.length) {
      selectedCompanyIds.forEach((selectedCompanyId) => {
        if (!values.servicecenter_codes.includes(selectedCompanyId)) {
          centerCodesToDelete.push(selectedCompanyId);
        }
      });
    }
    values["user_id"] = values["id"];
    values["servicecenter_codes"] = centerCodesToAdd;
    values["delete_servicecenter_codes"] = centerCodesToDelete;
    dispatch(updateUserAction(params.id, values, navigate));
  };

  return (
    <>
      <div>
        {usersLoading &&
        rolesLoading &&
        serviceCentersLoading &&
        userDetailLoading ? (
          <div style={{ textAlign: "center", padding: "24px" }}>
            <Spin />
          </div>
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
                      Edit User
                    </h1>
                  </Divider>
                </Col>
              </Row>
              <Row justify="center">
                <Col
                  xs={{ span: 24, offset: 0 }}
                  sm={{ span: 14, offset: 0 }}
                  md={{ span: 12, offset: 0 }}
                  lg={{ span: 12, offset: 0 }}
                  xl={{ span: 12, offset: 0 }}
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
                          name="id"
                          label="User"
                          rules={[
                            {
                              required: true,
                              message: "Please select user",
                            },
                          ]}
                        >
                          <Select
                            disabled
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
                            {users.map((user) => {
                              return (
                                <Select.Option value={user.id}>
                                  {user.userName}
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
                              message: "Please select Companies",
                            },
                          ]}
                        >
                          <Select
                            mode="multiple"
                            style={{ width: "100%" }}
                            placeholder="Please Select Service Centers"
                            optionFilterProp="children"
                            filterOption={(input, option) => {
                              return (
                                option.children
                                  .map((x) => x.toLowerCase())
                                  .indexOf(input.toLowerCase()) >= 0
                              );
                            }}
                            onChange={(value) => {
                              console.log(value);
                            }}
                          >
                            {serviceCenters.map((serviceCenter) => {
                              return (
                                <Select.Option
                                  key={`key-${serviceCenter.code}`}
                                  value={serviceCenter.code}
                                  // disabled={
                                  //   selectedCompanyIds.includes(company.id)
                                  //     ? true
                                  //     : false
                                  // }
                                >
                                  {serviceCenter.code} - {serviceCenter.name}
                                </Select.Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row justify="space-between">
                      <Col>
                        <Button
                          danger
                          type="primary"
                          onClick={() => navigate(-1)}
                        >
                          Cancel
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          type="primary"
                          htmlType="submit"
                          //   block
                          loading={updateUserLoading}
                          //   onClick={() => handleSubmitClick()}
                        >
                          Submit
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default EditUser;
