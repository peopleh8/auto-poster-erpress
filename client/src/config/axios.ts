import axios from 'axios'

const FBConfig = {
  baseURL: `${import.meta.env.VITE_FB_BASE_URL}/${import.meta.env.VITE_FB_PAGE_ID}`,
}

const commonConfig = {
  baseURL: import.meta.env.VITE_BACKEND_URL,
}

const FBAxios = axios.create(FBConfig)
const commonAxios = axios.create(commonConfig)

FBAxios.defaults.params = {}

FBAxios.interceptors.request.use((config) => {
  config.params['access_token'] = import.meta.env.VITE_FB_ACCESS_TOKEN

  return config
}, (error) => {
  return Promise.reject(error)
})

export { FBAxios, commonAxios }