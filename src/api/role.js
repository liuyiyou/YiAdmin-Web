import request from '@/utils/request'


export function get(id) {
  return request({
    url: '/api/admin/system/role/' + id,
    method: 'get',
  });
}


export function list(data) {
  return request({
    url: '/api/admin/system/role',
    method: 'post',
    data
  });
}


export function add(data) {
  return request({
    url: '/api/admin/system/role/add',
    method: 'post',
    data
  });
}


export function edit(data) {
  return request({
    url: '/api/admin/system/role/edit',
    method: 'put',
    data
  });
}


export function _delete(id) {
  return request({
    url: '/api/admin/system/role/' + id,
    method: 'delete'
  });
}



