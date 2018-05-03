import fetch from '@/utils/fetch'

export function login(account, password) {
  return fetch({
    url: '/nodeapi/users/login',
    method: 'post',
    data: {
      account,
      password
    }
  })
}

export function fetchUserInfo() {
  return fetch({
    url: '/nodeapi/users/fetchUserInfo',
    method: 'get'
  })
}

export function logout() {
  return fetch({
    url: '/user/logout',
    method: 'post'
  })
}
