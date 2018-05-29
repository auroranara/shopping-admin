import fetch from '@/utils/fetch'

export function fetchSettings(data) {
  return fetch({
    url: '/nodeapi/setting/fetchSettings',
    method: 'get',
    params: data
  })
}

export function removeCarouselImg(data) {
  return fetch({
    url: '/nodeapi/setting/removeCarouselImg',
    method: 'get',
    params: data
  })
}

export function deleteSetting(data) {
  return fetch({
    url: '/nodeapi/setting/deleteSetting',
    method: 'get',
    params: data
  })
}

export function createSetting(data) {
  return fetch({
    url: '/nodeapi/setting/createSetting',
    method: 'post',
    data
  })
}

export function checkSettingId(data) {
  return fetch({
    url: '/nodeapi/setting/checkSettingId',
    method: 'get',
    params: data
  })
}

export function fetchDashboardData() {
  return fetch({
    url: '/nodeapi/setting/fetchDashboardData',
    method: 'get'
  })
}
