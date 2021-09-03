import React from 'react';
import { Button, message } from 'antd';
import ProForm, {
    ModalForm,
    ProFormText,
    ProFormDateRangePicker,
    ProFormSelect,
    ProFormCheckbox,
    ProFormDigit
} from '@ant-design/pro-form';

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
const Form: React.FC<FormParams> = (props) => {
    const { onCancel } = props
    console.log(onCancel)

    return (
        <ModalForm<{
            name: string;
            company: string;
        }> {...{
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
                await waitTime(2000);
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
                options={[
                    {
                        value: 'chapter',
                        label: '盖章后生效',
                    },
                ]}
                rules={[
                    {
                        required: true,
                        message: '媒体是必填项！'
                    }
                ]}
                width="md"
                name="Media"
                placeholder="请选择媒体"
                label="媒体"
            />
            <ProFormSelect
                options={[
                    {
                        value: 'chapter',
                        label: '盖章后生效',
                    },
                ]}
                rules={[
                    {
                        required: true,
                        message: '广告主是必填项！'
                    }
                ]}
                width="md"
                name="adhost"
                placeholder="请选择广告主"
                label="广告主"
            />
            <ProFormCheckbox.Group
                name="radio"
                label="Radio.Group"
                rules={[
                    {
                        required: true,
                        message: '广告投放类型是必填项！'
                    }
                ]}
                options={[
                    {
                        label: '线索收集',
                        value: 0,
                    },
                    {
                        label: 'APP拉活',
                        value: 1,
                    },
                    {
                        label: 'APP拉新',
                        value: 2,
                    },
                ]}
            />
            <ProFormSelect
                options={[
                    {
                        value: 'chapter',
                        label: '盖章后生效',
                    },
                ]}
                width="md"
                name="adhost"
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
                ]} name="number" width="md" min={1} />
            <ProFormDigit label="广告投放每日预算"
                rules={[
                    {
                        required: true,
                        message: '广告投放每日预算是必填项！'
                    }
                ]} name="input-number" width="md" min={1} />
        </ModalForm>
    );
};
export default Form