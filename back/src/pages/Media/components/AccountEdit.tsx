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
        sign?: string
    }>()
    useEffect(() => {
        !Select && Modal.info({
            content: (
                <div>
                    <p>添加媒体前请确认已经完全对接成功！</p>
                </div>
            )
        });
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
                is_actived: current?.is_actived,
                name: current?.name,
                param: current?.param,
                sign: current?.sign,
            }}
            layout={'horizontal'}
            visible={true}
            title={Select?'编辑媒体':'添加媒体'}
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
                label="媒体名称"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '媒体名称是必填项！'
                    },
                    {
                        max: 24,
                        message: '媒体名称最多24个字！'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="sign"
                label="媒体标识"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '媒体标识是必填项！'
                    },
                    {
                        max: 24,
                        message: '媒体标识最多24个字！'
                    }
                ]}
            />
            <ProFormTextArea width="md" name="param" label='媒体对应配置参数(json格式)' />
        </ModalForm> : null
    );
};
export default Form