import ky from 'ky'

export const api = ky.extend({
  prefixUrl: 'http://192.168.1.18:4000',
  hooks: {
    beforeRequest: [
      (_, request: any) => {
        if (!request.headers) {
          request.headers = new Headers()
        }
        request.headers.set('Authorization', `Bearer ${localStorage['accounts:accessToken']}`)
      },
    ],
  },
})
