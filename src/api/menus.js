import request from '@/utils/request';

export function menu() {
  return request({
    url: '/api/menus',
    method: 'get'
  });
}

export function list() {
  return request({
    url: '/api/system/menus/list',
    method: 'get'
  });
}

export function roleMenuTreeData(roleId) {
  return request({
    url: `/api/system/menus/trees/${roleId}`,
    method: 'get'
  });
}

export function menuTreeData() {
  return request({
    url: '/api/system/menus/trees',
    method: 'get'
  });
}

export function menusAdd(data) {
  return request({
    url: '/api/system/menus/add',
    method: 'post',
    data
  });
}

export function menusEdit(data) {
  return request({
    url: '/api/system/menus/edit',
    method: 'post',
    data
  });
}

export function menusRemove(id) {
  return request({
    url: `/api/system/menus/remove/${id}`,
    method: 'delete'
  });
}
