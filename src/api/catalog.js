import request from '@/utils/request';


export function fetchList(parentId,params) {
  return request({
    url:'/api/base/category/list/'+parentId,
    method:'get',
    params:params
  })
}


export function addCatalog(data) {
  return request({
    url: '/api/catalog/add',
    method: 'POST',
    data
  });
}

export function editCatalog(data) {
  return request({
    url: '/api/catalog/edit',
    method: 'PATCH',
    data
  });
}

export function fetchAttributeList(params) {
  return request({
    url: '/api/catalog/attribute/list',
    method: 'get',
    params
  });
}

export function fetchAttributeById(attrId) {
  return request({
    url: `/api/catalog/attribute/${attrId}`,
    method: 'get'
  });
}

export function fetchCatalogStructure(params) {
  return request({
    url: '/api/catalog/structure/',
    method: 'get',
    params
  });
}

export function addCatalogAttribute(data) {
  return request({
    url: '/api/catalog/attribute/add',
    method: 'POST',
    data
  });
}

export function editCatalogAttribute(data) {
  return request({
    url: '/api/catalog/attribute/edit',
    method: 'PATCH',
    data
  });
}

export function editCatalogAttributeValue(data) {
  return request({
    url: '/api/catalog/attribute/value/edit',
    method: 'PATCH',
    data
  });
}

export function addCatalogAttributeValue(data) {
  return request({
    url: '/api/catalog/attribute/value/add',
    method: 'POST',
    data
  });
}

export function removeCatalogAttributeValue({id,attrId}) {
  return request({
    url: `/api/catalog/attribute/value/remove/${id}-${attrId}`,
    method: 'DELETE'
  });
}

export function fetchCatalogProdAttribute(params) {
  return request({
    url: '/api/catalog/prod/attribute',
    method: 'get',
    params
  });
}

