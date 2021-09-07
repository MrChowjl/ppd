import React from 'react';
import Footer from './../components/Footer';
import RightContent from '@/components/GlobalHeader/RightContent';
import { Link, useIntl, connect, history } from 'umi';
import logo from '../assets/logo.svg';
import { CloudOutlined, ProfileOutlined, DeploymentUnitOutlined, PartitionOutlined, IdcardOutlined, ReconciliationOutlined } from '@ant-design/icons';
import styles from './BlankLayout.less';
const Layout: React.FC = ({ children }) => {
  let path = children.props.location.pathname

  const menu = [
    {
      path: '/index',
      name: '首页',
      icon: <CloudOutlined />,
    },
    {
      path: '/list',
      name: '数据报表',
      icon: <ProfileOutlined />
    },
    {
      path: '/account',
      name: '投放账户',
      icon: <DeploymentUnitOutlined />,
    },
    {
      path: '/project',
      name: '项目',
      icon: <ReconciliationOutlined />,
    },
    {
      path: '/adowner',
      name: '广告主',
      icon: <IdcardOutlined />,
    },
    {
      path: '/subuser',
      name: '子用户',
      icon: <PartitionOutlined />
    },
  ]
  return (
    <div>
      <div style={{ height: 50, backgroundColor: '#001529', position: 'fixed', top: 0, width: '100%', zIndex: 999,minWidth:1200  }}>
        <div style={{
          display: 'inline-block',
          color: '#fff',
          width: 250,
          padding: '0px 20px',
          fontSize: 15,
          fontWeight: 'bolder'
        }}>
          <img style={{ maxWidth: 30, marginRight: 15 }} src={logo} alt="" />
          <div style={{ display: 'inline-block' }}>Demand-Side Platform</div>
        </div>
        <div style={{ display: 'inline-block', color: '#fff', lineHeight: '50px', height: '100%'}}>
          {
            menu.map(itm => {
              return (
                <span style={{
                  backgroundColor: path === itm.path ? '#1890ff' : ''
                }} className={styles.item}>
                  <Link style={{ color: '#fff', display: 'inline-block', padding: '0 20px', fontSize: 15 }} to={itm.path}> <span style={{ marginRight: 5 }}>{itm.icon}</span> {itm.name}</Link>
                </span>
              )
            })
          }
        </div>
        <RightContent /></div>
      <div style={{ backgroundColor: '#f0f2f5', padding: 25, paddingTop: 75, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {children}
        <Footer />
      </div>
    </div>
  )
};

export default Layout;
