import React, { useEffect, useState, useRef } from 'react';
import { Divider, message, Image, Modal, Button, Popconfirm, Tag, Radio, Input, Space } from 'antd';
const { TextArea } = Input;
import { makeAudit, getAudit, deleteAudit } from './../request'
import ProForm, {
    ModalForm,
    ProFormText,
    ProFormSwitch,
    ProFormTextArea,
    ProFormCheckbox,
    ProFormDigit,
    ProFormSelect
} from '@ant-design/pro-form';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
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
    const actionRef = useRef<ActionType>();
    const [isAdmit, setisAdmit] = React.useState(1);
    const [rejectReason, setrejectReason] = React.useState('');
    const statusMap = {
        '0': <Tag color="orange">等待审核</Tag>,
        '1': <Tag color="green">审核通过</Tag>,
        '-1': <Tag color="red">审核未过</Tag>,
        '-9': <Tag color="gray">已删除</Tag>
    }
    const columns: ProColumns<GithubIssueItem>[] = [
        {
            dataIndex: 'id',
            title: 'id',
            hideInSearch: true,
            width: 48,
        },
        {
            title: '名称',
            dataIndex: 'name',
            ellipsis: true,
            width: 100,
            hideInSearch: true,
        },
        {
            title: '编号',
            dataIndex: 'number',
            ellipsis: true,
            width: 100,
            hideInSearch: true,
        },
        {
            title: '状态',
            width: 80,
            dataIndex: 'status',
            ellipsis: true,
            hideInSearch: true,
            render: (value, record) => {
                return statusMap[record?.status?.toString()]
            }
        },
        {
            title: '状态',
            width: 80,
            valueType: 'select',
            dataIndex: 'qstatus',
            hideInTable: true,
            filters: true,
            valueEnum: {
                '0': { text: '待审核' },
                '1': { text: '已通过' },
                '-1': { text: '未通过' },
                '-9': { text: '已删除' }
            },
        },
        {
            title: '添加时间',
            width: 150,
            dataIndex: 'created_at',
            valueType: 'dateTime',
            ellipsis: true,
            hideInSearch: true,
        },
        {
            title: '营业执照',
            ellipsis: true,
            width: 120,
            render: (value, ecord) => {
                return (
                    <Image width={85} src={ecord?.file_url} />
                )
            },
            hideInSearch: true,
        },
        {
            title: '操作',
            width: 155,
            fixed: 'right',
            valueType: 'option',
            render: (text, record, _, action) => [
                <Popconfirm disabled={record?.status === 0 ? false : true} icon={false} onConfirm={async () => {
                    if (isAdmit === -1 && !rejectReason) {
                        message.warning('操作失败，审核失败原因必填')
                        return false
                    }
                    let res = await makeAudit(
                        {
                            id: record?.id,
                            status: isAdmit,
                            audited_info: rejectReason
                        }
                    )
                    if (res.code === 1) {
                        message.success(res.msg)
                        actionRef.current?.reload()
                    }
                }} title={(
                    <>
                        <Space direction="vertical">
                            <Radio.Group onChange={(v) => setisAdmit(v.target.value)} value={isAdmit}>
                                <Radio value={1}>通过</Radio>
                                <Radio value={-1}>拒绝</Radio>
                            </Radio.Group>
                            {isAdmit === -1 && <TextArea rows={2} size='small' value={rejectReason} onChange={(v) => setrejectReason(v.target.value)} placeholder={'请输入原因'} />}
                        </Space>
                    </>
                )} placement="bottom" okText="Yes" cancelText="No">
                    <Button type="primary" disabled={record?.status === 0 ? false : true} >审核</Button>
                </Popconfirm>,
                <Popconfirm title="您将要删除本条媒体？" placement="bottom" onConfirm={() => {
                    deleteAudit({ k: record.id.toString() }).then(res => {
                        if (res.code === 1) {
                            message.success(res.msg)
                            actionRef.current?.reload()
                        }
                    })
                }} okText="Yes" cancelText="No">
                    <Button>删除</Button>
                </Popconfirm>
            ],
            hideInSearch: true,
        },
    ];
    const { onCancel, Select, reload } = props
    enum status {
        '待审核' = 0,
        '已通过' = 1,
        '未通过' = -1,
        '已删除' = -9
    }
    return (
        <Modal title="资质审核" width={1000} visible={true} onOk={onCancel} onCancel={onCancel}>
            <ProTable<any>
                columns={columns}
                actionRef={actionRef}
                scroll={{y: 800}}
                request={async (
                    // 第一个参数 params 查询表单和 params 参数的结合
                    // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
                    params: T & {
                        pageSize: number;
                        current: number;
                    },
                ) => {
                    // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
                    // 如果需要转化参数可以在这里进行修改
                    const msg = await getAudit({
                        page: params.current,
                        limit: params.pageSize,
                        status: params.qstatus,
                        adv_id: Select?.id
                    });
                    return {
                        data: msg.data,
                        // success 请返回 true，
                        // 不然 table 会停止解析数据，即使有数据
                        success: true,
                        // 不传会使用 data 的长度，如果是分页一定要传
                        total: msg.count,
                    };
                }}
                rowKey="id"
                form={{
                    // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
                    syncToUrl: (values, type) => {
                        if (type === 'get') {
                            return {
                                ...values,
                                created_at: [values.startTime, values.endTime],
                            };
                        }
                        return values;
                    },
                }}
                pagination={{
                    pageSize: 20,
                }}
                dateFormatter="string"
                headerTitle={false}
            />
        </Modal>
    );
};
export default Form