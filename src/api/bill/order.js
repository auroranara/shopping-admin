import fetch from '@/utils/fetch'

export function adminFetchOrders(query) {
  return fetch({
    url: '/nodeapi/order/adminFetchOrders',
    method: 'get',
    params: query
  })
}

export function fetchOrderProducts(query) {
  return fetch({
    url: '/nodeapi/order/fetchOrderProducts',
    method: 'get',
    params: query
  })
}
