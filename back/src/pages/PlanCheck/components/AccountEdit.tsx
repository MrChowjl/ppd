import React, { useEffect, useState } from 'react';
import { Divider, message, Image } from 'antd';
import { audited, getCurrent } from './../request'
import ProForm, {
    ModalForm,
    ProFormText,
    ProFormSwitch,
    ProFormTextArea,
    ProFormCheckbox,
    ProFormDigit,
    ProFormSelect
} from '@ant-design/pro-form';
type GithubIssueItem = {
    url: string;
    id: number;
    number: number;
    title: string;
    status: number;
    state: string;
    comments: number;
    created_at: string;
    updated_at: string;
    is_public?: number;
    business_license: string;
};
interface FormParams {
    onCancel: () => void;
    Select: GithubIssueItem | undefined;
    reload: () => void;
}
const Form: React.FC<FormParams> = (props) => {
    const { onCancel, Select, reload } = props
    enum status {
        '待审核' = 0,
        '已通过' = 1,
        '未通过' = -1,
        '已删除' = -9
    }
    return (
        <ModalForm<any> {...{
            labelCol: { span: 8 },
            wrapperCol: { span: 14 },
        }}
            initialValues={Select}
            layout={'horizontal'}
            visible={true}
            title={'广告主审核'}
            width={500}
            modalProps={{
                onCancel: () => onCancel()
            }}
            onFinish={async (values) => {
                console.log(values)
                let params = {
                    id: Select?.id,
                    status: values.opstatus,
                    audited_info: values.audited_info
                }
                let res = await audited({ ...values, ...params });
                if (res.code === 1) {
                    message.success(res.msg);
                    reload()
                    onCancel()
                    return true;
                }
            }}
        >
            <ProFormText
                width="md"
                name="name"
                label="简称"
                disabled={true}
            />
            <ProFormText
                width="md"
                name="company"
                label="公司全称"
                disabled={true}
            />
            <ProFormText
                width="md"
                name="site_name"
                label="网站名称"
                disabled={true}
            />
            <ProFormText
                width="md"
                name="site_url"
                label="网站地址"
                disabled={true}
            />
            <ProFormText
                width="md"
                name="credit_code"
                label="营业税号"
                disabled={true}
            />
            <ProFormText
                width="md"
                name="link_name"
                label="联系人姓名"
                disabled={true}
            />
            <ProFormText
                width="md"
                name="link_tel"
                label="联系人电话"
                disabled={true}
            />
            <ProFormText
                width="md"
                name="link_email"
                label="联系人邮箱"
                disabled={true}
            />
            <ProFormText
                width="md"
                name="user_id"
                label="所属主账号ID"
                disabled={true}
            />
            <ProFormText
                width="md"
                name="user_email"
                label="所属用户名称"
                disabled={true}
            />
            <div style={{ textAlign: 'center' }}>
                <h3>营业执照</h3>
                <Image
                    width={200}
                    src={Select?.business_license}
                />
            </div>
            <Divider />
            <ProFormSelect
                width="md"
                name="opstatus"
                label="状态"
                options={[
                    { label: '通过', value: 1 },
                    { label: '不通过', value: -1 },
                ]}
                rules={[
                    {
                        required: true,
                        message: '请选择审核状态'
                    }
                ]}
            />
            <ProForm.Item noStyle shouldUpdate>
                {(form) => {
                    return (
                        form.getFieldValue("opstatus") === -1 &&
                        <ProFormTextArea
                            width="md"
                            name="audited_info"
                            label="审核失败原因"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入审核失败原因'
                                }
                            ]}
                        />
                    );
                }}
            </ProForm.Item>

        </ModalForm>
    );
};
export default Form