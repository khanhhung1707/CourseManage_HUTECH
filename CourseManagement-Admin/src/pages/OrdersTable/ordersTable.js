import React, { useEffect, useState } from "react";
import { Table, Spin, notification } from "antd";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

const OrdersTable = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "orders"));
                const ordersData = querySnapshot.docs.map((doc) => ({
                    key: doc.id, // Add a key for Ant Design table
                    ...doc.data(),
                }));
                setOrders(ordersData);
                setLoading(false);
            } catch (error) {
                notification["error"]({
                    message: `Error`,
                    description: "Failed to fetch orders",
                });
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const columns = [
        {
          title: "ID người dùng",
          dataIndex: "userId",
          key: "userId",
        },
        {
          title: "Địa chỉ",
          dataIndex: "address",
          key: "address",
        },
        {
          title: "Phương thức thanh toán",
          dataIndex: "billing",
          key: "billing",
        },
        {
          title: "Mô tả",
          dataIndex: "description",
          key: "description",
        },
        {
          title: "Trạng thái",
          dataIndex: "status",
          key: "status",
        },
        {
          title: "Tổng đơn hàng",
          dataIndex: "orderTotal",
          key: "orderTotal",
        },
        {
          title: "Sản phẩm",
          dataIndex: "products",
          key: "products",
          render: (products) => (
            <ul>
              {products.map((product, index) => (
                <li key={index}>
                  {product.tenKhoaHoc} - Số lượng: {product.quantity} - Giá: {product.price}
                </li>
              ))}
            </ul>
          ),
        },
      ];
    

    return (
        <Spin spinning={loading}>
            <div style={{ marginTop: 30 }}>
                <Table columns={columns} dataSource={orders} />
            </div>
        </Spin>
    );
};

export default OrdersTable;
