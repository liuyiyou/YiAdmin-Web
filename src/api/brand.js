import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/api/base/brand/list',
    method: 'post',
    data
  })
}


export function createBrand(data) {
  return request({
    url: '/api/base/brand/create',
    method: 'post',
    data: data
  })
}

export function updateShowStatus(data) {
  return request({
    url: '/api/base/brand/update/showStatus',
    method: 'post',
    data: data
  })
}

export function updateFactoryStatus(data) {
  return request({
    url: '/api/base/brand/update/factoryStatus',
    method: 'post',
    data: data
  })
}

export function deleteBrand(id) {
  return request({
    url: '/api/base/brand/delete/' + id,
    method: 'get',
  })
}

export function getBrand(id) {
  return request({
    url: '/api/base/brand/' + id,
    method: 'get',
  })
}

export function updateBrand(id, data) {
  return request({
    url: '/api/base/brand/update/' + id,
    method: 'post',
    data: data
  })
}

