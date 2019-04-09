import request from '@/utils/request';

export function deptsList() {
  return request({
    url: '/api/admin/system/dept/list',
    method: 'get'
  });
}
export function deptsEdit(data) {
  return request({
    url: '/api/admin/system/dept/edit',
    method: 'post',
    data
  });
}
export function deptsAdd(data) {
  return request({
    url: '/api/admin/system/dept/add',
    method: 'post',
    data
  });
}

export function getDept(id) {
  return request({
    url: `/api/admin/system/dept/edit/${id}`,
    method: 'get'
  });
}
export function deptsRemove(id) {
  return request({
    url: `/api/admin/system/dept/remove/${id}`,
    method: 'delete'
  });
}

