import {
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
    Form,
    Row,
    Select,
    Space,
    Spin,
    Table
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PieChart from '../PieChart/pieChart';
import 'suneditor/dist/css/suneditor.min.css';
import categoryApi from '../../apis/categoryApi';
import productApi from "../../apis/productsApi";
import "./studentCourse.css";
const { Option } = Select;

const StudentCourse = () => {
    const [product, setProduct] = useState([]);
    const [product2, setProduct2] = useState([]);

    const [category, setCategoryList] = useState([]);

    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const { id } = useParams();


    const columns = [
        {
            title: 'Tài khoản',
            dataIndex: 'taiKhoan',
            key: 'taiKhoan',
        },
        {
            title: 'Họ tên',
            dataIndex: 'hoTen',
            key: 'hoTen',
        },
        {
            title: 'Bí danh',
            dataIndex: 'biDanh',
            key: 'biDanh',
        },
    ];

    const columns2 = [
        {
            title: 'Tài khoản',
            dataIndex: 'taiKhoan',
            key: 'taiKhoan',
        },
        {
            title: 'Họ tên',
            dataIndex: 'hoTen',
            key: 'hoTen',
        },
        {
            title: 'Bí danh',
            dataIndex: 'biDanh',
            key: 'biDanh',
        },
    ];

    const handleOpen = () => {
        setVisible(true);
    };

    useEffect(() => {
        (async () => {
            try {
                await productApi.getStudentCourse(id).then((res) => {
                    console.log(res);
                    setProduct(res);
                    setLoading(false);
                });

                await productApi.getStudentCourse2(id).then((res) => {
                    console.log(res);
                    setProduct2(res);
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

    const chartData = [
        { value: product.length, color: '#0088FE' },
    ];

    const chartData2 = [
        { value: product2.length, color: '#00C49F' }
    ];

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
                                <span>Chi tiết khóa học</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader
                                subTitle=""
                                style={{ fontSize: 14 }}
                            >
                                {/* <Row>
                                    <Col span="18">
                                    </Col>


                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row> */}

                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <div style={{ width: '50%', boxSizing: 'border-box', padding: '0 10px', marginTop: 30, textAlign: 'center' }}>
                            <h3>Thống kê học viên khóa học</h3>
                            <PieChart data={chartData} />
                        </div>

                        <div style={{ width: '50%', boxSizing: 'border-box', padding: '0 10px', marginTop: 30, textAlign: 'center' }}>
                            <h3>Thống kê học viên chờ xét duyệt</h3>
                            <PieChart data={chartData2} />
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table title={() => 'Danh sách học viên khóa học'}
                            columns={columns} dataSource={product} pagination={{ position: ['bottomCenter'] }} />
                    </div>
                    <div style={{ marginTop: 30 }}>
                        <Table title={() => 'Danh sách học viên chờ xét duyệt'}
                            columns={columns2} dataSource={product2} pagination={{ position: ['bottomCenter'] }} />
                    </div>
                   
                </div>



                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default StudentCourse;