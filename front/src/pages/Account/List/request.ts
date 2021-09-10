import request from '@/utils/request';

export async function getOptions() {
    return request('v1/ad_accounts_section', {
        method: 'GET'
    });
}


export async function addAcount(params: any) {
    return request('v1/add_ad_account', {
        method: 'POST',
        data: params,
    });
}