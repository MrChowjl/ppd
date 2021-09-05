import React, { useRef, useState } from 'react';
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Button, Tag, Space, Menu, Popconfirm, message } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import AccountEdit from './components/AccountEdit'
import { queryList, deleteCurrent } from './request'

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

const Page: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [editShow, seteditShow] = useState<boolean>(false)
  const [pagesize, setpagesize] = useState<number>(10)
  const [select, setselect] = useState<string>()
  const confirm = (id: string) => {
    deleteCurrent({k: id.toString()}).then(res =>{
      if (res.code === 1) {
        message.success(res.msg)
      }
    })
  }
  const columns: ProColumns<GithubIssueItem>[] = [
    {
      dataIndex: 'id',
      title: 'id',
      width: 48,
    },
    {
      title: '媒体名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '是否启用',
      dataIndex: 'is_actived',
      ellipsis: true,
      render: (value, ecord) => {
        console.log(value);
        
          if(ecord?.is_actived === 1) {
            return <Tag color="#108ee9">启用</Tag>
          } else {
            return <Tag >关闭</Tag>
          }
      }
    },
    {
      title: '媒体标识',
      dataIndex: 'sign',
      ellipsis: true,
    },
    {
      title: '添加时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      ellipsis: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        <Button type="primary" onClick={() => {
          seteditShow(true)
          setselect(record?.id)
        }}>编辑</Button>,
        <Popconfirm title="您将要删除本条媒体？" placement="bottom" onConfirm={() => confirm(record?.id)} okText="Yes" cancelText="No">
          <Button>删除</Button>
        </Popconfirm>
      ],
    },
  ];
  console.log(editShow)

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
          sort,
          filter,
        ) => {
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          const msg = await queryList({
            page: params.current,
            limit: params.pageSize,
            sort: sort
          });
          return {
            data: msg.data,
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: true,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: msg.pages.list.length * pagesize,
          };
        }}
        rowKey="id"
        search={false}
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
          pageSize: pagesize,
        }}
        dateFormatter="string"
        headerTitle={false}
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} onClick={() => {
            seteditShow(true)
            setselect('')
          }} type="primary">
            添加媒体
          </Button>
        ]}
      />
      {editShow && <AccountEdit reload={() => actionRef.current?.reload()} Select={select} onCancel={() => seteditShow(false)} />}
    </>
  );
};
export default Page