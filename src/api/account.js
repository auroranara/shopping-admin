import fetch from '@/utils/fetch'

export function fetchAccounts(query) {
  return fetch({
    url: '/nodeapi/users/fetchAccounts',
    method: 'get',
    params: query
  })
}

export function adminChnagePwd(data) {
  return fetch({
    url: '/nodeapi/users/adminChnagePwd',
    method: 'post',
    data
  })
}
