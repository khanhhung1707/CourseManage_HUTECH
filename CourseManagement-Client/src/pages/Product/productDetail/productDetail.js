import {
    Breadcrumb, Button, Card, Carousel, Col, Form,
    Modal, Row,
    Spin,
    notification, TimePicker, DatePicker, Select, Calendar,
    message
} from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import courtsManagementApi from "../../../apis/courtsManagementApi";
import triangleTopRight from "../../../assets/icon/Triangle-Top-Right.svg";
import { numberWithCommas } from "../../../utils/common";
import bookingApi from "../../../apis/bookingApi";
import dayjs from 'dayjs';
import moment from "moment";
import userApi from "../../../apis/userApi";
import productApi from "../../../apis/productApi";
import axiosClient from "../../../apis/axiosClient";
import axios from "axios";

const { Option } = Select;

const ProductDetail = () => {
    const [productDetail, setProductDetail] = useState([]);
    const [recommend, setRecommend] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    let { id } = useParams();
    const history = useHistory();

    const handleReadMore = (id) => {
        console.log(id);
        history.push("/product-detail/" + id);
        window.location.reload();
    };


    const [reviews, setProductReview] = useState([]);
    const [reviewsCount, setProductReviewCount] = useState([]);
    const [avgRating, setAvgRating] = useState(null);
    const [bookingCourt, setBookingCourt] = useState([]);

    const [userData, setUserData] = useState([]);

    const [qr, setQR] = useState();

    const handleCategoryList = async () => {
        try {
            await bookingApi.getBookingByCourt(id).then(item => {
                console.log(item);
                setBookingCourt(item);
            })

            await courtsManagementApi.getCourtById(id).then((item) => {
                setProductDetail(item);
                setProductReview(item.reviews);
                setProductReviewCount(item.reviewStats);
                setAvgRating(item.avgRating);
                console.log(((reviewsCount[4] || 0) / reviews.length) * 100);
            });
            await courtsManagementApi.getAllCourts().then((item) => {
                setRecommend(item);
            });
            setLoading(false);

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        };
    }

    useEffect(() => {
        (async () => {
            try {

                // Lấy thông tin user và role từ localStorage
                const user = localStorage.getItem('user');
                const parsedUser = user ? JSON.parse(user) : null;
                setUserData(parsedUser);

                await productApi.searchProductsKhoaHoc(id).then(async item => {
                    console.log(item);
                    setProductDetail(item);
                    console.log(((reviewsCount[4] || 0) / reviews.length) * 100);
                });

                setLoading(false);
            } catch (error) {
                console.log("Failed to fetch event detail:" + error);
            }
        })();
        window.scrollTo(0, 0);
    }, []);



    const handleOkUser = async (values) => {
        const user = localStorage.getItem('user');
        if (!user) {
            return history.push("/login")
        }
        setLoading(true);
        try {
            const bookingDateTime = dayjs(values.booking_date); // Chuyển đổi booking_date thành đối tượng dayjs
            const startTime = dayjs(values.start_time);
            const endTime = dayjs(values.end_time);
            // Tính thời gian đặt sân (phút)
            const bookingDuration = endTime.diff(startTime, 'minute');
            console.log("thời gian đặt sân", bookingDuration)
            // Tính total_amount
            const totalAmount = ((bookingDuration / 60) * productDetail.price);
            const categoryList = {
                "booking_date": bookingDateTime.format('YYYY-MM-DD'), // Lấy ngày tháng năm
                "payment_method": values.payment_method,
                "start_time": startTime.format('HH:mm'), // Lấy giờ và phút
                "end_time": endTime.format('HH:mm'),
                "user_id": userData.id,
                "court_id": Number(id),
                "total_amount": totalAmount
            };
            setLoading(false);

            return bookingApi.bookCourt(categoryList).then(response => {
                if (response.message === "Booking time conflicts with existing booking") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Đặt sân không được trùng',
                    });
                    return;
                }
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Đặt sân thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Đặt sân thành công',
                    });
                    setOpenModalCreate(false);

                    handleCategoryList();
                }

            })

        } catch (error) {
            throw error;
        }
    }

    const [openModalCreate, setOpenModalCreate] = useState(false);


    const isButtonDisabled = productDetail.status !== 'active' ? true : false;

    function disabledDate(current) {
        // Vô hiệu hóa tất cả các ngày quá khứ
        return current && current < moment().startOf('day');
    }

    const [buttonText, setButtonText] = useState('Ghi danh ngay');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const registerCourse = async () => {
        try {
            const local = localStorage.getItem("user");
            const user = JSON.parse(local);
            const params = {
                maKhoaHoc: id,
                taiKhoan: user.taiKhoan,
            }
            const response = await axiosClient.post('/QuanLyKhoaHoc/DangKyKhoaHoc', params);
            if (response) {
                // message.success('Ghi danh thành công!');
                setButtonText('Hủy ghi danh');
            }
        } catch (error) {
            message.error('Ghi danh thất bại, vui lòng thử lại!');
        }
    };

    const cancelRegistration = async () => {
        try {
            const local = localStorage.getItem("user");
            const user = JSON.parse(local);
            const params = {
                maKhoaHoc: id,
                taiKhoan: user.taiKhoan,
            }
            const response = await axiosClient.post('/QuanLyKhoaHoc/HuyGhiDanh', params);
            if (response) {
                message.success('Hủy ghi danh thành công!');
                setButtonText('Ghi danh ngay');
            }
        } catch (error) {
            message.error('Hủy ghi danh thất bại, vui lòng thử lại!');
        }
    };

    const [cartLength, setCartLength] = useState();

    const paymentCard = (product) => {
        console.log(product);
        const existingItems = JSON.parse(localStorage.getItem('cart')) || [];
        let updatedItems;
        const existingItemIndex = existingItems.findIndex((item) => item.maKhoaHoc === product.maKhoaHoc);
        if (existingItemIndex !== -1) {
            // If product already exists in the cart, increase its quantity
            updatedItems = existingItems.map((item, index) => {
                if (index === existingItemIndex) {
                    return {
                        ...item,
                        quantity: item.quantity + 1,
                    };
                }
                return item;
            });
        } else {
            // If product does not exist in the cart, add it to the cart
            updatedItems = [...existingItems, { ...product, quantity: 1 }];
        }
        console.log(updatedItems.length);
        setCartLength(updatedItems.length);
        localStorage.setItem('cart', JSON.stringify(updatedItems));
        localStorage.setItem('cartLength', updatedItems.length);
        history.push("/cart");
    }

    const handleOk = () => {
        registerCourse();
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleButtonClick = () => {
        if (buttonText === 'Ghi danh ngay') {
            showModal();
        } else {
            cancelRegistration();
        };
    }

    return (
        <div>
            <Spin spinning={false}>
                <Card className="container_details">
                    <div className="product_detail">
                        <div style={{ marginLeft: 5, marginBottom: 10 }}>
                            <Breadcrumb>
                                <Breadcrumb.Item href="http://localhost:3500/home">
                                    {/* <HomeOutlined /> */}
                                    <span>Trang chủ</span>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item href="http://localhost:3500/product-list/643cd88879b4192efedda4e6">
                                    {/* <AuditOutlined /> */}
                                    <span>khóa học</span>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item href="">
                                    <span>{productDetail.name}</span>
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <hr></hr>
                        <Row gutter={12} style={{ marginTop: 20, marginBottom: 20 }}>
                            <Col span={13}>
                                <Card className="card_image" bordered={false}>
                                    <img src={productDetail.hinhAnh + productDetail.biDanh + ".jpg"} />
                                    <div className="promotion"></div>
                                </Card>
                            </Col>
                            <Col span={11}>
                                <div className="price" style={{ paddingBottom: 10 }}>
                                    <h1 className="product_name">{productDetail.tenKhoaHoc}</h1>
                                </div>
                                <Card
                                    className="card_total"
                                    bordered={false}
                                    style={{ width: "90%" }}
                                >
                                    <div className="price_product" >
                                        {productDetail?.ngayTao}
                                    </div>

                                    <div class="box-product-promotion">
                                        <div class="box-product-promotion-header">
                                            <p>Ưu đãi</p>
                                        </div>
                                        <div class="box-content-promotion">
                                            <p class="box-product-promotion-number"></p>
                                            <a>
                                                Đặt sân ngay - khóa học chất lượng<br />
                                                <br /> Khuyến mãi giảm giá cho đặt sân trước <br />
                                                <br /> Sân mới, sạch sẽ và tiện nghi
                                            </a>
                                        </div>

                                    </div>

                                    <div className="mt-3 flex flex-wrap justify-center items-center gap-4">
                                        {/* Wifi */}
                                        <div className="bg-gray-200 rounded-full p-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 16a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 1 0v11a.5.5 0 0 1-.5.5zM10 6a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 1 0v1a.5.5 0 0 1-.5.5z" />
                                                <path fillRule="evenodd" d="M2.146 6.146a.5.5 0 0 1 .708 0l1.414 1.414a.5.5 0 0 1-.708.708L2.146 6.854a1.5 1.5 0 0 1 0-2.122l1.414-1.414a.5.5 0 1 1 .708.708L2.854 4.146a.5.5 0 0 0 0 .708zm15.708 1.708a.5.5 0 0 0-.708 0l-1.414 1.414a.5.5 0 1 0 .708.708l1.414-1.414a1.5 1.5 0 0 0 0-2.122l-1.414-1.414a.5.5 0 1 0-.708.708l1.414 1.414a.5.5 0 0 0 0 .708zM4 9.5a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 1 0v2a.5.5 0 0 1-.5.5zm12 0a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 1 0v2a.5.5 0 0 1-.5.5zm-9 0a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 1 0v3a.5.5 0 0 1-.5.5zm6 0a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 1 0v3a.5.5 0 0 1-.5.5zm-3-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 1 0v1a.5.5 0 0 1-.5.5z" />
                                            </svg>
                                        </div>
                                        <span>Wifi</span>

                                        {/* Bãi đỗ xe máy */}
                                        <div className="bg-gray-200 rounded-full p-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M15 3a1 1 0 0 1 1 1v3h2a1 1 0 1 1 0 2h-2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9H1a1 1 0 0 1 0-2h2V4a1 1 0 0 1 1-1h11zM8 4H4v14h12V7h-2V5a1 1 0 0 0-1-1H8z" />
                                            </svg>
                                        </div>
                                        <span>Bãi đỗ xe máy</span>

                                        {/* Căng tin */}
                                        <div className="bg-gray-200 rounded-full p-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M1 4a1 1 0 0 1 1-1h2.586A1.986 1.986 0 0 0 5 4.586V6h4V4.586a1.986 1.986 0 0 0-.586-1.414L9 1h2l.586 1.586A1.986 1.986 0 0 0 11 4.586V6h6a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm3 8H3V9h1v3zm0-4H3V5h1v3zm4 0H7V5h1v3zm4 0h-1V5h1v3zm0 4H11V9h1v3zm0-4H11V5h1v3zm4 0h-1V5h1v3z" />
                                            </svg>
                                        </div>
                                        <span>Khu vực học tiện nghi</span>

                                        {/* Trà đá */}
                                        <div className="bg-gray-200 rounded-full p-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 3a1 1 0 0 0-1 1v12a1 1 0 0 0 2 0V4a1 1 0 0 0-1-1zM4 8a1 1 0 1 0 0 2h12a1 1 0 1 0 0-2H4z" />
                                            </svg>
                                        </div>
                                        <span>Mentor hỗ trợ nhiệt tình</span>
                                    </div>



                                    <div className="box_cart_1 mr-2">
                                        <Button
                                            type="primary"
                                            className="by mr-2"
                                            size="large"
                                            onClick={handleButtonClick}
                                        >
                                            {buttonText}
                                        </Button>

                                        <Modal
                                            title="Xác nhận ghi danh"
                                            visible={isModalVisible}
                                            onOk={handleOk}
                                            onCancel={handleCancel}
                                            okText="Xác nhận"
                                            cancelText="Hủy"
                                        >
                                            <p>Bạn có chắc chắn muốn ghi danh vào khóa học này không?</p>
                                        </Modal>
                                        <Button type="primary" className="by" size={'large'} onClick={() => paymentCard(productDetail)}>
                                            Mua ngay
                                        </Button>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                        <hr />
                        <div className="describe">
                            <div className="title_total" style={{ fontSize: 20, marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>
                                Giới thiệu: "{productDetail.tenKhoaHoc}"
                            </div>
                            <div
                                className="describe_detail_description"
                                dangerouslySetInnerHTML={{ __html: productDetail.moTa }}
                            ></div>
                        </div>
                        <hr />
                    </div>


                </Card>
            </Spin>
        </div>
    );
};

export default ProductDetail;
