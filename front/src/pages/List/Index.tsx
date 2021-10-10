import React, { useRef, useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Statistic, Row, Col, Button, Card, Badge } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import {
  QueryFilter,
  ProFormText,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormDateTimePicker,
} from '@ant-design/pro-form';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { queryList, getCount, getAccount, getPlan, getUnit, getCreate } from './request'
import styles from './home.less';
import { history } from 'umi';
type Item = {
  url: string;
  id: number;
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  status: string;
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
};
export default (): React.ReactNode => {
  const actionRef = useRef<ActionType>();
  const [account, setAccount] = useState()
  const [currentaccount, setcurrentaccount] = useState()
  const [plan, setPlan] = useState()
  const [currentplan, setcurrentplan] = useState()
  const [unit, setunit] = useState()
  const [currentunit, setcurrentunit] = useState()
  const [create, secreate] = useState()
  enum status {
    '待系统审核' = 'processing',
    '待媒体审核' = 'processing',
    '系统审核通过' = 'default',
    '媒体审核通过' = 'default',
    '系统审核失败' = 'error',
    '媒体审核失败' = 'error',
    '开启中' = 'success',
    '已关闭' = 'default',
    '已删除' = 'default'
  }
  useEffect(() => {
    getAccount().then(res => {
      if (res.code === 1) {
        setAccount(res.data.list?.map((itm: any) => {
          return {
            label: itm.name,
            value: itm.id
          }
        }))
      }
    })
  }, [])
  useEffect(() => {
    currentaccount && getPlan({
      acc_id: currentaccount,
      status: 3
    }).then(res => {
      if (res.code === 1) {
        setPlan(res.data.list?.map((itm: any) => {
          return {
            label: itm.name,
            value: itm.id
          }
        }))
      }
    })
  }, [currentaccount])
  useEffect(() => {
    currentplan && currentaccount && getUnit({
      acc_id: currentaccount,
      status: 3
    }).then(res => {
      if (res.code === 1) {
        setunit(res.data.list?.filter((it: any) => it.plan_id === currentplan).map((itm: any) => {
          return {
            label: itm.name,
            value: itm.id
          }
        }))
      }
    })
  }, [currentplan])
  useEffect(() => {
    currentunit && currentaccount && getCreate({
      acc_id: currentaccount,
      status: 3
    }).then(res => {
      if (res.code === 1) {
        secreate(res.data.list?.map((itm: any) => {
          return {
            label: itm.name,
            value: itm.id
          }
        }))
      }
    })
  }, [currentunit])
  const columns: ProColumns<Item>[] = [
    {
      dataIndex: 'id',
      title: 'id',
      hideInSearch: true,
      width: 48,
    },
    {
      title: '投放账户名称',
      dataIndex: 'name',
      hideInSearch: true,
      width: 150,
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
      dataIndex: 'status',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInSearch: true,
      width: 120,
      filters: true,
      render: (_, item) => {
        return <Badge status={status[item.status]} text={item.status} />;
      },
    },
    {
      dataIndex: 'adv_name',
      title: '广告主',
      hideInSearch: true,
    },
    {
      dataIndex: 'adx_name',
      title: '媒体',
      hideInSearch: true,
    },
    {
      dataIndex: 'category',
      title: '投放类型',
      hideInSearch: true,
    },
    {
      dataIndex: 'budget_all',
      title: '总预算',
      hideInSearch: true,
    },
    {
      dataIndex: 'budget_day',
      title: '日预算',
      hideInSearch: true,
    },
    {
      dataIndex: 'balance',
      title: '剩余金额',
      hideInSearch: true,
    },
    {
      dataIndex: 'day_used',
      title: '今日消耗',
      hideInSearch: true,
    },
    {
      dataIndex: 'yesterday_used',
      title: '昨日消耗',
      hideInSearch: true,
    },
    {
      dataIndex: 'plan_num',
      title: '计划数',
      hideInSearch: true,
    },
    {
      dataIndex: 'unit_num',
      title: '单元数',
      hideInSearch: true,
    },
    {
      dataIndex: 'design_num',
      title: '创意数',
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 125,
      render: (text, record, _, action) => [
        <Button type="primary" disabled={record?.status === '开启中' ? false : true} onClick={() => {
          history.push(`/account/basic?id=${record.id}`)
        }}>投放管理</Button>,
      ],
    },
  ];
  return (
    <PageContainer pageHeaderRender={false} title={false} breadcrumbRender={false} ghost={false}>
      <Card style={{ marginBottom: 24, minWidth: 1200 }}>
        <QueryFilter<{
          name: string;
          company: string;
        }>
          onFinish={async (values) => {
            await queryList(values)
            console.log(values.name);
          }}
        >
          <ProFormSelect
            name="acc_id"
            label="投放账户"
            showSearch
            options={account}
            fieldProps={{
              onChange: (value) => {
                let obj = {
                  sdate: value?.time[0],
                  edate: value?.time[1],
                }
                setcurrentaccount({ ...value, ...obj })
              }
            }}
          />
          <ProFormSelect
            name="plan_id"
            label="广告计划"
            showSearch
            options={plan}
            fieldProps={{
              onChange: (value) => {
                setcurrentplan(value)
              }
            }}
          />
          <ProFormSelect
            name="unit_id"
            label="广告单元"
            showSearch
            options={unit}
            fieldProps={{
              onChange: (value) => {
                setcurrentunit(value)
              }
            }}
          />
          <ProFormSelect
            name="des_id"
            label="广告创意"
            showSearch
            options={create}
          />
          <ProFormDateRangePicker
            name="time"
            label="时间范围"
          />
        </QueryFilter>
      </Card>
      <ProTable
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
            adv_id: params.adv_id,
            adx_id: params.adx_id,
            type: params.type,
            status: params.status
          });
          return {
            data: msg.data.list,
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: true,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: msg.data.count,
          };
        }}
        editable={{
          type: 'multiple',
        }}
        rowKey="id"
        pagination={{
          pageSize: 20
        }}
        search={{
          filterType: 'light'
        }}
        headerTitle={false}
        dateFormatter="string"
      />
    </PageContainer>
  );
};
