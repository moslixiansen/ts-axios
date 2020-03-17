import { isPlainObject } from './util'

function normalizeHeadName(headers: any, normalizeName: string): void {
  if (!headers) {
    return
  }

  Object.keys(headers).forEach(name => {
    if (name !== normalizeName && name.toUpperCase() === normalizeName.toUpperCase()) {
      headers[normalizeName] = headers[name]
      delete headers[name]
    }
  })
}

/**
 * 处理请求头
 * @param headers
 * @param data
 */
export function processHeaders(headers: any, data: any): any {
  if (isPlainObject(data)) {
    normalizeHeadName(headers, 'Content-Type')
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }

  return headers
}

/**
 * 处理响应头
 * @param headers
 */
export function parseHeaders(headers: any): any {
  const parsed = Object.create(null)

  if (!headers) {
    return parsed
  }

  headers.split('\r\n').forEach((item: any) => {
    let [key, value] = item.split(':')

    if (!key) {
      return
    }

    key = key.trim().toLowerCase()

    if (value) {
      value = value.trim()
    }

    parsed[key] = value
  })

  return parsed
}
