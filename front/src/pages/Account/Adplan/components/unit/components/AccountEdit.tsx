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
        network?: any[],
        passed_crowd?: any[],
        denied_crowd?: any[],
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
        ],
        passed_crowd: ['A包', 'B包', 'C包'],
        denied_crowd: ['D包', 'E包', 'F包']
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
            width={600}
            style={{ maxHeight: 500 }}
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
                name="region"
                label="地域"
                mode='multiple'
                options={option?.region}
                rules={[
                    {
                        required: true,
                        message: '地域是必填项！'
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
            <ProFormSelect
                width="md"
                name="passed_crowd"
                label="投放人群包"
                mode='multiple'
                options={option?.passed_crowd}
                rules={[
                    {
                        required: true,
                        message: '投放人群包是必填项！'
                    }
                ]}
            />
            <ProFormSelect
                width="md"
                name="denied_crowd"
                label="排除人群包"
                mode='multiple'
                options={option?.denied_crowd}
                rules={[
                    {
                        required: true,
                        message: '投放人群包是必填项！'
                    }
                ]}
            />
            <ProFormUploadButton
                name="app_logo"
                label="APP logo"
                max={1}
                fieldProps={{
                    name: 'app_logo',
                    listType: 'picture-card'
                }}
                rules={[
                    {
                        required: true,
                        message: 'APP logo是必传项！'
                    }
                ]}
                action={''}
                extra="请上传小于4M的png/jpg格式的图片"
            />
            <ProFormText
                width="md"
                name="app_title"
                label="APP名称"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: 'APP名称是必填项！'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="app_name"
                label="APP包名"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: 'APP包名是必填项！'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="app_down_addr"
                label="APP下载地址"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: 'APP下载地址是必填项！'
                    }
                ]}
            />
            <ProFormSelect
                width="md"
                name="denied_crowd"
                label="行动感召"
                mode='multiple'
                options={[
                    { label: '立即下载', value: 1 },
                    { label: '打开应用', value: 2 }
                ]}
                rules={[
                    {
                        required: true,
                        message: '行动感召是必填项！'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="page_addr"
                label="落地页地址"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '落地页地址是必填项！'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="apply_addr"
                label="应用直达链接"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '应用直达链接是必填项！'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="show_addr"
                label="曝光监测"
                placeholder="请输入"
                rules={[
                ]}
            />
            <ProFormText
                width="md"
                name="click_addr"
                label="点击监测"
                placeholder="请输入"
                rules={[
                ]}
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