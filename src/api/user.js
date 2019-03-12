import request from '@/utils/request'

// export function list(params) {
//   return request({
//     url: '/api/system/user',
//     method: 'post',
//     params
//   });
// }


export function list(data) {
  return request({
    url: '/api/system/user',
    method: 'post',
    data
  });
}
