import {
    Breadcrumb, Button, Card,
    Spin, Table, Tag
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import userApi from "../../../apis/userApi";
import "./cartHistory.css";

const CartHistory = () => {
    const [orderList, setOrderList] = useState([]);
    const [loading, setLoading] = useState(true);
    let { id } = useParams();
    const history = useHistory();

    const columns = [
        {
            title: "Mã Khóa Học",
            dataIndex: "maKhoaHoc",
            key: "maKhoaHoc",
        },
        {
            title: "Tên Khóa Học",
            dataIndex: "tenKhoaHoc",
            key: "tenKhoaHoc",
        },
        {
            title: "Bí Danh",
            dataIndex: "biDanh",
            key: "biDanh",
        },
        {
            title: "Mô Tả",
            dataIndex: "moTa",
            key: "moTa",
        },
        {
            title: "Ngày Tạo",
            dataIndex: "ngayTao",
            key: "ngayTao",
            render: (ngayTao) => (
                <span>{moment(ngayTao).format("DD/MM/YYYY HH:mm")}</span>
            ),
        },
        {
            title: "Hình Ảnh",
            dataIndex: "hinhAnh",
            key: "hinhAnh",
            render: (hinhAnh) => (
                <img src={hinhAnh} alt="Hình ảnh khóa học" style={{ width: 100 }} />
            ),
        },
        {
            title: "Đánh Giá",
            dataIndex: "danhGia",
            key: "danhGia",
        },
        {
            title: "Lượt Xem",
            dataIndex: "luotXem",
            key: "luotXem",
            render: (luotXem) => (
                <div>{Number(luotXem)?.toLocaleString("vi-VN")}</div>
            ),
        },
        
    ];

    const handleList = () => {
        (async () => {
            try {
                const response = await userApi.getProfile();
                console.log(response);
                setLoading(false);
                setOrderList(response.chiTietKhoaHocGhiDanh);
            } catch (error) {
                console.log("Failed to fetch event detail:" + error);
            }
        })();
    }

    useEffect(() => {
        handleList();
        window.scrollTo(0, 0);
    }, []);

    return (
        <div>
            <Spin spinning={false}>
                <Card className="container_details">
                    <div className="product_detail">
                        <div style={{ marginLeft: 5, marginBottom: 10, marginTop: 10 }}>
                            <Breadcrumb>
                                <Breadcrumb.Item href="http://localhost:3500/home">
                                    <span>Trang chủ</span>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item href="">
                                    <span>Quản lý khóa học </span>
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <hr></hr>
                        <div className="container" style={{ marginBottom: 30 }}>

                            <br></br>
                            <Card>
                                <Table
                                    columns={columns}
                                    dataSource={orderList}
                                    rowKey="_id"
                                    pagination={{ position: ["bottomCenter"] }}
                                />
                            </Card>
                        </div>
                    </div>
                </Card>
            </Spin>
        </div>
    );
};

export default CartHistory;
