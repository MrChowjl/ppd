import React, { useRef, useState } from 'react';
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Button, Tag, Space, Menu, Dropdown } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import AccountEdit from './components/AccountEdit'

type GithubIssueItem = {
  url: string;
  id: number;
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
};

const columns: ProColumns<GithubIssueItem>[] = [
  {
    title: '状态',
    dataIndex: 'state',
    hideInForm: true,
    filters: true,
    onFilter: true,
    valueType: 'select',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      open: {
        text: '未解决',
        status: 'Error',
      },
      closed: {
        text: '已解决',
        status: 'Success',
        disabled: true,
      },
      processing: {
        text: '解决中',
        status: 'Processing',
      },
    },
  },
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    title: 'id',
    width: 48,
  },
  {
    title: '投放账户名称',
    dataIndex: 'title',
    valueType: 'indexBorder',
    width: 150,
    copyable: true,
    ellipsis: true,
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
  },
  {
    title: '开关',
    dataIndex: 'title',
    valueType: 'indexBorder',
    copyable: true,
    ellipsis: true,
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
  },
  {
    title: '状态',
    dataIndex: 'state',
    hideInSearch: true,
    filters: true,
    onFilter: true,
    valueType: 'select',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      open: {
        text: '未解决',
        status: 'Error',
      },
      closed: {
        text: '已解决',
        status: 'Success',
        disabled: true,
      },
      processing: {
        text: '解决中',
        status: 'Processing',
      },
    },
  },
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    title: '广告主',
  },
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    title: '媒体'
  },
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    title: '投放类型'
  },
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    title: '总预算'
  },
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    title: '日预算'
  },
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    title: '剩余金额'
  },
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    title: '今日消耗'
  },
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    title: '昨日消耗'
  },
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    title: '计划数'
  },
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    title: '单元数'
  },
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    title: '创意数'
  },
  {
    title: '操作',
    valueType: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' },
        ]}
      />,
    ],
  },
];


const Page: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [editShow, seteditShow] = useState<boolean>(true)
  console.log(editShow)
  
  return (
    <>
      <ProTable<GithubIssueItem>
        columns={columns}
        actionRef={actionRef}
        request={async (params = {}, sort, filter) => {
          console.log(sort, filter);
          return []
        }}
        editable={{
          type: 'multiple',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
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
          pageSize: 5,
        }}
        dateFormatter="string"
        headerTitle={false}
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} onClick={() =>seteditShow(true)} type="primary">
            创建投放账户
          </Button>
        ]}
      />
      {editShow&&<AccountEdit onCancel={() => seteditShow(false)} />}
    </>
  );
};
export default Page