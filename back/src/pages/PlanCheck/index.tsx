import React, { useRef, useState } from 'react';
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Button, Tag, Space, Image, Popconfirm, message, Switch, Radio, Input, Badge } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import AccountEdit from './components/AccountEdit'
import QualyAudit from './components/QualyAudit'
import { queryList, deleteCurrent, switchAccount, makeAudit } from './request'
import RightContent from '@/components/GlobalHeader/RightContent';
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
    '待系统审核' = 0,
    '系统审核通过' = 1,
    '关闭状态' = 2,
    '系统审核失败' = -1,
    '媒体审核失败' = -2,
    '开启中' = 3,
    '已删除' = -9
  }
  const statusMap = {
    '0': 'processing',
    '1': 'processing',
    '2': 'processing',
    '-1': 'error',
    '-2': 'error',
    '3': 'success',
    '-9': 'default',
  }
  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '所属用户id',
      dataIndex: 'user_id',
      ellipsis: true,
      hideInTable: true
    },
    {
      title: '投放账户id',
      dataIndex: 'acc_id',
      ellipsis: true,
      hideInTable: true
    },
    {
      title: '关键字搜索',
      dataIndex: 'keywords',
      ellipsis: true,
      hideInTable: true
    },
    {
      dataIndex: 'id',
      title: 'id',
      hideInSearch: true,
      width: 48,
    },
    {
      title: '计划名称',
      dataIndex: 'name',
      ellipsis: true,
      hideInSearch: true
    },
    {
      title: '开关',
      dataIndex: 'status',
      hideInSearch: true,
      width: 80,
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
      title: '所属账户名称',
      dataIndex: 'acc_name',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      ellipsis: true,
      render: (_, item) => {
        return <Badge status={statusMap[item.status]} text={status[item.status]} />;
      },
      hideInSearch: true,
    },
    {
      title: '所属用户邮箱',
      dataIndex: 'user_email',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '总预算(单位：分)',
      dataIndex: 'budget_all',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '每日预算(单位：分)',
      dataIndex: 'budget_day',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '明日预算(单位：分)',
      dataIndex: 'budget_tomorrow',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '投放开始时间',
      dataIndex: 'started_at',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '投放停止时间',
      dataIndex: 'stopped_at',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '审核失败原因',
      dataIndex: 'audited_info',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '状态',
      valueType: 'select',
      dataIndex: 'status',
      hideInTable: true,
      filters: true,
      valueEnum: {
        '0': { text: '待审核' },
        '1': { text: '系统审核通过' },
        '2': { text: '关闭状态' },
        '-1': { text: '系统审核未通过' },
        '3': { text: '开启中' },
        '-9': { text: '已删除' }
      },
    },
    {
      title: '操作',
      width: 155,
      valueType: 'option',
      fixed: 'right',
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
        scroll={{ x: 1800 }}
        request={async (
          // 第一个参数 params 查询表单和 params 参数的结合
          // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
          params: T & {
            pageSize: number;
            current: number;
          },
          sort,
          filter,
        ) => {
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          const msg = await queryList({
            page: params.current,
            limit: params.pageSize,
            status: params.status,
            user_id: params.user_id,
            acc_id: params.acc_id,
            keywords: params.keywords
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