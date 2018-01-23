import React, {Component} from 'react';
import { List, Avatar, Icon, Layout, Divider, Row, Col, Popover } from 'antd';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {formatDate} from '../utils/date';

const {Sider, Content} = Layout;

export default class NewsList extends Component
{
    render(){
        return (
            <Layout>
                <Content style={{ padding: '24px 0', background: '#fff'}}>
                    <div>
                        Home!
                    </div>
                </Content>
            </Layout>
        )
    }
}


