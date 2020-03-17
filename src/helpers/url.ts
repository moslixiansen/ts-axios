import { isDate, isPlainObject } from './util'

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildUrl(url: string, params?: any): string {
  if (!params) {
    return url
  }

  const parts: string[] = []

  Object.keys(params).forEach(key => {
    let val = params[key]

    if (val === undefined || val === null) {
      return
    }

    let values: string[] = []

    if (Array.isArray(val)) {
      key = `[]${key}`
      values = val
    } else {
      values = [val]
    }

    values.forEach(item => {
      if (isDate(item)) {
        item = item.toISOString()
      } else if (isPlainObject(item)) {
        item = JSON.stringify(item)
      }

      parts.push(`${encode(key)}=${encode(item)}`)
    })
  })

  const serializedParams = parts.join('&')

  const markIndex = url.indexOf('#')
  if (markIndex !== -1) {
    url = url.slice(0, markIndex)
  }
  return url.includes('?') ? `${url}&${serializedParams}` : `${url}?${serializedParams}`
}
