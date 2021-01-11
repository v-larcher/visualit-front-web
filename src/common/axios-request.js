import axios from 'axios'
import { API_URL } from '@/common/config'
import store from '../store'

const instance = initAxios()

function initAxios() {
  const instance = axios.create({
    baseURL: API_URL
  })
  instance.defaults.headers.post['Content-Type'] =
    'application/x-www-form-urlencoded'
  instance.defaults.headers.post['Access-Control-Allow-Origin'] = '*'
  return instance
}

export const ApiRequest = {
  query(resource, params) {
    instance.defaults.headers.common.Authorization = `Bearer ${store.state.token}`
    return instance.get(`${resource}`, params).catch(error => {
      throw new Error(`[Get] ApiService ${error}`)
    })
  },

  get(resource, slug = '') {
    instance.defaults.headers.common.Authorization = `Bearer ${store.state.token}`
    return instance.get(`${resource}/${slug}`).catch(error => {
      throw new Error(`[Get] ApiService ${error}`)
    })
  },

  post(resource, params) {
    instance.defaults.headers.common.Authorization = `Bearer ${store.state.token}`
    return instance.post(`${resource}`, params).catch(error => {
      throw new Error(`[Post] ApiService ${error}`)
    })
  },

  update(resource, slug, params) {
    instance.defaults.headers.common.Authorization = `Bearer ${store.state.token}`
    return instance.put(`${resource}/${slug}`, params).catch(error => {
      throw new Error(`[Put] ApiService ${error}`)
    })
  },

  put(resource, params) {
    instance.defaults.headers.common.Authorization = `Bearer ${store.state.token}`
    return instance.put(`${resource}`, params).catch(error => {
      throw new Error(`[Put] ApiService ${error}`)
    })
  },
  delete(resource, params) {
    instance.defaults.headers.common.Authorization = `Bearer ${store.state.token}`
    return instance.delete(resource, params).catch(error => {
      throw new Error(`[Delete] ApiService ${error}`)
    })
  }
}

export default ApiRequest
