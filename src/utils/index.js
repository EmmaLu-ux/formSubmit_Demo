import axios from 'axios'

const httpRequest = axios.create({
    baseURL: '/api',
    timeout: 5000,
})

httpRequest.interceptors.request.use(
    (config) => {
        // console.log('config', config)
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

httpRequest.interceptors.response.use(
    (response) => {
        // console.log('response', response)
        return response.data
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default httpRequest