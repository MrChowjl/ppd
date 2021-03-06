import React, { useEffect, useState } from 'react';
import { Space, message, Image, Form, Button, Popover, Tabs } from 'antd';
const { TabPane } = Tabs;
import { DeleteOutlined } from '@ant-design/icons';
import { mediaEdit, getCurrent, getPlan, getUnit, getLogo, getStyle } from './../request'
import ProForm, {
    ModalForm,
    ProFormText,
    ProFormSelect,
    ProFormUploadButton,
    ProFormCheckbox,
    ProFormRadio,
    ProFormDigit,
    ProFormDateRangePicker,
    ProFormTimePicker,
    ProFormTextArea
} from '@ant-design/pro-form';
import moment from 'moment'
interface FormParams {
    onCancel: () => void;
    Select: string | undefined;
    reload: () => void;
}
const Formt: React.FC<FormParams> = (props) => {
    const { onCancel, Select, reload } = props
    const [APPLogo, setAPPlogo] = useState<any>()
    const [trendsurl, settrendsurl] = useState<any>()
    const [trendsvideo, settrendsvideo] = useState<any>()
    const [planOption, setplanOption] = useState<any[]>([])
    const [plan, setplan] = useState<string | null>()
    const [unitOption, setunitOption] = useState<any[] | undefined>([])
    const [unit, setunit] = useState<string | null>()
    const [logoVisible, setlogoVisible] = useState<boolean>(false)
    const [current, setcurrent] = useState<{
        name?: string;
        budget_all?: string;
        budget_day?: string;
        budget_tomorrow?: string;
        edate: string;
        sdate: string;
    }>()
    const [option, setoption] = useState<{
        plan?: any[],
        unit?: any[]
        logodata?: any[],
        videodata?: any[],
        style?: any[]
    }>({
        plan: [],
        unit: [],
        logodata: [],
        videodata: [],
        style: []
    })
    useEffect(() => {
        setSelectOptions().then((option) => {
            Select && getCurrent(Select).then(res => {
                if (res.code === 1) {
                    setcurrent(res.data)
                    setunitOption(() => option.unit?.filter(itm => res.data.ad_plan_id === itm.plan_id))
                    settrendsurl(res.data.material_url)
                }
            })
        })
    }, [])
    useEffect(() => {
        setunitOption(() => option.unit?.filter(itm => plan === itm.plan_id))
    }, [plan])
    const setSelectOptions = async () => {
        return new Promise(async (resolve, reject) => {
            let resLogo = await getLogo({ type: 0 })
            let resVideo = await getLogo({ type: 1 })
            let resStyle = await getStyle()
            let resPlan = await getPlan()
            let resUnit = await getUnit()
            if (resLogo.code === 1 && resVideo.code === 1) {
                let replogo = resLogo.data?.map(((itm: any) => {
                    return {
                        label: itm.thumbnail,
                        url: itm.url,
                        value: itm.id
                    }
                }))
                let reVideo = resVideo.data?.map(((itm: any) => {
                    return {
                        label: itm.thumbnail,
                        url: itm.url,
                        value: itm.id
                    }
                }))
                let reStyle = resStyle.data?.map(((itm: any) => {
                    return {
                        label: itm.name,
                        value: itm.id
                    }
                }))
                let rePlan = resPlan.data.list?.map(((itm: any) => {
                    return {
                        label: itm.name,
                        value: itm.id
                    }
                }))
                let reUnit = resUnit.data.list?.map(((itm: any) => {
                    return {
                        label: itm.name,
                        plan_id: itm.plan_id,
                        value: itm.id
                    }
                }))
                setplanOption(rePlan)
                setoption({
                    ...option, ...{ logodata: replogo },
                    ...{ videodata: reVideo },
                    ...{ style: reStyle },
                    ...{ unit: reUnit },
                })
                resolve({
                    ...option, ...{ logodata: replogo },
                    ...{ videodata: reVideo },
                    ...{ style: reStyle },
                    ...{ unit: reUnit },
                })
            }
        })
    }
    return (
        (Select ? current?.name ? true : false : true) ? <ModalForm<any> {...{
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        }}
            initialValues={{
                plan_id: current?.ad_plan_id,
                unit_id: current?.ad_unit_id,
                name: current?.name,
                ad_style_type: current?.ad_style_type,
                ad_title: current?.ad_title,
                material_url: current?.material_url,
                ad_info: current?.ad_info,
                adddate: current?.sdate ? 1 : 0,
                dateplan: current && current?.sdate ? [current.sdate && moment(current.sdate * 1000).format('yyyy-MM-DD') || '', moment(current && current.edate * 1000).format('yyyy-MM-DD') || ''] : null,
            }}
            layout={'horizontal'}
            visible={true}
            title={Select ? '????????????' : '????????????'}
            width={700}
            style={{ maxHeight: 500 }}
            modalProps={{
                onCancel: () => onCancel()
            }}
            onFinish={async (values) => {
                let form = new FormData()
                form.append('id', Select || '')
                form.append('plan_id', plan || current?.ad_plan_id || '')
                form.append('unit_id', unit || current?.ad_unit_id || '')
                form.append('name', values.name || '')
                form.append('ad_style_type', values.ad_style_type || '')
                form.append('material_id', APPLogo?.value || trendsvideo?.value || current?.material_id || '')
                form.append('material_url', APPLogo?.url || trendsvideo?.url || trendsurl || '')
                form.append('ad_title', values.ad_title || '')
                form.append('ad_info', values.ad_info || '')
                form.append('sdate', values.dateplan?.[0] || '')
                form.append('edate', values.dateplan?.[1] || '')
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
                label="????????????"
                options={planOption}
                rules={[
                    {
                        required: true,
                        message: '???????????????????????????'
                    }
                ]}
                fieldProps={{
                    value: plan,
                    defaultValue: plan,
                    onChange: (value) => { setunit(null); setplan(value) }
                }}
            />
            <ProForm.Item noStyle shouldUpdate>
                {(form) => {
                    let re = form.getFieldValue("plan_id")
                    console.log(re)

                    return (
                        <>{re ?
                            <ProFormSelect
                                width="md"
                                name="unit_id"
                                label="????????????"
                                options={unitOption}
                                fieldProps={{
                                    value: unit,
                                    defaultValue: unit,
                                    onChange: (value) => { setunit(value) }
                                }}
                                rules={[
                                    {
                                        required: true,
                                        message: '???????????????????????????'
                                    }
                                ]}
                            /> : null}
                        </>
                    );
                }}
            </ProForm.Item>
            <ProFormText
                width="md"
                name="name"
                label="????????????"
                placeholder="?????????"
                rules={[
                    {
                        required: true,
                        message: '???????????????????????????'
                    }
                ]}
            />
            <ProFormSelect
                width="md"
                name="ad_style_type"
                label="????????????"
                options={option?.style}
                rules={[
                    {
                        required: true,
                        message: '???????????????????????????'
                    }
                ]}
            />
            {!Select ? !APPLogo && !trendsvideo ? <Form.Item label="?????????" valuePropName="checked">
                <Popover
                    content={(
                        <Tabs defaultActiveKey="1" tabPosition='left'>
                            <TabPane
                                tab={
                                    <span>
                                        ??????
                                    </span>
                                }
                                key="1"
                            >
                                <div style={{ width: 500, maxHeight: 500 }}>
                                    <Space size={[8, 16]} wrap align='center'>
                                        {option?.logodata?.map((itm) => (
                                            <Image
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    setAPPlogo(itm)
                                                    setlogoVisible(false)
                                                }}
                                                preview={false}
                                                key={itm.value}
                                                height={125}
                                                width={120}
                                                src={itm.label}
                                            />
                                        ))}
                                    </Space>
                                </div>
                            </TabPane>
                            <TabPane
                                tab={
                                    <span>
                                        ??????
                                    </span>
                                }
                                key="2"
                            >
                                <div style={{ width: 500, maxHeight: 500 }}>
                                    <Space size={[8, 16]} wrap align='center'>
                                        {option?.videodata?.map((itm) => (
                                            <Image
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    settrendsvideo(itm)
                                                    setlogoVisible(false)
                                                }}
                                                preview={false}
                                                key={itm.value}
                                                height={125}
                                                src={itm.label}
                                            />
                                        ))}
                                    </Space>
                                </div>
                            </TabPane>
                        </Tabs>
                    )}
                    trigger="click"
                    visible={logoVisible}
                    onVisibleChange={(value) => {
                        setlogoVisible(value)
                    }}
                >
                    <Button>????????????</Button>
                </Popover>
            </Form.Item> : null : null}
            {!Select ? APPLogo ? <Form.Item label="??????" valuePropName="checked">
                <Image
                    preview={false}
                    height={125}
                    src={APPLogo.url}
                ></Image>
                <DeleteOutlined onClick={() => {
                    setAPPlogo('')
                }} style={{ fontSize: 16, cursor: 'pointer', marginLeft: 5 }} />
            </Form.Item> : null : null}
            {trendsvideo ? <Form.Item label="??????" valuePropName="checked">
                <video controls height={125} src={trendsvideo.url}></video>
                <DeleteOutlined onClick={() => {
                    settrendsvideo('')
                }} style={{ fontSize: 16, cursor: 'pointer', marginLeft: 5 }} />
            </Form.Item> : null}
            {Select ? <ProFormText
                width="md"
                name="material_url"
                label="??????"
                placeholder="?????????"
                disabled={true}
            /> : null}
            <ProFormText
                width="md"
                name="ad_title"
                label="????????????"
                placeholder="?????????"
                rules={[
                    {
                        required: true,
                        message: '???????????????????????????'
                    }
                ]}
            />
            <ProFormTextArea
                width="md"
                name="ad_info"
                label="????????????"
                placeholder="?????????"
                rules={[
                    {
                        required: true,
                        message: '???????????????????????????'
                    }
                ]}
            />
            <ProFormRadio.Group
                label="????????????"
                name='adddate'
                options={[
                    { label: '???????????????', value: 0 },
                    { label: '??????', value: 1 },
                ]}
            />
            <ProForm.Item noStyle shouldUpdate>
                {(form) => {
                    let re = form.getFieldValue("adddate")
                    return (re ?
                        <>
                            <ProFormDateRangePicker
                                width="md"
                                name="dateplan"
                                label="????????????"
                                rules={[
                                    {
                                        required: true,
                                        message: '???????????????????????????'
                                    }
                                ]}
                            />
                        </> : null
                    );
                }}
            </ProForm.Item>
        </ModalForm> : null
    );
};
export default Formt