import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from './types'
import { createError } from './helpers/error'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    const { url, method = 'get', data = null, headers, responseType, timeout } = config

    if (timeout) {
      request.timeout = timeout
    }

    if (responseType) {
      request.responseType = responseType
    }

    // method 需要大写
    request.open(method.toUpperCase(), url, true)

    // setRequestHeader 需要在 open 之后
    Object.keys(headers).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    request.onerror = function handleNetworkError() {
      reject(createError('Network Error!', config, '', request))
    }

    request.ontimeout = function handleTimeout() {
      reject(createError(`Timeout of ${timeout} ms exceed`, config, 'ECONNABORTED', request))
    }

    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) {
        return
      }

      if (request.status === 0) {
        return
      }

      // 获取响应头
      const responseHeaders = request.getAllResponseHeaders()
      const responseData =
        responseType && responseType !== 'text' ? request.response : request.responseText
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }

      handleResponse(response)
    }

    request.send(data)

    function handleResponse(res: AxiosResponse) {
      if (res.status >= 200 && res.status <= 300) {
        resolve(res)
      } else {
        reject(
          createError(`Request failed with status code = ${res.status}`, config, '', request, res)
        )
      }
    }
  })
}
