import axios from 'axios'

const FBConfig = {
  baseURL: `${import.meta.env.VITE_FB_BASE_URL}/${import.meta.env.VITE_FB_PAGE_ID}`,
}

const commonConfig = {
  baseURL: import.meta.env.VITE_BACKEND_URL,
}

const unsplashConfig = {
  baseURL: import.meta.env.VITE_UNSPLASH_BASE_URL,
}

const FBAxios = axios.create(FBConfig)
const commonAxios = axios.create(commonConfig)
const unsplashAxios = axios.create(unsplashConfig)

FBAxios.defaults.params = {}
unsplashAxios.defaults.params = {}

FBAxios.interceptors.request.use((config) => {
  config.params['access_token'] = import.meta.env.VITE_FB_ACCESS_TOKEN

  return config
}, (error) => {
  return Promise.reject(error)
})

unsplashAxios.interceptors.request.use((config) => {
  config.params['client_id'] = import.meta.env.VITE_UNSPLASH_CLIENT_ID

  return config
}, (error) => {
  return Promise.reject(error)
})

export { FBAxios, commonAxios, unsplashAxios }