import request from '@/utils/request';

export type LoginParamsType = {
  email?: string;
  password?: string;
};

export async function fakeAccountLogin(params: LoginParamsType) {
  return request('/v1/member/login', {
    method: 'POST',
    data: params,
  });
}

export async function register(params: LoginParamsType) {
  return request('/v1/member/register', {
    method: 'POST',
    data: params,
  });
}
