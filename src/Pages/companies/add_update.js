import React, { useEffect } from "react";

import {
  Row,
  Col,
  Form,
  Button,
  Divider,
  Table,
  Spin,
  Card,
  Image,
  Popconfirm,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getCompaniesAction } from "../../redux/company_actions";

const AddUpdateCompany = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const {
    loading,
    list: companies,
    addLading: addCompanyLoading,
  } = useSelector((state) => state.companies);

  useEffect(() => {
    dispatch(getCompaniesAction(navigate, true));
  }, [dispatch, navigate]);

  const handleSubmitClick = () => {
    form.submit();
  };

  const onFormSubmit = (values) => {
    // const selectedEmployee = users.find(
    //   (user) => user.employeeId === values.employeeId,
    // );
    // if (selectedEmployee)
    //   return message.error("This Employee has already been added.");
    // dispatch(addUserAction(values, navigate));
    // form.resetFields();
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      defaultSortOrder: "descend",
      sorter: {
        compare: (a, b) => a.id - b.id,
      },
    },
    {
      title: "Company Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Company Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Website",
      dataIndex: "website",
      key: "website",
      render: (value) => {
        return value ? value : "N/A";
      },
    },
    {
      title: "logo_url",
      dataIndex: "logo_url",
      key: "logo_url",
      render: (value) => {
        return <Image width={100} src={value} />;
      },
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
                {/* <Row gutter={16}>
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
                            {users.map((employee) => {
                              return (
                                <Select.Option value={employee.employeeId}>
                                  {`${employee.employeeId} - ${employee.name}`}
                                </Select.Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row> */}
                <Row>
                  <Col span={24}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      //   block
                      loading={addCompanyLoading}
                      onClick={() => handleSubmitClick()}
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
    </>
  );
};

export default AddUpdateCompany;
