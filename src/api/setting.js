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

