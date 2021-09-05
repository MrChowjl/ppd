import {
  AlipayCircleOutlined,
  LockOutlined,
  MailOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { Alert, Space, message, Tabs } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { useIntl, connect, FormattedMessage } from 'umi';
import type { Dispatch } from 'umi';
import type { StateType } from '@/models/login';
import type { LoginParamsType } from '@/services/login';
import type { ConnectState } from '@/models/connect';
import styles from './index.less';
import { register } from './../../../services/login';
export type LoginProps = {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
};

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = (props) => {
  const { userLogin = {}, submitting } = props;
  console.log(userLogin);
  const { status, msg } = userLogin;
  const [regorlog, setType] = useState<string>('account');

  const handleSubmit = async (values: LoginParamsType) => {
    const { dispatch } = props;

    if (regorlog === 'register') {
      let res = await register(values);

      if (res.code === 1) {
        message.success('注册成功，请登录！');
        setType('account');
      } else {
        message.error(res.msg);
      }

      return;
    }

    dispatch({
      type: 'login/login',
      payload: { ...values },
    });
  };

  return (
    <div className={styles.main}>
      <ProForm
        initialValues={{
          autoLogin: true,
          username: 'admin',
          password: '123456',
        }}
        submitter={{
          render: (_, dom) => dom.pop(),
          submitButtonProps: {
            loading: submitting,
            size: 'large',
            style: {
              width: '100%',
            },
          },
        }}
        onFinish={(values) => {
          handleSubmit(values as LoginParamsType);
          return Promise.resolve();
        }}
      >
        <Tabs
          activeKey={regorlog}
          onChange={(v) => {
            setType(v);
          }}
        >
          <Tabs.TabPane key="account" tab="请登录" />
        </Tabs>
        {status === -1 && regorlog === 'account' && !submitting && (
          <LoginMessage content={msg as string} />
        )}
        <ProFormText
          name="username"
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined className={styles.prefixIcon} />,
          }}
          placeholder={'登陆用户'}
          rules={[
            {
              required: true,
              message: '用户名是必填项！',
            }
          ]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={styles.prefixIcon} />,
          }}
          placeholder={'密码'}
          rules={[
            {
              required: true,
              message: '密码是必填项！',
            },
          ]}
        />
        <div
          style={{
            marginBottom: 24,
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin">
            自动登录
          </ProFormCheckbox>
        </div>
      </ProForm>
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
