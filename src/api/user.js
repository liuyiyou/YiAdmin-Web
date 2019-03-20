import request from '@/utils/request'

export function get(id) {
  return request({
    url: '/api/system/user/' + id,
    method: 'get',
  });
}


export function list(data) {
  return request({
    url: '/api/system/user',
    method: 'post',
    data
  });
}


