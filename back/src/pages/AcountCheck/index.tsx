import React, { useRef, useState } from 'react';
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Button, Tag, Space, Image, Popconfirm, message, Switch, Radio, Input } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import AccountEdit from './components/AccountEdit'
import QualyAudit from './components/QualyAudit'
import { queryList, deleteCurrent, switchAccount, makeAudit } from './request'
const { TextArea } = Input;
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

const Page: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [editShow, seteditShow] = useState<boolean>(false)
  const [isAdmit, setisAdmit] = React.useState(1);
  const [rejectReason, setrejectReason] = React.useState('');
  const [select, setselect] = useState<string>()
  const confirm = (id: string) => {
    deleteCurrent({ k: id.toString() }).then(res => {
      if (res.code === 1) {
        message.success(res.msg)
        actionRef.current?.reload()
      }
    })
  }
  enum status {
    '待审核' = 0,
    '系统审核通过' = 1,
    '媒体审核通过' = 2,
    '系统审核未通过' = -1,
    '媒体审核未通过' = -2,
    '开启中' = 3,
    '已删除' = -9
  }
  const columns: ProColumns<GithubIssueItem>[] = [
    {
      dataIndex: 'id',
      title: 'id',
      hideInSearch: true,
      width: 48,
    },
    {
      title: '投放账户名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 100,
      hideInSearch: true,
      fixed: 'left'
    },
    {
      title: '开关',
      dataIndex: 'status',
      width: 100,
      hideInSearch: true,
      ellipsis: true,
      render: (r, re) => {
        return (
          <Switch checked={re.status === 3 ? true : false} onChange={() => {
            switchAccount(
              { k: re.id }
            ).then(res => {
              if (res.code === 1) {
                message.success(res.msg)
              }
              actionRef.current?.reload()
            })
          }} />
        )
      }
    },
    {
      title: '广告主名称',
      dataIndex: 'adv_name',
      ellipsis: true,
      width: 100,
      hideInSearch: true,
    },
    {
      title: '媒体名称',
      dataIndex: 'adx_name',
      ellipsis: true,
      width: 100,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      ellipsis: true,
      render: (value, record) => {
        return <Tag >{status[record?.status]}</Tag>
      },
      width: 80,
      hideInSearch: true,
    },
    {
      title: '余额(单位：分)',
      dataIndex: 'balance',
      ellipsis: true,
      width: 100,
      hideInSearch: true,
    },
    {
      title: '总预算(单位：分)',
      dataIndex: 'budget_all',
      ellipsis: true,
      width: 100,
      hideInSearch: true,
    },
    {
      title: '每日预算(单位：分)',
      dataIndex: 'budget_day',
      ellipsis: true,
      width: 100,
      hideInSearch: true,
    },
    {
      title: '投放类型',
      dataIndex: 'category',
      ellipsis: true,
      width: 100,
      hideInSearch: true,
    },
    {
      title: '今日消耗(单位：分)',
      dataIndex: 'day_used',
      ellipsis: true,
      width: 100,
      hideInSearch: true,
    },
    {
      title: '昨日消耗(单位：分)',
      dataIndex: 'yesterday_used',
      ellipsis: true,
      width: 100,
      hideInSearch: true,
    },
    {
      title: '创意数',
      dataIndex: 'design_num',
      ellipsis: true,
      width: 100,
      hideInSearch: true,
    },
    {
      title: '计划数',
      dataIndex: 'plan_num',
      ellipsis: true,
      width: 100,
      hideInSearch: true,
    },
    {
      title: '单元数',
      dataIndex: 'unit_num',
      ellipsis: true,
      width: 100,
      hideInSearch: true,
    },
    {
      title: '广告账户id',
      dataIndex: 'id',
      ellipsis: true,
      width: 100,
      hideInSearch: true,
    },
    {
      title: '绑定RTA的ID',
      dataIndex: 'rta_id',
      ellipsis: true,
      width: 100,
      hideInSearch: true,
    },
    {
      title: '投放开始时间',
      dataIndex: 'started_at',
      ellipsis: true,
      width: 110,
      hideInSearch: true,
    },
    {
      title: '投放停止时间',
      dataIndex: 'stopped_at',
      ellipsis: true,
      width: 110,
      hideInSearch: true,
    },
    {
      title: '审核失败原因',
      dataIndex: 'audited_info',
      ellipsis: true,
      width: 100,
      hideInSearch: true,
    },
    {
      title: '添加时间',
      dataIndex: 'created_at',
      ellipsis: true,
      width: 110,
      hideInSearch: true,
    },
    {
      title: '系统审核时间',
      dataIndex: 'sys_audited_at',
      ellipsis: true,
      width: 110,
      hideInSearch: true,
    },
    {
      title: '媒体审核时间',
      dataIndex: 'adx_audited_at',
      ellipsis: true,
      hideInSearch: true,
      width: 110,
    },
    {
      title: '用户id',
      dataIndex: 'user_id',
      ellipsis: true,
      width: 100,
      hideInTable: true
    },
    {
      title: '广告主id',
      dataIndex: 'adv_id',
      ellipsis: true,
      width: 100,
      hideInTable: true
    },
    {
      title: '媒体id',
      dataIndex: 'adx_id',
      ellipsis: true,
      width: 100,
      hideInTable: true
    },
    {
      title: '投放类型',
      width: 80,
      valueType: 'select',
      dataIndex: 'type',
      hideInTable: true,
      filters: true,
      valueEnum: {
        '0': { text: '线索收集' },
        '1': { text: 'APP拉活' },
        '2': { text: 'APP拉新' },
      },
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
        '1': { text: '系统审核通过' },
        '2': { text: '媒体审核通过' },
        '-1': { text: '系统审核未通过' },
        '-2': { text: '媒体审核未通过' },
        '3': { text: '开启中' },
        '-9': { text: '已删除' }
      },
    },
    {
      title: '操作',
      width: 120,
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
            setrejectReason('')
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
        <Popconfirm title="您将要删除本条媒体？" placement="bottom" onConfirm={() => confirm(record?.id)} okText="Yes" cancelText="No">
          <Button>删除</Button>
        </Popconfirm>
      ],
      hideInSearch: true,
    },
  ];
  return (
    <>
      <ProTable<any>
        columns={columns}
        actionRef={actionRef}
        scroll={{ x: 3500 }}
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
          const msg = await queryList({
            page: params.current,
            limit: params.pageSize,
            name: params.name,
            status: params.qstatus,
            user_id: params.user_id
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
      {editShow && <AccountEdit reload={() => actionRef.current?.reload()} Select={select} onCancel={() => seteditShow(false)} />}
    </>
  );
};
export default Page