/**
 * Created by gopi on 1/1/18.
 */
import React from 'react'
import { Link, Switch, Route  } from 'react-router-dom';
import Home from './Home';


import { Layout, Menu, Affix } from 'antd';
const { Header, Content, Footer} = Layout;

const FixedMenuLayout = () => (
    <Layout className="layout">
        <Header>
            <Affix>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['News']}
                    style={{ lineHeight: '64px' }}>
                    <Menu.Item key="Home">
                        <Link to="/" className="nav-text">Home</Link>
                    </Menu.Item>
                </Menu>
            </Affix>
        </Header>
        <Content style={{ padding: '0 50px' }}>
            <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                <Switch>
                    <Route exact path="/" component={Home}/>
                </Switch>
            </div>
        </Content>
    </Layout>
)

export default FixedMenuLayout