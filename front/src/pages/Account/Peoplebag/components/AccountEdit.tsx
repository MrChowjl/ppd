import React, { useEffect, useState } from 'react';
import { Alert, message, Modal } from 'antd';
import { mediaEdit, getCurrent } from './../request'
import ProForm, {
    ModalForm,
    ProFormText,
    ProFormSelect,
    ProFormUploadButton,
    ProFormCheckbox,
    ProFormDigit
} from '@ant-design/pro-form';

interface FormParams {
    onCancel: () => void;
    Select: string | undefined;
    reload: () => void;
}
const Form: React.FC<FormParams> = (props) => {
    const { onCancel, Select, reload } = props
    const [current, setcurrent] = useState<{
        name?: string;
        param?: string;
        sign?: string;
    }>()
    const [filetax, setfiletax] = useState()
    useEffect(() => {
        Select && getCurrent({ k: Select }).then(res => {
            if (res.code === 1) {
                setcurrent(res.data)
            }
        })
    }, [])
    return (
        (Select ? current?.name ? true : false : true) ? <ModalForm<any> {...{
            labelCol: { span: 8 },
            wrapperCol: { span: 14 },
        }}
            initialValues={{
                name: current?.name,
                param: current?.param,
                sign: current?.sign,
            }}
            layout={'horizontal'}
            visible={true}
            title={Select ? '编辑广告主' : '添加广告主'}
            width={600}
            modalProps={{
                onCancel: () => onCancel()
            }}
            onFinish={async (values) => {
                console.log(values.file[0].originFileObj)
                let form = new FormData()
                form.append('file', values.file[0].originFileObj)
                form.append('id', Select ? Select : '')
                form.append('name', values.name)
                form.append('company', values.company)
                form.append('site_name', values.site_name)
                form.append('site_url', values.site_url)
                form.append('industry_id', values.industry_id)
                form.append('link_name', values.link_name)
                form.append('link_tel', values.link_tel)
                form.append('link_email', values.link_email)
                form.append('credit_code', values.credit_code)
                let res = await mediaEdit(form);
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
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '简称是必填项！'
                    },
                    {
                        max: 24,
                        message: '简称最多8个字！'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="company"
                label="公司"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '公司名称是必填项！'
                    },
                    {
                        max: 24,
                        message: '公司名称最多24个字！'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="site_name"
                label="网站名称"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '网站名称是必填项！'
                    },
                    {
                        max: 100,
                        message: '网站名称最多100个字！'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="site_url"
                label="网站地址"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '网站地址是必填项！'
                    },
                    {
                        max: 100,
                        message: '网站地址最多100个字！'
                    }
                ]}
            />
            <ProFormSelect
                options={[
                    {
                        value: 12,
                        label: '鸡行',
                    },
                    {
                        value: 45,
                        label: '鸭行',
                    },
                    {
                        value: 5,
                        label: '猪行',
                    },
                ]}
                width="md"
                name="industry_id"
                label="行业"
            />
            <ProFormText
                width="md"
                name="link_name"
                label="联系人姓名"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '联系人姓名是必填项！'
                    },
                    {
                        max: 24,
                        message: '联系人姓名最多24个字！'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="link_tel"
                label="联系人电话"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '联系人电话是必填项！'
                    },
                    {
                        max: 24,
                        message: '联系人电话最多24个字！'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="link_email"
                label="联系人邮箱"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '联系人邮箱是必填项！'
                    },
                    {
                        max: 24,
                        message: '联系人邮箱最多24个字！'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="credit_code"
                label="营业执照统一信用码"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '营业执照统一信用码是必填项！'
                    },
                    {
                        max: 24,
                        message: '营业执照统一信用码最多24个字！'
                    }
                ]}
            />
            <ProFormUploadButton
                name="file"
                label="营业执照"
                max={1}
                fieldProps={{
                    name: 'file',
                    listType: 'picture-card'
                }}
                rules={[
                    {
                        required: true,
                        message: '营业执照是必传项！'
                    }
                ]}
                action={''}
                extra="请上传小于4M的png/jpg格式的图片"
            />
        </ModalForm> : null
    );
};
export default Form