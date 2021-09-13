import React, { useEffect, useState } from 'react';
import { Alert, message, Image } from 'antd';
import { mediaEdit, getCurrent, getIndustry } from './../request'
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
    }>()
    const [industry, setindustry] = useState<any[]>([])
    useEffect(() => {
        Select && getCurrent({ k: Select }).then(res => {
            if (res.code === 1) {
                setcurrent(res.data)
            }
        })
        getIndustry().then(res => {
            if (res.code === 1) {
                let keys = Object.keys(res.data)
                let values = Object.values(res.data)
                let ar =  keys.map((itm,idx) => {
                    return {
                        label: values[idx],
                        value: Number(keys[idx])
                    }
                } )
                setindustry(ar)
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
            }}
            layout={'horizontal'}
            visible={true}
            title={Select ? '编辑项目' : '添加项目'}
            width={600}
            modalProps={{
                onCancel: () => onCancel()
            }}
            onFinish={async (values) => {
                console.log(values.file)
                let obj = {}
                let res = await mediaEdit({...values, ...obj});
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
                label="项目名称"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '项目名称是必填项！'
                    }
                ]}
            />
        </ModalForm> : null
    );
};
export default Form