import request from '@/utils/request';

export async function getSet(): Promise<any> {
  return request('/v1/set');
}

export async function editSet(params: any) {
  return request('/v1/set_edit', {
    method: 'POST',
    data: params,
  });
}
