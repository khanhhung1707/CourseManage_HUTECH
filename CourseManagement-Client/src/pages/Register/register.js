import React, { useState } from "react";
import "./register.css";
import { DatePicker, Input } from 'antd';
import { Card, Form, Button, Divider, notification } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined, IdcardOutlined, TeamOutlined, AimOutlined } from '@ant-design/icons';
import { useHistory, Link } from "react-router-dom";
import axiosClient from "../../apis/axiosClient";

const RegisterCustomer = () => {

    const [delivery, setDelivery] = useState([]);
    let history = useHistory();

    const onFinish = async (values) => {
        try {
            const formatData = {
                "taiKhoan": values.taiKhoan,
                "matKhau": values.matKhau,
                "hoTen": values.hoTen,
                "soDT": values.soDT,
                "maNhom": values.maNhom,
                "email": values.email
            };
            await axiosClient.post("/QuanLyNguoiDung/DangKy", formatData)
                .then(response => {
                    console.log(response);
                    if (response.status === 500) {
                        return notification["error"]({
                            message: "Thông báo",
                            description: response.data,
                        });
                    }
                    if (response === "Email is exist") {
                        return notification["error"]({
                            message: "Thông báo",
                            description: "Email đã tồn tại",
                        });
                    }
                    if (!response) {
                        notification["error"]({
                            message: "Thông báo",
                            description: "Đăng ký thất bại",
                        });
                    } else {
                        notification["success"]({
                            message: "Thông báo",
                            description: "Đăng kí thành công",
                        });
                        setTimeout(() => {
                            history.push("/login");
                        }, 1000);
                    }
                });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="imageBackground">
            <div id="wrapper">
                <Card id="dialog" bordered={false} >
                    <Form
                        style={{ width: 400, marginBottom: 8 }}
                        name="register"
                        className="register-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                    >
                        <Form.Item style={{ marginBottom: 3 }}>
                            <Divider style={{ marginBottom: 5, fontSize: 19 }} orientation="center">GRASSO</Divider>
                        </Form.Item>
                        <Form.Item style={{ marginBottom: 16 }}>
                            <p className="text">Đăng Kí Tài Khoản Khách Hàng</p>
                        </Form.Item>

                        <Form.Item
                            style={{ marginBottom: 20 }}
                            name="taiKhoan"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tài khoản!',
                                },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="siteformitemicon" />} placeholder="Tài khoản" />
                        </Form.Item>

                        <Form.Item
                            style={{ marginBottom: 20 }}
                            name="matKhau"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu!',
                                },
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined className="siteformitemicon" />} placeholder="Mật khẩu" />
                        </Form.Item>

                        <Form.Item
                            style={{ marginBottom: 20 }}
                            name="hoTen"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập họ tên!',
                                },
                            ]}
                        >
                            <Input prefix={<IdcardOutlined className="siteformitemicon" />} placeholder="Họ tên" />
                        </Form.Item>

                        <Form.Item
                            style={{ marginBottom: 20 }}
                            name="soDT"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số điện thoại!',
                                },
                                {
                                    pattern: /^[0-9]{10,15}$/,
                                    message: 'Số điện thoại không hợp lệ, vui lòng kiểm tra lại!',
                                },
                            ]}
                        >
                            <Input prefix={<PhoneOutlined className="siteformitemicon" />} placeholder="Số điện thoại" />
                        </Form.Item>

                        <Form.Item
                            style={{ marginBottom: 20 }}
                            name="maNhom"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mã nhóm!',
                                },
                            ]}
                        >
                            <Input prefix={<AimOutlined className="siteformitemicon" />} placeholder="Mã nhóm" />
                        </Form.Item>

                        <Form.Item
                            style={{ marginBottom: 20 }}
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập email!',
                                },
                                {
                                    type: 'email',
                                    message: 'Email không hợp lệ!',
                                },
                            ]}
                        >
                            <Input prefix={<MailOutlined className="siteformitemicon" />} placeholder="Email" />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 18 }}>
                            <Button className="register-form-button" type="primary" htmlType="submit">
                                Đăng Kí
                            </Button>
                        </Form.Item>
                        <div className="link-login">
                            Đã có tài khoản? <Link className="link" to="/login">Đăng nhập</Link>
                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default RegisterCustomer;
