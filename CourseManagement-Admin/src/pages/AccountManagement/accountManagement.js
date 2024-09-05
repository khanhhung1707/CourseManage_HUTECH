import React, { useState, useEffect } from 'react';
import "./accountManagement.css";
import { Button, Spin, Row, Card, Select, Popconfirm, Form, Modal, Table, Input, Col, notification, BackTop, Tag, Breadcrumb, Space, Popover, message, Drawer } from 'antd';
import { HomeOutlined, PlusOutlined, UserOutlined, DeleteOutlined, StopOutlined, CheckCircleOutlined, CopyOutlined, EditOutlined, SecurityScanOutlined } from '@ant-design/icons';
import userApi from "../../apis/userApi";
import { useHistory } from 'react-router-dom';
import { PageHeader } from '@ant-design/pro-layout';
import axiosClient from '../../apis/axiosClient';
const { Option } = Select;

const AccountManagement = () => {

    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [selectedInput, setSelectedInput] = useState();
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form2] = Form.useForm();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setOpenModalUpdate(false);
    };
    const history = useHistory();

    const accountCreate = async (values) => {
        try {
            const formatData = {
                "taiKhoan": values.taiKhoan,
                "matKhau": values.matKhau,
                "hoTen": values.hoTen,
                "soDT": values.soDT,
                "maLoaiNguoiDung": values.maLoaiNguoiDung,
                "maNhom": "GP10",
                "email": values.email,
            }
            await axiosClient.post("/QuanLyNguoiDung/ThemNguoiDung", formatData)
                .then(response => {
                    console.log(response)
                    if (response == "User with this phone number already exists") {
                        return message.error('Số điện thoại không được trùng');
                    }

                    if (response == "User with this email already exists") {
                        return message.error('Email không được trùng');
                    }

                    if (response == "User already exists") {
                        return message.error('Tài khoản đã tổn tại');
                    } else
                        if (response.message == "Validation failed: Email has already been taken") {
                            message.error('Email has already been taken');
                        } else
                            if (response.message == "Validation failed: Phone has already been taken") {
                                message.error('Validation failed: Phone has already been taken');
                            } else
                                if (response == undefined) {
                                    notification["error"]({
                                        message: `Thông báo`,
                                        description:
                                            'Tạo tài khoản thất bại',

                                    });
                                }
                                else {
                                    notification["success"]({
                                        message: `Thông báo`,
                                        description:
                                            'Tạo tài khoản thành công',
                                    });
                                    form.resetFields();
                                    handleList();
                                    history.push("/account-management");
                                }
                }
                );

            setIsModalVisible(false);

        } catch (error) {
            throw error;
        }
        setTimeout(function () {
            setLoading(false);
        }, 1000);
    }

    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (value, item, index) => (
                (page - 1) * 10 + (index + 1)
            ),
        },
        {
            title: 'Tài khoản',
            dataIndex: 'taiKhoan',
            key: 'taiKhoan',
        },
        {
            title: 'Họ và tên',
            dataIndex: 'hoTen',
            key: 'hoTen',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'soDt',
            key: 'soDt',
        },
        {
            title: 'Role',
            dataIndex: 'maLoaiNguoiDung',
            key: 'maLoaiNguoiDung',
            width: '12%',
            render: (text, record) => (
                <Space size="middle">
                    {
                        text === "GV" ?
                            <Tag color="blue" key={text} style={{ width: 120, textAlign: "center" }} icon={<CopyOutlined />}>
                                Giáo viên
                            </Tag> : text === "HV" ? <Tag color="green" key={text} style={{ width: 120, textAlign: "center" }} icon={<CheckCircleOutlined />}>
                                Học Viên
                            </Tag> : null
                    }
                </Space>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        style={{ width: 150, borderRadius: 15, height: 30, marginBottom: 10 }}
                        onClick={() => handleEditCategory(record)}
                    >
                        {"Chỉnh sửa"}
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn xóa tài khoản này?"
                        onConfirm={() => handleDeleteCategory(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            size="small"
                            icon={<DeleteOutlined />}
                            style={{ width: 150, borderRadius: 15, height: 30 }}
                        >
                            {"Xóa"}
                        </Button>
                    </Popconfirm>
                </div>
            ),
        }

    ];
    const [id, setId] = useState();

    const handleUpdateCategory = async (values) => {
        setLoading(true);
        try {
            const categoryList = {
                "taiKhoan": values.taiKhoan,
                "matKhau": values.matKhau,
                "hoTen": values.hoTen,
                "soDT": values.soDT,
                "maLoaiNguoiDung": values.maLoaiNguoiDung,
                "maNhom": "GP10",
                "email": values.email,
            }
            return axiosClient.put("/QuanLyNguoiDung/CapNhatThongTinNguoiDung", categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa tài khoản thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa tài khoản thành công',
                    });
                    handleList();
                    setOpenModalUpdate(false);
                }
            })

        } catch (error) {
            throw error;
        }
    }

    const handleEditCategory = (record) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                console.log(record);
                setId(record.id);
                form2.setFieldsValue({
                    "taiKhoan": record.taiKhoan,
                    "matKhau": record.matKhau,
                    "hoTen": record.hoTen,
                    "soDT": record.soDt,
                    "maLoaiNguoiDung": record.maLoaiNguoiDung,
                    "maNhom": "GP10",
                    "email": record.email,
                });
                console.log(form2);
                setLoading(false);
            } catch (error) {
                throw error;
            }
        })();
    }


    const handleDeleteCategory = async (record) => {
        setLoading(true);
        try {
            const response = await userApi.xoaNguoiDung(record.taiKhoan);
            console.log(response);
            if (response.status === 500) {
                return notification["error"]({
                    message: `Thông báo`,
                    description: response.data,
                });
            }

            if (response === undefined) {
                notification["error"]({
                    message: `Thông báo`,
                    description: 'Không nhận được phản hồi từ server',
                });
            } else {
                notification["success"]({
                    message: `Thông báo`,
                    description: 'Xóa tài khoản thành công',
                });
                handleList();
            }
        } catch (error) {
            console.log('Failed to delete user:', error);
            notification["error"]({
                message: `Thông báo`,
                description: error.message || 'Có lỗi xảy ra. Vui lòng thử lại.',
            });
        } finally {
            setLoading(false);
        }
    };


    const handleList = () => {
        (async () => {
            try {
                const response = await userApi.listUserByAdmin();
                console.log(response);
                setUser(response);
                setLoading(false);
            } catch (error) {
                console.log('Failed to fetch user list:' + error);
            }
        })();
    }



    const handleFilterEmail = async (email) => {
        try {
            const response = await userApi.searchUser(email);
            setUser(response);
        } catch (error) {
            console.log('search to fetch user list:' + error);
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await userApi.listUserByAdmin();
                console.log(response);
                setUser(response);
                setLoading(false);
            } catch (error) {
                console.log('Failed to fetch user list:' + error);
            }
        })();
        window.scrollTo(0, 0);

    }, [])

    const [selectedRole, setSelectedRole] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

    const handleRoleChange = (value) => {
        setSelectedRole(value);
    };

    const filteredUsers = user.filter(u => {
        const roleCondition = selectedRole === 'all' || u.maLoaiNguoiDung === selectedRole;
        return roleCondition;
    });

    const CancelCreateRecruitment = () => {
        setIsModalVisible(false);
        form.resetFields();
        history.push("/account-management");
    }

    return (
        <div>
            <Spin spinning={loading}>
                <div style={{ marginTop: 20, marginLeft: 24 }}>
                    <Breadcrumb>
                        <Breadcrumb.Item href="">
                            <HomeOutlined />
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="">
                            <UserOutlined />
                            <span>Quản lý tài khoản</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div id="account">
                    <div id="account_container">
                        <PageHeader
                            subTitle=""
                            style={{ fontSize: 14, paddingTop: 20, paddingBottom: 20 }}
                        >
                            <Row>
                                <Col span="12">
                                    <Input
                                        placeholder="Tìm kiếm theo tên người dùng"
                                        allowClear
                                        style={{ width: 300 }}
                                        onChange={handleFilterEmail}
                                        value={selectedInput}
                                    />
                                </Col>
                                <Col span="12">
                                    <Row justify="end">
                                        <Select defaultValue="all" style={{ width: 140, marginLeft: 10 }} onChange={handleRoleChange}>
                                            <Option value="all">Toàn bộ</Option>
                                            <Option value="GV">Giáo viên</Option>
                                            <Option value="HV">Học viên</Option>
                                        </Select>
                                        <Button style={{ marginLeft: 10 }} icon={<PlusOutlined />} size="middle" onClick={showModal}>{"Tạo tài khoản"}</Button>
                                    </Row>
                                </Col>
                            </Row>

                        </PageHeader>
                    </div>
                </div>
                <div style={{ marginTop: 20, marginRight: 5 }}>
                    <div id="account">
                        <div id="account_container">
                            <Card title="Quản lý tài khoản" bordered={false} >
                                <Table columns={columns} dataSource={filteredUsers} pagination={{ position: ['bottomCenter'] }} />
                            </Card>
                        </div>
                    </div>
                </div>

                <Drawer
                    title="Chỉnh sửa tài khoản"
                    visible={openModalUpdate}
                    onClose={() => handleCancel("update")}
                    width={1000}
                    footer={
                        <div
                            style={{
                                textAlign: 'right',
                            }}
                        >
                            <Button onClick={() => {
                                form2
                                    .validateFields()
                                    .then((values) => {
                                        form2.resetFields();
                                        handleUpdateCategory(values);
                                    })
                                    .catch((info) => {
                                        console.log('Validate Failed:', info);
                                    });
                            }} type="primary" style={{ marginRight: 8 }}>
                                Hoàn thành
                            </Button>
                            <Button onClick={() => handleCancel("update")}>
                                Hủy
                            </Button>
                        </div>
                    }
                >
                    <Form
                        form={form2}
                        name="eventCreate"
                        layout="vertical"
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="taiKhoan"
                            label="Tài khoản"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tài khoản!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tài khoản" disabled/>
                        </Form.Item>

                        <Form.Item
                            name="matKhau"
                            label="Mật khẩu"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input.Password placeholder="Mật khẩu" />
                        </Form.Item>

                        <Form.Item
                            name="hoTen"
                            label="Họ và tên"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập họ và tên!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Họ và tên" />
                        </Form.Item>

                        <Form.Item
                            name="soDT"
                            label="Số điện thoại"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số điện thoại!',
                                },
                                {
                                    pattern: /^[0-9]{10}$/,
                                    message: "Số điện thoại phải có 10 chữ số và chỉ chứa số",
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Số điện thoại" />
                        </Form.Item>

                        <Form.Item
                            name="maLoaiNguoiDung"
                            label="Loại người dùng"
                            hasFeedback
                            initialValue="GV" // Giá trị mặc định là "GV"
                            style={{ marginBottom: 10 }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn loại người dùng!',
                                },
                            ]}
                        >
                            <Select placeholder="Chọn loại người dùng">
                                <Option value="HV">Học viên</Option>
                                <Option value="GV">Giáo viên</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            hasFeedback
                            rules={[
                                {
                                    type: 'email',
                                    message: 'Email không hợp lệ!',
                                },
                                {
                                    required: true,
                                    message: 'Vui lòng nhập email!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Email" />
                        </Form.Item>
                    </Form>
                </Drawer>

                <Modal
                    title="Thêm tài khoản"
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <Form
                        form={form}
                        onFinish={accountCreate}
                        name="accountCreate"
                        layout="vertical"
                        initialValues={{
                            role: 'GV', // Giá trị mặc định cho select option
                        }}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="taiKhoan"
                            label="Tài khoản"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tài khoản!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tài khoản" />
                        </Form.Item>

                        <Form.Item
                            name="matKhau"
                            label="Mật khẩu"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input.Password placeholder="Mật khẩu" />
                        </Form.Item>

                        <Form.Item
                            name="hoTen"
                            label="Họ và tên"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập họ và tên!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Họ và tên" />
                        </Form.Item>

                        <Form.Item
                            name="soDT"
                            label="Số điện thoại"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số điện thoại!',
                                },
                                {
                                    pattern: /^[0-9]{10}$/,
                                    message: "Số điện thoại phải có 10 chữ số và chỉ chứa số",
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Số điện thoại" />
                        </Form.Item>

                        <Form.Item
                            name="maLoaiNguoiDung"
                            label="Loại người dùng"
                            hasFeedback
                            initialValue="GV" // Giá trị mặc định là "GV"
                            style={{ marginBottom: 10 }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn loại người dùng!',
                                },
                            ]}
                        >
                            <Select placeholder="Chọn loại người dùng">
                                <Option value="HV">Học viên</Option>
                                <Option value="GV">Giáo viên</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            hasFeedback
                            rules={[
                                {
                                    type: 'email',
                                    message: 'Email không hợp lệ!',
                                },
                                {
                                    required: true,
                                    message: 'Vui lòng nhập email!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Email" />
                        </Form.Item>

                        <Form.Item >
                            <Button style={{ background: "#FF8000", color: '#FFFFFF', float: 'right', marginTop: 20, marginLeft: 8 }} htmlType="submit">
                                Hoàn thành
                            </Button>
                            <Button style={{ background: "#FF8000", color: '#FFFFFF', float: 'right', marginTop: 20 }} onClick={CancelCreateRecruitment}>
                                Hủy
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div>
    )
}

export default AccountManagement;