import React, { useRef, useState } from 'react';
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Button, Tag, Space, Image, Popconfirm, message } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import AccountEdit from './components/AccountEdit'
import { queryList, deleteCurrent } from './request'

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
    '已通过' = 1,
    '未通过' = -1,
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
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 100,
    },
    {
      title: '用户id',
      dataIndex: 'user_id',
      ellipsis: true,
      width: 100,
      hideInTable: true
    },
    {
      title: '状态',
      width: 80,
      valueType: 'select',
      dataIndex: 'qstatus',
      hideInTable: true,
      filters: true,
      initialValue: '0',
      valueEnum: {
        '0': { text: '待审核' },
        '1': { text: '已通过' },
        '-1': { text: '未通过' },
        '-9': { text: '已删除' }
      },
    },
    // {
    //   title: '公司全称',
    //   dataIndex: 'company',
    //   ellipsis: true,
    // },
    {
      title: '网站名称',
      dataIndex: 'site_name',
      ellipsis: true,
      width: 100,
      hideInSearch: true,
    },
    // {
    //   title: '网站地址',
    //   dataIndex: 'site_url',
    //   ellipsis: true,
    // },
    // {
    //   title: '营业税号',
    //   dataIndex: 'credit_code',
    //   ellipsis: true,
    // },
    // {
    //   title: '联系人姓名',
    //   dataIndex: 'link_name',
    //   ellipsis: true,
    // },
    // {
    //   title: '联系人电话',
    //   dataIndex: 'link_tel',
    //   ellipsis: true,
    // },
    // {
    //   title: '联系人邮箱',
    //   dataIndex: 'link_email',
    //   ellipsis: true,
    // },
    // {
    //   title: '所属用户名称',
    //   dataIndex: 'user_email',
    //   ellipsis: true,
    //   width: 165
    // },
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
      title: '是否公开',
      dataIndex: 'is_public',
      width: 80,
      render: (value, ecord) => {
        return (
          ecord?.is_public ? '是' : '否'
        )
      },
      hideInSearch: true,
    },
    {
      title: '营业执照',
      ellipsis: true,
      width: 100,
      render: (value, ecord) => {
        return (
          <Image width={85} src={ecord?.business_license} />
        )
      },
      hideInSearch: true,
    },
    {
      title: '添加时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      valueType: 'dateTime',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '审核时间',
      dataIndex: 'audited_at',
      valueType: 'dateTime',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '审核失败原因',
      dataIndex: 'audited_info',
      ellipsis: true,
      width: 120,
      hideInSearch: true,
    },
    {
      title: '操作',
      width: 255,
      fixed: 'right',
      valueType: 'option',
      render: (text, record, _, action) => [
        <Button type="primary" disabled={record?.status!==0} onClick={() => {
          seteditShow(true)
          setselect(record)
        }}>{status[record?.status]}</Button>,
        <Button type="primary" >资质</Button>,
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