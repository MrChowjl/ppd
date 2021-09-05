import request from '@/utils/request';

export async function mediaEdit(params: any) {
    return request('/v1/adx_edit', {
        method: 'POST',
        data: params,
    });
}


export async function queryList(params: any) {
    return request('/v1/adx_list', {
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
    return request('/v1/delete/adx', {
        method: 'POST',
        data: params,
    });
}