import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin, Tag } from 'antd';
import React from 'react';
import type { ConnectProps } from 'umi';
import { history, connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import type { CurrentUser } from '@/models/user';
import type { LoginModelType } from '@/models/login';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export type GlobalHeaderRightProps = {
  currentUser?: CurrentUser;
  menu?: boolean;
  login?: LoginModelType
} & Partial<ConnectProps>;

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};
const tagContent = {
  1: '超级管理员',
  0: '普通管理员'
}
class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  onMenuClick = (event: { key: React.Key; keyPath: React.Key[]; item: React.ReactInstance }) => {
    const { key } = event;
    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    }

    history.push(`/account/${key}`);
  };

  render(): React.ReactNode {
    const {
      menu
    } = this.props;
    console.log(sessionStorage.getItem('CurrentUser'))

    let CurrentUser = JSON.parse(sessionStorage.getItem('CurrentUser') as string)
    console.log(CurrentUser)

    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <UserOutlined />
            个人中心
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <SettingOutlined />
            个人设置
          </Menu.Item>
        )}
        {menu && <Menu.Divider />}
        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return CurrentUser && CurrentUser.username ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} alt="avatar" />
          <span className={`${styles.name} anticon`}>{CurrentUser.username}</span>
          <span style={{ marginLeft: 10 }}>
            <Tag color={'#87d068'}>{tagContent[CurrentUser?.is_super as number]}</Tag>
          </span>
        </span>
      </HeaderDropdown>
    ) : (
      <span className={`${styles.action} ${styles.account}`}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
    );
  }
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser
}))(AvatarDropdown);
