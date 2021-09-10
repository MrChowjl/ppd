import React, { useEffect } from 'react';
import { Button, message } from 'antd';
import ProForm, {
    ModalForm,
    ProFormText,
    ProFormDateRangePicker,
    ProFormSelect,
    ProFormRadio,
    ProFormDigit
} from '@ant-design/pro-form';
import { getOptions, addAcount } from './../request'
import { useState } from 'react';

const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};
interface FormParams {
    onCancel: () => void;
}
const Form: React.FC<any> = (props) => {
    const { onCancel } = props
    const [options, setoptions] = useState<{
        Media: { value: number; label: string }[],
        Adhost: { value: number; label: string }[],
        Cate: { value: number; label: string }[],
        Rta: { value: number; label: string }[],
    }>({
        Media: [],
        Adhost: [
            {value: 8, label: '允执行'},
            {value: 5, label: '324'},
            {value: 2, label: '43124'},
        ],
        Cate: [],
        Rta: [
            {value: 3, label: 'arqweqwe'},
            {value: 4, label: 'sftdfg'},
        ]
    })
    console.log(onCancel)
    useEffect(() => {
        getOptions().then(res => {
            if (res.code === 1) {
                let Media = []
                let Adhost = []
                let Rta = []
                let Cate = []
                Media = res.data.adx?.map(itm=> {
                    return {
                        value: itm.id,
                        label: itm.name
                    }
                })
                Cate = res.data.category?.map(itm=> {
                    return {
                        value: itm.id,
                        label: itm.name
                    }
                })
                setoptions({...options,Media,Cate})
            }
        })
    }, [])
    return (
        <ModalForm<any> {...{
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        }}
            layout={'horizontal'}
            visible={true}
            title="创建投放账户"
            width={600}
            modalProps={{
                onCancel: () => onCancel()
            }}
            onFinish={async (values) => {
                console.log(values)
                
                let obj = {
                    name: values.name,
                    sdate: values.contractTime[0],
                    edate: values.contractTime[1],
                    budgetday: values.budgetday,
                    budgetall: values.budgetall,
                    adx_id: values.adx_id,
                    user_adv_id: values.user_adv_id,
                    type: Number(values.type),
                    rta_id: values.rta_id,
                    aid: null
                }
                await addAcount(obj);
                console.log(values.name);
                message.success('提交成功');
                return true;
            }}
        >
            <ProFormText
                width="md"
                name="name"
                label="投放账户名称"
                tooltip="最长为 24 位"
                placeholder="请输入名称"
                rules={[
                    {
                        required: true,
                        message: '名称是必填项！'
                    },
                    {
                        max: 24,
                        message: '名称最多24个字！'
                    }
                ]}
            />
            <ProFormSelect
                options={options.Media}
                rules={[
                    {
                        required: true,
                        message: '媒体是必填项！'
                    }
                ]}
                width="md"
                name="adx_id"
                placeholder="请选择媒体"
                label="媒体"
            />
            <ProFormSelect
                options={options.Adhost}
                rules={[
                    {
                        required: true,
                        message: '广告主是必填项！'
                    }
                ]}
                width="md"
                name="user_adv_id"
                placeholder="请选择广告主"
                label="广告主"
            />
             <ProFormRadio.Group
                name="type"
                label="广告投放类型"
                rules={[
                    {
                        required: true,
                        message: '广告投放类型是必填项！'
                    }
                ]}
                options={options.Cate}
            />
            <ProFormSelect
                options={options.Rta}
                width="md"
                name="rta_id"
                placeholder="请选择要绑定的绑定RTA"
                label="绑定RTA"
            />
            <ProFormDateRangePicker name="contractTime"
                width="md" label="投放日期" />
            <ProFormDigit label="广告投放总预算"
                rules={[
                    {
                        required: true,
                        message: '广告投放总预算是必填项！'
                    }
                ]} name="budgetall" width="md" min={1} />
            <ProFormDigit label="广告投放每日预算"
                rules={[
                    {
                        required: true,
                        message: '广告投放每日预算是必填项！'
                    }
                ]} name="budgetday" width="md" min={1} />
        </ModalForm>
    );
};
export default Form