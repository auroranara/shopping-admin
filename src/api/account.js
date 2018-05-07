import fetch from '@/utils/fetch'

export function fetchAccounts(query) {
  return fetch({
    url: '/nodeapi/users/fetchAccounts',
    method: 'get',
    params: query
  })
}

export function deleteAccount(id) {
  return fetch({
    url: 'nodeapi/users/deleteAccount',
    method: 'get',
    params: id
  })
}

export function checkAccount(data) {
  return fetch({
    url: '/nodeapi/users/checkAccount',
    method: 'get',
    params: data
  })
}

export function createAccount(data) {
  return fetch({
    url: '/nodeapi/users/createAccount',
    method: 'post',
    data
  })
}

export function superChangePassword(data) {
  return fetch({
    url: '/nodeapi/users/superChangePassword',
    method: 'post',
    data
  })
}
