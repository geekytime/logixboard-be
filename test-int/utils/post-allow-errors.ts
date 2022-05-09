import axios from 'axios'
export const postAllowErrors = (url: string, data: any) => {
  return axios({
    method: 'post',
    url,
    data,
    validateStatus (status) {
      return status < 500
    }
  })
}
