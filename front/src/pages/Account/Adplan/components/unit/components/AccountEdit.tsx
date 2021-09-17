import React, { useEffect, useState } from 'react';
import { Alert, message, Image } from 'antd';
import { mediaEdit, getCurrent, queryOption } from './../request'
import ProForm, {
    ModalForm,
    ProFormText,
    ProFormSelect,
    ProFormUploadButton,
    ProFormCheckbox,
    ProFormRadio,
    ProFormDigit,
    ProFormDateRangePicker
} from '@ant-design/pro-form';
import moment from 'moment'
interface FormParams {
    onCancel: () => void;
    Select: string | undefined;
    reload: () => void;
}
const Form: React.FC<FormParams> = (props) => {
    const { onCancel, Select, reload } = props
    const [current, setcurrent] = useState<{
        name?: string;
        budget_all?: string;
        budget_day?: string;
        budget_tomorrow?: string;
        edate: string;
        sdate: string;
    }>()
    const [option, setoption] = useState<{
        plan?: any,
        ad_type?: any[],
        os?: any[],
        region?: any[],
        gender?: any[],
        network?: any[]
    }>({
        ad_type: [
            { label: '信息流列表页', value: 1 },
            { label: '开屏', value: 2 },
            { label: '横幅', value: 3 },
            { label: '激励视频', value: 4 },
        ],
        os: [
            { label: '不限', value: 0 },
            { label: '安卓', value: 1 },
            { label: 'IOS', value: 2 },
        ],
        region: ['不限', '西南', '华北', '华南', '东北', '华中', '西北', '东南', '华东'],
        gender: [
            { label: '不限', value: 0 },
            { label: '男', value: 1 },
            { label: '女', value: 2 },
        ],
        network: [
            { label: 'WIFI', value: 1 },
            { label: '2G', value: 2 },
            { label: '3G', value: 3 },
            { label: '4G', value: 4 },
            { label: '5G', value: 5 },
        ]
    })
    useEffect(() => {
        Select && getCurrent(Select).then(res => {
            if (res.code === 1) {
                setcurrent(res.data)
            }
        })
        queryOption().then(res => {
            console.log(res)
            if (res.code === 1) {

                setoption({ ...option, ...res.data })
            }
        })
    }, [])
    return (
        (Select ? current?.name ? true : false : true) ? <ModalForm<any> {...{
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        }}
            initialValues={{
                name: current?.name,
                budgetall: current?.budget_all,
                dateplan: current ? [current && moment(current.sdate * 1000).format('yyyy-MM-DD'), moment(current && current.edate * 1000).format('yyyy-MM-DD')] : null,
                budgetday: current?.budget_day,
                budgettomorrow: current?.budget_tomorrow,
            }}
            layout={'horizontal'}
            visible={true}
            title={Select ? '编辑单元' : '添加单元'}
            width={700}
            modalProps={{
                onCancel: () => onCancel()
            }}
            onFinish={async (values) => {
                console.log(values)
                let form = new FormData()
                form.append('id', Select || '')
                form.append('title', values.name)
                form.append('sdate', values.dateplan[0])
                form.append('edate', values.dateplan[1])
                form.append('budgetall', values.budgetall)
                form.append('budgetday', values.budgetday)
                form.append('budgettomorrow', values.budgettomorrow || '')
                let res = await mediaEdit(form);
                if (res.code === 1) {
                    message.success(res.msg);
                    reload()
                    onCancel()
                    return true;
                }
            }}
        >
            <ProFormSelect
                width="md"
                name="plan_id"
                label="选择计划"
                valueEnum={option?.plan}
                rules={[
                    {
                        required: true,
                        message: '选择计划是必填项！'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="title"
                label="单元标题"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '单元标题是必填项！'
                    }
                ]}
            />
            <ProFormRadio.Group
                label="广告投放类型"
                name='ad_type'
                rules={[
                    {
                        required: true,
                        message: '广告投放类型是必填项！'
                    }
                ]}
                options={option?.ad_type}
            />
            <ProFormSelect
                width="md"
                name="passed_app"
                label="指定app"
                valueEnum={option?.plan}
            />
            <ProFormSelect
                width="md"
                name="denied_app"
                label="排除app"
                valueEnum={option?.plan}
            />
            <ProFormSelect
                width="md"
                name="region"
                label="地域"
                mode='multiple'
                options={option?.region}
                rules={[
                    {
                        required: true,
                        message: '选择计划是必填项！'
                    }
                ]}
            />
            <ProFormRadio.Group
                width="md"
                name="gender"
                label="性别"
                options={option?.gender}
            />
            <ProFormCheckbox.Group
                width="md"
                name="network"
                label="网络"
                options={option?.network}
            />
            <ProFormRadio.Group
                label="广告投放类型"
                name='os'
                rules={[
                    {
                        required: true,
                        message: '广告投放类型是必填项！'
                    }
                ]}
                options={option?.os}
            />
            <ProFormDateRangePicker
                width="md"
                name="dateplan"
                label="投放日期"
                rules={[
                    {
                        required: true,
                        message: '投放日期是必填项！'
                    }
                ]}
            />
            <ProFormDigit
                width="md"
                name="budgetall"
                label="总预算"
                placeholder="请输入"
                min={1}
                rules={[
                    {
                        required: true,
                        message: '总预算是必填项！'
                    }
                ]}
            />
            <ProFormDigit
                width="md"
                name="budgetday"
                label="每日预算"
                placeholder="请输入"
                min={1}
                rules={[
                    {
                        required: true,
                        message: '每日预算是必填项！'
                    }
                ]}
            />
            <ProFormDigit
                width="md"
                name="budgettomorrow"
                label="明日预算"
                placeholder="请输入"
                min={1}
            />
        </ModalForm> : null
    );
};
export default Form