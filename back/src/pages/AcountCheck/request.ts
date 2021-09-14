import request from '@/utils/request';

export async function audited(params: any) {
    return request('/v1/manage/audited/adv', {
        method: 'POST',
        data: params,
    });
}


export async function queryList(params: any) {
    return request('/v1/manage/ad_account_list', {
        method: 'GET',
        params: params,
    });
}

export async function getCurrent(params: any) {
    return request('/v1/adx_one', {
        method: 'GET',
        params: params,
    });
}


export async function deleteCurrent(params: any) {
    return request('/v1/manage/delete/ad_account', {
        method: 'POST',
        data: params,
    });
}

export async function getAudit(params: any) {
    return request('/v1/manage/adv_qualification', {
        method: 'GET',
        params: params,
    });
}


export async function makeAudit(params: any) {
    return request('/v1/manage/audited/ad_account', {
        method: 'POST',
        data: params,
    });
}

export async function deleteAudit(params: any) {
    return request('/v1/manage/delete/adv_qualification', {
        method: 'POST',
        data: params,
    });
}

export async function switchAccount(params: any) {
    return request('/v1/manage/switch/ad_account', {
        method: 'GET',
        params: params,
    });
}
