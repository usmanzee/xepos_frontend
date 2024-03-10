import React, { useEffect, useState } from "react";
import "./index.css";
import {
  Row,
  Col,
  Button,
  Table,
  Card,
  Image,
  Typography,
  Drawer,
  Popconfirm,
  Space,
  Form,
  Input,
  Upload,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  InboxOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addCompanyAction,
  deleteCompanyAction,
  getCompaniesAction,
  updateCompanyAction,
} from "../../redux/actions";

const { Title } = Typography;
const { Dragger } = Upload;

const Companies = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const {
    loading,
    list: companies,
    pagination,
    addLoading,
    addSuccess,
    updateLoading,
    updateSuccess,
    deleteLoading,
    deleteSuccess,
  } = useSelector((state) => state.companies);

  useEffect(() => {
    dispatch(getCompaniesAction(navigate));
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
    setSelectedCompany(null);
    setSelectedImage(null);
    form.resetFields();
    setOpen(false);
  };

  const handlePaginationChange = (page) => {
    dispatch(getCompaniesAction(navigate, page.current));
  };

  const handleAddSubmitClick = () => {
    form.submit();
  };

  const onAddFormSubmit = (values) => {
    const requestObj = {
      name: values.name,
      email: values.email,
      website: values.website,
    };
    const formData = new FormData();
    for (const name in requestObj) {
      if (requestObj[name]) {
        formData.append(name, requestObj[name]);
      }
    }
    if (!selectedCompany) {
      if (selectedImage) {
        formData.append("logo", selectedImage);
      }
      dispatch(addCompanyAction(navigate, formData));
    } else {
      formData.append("_method", "PUT");
      console.log(selectedImage);
      if (selectedImage && selectedImage.uid !== "-1") {
        formData.append("logo", selectedImage);
      }
      formData.append("removeImage", selectedImage ? 0 : 1);
      dispatch(updateCompanyAction(navigate, selectedCompany.id, formData));
    }
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
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
      title: "Company Name",
      dataIndex: "name",
      key: "name",
      render: (value) => {
        return value ? value : "N/A";
      },
    },
    {
      title: "Company Email",
      dataIndex: "email",
      key: "email",
      render: (value) => {
        return value ? value : "N/A";
      },
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
      title: "Logo",
      dataIndex: "logo_url",
      key: "logo_url",
      render: (value) => {
        return value ? <Image width={50} src={value} /> : "N/A";
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
              setSelectedCompany(row);
              form.setFieldsValue({
                name: row.name,
                email: row.email,
                website: row.website,
              });
              if (row.logo) {
                const fileExtentionArr = row.logo.split(".");
                let extention = "";
                if (fileExtentionArr.length > 1) {
                  extention = fileExtentionArr[1];
                }
                const logo = {
                  uid: "-1",
                  name: `${row.name}.${extention}`,
                  status: "done",
                  url: row.logo_url,
                  thumbUrl: row.logo_url,
                };
                setSelectedImage(logo);
              }
              showFormDrawer();
            }}
          />
          <Popconfirm
            title="Delete Company"
            description="Are you sure to delete this company?"
            onConfirm={() => {
              dispatch(deleteCompanyAction(navigate, row.id));
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

  const uploadProps = {
    onRemove: (file) => {
      setSelectedImage(null);
    },
    beforeUpload: (file) => {
      setSelectedImage(file);
      return false;
    },
    listType: "picture",
    multiple: false,
    maxCount: 1,
    fileList: selectedImage ? [selectedImage] : [],
  };

  return (
    <>
      <Card
        title={
          <>
            <Row justify="space-between" style={{ alignItems: "center" }}>
              <Col>
                <Title level={5}>Companies</Title>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={showFormDrawer}
                >
                  Add Company
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
              dataSource={companies}
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
        title="Add New Company"
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
              {!selectedCompany ? "Submit" : "Update"}
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
                name="name"
                label="Compnay Name"
                rules={[
                  {
                    required: true,
                    message: "company name is required.",
                  },
                ]}
              >
                <Input placeholder="Company Name" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="email"
                label="Compnay Email"
                rules={[
                  {
                    required: false,
                    type: "email",
                    message: "Please input a valid email.",
                  },
                ]}
              >
                <Input placeholder="Company Email" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="website"
                label="Compnay Website"
                rules={[
                  {
                    required: false,
                    type: "url",
                    message: "Please input a valid url.",
                  },
                ]}
              >
                <Input placeholder="Company Website" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="logo"
                label="Compnay Logo"
                rules={[
                  {
                    required: false,
                    message: "company logo is required.",
                  },
                ]}
              >
                <Dragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag logo to this area to upload
                  </p>
                </Dragger>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};

export default Companies;
