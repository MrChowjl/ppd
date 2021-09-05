import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { message, Card } from 'antd';
import ProForm, { ProFormSwitch, ProFormDigit, ProFormSelect } from '@ant-design/pro-form';
import { getSet, editSet } from './../services/set'

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};
export default () => {
  const [initParams, setinitParams] = useState({})
  useEffect(() => {
    init()
  }, [])
  const init = () => {
    getSet().then(res => {
      if (res.code === 1) {
        setinitParams(res.data)
      }
    })
  }
  return (
    <PageContainer pageHeaderRender={false} title={false} breadcrumbRender={false} ghost={false}>
      <Card>
        <ProForm<any>
          initialValues={{
            is_register: initParams[0]?.param_value,
            add_acc_num: initParams[1]?.param_value,
            add_user_num: initParams[2]?.param_value,
          }}
          {...{
            labelCol: { span: 6 },
            wrapperCol: { span: 6 },
          }}
          layout={'horizontal'}
          onFinish={async (values) => {
            console.log(values)
            let params = [{
              "param_name": "is_register",
              "param_value": values.is_register
            },
            {
              "param_name": "add_acc_num",
              "param_value": values.add_acc_num
            },
            {
              "param_name": "add_user_num",
              "param_value": values.add_user_num
            }
            ]
            let res = await editSet(params)
            if (res.code === 1) {
              message.success('提交成功');
              init()
            }
          }}
          params={{}}
          request={async () => {
            await waitTime(100);
            return {
              name: '蚂蚁设计有限公司',
              useMode: 'chapter',
            };
          }}
        >
          <ProFormSwitch name="is_register" label="开放注册" />
          <ProFormDigit label="单用户可创建广告账户数" name="add_acc_num" width="md" min={1} />
          <ProFormDigit label="单用户可创建子用户数" name="add_user_num" width="md" min={1} />
        </ProForm>
      </Card>
    </PageContainer >
  );
};