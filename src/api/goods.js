import fetch from '@/utils/fetch'

export function adminFetchGoods(query) {
  return fetch({
    url: '/nodeapi/goods/adminFetchGoods',
    method: 'get',
    params: query
  })
}
