import React, { useEffect, useState } from 'react';
import { Alert, message, Modal } from 'antd';
import { mediaEdit, getCurrent } from './../request'
import ProForm, {
    ModalForm,
    ProFormText,
    ProFormSwitch,
    ProFormTextArea,
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
        is_actived?: number;
        name?: string;
        param?: string;
        sign?: string;
        adv_id?: number;
        url?: string;
    }>()
    useEffect(() => {
        Select && getCurrent({ k: Select }).then(res => {
            if (res.code === 1) {
                setcurrent(res.data)
            }
        })
    }, [])
    return (
        (Select ? current?.name ? true : false : true) ? <ModalForm<any> {...{
            labelCol: { span: 5 },
            wrapperCol: { span: 14 },
        }}
            initialValues={{
                is_actived: current?.is_actived,
                name: current?.name,
                adv_id: current?.adv_id,
                sign: current?.sign,
                url: current?.url,
            }}
            layout={'horizontal'}
            visible={true}
            title={Select?'编辑RTA接口':'添加RTA接口'}
            width={600}
            modalProps={{
                onCancel: () => onCancel()
            }}
            onFinish={async (values) => {
                console.log(values)
                let params = {
                    is_actived: Number(values.is_actived),
                    id: Select ? Select : null,
                }
                let res = await mediaEdit({ ...values, ...params });
                if (res.code === 1) {
                    message.success(res.msg);
                    reload()
                    onCancel()
                    return true;
                }
            }}
        >
            <ProFormSwitch name="is_actived" label="设为可用" />
            <ProFormText
                width="md"
                name="name"
                label="RTA名称"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: 'RTA名称是必填项！'
                    },
                    {
                        max: 24,
                        message: 'RTA名称最多24个字！'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="url"
                label="接口地址"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '接口地址是必填项！'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="sign"
                label="二次判断标识"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '二次判断标识是必填项！'
                    },
                    {
                        max: 24,
                        message: '二次判断标识最多24个字！'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="adv_id"
                label="广告主ID"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '广告主ID是必填项！'
                    }
                ]}
            />
        </ModalForm> : null
    );
};
export default Form