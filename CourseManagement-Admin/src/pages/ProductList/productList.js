import {
    DeleteOutlined,
    EditOutlined,
    FormOutlined,
    HomeOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import {
    BackTop,
    Breadcrumb,
    Button,
    Col,
    Drawer,
    Form,
    Input,
    Popconfirm,
    Row,
    Select,
    Space,
    Modal,
    Spin,
    Table,
    Tag,
    notification
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import 'suneditor/dist/css/suneditor.min.css';
import axiosClient from '../../apis/axiosClient';
import categoryApi from '../../apis/categoryApi';
import productApi from "../../apis/productsApi";
import supplierApi from '../../apis/supplierApi';
import uploadFileApi from '../../apis/uploadFileApi';
import "./productList.css";
const { Option } = Select;

const ProductList = () => {
    const [product, setProduct] = useState([]);
    const [category, setCategoryList] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [image, setImage] = useState();

    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [file, setUploadFile] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [description, setDescription] = useState();
    const [total, setTotalList] = useState(false);
    const [id, setId] = useState();
    const [visible, setVisible] = useState(false);
    const [supplier, SetSupplier] = useState(null);
    const history = useHistory();

    const handleChangeImage = async (e) => {
        setLoading(true);
        const response = await uploadFileApi.uploadFile(e);
        if (response) {
            setUploadFile(response);
        }
        setLoading(false);
    }

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const local = localStorage.getItem("user");
            const user = JSON.parse(local);

            const currentDate = new Date().toISOString(); // Lấy ngày hiện tại
            const categoryList = {
                "maKhoaHoc": values.maKhoaHoc,
                "tenKhoaHoc": values.tenKhoaHoc,
                "biDanh": values.biDanh,
                "moTa": values.moTa,
                "maNhom": "GP10",
                "luotXem": 0, // Đặt luotXem bằng 0
                "danhGia": 0, // Đặt danhGia bằng 0
                "hinhAnh": file,
                "maDanhMucKhoaHoc": values.maDanhMucKhoaHoc,
                "taiKhoanNguoiTao": user.taiKhoan,
                "ngayTao": currentDate // Đặt ngayTao bằng ngày hiện tại
            };
            return axiosClient.post("/QuanLyKhoaHoc/ThemKhoaHoc", categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description: 'Tạo khóa học thất bại',
                    });
                } else {
                    notification["success"]({
                        message: `Thông báo`,
                        description: 'Tạo khóa học thành công',
                    });
                    setOpenModalCreate(false);
                    handleProductList();
                }
            });
        } catch (error) {
            throw error;
        }
    };

    const handleUpdateProduct = async (values) => {
        setLoading(true);
        try {
            const local = localStorage.getItem("user");
            const user = JSON.parse(local);

            const currentDate = new Date().toISOString(); // Lấy ngày hiện tại
            const categoryList = {
                "maKhoaHoc": values.maKhoaHoc,
                "tenKhoaHoc": values.tenKhoaHoc,
                "biDanh": values.biDanh,
                "moTa": values.moTa,
                "maNhom": "GP10",
                "luotXem": 0, // Đặt luotXem bằng 0
                "danhGia": 0, // Đặt danhGia bằng 0
                "hinhAnh": file,
                "maDanhMucKhoaHoc": values.maDanhMucKhoaHoc,
                "taiKhoanNguoiTao": user.taiKhoan,
                "ngayTao": currentDate // Đặt ngayTao bằng ngày hiện tại

            };

            return axiosClient.put("/QuanLyKhoaHoc/CapNhatKhoaHoc", categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description: 'Chỉnh sửa khóa học thất bại',
                    });
                    setLoading(false);
                } else {
                    notification["success"]({
                        message: `Thông báo`,
                        description: 'Chỉnh sửa khóa học thành công',
                    });
                    setOpenModalUpdate(false);
                    handleProductList();
                    setLoading(false);
                }
            });

        } catch (error) {
            throw error;
        }
    };


    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
            setOpenModalUpdate(false)
        }
        console.log('Clicked cancel button');
    };

    const handleProductList = async () => {
        try {
            await productApi.getAllProducts({ page: 1, limit: 10000 }).then((res) => {
                console.log(res);
                setProduct(res);
                setLoading(false);
            });

            await categoryApi.getListCategory({ page: 1, limit: 10000 }).then((res) => {
                console.log(res);
                setCategoryList(res);
                setLoading(false);
            });
        } catch (error) {
            console.log('Failed to fetch product list:' + error);
        };
    };

    const handleDeleteCategory = async (record) => {
        setLoading(true);
        try {
            await productApi.deleteProduct(record.maKhoaHoc).then(response => {
                if (response.status === 500) {

                    handleProductList();
                    setLoading(false);
                    return notification["error"]({
                        message: `Thông báo`,
                        description: response.data,
                    });
                }

                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa khóa học thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa khóa học thành công',

                    });
                    handleProductList();
                    setLoading(false);
                }
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleProductEdit = (record) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await productApi.getProductById(id);
                console.log(response);
                setId(record.maKhoaHoc);
                const currentDate = new Date().toISOString(); // Lấy ngày hiện tại

                form2.setFieldsValue({
                    "maKhoaHoc": record?.maKhoaHoc,
                    "tenKhoaHoc": record?.tenKhoaHoc,
                    "biDanh": record?.biDanh,
                    "moTa": record?.moTa,
                    "maNhom": "GP10",
                    "luotXem": 0, // Đặt luotXem bằng 0
                    "danhGia": 0, // Đặt danhGia bằng 0
                    "maDanhMucKhoaHoc": record?.danhMucKhoaHoc?.maDanhMucKhoahoc,
                    "taiKhoanNguoiTao": record?.taiKhoan,
                    "ngayTao": currentDate // Đặt ngayTao bằng ngày hiện tại

                });
                console.log(form2);
                setDescription(response.data.description);
                setLoading(false);
            } catch (error) {
                throw error;
            }
        })();
    }

    const [courseData, setCourseData] = useState(null);

    const handleFilter = async (name) => {
        try {

            const res = await productApi.searchProducts(name.target.value);
            if (res.status === 500) {
                return notification["error"]({
                    message: `Thông báo`,
                    description: res.data,
                });
            }

            if (res.status === 400) {
                return notification["error"]({
                    message: `Thông báo`,
                    description: res.data,
                });
            }
            if (res) {

                openModal(res)
            }
        } catch (error) {
            console.log('search to fetch category list:' + error);
        }
    }

    const [studentsData, setStudentData] = useState(null);


    const handleFilter2 = async (name) => {
        try {
            const res = await productApi.searchProductsKhoaHoc(name.target.value);
            if (res.status === 500) {
                return notification["error"]({
                    message: `Thông báo`,
                    description: res.data,
                });
            }

            if (res.status === 400) {
                return notification["error"]({
                    message: `Thông báo`,
                    description: res.data,
                });
            }
            if (res) {
                openModal2(res)
            }
        } catch (error) {
            console.log('search to fetch category list:' + error);
        }
    }

    const [modalVisible, setModalVisible] = useState(false);

    const openModal = (data) => {
        setCourseData(data);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const [modalVisible2, setModalVisible2] = useState(false);

    const openModal2 = (data) => {
        setStudentData(data);
        setModalVisible2(true);
    };

    const closeModal2 = () => {
        setModalVisible2(false);
    };

    const handleChange = (content) => {
        console.log(content);
        setDescription(content);
    }

    const handleViewDetails = (record) => {
        history.push(`/student-course-details/${record.maKhoaHoc}`);
    };

    const columns = [
        {
            title: 'Mã khóa học',
            dataIndex: 'maKhoaHoc',
            key: 'maKhoaHoc',
        },
        {
            title: 'Tên khóa học',
            dataIndex: 'tenKhoaHoc',
            key: 'tenKhoaHoc',
        },
        {
            title: 'Bí danh',
            dataIndex: 'biDanh',
            key: 'biDanh',
        },
        {
            title: 'Lượt xem',
            dataIndex: 'luotXem',
            key: 'luotXem',
        },
        {
            title: 'Mã nhóm',
            dataIndex: 'maNhom',
            key: 'maNhom',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'ngayTao',
            key: 'ngayTao',
        },
        {
            title: 'Số lượng học viên',
            dataIndex: 'soLuongHocVien',
            key: 'soLuongHocVien',
        },
        {
            title: 'Người tạo',
            dataIndex: ['nguoiTao', 'hoTen'],
            key: 'nguoiTao',
        },
        {
            title: 'Danh mục khóa học',
            dataIndex: ['danhMucKhoaHoc', 'tenDanhMucKhoaHoc'],
            key: 'danhMucKhoaHoc',
        },
        {
            title: 'Mã danh mục',
            key: 'Mã danh mục',
            hidden: true,
            render: (text, record) => (
                <div>
                    {record.danhMucKhoaHoc.maDanhMucKhoahoc}
                </div>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Row>
                        <div className='groupButton'>
                        <Button
                                size="small"
                                style={{ width: 150, borderRadius: 15, height: 30, marginTop: 5 }}
                                onClick={() => handleViewDetails(record)}
                            >
                                {"Xem chi tiết"}
                            </Button>
                            <Button
                                size="small"
                                icon={<EditOutlined />}
                                style={{ width: 150, borderRadius: 15, height: 30, marginTop: 5 }}
                                onClick={() => handleProductEdit(record)}
                            >{"Chỉnh sửa"}
                            </Button>
                            <div
                                style={{ marginTop: 5 }}>
                                <Popconfirm
                                    title="Bạn có chắc chắn xóa khóa học này?"
                                    onConfirm={() => handleDeleteCategory(record)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        size="small"
                                        icon={<DeleteOutlined />}
                                        style={{ width: 150, borderRadius: 15, height: 30 }}
                                    >{"Xóa"}
                                    </Button>
                                </Popconfirm>
                            </div>
                           
                        </div>
                    </Row>
                </div >
            ),
        },
    ];

    const handleOpen = () => {
        setVisible(true);
    };

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            form.resetFields();
            handleOkUser(values);
            setVisible(false);
        });
    };


    useEffect(() => {
        (async () => {
            try {
                await productApi.getAllProducts({ page: 1, limit: 10000 }).then((res) => {
                    console.log(res);
                    setProduct(res);
                    setLoading(false);
                });

                await categoryApi.getListCategory({ page: 1, limit: 10000 }).then((res) => {
                    console.log(res);
                    setCategoryList(res);
                    setLoading(false);
                });
            } catch (error) {
                console.log('Failed to fetch event list:' + error);
            }
        })();
    }, [])
    return (
        <div>
            <Spin spinning={loading}>
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <FormOutlined />
                                <span>Quản lý kho hàng</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <Modal
                        title="Thông tin khóa học"
                        visible={modalVisible}
                        onCancel={closeModal}
                        footer={null}
                    >
                        {courseData && (
                            <div>
                                <h2>{courseData?.tenKhoaHoc}</h2>
                                <p><strong>Bi danh:</strong> {courseData?.biDanh}</p>
                                <p><strong>Danh mục khoá học:</strong> {courseData?.danhMucKhoaHoc?.tenDanhMucKhoaHoc}</p>
                                {/* <p><strong>Hình ảnh:</strong> <img src={courseData?.hinhAnh} alt={courseData?.tenKhoaHoc} style={{ maxWidth: '100%', height: 'auto' }} /></p> */}
                                <p><strong>Lượt xem:</strong> {courseData?.luotXem}</p>
                                <p><strong>Mô tả:</strong> {courseData?.moTa}</p>
                                <p><strong>Ngày tạo:</strong> {courseData?.ngayTao}</p>
                                <p><strong>Người tạo:</strong> {courseData?.nguoiTao?.hoTen}</p>
                                <p><strong>Số lượng học viên:</strong> {courseData?.soLuongHocVien}</p>
                            </div>
                        )}
                    </Modal>

                    <Modal
                        title="Thông tin học viên"
                        visible={modalVisible2}
                        onCancel={closeModal2}
                        footer={null}
                    >
                        {studentsData && (
                            <div>
                                <h2>{studentsData?.tenKhoaHoc}</h2>
                                <p><strong>Bi danh:</strong> {studentsData?.biDanh || "princess-didi"}</p>
                                <p><strong>Danh mục khoá học:</strong> {studentsData?.danhMucKhoaHoc?.tenDanhMucKhoaHoc || "Chưa có danh mục"}</p>
                                <p><strong>Lượt xem:</strong> {studentsData?.luotXem}</p>
                                <p><strong>Mô tả:</strong> {studentsData?.moTa || "Chưa có mô tả"}</p>
                                <p><strong>Ngày tạo:</strong> {studentsData?.ngayTao || "Chưa có ngày tạo"}</p>
                                <p><strong>Người tạo:</strong> {studentsData?.nguoiTao?.hoTen || "Chưa có người tạo"}</p>
                                <p><strong>Số lượng học viên:</strong> {studentsData?.soLuongHocVien || 0}</p>
                            </div>
                        )}
                    </Modal>




                    <div style={{ marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader
                                subTitle=""
                                style={{ fontSize: 14 }}
                            >
                                <Row>
                                    <Col span="18">
                                        <Input
                                            placeholder="Nhập mã khóa học lấy thông tin khóa học"
                                            allowClear
                                            onChange={handleFilter}
                                            style={{ width: 300 }}
                                        />

                                        {/* <Input
                                            placeholder="Nhập mã khóa học lấy thông tin học viên"
                                            allowClear
                                            onChange={handleFilter2}
                                            style={{ width: 300, marginLeft: 15 }}
                                        /> */}
                                    </Col>


                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                <Button onClick={handleOpen} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo khóa học</Button>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} dataSource={product} pagination={{ position: ['bottomCenter'] }} />
                    </div>
                </div>

                <Drawer
                    title="Tạo khóa học mới"
                    visible={visible}
                    onClose={() => setVisible(false)}
                    width={1000}
                    footer={
                        <div
                            style={{
                                textAlign: 'right',
                            }}
                        >
                            <Button onClick={() => setVisible(false)} style={{ marginRight: 8 }}>
                                Hủy
                            </Button>
                            <Button onClick={handleSubmit} type="primary">
                                Hoàn thành
                            </Button>
                        </div>
                    }
                >
                    <Form
                        form={form}
                        name="eventCreate"
                        layout="vertical"
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="maKhoaHoc"
                            label="Mã Khóa Học"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mã khóa học!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Mã Khóa Học" />
                        </Form.Item>

                        <Form.Item
                            name="biDanh"
                            label="Bí danh"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập bí danh!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Bí danh" />
                        </Form.Item>

                        <Form.Item
                            name="tenKhoaHoc"
                            label="Tên Khóa Học"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên khóa học!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên Khóa Học" />
                        </Form.Item>

                        <Form.Item
                            name="moTa"
                            label="Mô Tả"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mô tả!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input.TextArea placeholder="Mô Tả" />
                        </Form.Item>



                        <Form.Item
                            name="hinhAnh"
                            label="Hình Ảnh"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ảnh!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <input type="file" onChange={handleChangeImage} id="avatar" name="file" accept="image/png, image/jpeg" />
                        </Form.Item>


                        <Form.Item
                            name="maDanhMucKhoaHoc"
                            label="Mã Danh Mục Khóa Học"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mã danh mục khóa học!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select style={{ width: '100%' }} tokenSeparators={[',']} placeholder="Danh mục" showSearch filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }>
                                {category.map((item, index) => {
                                    return (
                                        <Option value={item.maDanhMuc} key={index} >
                                            {item.tenDanhMuc}
                                        </Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>


                    </Form>
                </Drawer>


                <Drawer
                    title="Chỉnh sửa khóa học"
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
                                        handleUpdateProduct(values);
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
                            name="maKhoaHoc"
                            label="Mã Khóa Học"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mã khóa học!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Mã Khóa Học" disabled/>
                        </Form.Item>

                        <Form.Item
                            name="biDanh"
                            label="Bí danh"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập bí danh!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Bí danh" />
                        </Form.Item>

                        <Form.Item
                            name="tenKhoaHoc"
                            label="Tên Khóa Học"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên khóa học!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên Khóa Học" />
                        </Form.Item>

                        <Form.Item
                            name="moTa"
                            label="Mô Tả"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mô tả!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input.TextArea placeholder="Mô Tả" />
                        </Form.Item>



                        <Form.Item
                            name="hinhAnh"
                            label="Hình Ảnh"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập hình ảnh!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <input type="file" onChange={handleChangeImage} id="avatar" name="file" accept="image/png, image/jpeg" />
                        </Form.Item>


                        <Form.Item
                            name="maDanhMucKhoaHoc"
                            label="Mã Danh Mục Khóa Học"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mã danh mục khóa học!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select style={{ width: '100%' }} tokenSeparators={[',']} placeholder="Danh mục" showSearch filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }>
                                {category.map((item, index) => {
                                    return (
                                        <Option value={item.maDanhMuc} key={index} >
                                            {item.tenDanhMuc}
                                        </Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>


                    </Form>
                </Drawer>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default ProductList;