import fetch from '@/utils/fetch'

export function adminFetchGoods(query) {
  return fetch({
    url: '/nodeapi/goods/adminFetchGoods',
    method: 'get',
    params: query
  })
}

export function checkGoodsName(data) {
  return fetch({
    url: '/nodeapi/goods/checkGoodsName',
    method: 'get',
    params: data
  })
}

export function createGoods(data) {
  return fetch({
    url: '/nodeapi/goods/createGoods',
    method: 'post',
    data
  })
}

export function updateGoods(data) {
  return fetch({
    url: '/nodeapi/goods/updateGoods',
    method: 'post',
    data
  })
}
