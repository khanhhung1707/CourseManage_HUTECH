
import { BarsOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Layout, List, Row, Select, Col, Badge } from 'antd';
import React, { useEffect, useState } from 'react';
import { NavLink, useHistory } from "react-router-dom";
import DropdownAvatar from "../../DropdownMenu/dropdownMenu";
import styles from './header.module.css';

const { Option } = Select;

const { Header } = Layout;

function Topbar() {

  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [userData, setUserData] = useState([]);
  const [cart, setCart] = useState();

  const history = useHistory();

  const handleLink = (link) => {
    setVisibleDrawer(false);
    history.push(link);
  }


  const showDrawer = () => {
    setVisibleDrawer(true);
  };

  useEffect(() => {
    (async () => {
      try {
        const local = localStorage.getItem("user");
        const user = JSON.parse(local);
        const cart = localStorage.getItem('cartLength');
        setCart(cart);
        setUserData(user);
      } catch (error) {
        console.log('Failed to fetch profile user:' + error);
      }
    })();
  }, [])

  return (
    <Header
      style={{ background: "#FFFFFF" }}
      className={styles.header}
    >
      <div className="">
        <img style={{ color: "#000000", fontSize: 15, height: 55, width: 200, cursor: "pointer" }} src="https://thumbs.dreamstime.com/b/gradient-fire-phoenix-bird-simple-logo-design-black-bird-simple-logo-design-simple-gradient-fire-phoenix-bird-logo-158339374.jpg" onClick={() => handleLink("/home")}></img>
      </div>
      <BarsOutlined className={styles.bars} onClick={showDrawer} />
      <div className={styles.navmenu} style={{ marginLeft: 15 }}>
        <NavLink className={styles.navlink} to="/home" activeStyle>
          Trang chủ
        </NavLink>
        <NavLink className={styles.navlink} to="/contact" activeStyle>
          Liên hệ
        </NavLink>
      </div>
      <div className={styles.logBtn}>
        <div style={{ position: 'relative', display: 'flex', float: 'right', alignItems: "center", cursor: 'pointer' }}>
        <Row style={{ display: 'flex', alignItems: 'center' }}>
            <Col style={{ display: 'flex', alignItems: 'center' }} onClick={() => handleLink("/cart")}>
              <ShoppingOutlined style={{ fontSize: '16px', color: '#000000', marginRight: 4 }} />
              <span style={{ padding: 0, marginTop: 2, margin: 0, color: '#000000', marginRight: 6 }}>
                {cart} sản phẩm
              </span>
            </Col>
            <Col>
              <Badge style={{ marginLeft: 10 }} overflowCount={9999} count={userData?.score > 0 ? userData?.score : 0} />
            </Col>
          </Row>
          <Row>
            <DropdownAvatar key="avatar" />
          </Row>
        </div>
      </div>

    </Header >
  );
}

export default Topbar;