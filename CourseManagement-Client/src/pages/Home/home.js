import QueueAnim from 'rc-queue-anim';
import { OverPack } from 'rc-scroll-anim';
import Texty from 'rc-texty';
import TweenOne from 'rc-tween-one';
import React, { useEffect, useState } from "react";
import courtsManagementApi from "../../apis/courtsManagementApi";
import areaManagementApi from "../../apis/areaManagementApi";

import triangleTopRight from "../../assets/icon/Triangle-Top-Right.svg";
import service10 from "../../assets/image/service/service10.png";
import service6 from "../../assets/image/service/service6.png";
import service7 from "../../assets/image/service/service7.png";
import service8 from "../../assets/image/service/service8.png";
import service9 from "../../assets/image/service/service9.png";
import "../Home/home.css";

import {  doc as firestoreDoc , addDoc, doc, getDoc, updateDoc, setDoc, arrayRemove } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { RightOutlined } from '@ant-design/icons';
import { BackTop, Card, Carousel, Col, Row, Spin, Pagination, notification, Button } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import { useHistory } from 'react-router-dom';
import { numberWithCommas } from "../../utils/common";
import productApi from '../../apis/productApi';
import categoryApi from '../../apis/categoryApi';


const Home = () => {

    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);


    const history = useHistory();


    const handleReadMore = (id) => {
        console.log(id);
        history.push("product-detail/" + id)
    }

    const handleCategoryDetails = (id) => {
        console.log(id);
    }

    useEffect(() => {
        (async () => {
            try {
                fetchBookmarks();
                const response = await productApi.getAllProducts({ page: 1, limit: 10 });
                // Lọc dữ liệu có approval_status khác "pending"
                setProductList(response);
                setLoading(false);
            } catch (error) {
                console.log('Failed to fetch event list:' + error);
            }

            try {
                const response = await categoryApi.getListCategory();
                console.log(response);
                setCategories(response);
            } catch (error) {
                console.log(error);
            }
        })();
    }, [])

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Calculate the items to be displayed on the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = productList.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const [bookmarks, setBookmarks] = useState([]);


    const fetchBookmarks = async () => {
        try {
            const user = localStorage.getItem("user"); // Lấy thông tin người dùng từ localStorage
            const userId = user ? JSON.parse(user).taiKhoan : null; // Lấy user_id từ thông tin người dùng

            if (!userId) {
                // Xử lý khi không tìm thấy user_id
                return;
            }

            // Fetch bookmarks for the current user from Firestore
            const userDoc = doc(db, "bookmarks", userId);
            const userSnap = await getDoc(userDoc);
            if (userSnap.exists()) {
                // Nếu tài liệu tồn tại, lấy danh sách bookmarks hiện tại
                const userData = userSnap.data();
                setBookmarks(userData.bookmarks || []);

            }
        } catch (error) {
            console.error("Error fetching bookmarks:", error);
            notification.error({
                message: "Error",
                description: "Failed to fetch bookmarks",
            });
        }
    };

    const handleBookmark = async (courseId) => {
        try {
            const user = localStorage.getItem("user");
            const userId = user ? JSON.parse(user).taiKhoan : null;
    
            if (!userId) {
                // Xử lý khi không tìm thấy user_id
                return;
            }
    
            // Kiểm tra xem tài liệu của người dùng đã tồn tại hay chưa
            const userDoc = doc(db, "bookmarks", userId);
            const userSnap = await getDoc(userDoc);
            let updatedBookmarks = [];
    
            if (userSnap.exists()) {
                // Nếu tài liệu tồn tại, lấy danh sách bookmarks hiện tại
                const userData = userSnap.data();
                updatedBookmarks = userData.bookmarks || [];
            }
    
            const isBookmarked = updatedBookmarks.includes(courseId);
            if (isBookmarked) {
                updatedBookmarks = updatedBookmarks.filter((maKhoaHoc) => maKhoaHoc !== courseId);
            } else {
                updatedBookmarks.push(courseId);
            }
    
            // Cập nhật hoặc tạo mới tài liệu của người dùng
            if (userSnap.exists()) {
                await updateDoc(userDoc, { bookmarks: updatedBookmarks });
            } else {
                await setDoc(userDoc, { bookmarks: updatedBookmarks });
            }
    
            setBookmarks(updatedBookmarks);
        } catch (error) {
            console.error("Error updating bookmarks:", error);
            notification.error({
                message: "Error",
                description: "Failed to update bookmarks",
            });
        }
    };


    return (
        <Spin spinning={false}>

            <div style={{ background: "#FFFFFF", overflowX: "hidden", overflowY: "hidden", paddingTop: 15, }} className="home">
                <div style={{ background: "#FFFFFF" }} className="container-home container banner-promotion">
                    <Row justify="center" align="top" key="1" style={{ display: 'flex' }}>
                        <Col span={4} style={{ height: '100%' }}>
                            <ul className="menu-tree" style={{ height: '100%' }}>
                                {categories.map((category) => (
                                    <li key={category.maDanhMuc} onClick={() => handleCategoryDetails(category.id)} style={{ height: '100%' }}>
                                        <div className="menu-category" style={{ height: '100%' }}>
                                            {category.tenDanhMuc}
                                            <RightOutlined />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Col>
                        <Col span={15} style={{ height: '100%' }}>
                            <Carousel autoplay className="carousel-image" style={{ height: '100%' }}>
                                <div className="img">
                                    <img style={{ width: '100%', height: 300, objectFit: 'cover' }} src="https://kt.city/_next/image?url=https%3A%2F%2Fstatic.kt.city%2Fslider%2Fevondev-nangcao-1614250885647.jpg&w=3840&q=100" alt="" />
                                </div>
                                <div className="img">
                                    <img style={{ width: '100%', height: 300, objectFit: 'cover' }} src="https://kt.city/_next/image?url=https%3A%2F%2Fstatic.kt.city%2Fslider%2Fevondevbannerhomepage2x-1625192140875.png&w=3840&q=100" alt="" />
                                </div>
                                <div className="img">
                                    <img style={{ width: '100%', height: 300, objectFit: 'cover' }} src="https://product.bachkhoa-aptech.edu.vn:33/resources/upload/image/1200x628-4-.png" alt="" />
                                </div>
                            </Carousel>
                            <div className="product-promotion" style={{ height: '100%' }}>
                                <div class="product-card">
                                    <div class="product-image">
                                        <img src="https://img.thegioithethao.vn/thumbs/thuong-hieu/avg-1982_thumb_150.png" alt="Sản phẩm 1" />
                                    </div>
                                    <div class="product-name">Khóa học lập trình</div>
                                </div>
                                <div class="product-card">
                                    <div class="product-image">
                                        <img src="https://img.thegioithethao.vn/thumbs/thuong-hieu/kamito-logo_thumb_150.png" alt="Sản phẩm 2" />
                                    </div>
                                    <div class="product-name">Khóa học dựng video</div>
                                </div>
                                <div class="product-card">
                                    <div class="product-image">
                                        <img src="https://img.thegioithethao.vn/thumbs/thuong-hieu/molten-logo_thumb_150.png" alt="Sản phẩm 3" />
                                    </div>
                                    <div class="product-name">Khóa học kinh doanh</div>
                                </div>
                            </div>
                        </Col>
                        <Col span={5} style={{ height: '100%' }}>
                            <div class="right-banner image-promotion" style={{ height: '100%' }}>
                                <a href="#" class="right-banner__item">
                                    <img style={{ width: '100%' }} src="https://cdn.codegym.vn/wp-content/uploads/2021/06/khoa-hoc-lap-trinh-mien-phi-cho-nguoi-moi-bat-dau-1-1.jpg" loading="lazy" class="right-banner__img" />
                                </a>
                                <a href="#" class="right-banner__item">
                                    <img style={{ width: '100%' }} src="https://aptech.fpt.edu.vn/wp-content/uploads/2021/09/FAT-FrontEnd-bannerweb-scaled.jpg" loading="lazy" class="right-banner__img" />
                                </a>
                                <a href="#" class="right-banner__item">
                                    <img style={{ width: '100%' }} src="https://cce.hcmut.edu.vn/image/cache/catalog/ctdt/baiviet-tkw-800x500.jpg" loading="lazy" class="right-banner__img" />
                                </a>
                                <a href="#" class="right-banner__item">
                                    <img style={{ width: '100%' }} src="https://aptech.fpt.edu.vn/wp-content/uploads/2023/05/hoc-thu-lap-trinh-vo-long_cover-fb-scaled.jpg" loading="lazy" class="right-banner__img" />
                                </a>
                            </div>
                        </Col>
                    </Row>

                </div >

                <div className="image-one">
                    <div className="texty-demo">
                        <Texty>Khóa Học Mới</Texty>
                    </div>
                    <div className="texty-title">
                        <p>Trải Nghiệm <strong style={{ color: "#3b1d82" }}>Ngay</strong></p>
                    </div>

                    <div className="container">
                        <div
                            className="list-products"
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gridGap: '25px' }}
                        >
                            {currentItems.map((item) => (
                                <div
                                    className='col-product'
                                    onClick={() => handleReadMore(item.maKhoaHoc)}
                                    key={item.id}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="show-product">
                                        {item.hinhAnh ? (
                                            <img
                                                className='image-product'
                                                src={item.hinhAnh}
                                                alt={item.hinhAnh}
                                            />
                                        ) : (
                                            <img
                                                className='image-product'
                                                src={require('../../assets/image/NoImageAvailable.jpg')}
                                                alt="No Image Available"
                                            />
                                        )}
                                        <div className='wrapper-products'>
                                            <Paragraph className='title-product overflow-ellipsis overflow-hidden whitespace-nowrap'>
                                                {item.tenKhoaHoc}
                                            </Paragraph>
                                            <div className="truncate">Lượt xem: {item.luotXem}</div>
                                        </div>
                                        <Button
                                            type={bookmarks.includes(item.maKhoaHoc) ? "primary" : "default"}
                                            onClick={(e) => {
                                                e.stopPropagation(); // Ngăn chặn sự kiện click lan ra các phần tử lồng nhau
                                                handleBookmark(item.maKhoaHoc);
                                            }}                                        >
                                            {bookmarks.includes(item.maKhoaHoc) ? "Bỏ yêu thích" : "Yêu thích"}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Pagination
                            current={currentPage}
                            pageSize={itemsPerPage}
                            total={productList.length}
                            onChange={handlePageChange}
                            style={{ marginTop: '20px', textAlign: 'center' }}
                        />
                    </div>
                </div>


                <div className="heading_slogan" style={{ marginTop: 50 }}>
                    <div>Tại sao</div>
                    <div>bạn nên chọn chúng tôi</div>
                </div>
                <div className="card_wrap container-home container flex justify-center">
                    <div>
                        <Card bordered={false} className="card_suggest card_why card_slogan flex flex-col items-center">
                            <img src={service6} alt="Sân bóng tiện ích" className="mx-auto"></img>
                            <p className="card-text mt-3 fw-bold text-center">Tiện ích đầy đủ <br /> và hiện đại</p>
                        </Card>
                    </div>
                    <div>
                        <Card bordered={false} className="card_suggest card_why card_slogan flex flex-col items-center">
                            <img src={service7} alt="Chất lượng sân bóng" className="mx-auto"></img>
                            <p className="card-text mt-3 fw-bold text-center">Chất lượng khóa học <br /> tốt nhất</p>
                        </Card>
                    </div>
                    <div>
                        <Card bordered={false} className="card_suggest card_why card_slogan flex flex-col items-center">
                            <img src={service8} alt="Dịch vụ chuyên nghiệp" className="mx-auto"></img>
                            <p className="card-text mt-3 fw-bold text-center">Dịch vụ chuyên nghiệp <br /> và thân thiện</p>
                        </Card>
                    </div>
                    <div>
                        <Card bordered={false} className="card_suggest card_why card_slogan flex flex-col items-center">
                            <img src={service9} alt="Đặt lịch linh hoạt" className="mx-auto"></img>
                            <p className="card-text mt-3 fw-bold text-center">Khóa học linh hoạt <br /> và nhanh chóng</p>
                        </Card>
                    </div>
                    <div>
                        <Card bordered={false} className="card_suggest card_why card_slogan flex flex-col items-center">
                            <img src={service10} alt="Hỗ trợ 24/7" className="mx-auto"></img>
                            <p className="card-text mt-3 fw-bold text-center">Hỗ trợ 24/7 <br /> đảm bảo trải nghiệm <br /> tốt nhất</p>
                        </Card>
                    </div>
                </div>

                <div className="image-footer">
                    <OverPack style={{ overflow: 'hidden', height: 800, marginTop: 20 }} >
                        <TweenOne key="0" animation={{ opacity: 1 }}
                            className="code-box-shape"
                            style={{ opacity: 0 }}
                        />
                        <QueueAnim key="queue"
                            animConfig={[
                                { opacity: [1, 0], translateY: [0, 50] },
                                { opacity: [1, 0], translateY: [0, -50] }
                            ]}
                        >
                            <div className="texty-demo-footer">
                                <Texty>NHANH LÊN! </Texty>
                            </div>
                            <div className="texty-title-footer">
                                <p>Tham Dự Buổi <strong>Ra Mắt Khóa Học Mới</strong></p>
                            </div>
                            <Row justify="center" style={{ marginBottom: 40, fill: "#FFFFFF" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="71px" height="11px"> <path fill-rule="evenodd" d="M59.669,10.710 L49.164,3.306 L39.428,10.681 L29.714,3.322 L20.006,10.682 L10.295,3.322 L1.185,10.228 L-0.010,8.578 L10.295,0.765 L20.006,8.125 L29.714,0.765 L39.428,8.125 L49.122,0.781 L59.680,8.223 L69.858,1.192 L70.982,2.895 L59.669,10.710 Z"></path></svg>
                            </Row>
                            <Row justify="center">
                                <a href="#" class="footer-button" role="button">
                                    <span>ĐĂNG KÝ NGAY</span>
                                </a>
                            </Row>
                        </QueueAnim>
                    </OverPack>
                </div>
            </div>

            <BackTop style={{ textAlign: 'right' }} />
        </Spin >
    );
};

export default Home;
