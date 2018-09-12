import http from './fetch'
const test = (params) => {
  return http.post('/mjcjCjdb/queryToDayJqCount', {}, {
    params
  })
}
export {test}
