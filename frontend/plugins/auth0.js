import Auth0Lock from 'auth0-lock'
import jwtDecode from 'jwt-decode'
import queryString from 'query-string'
import nuxtConfig from '~/nuxt.config'
const config = nuxtConfig.auth0

class Auth0Util {
  showLock(container) {
    const lock = new Auth0Lock(
      config.clientID,
      config.domain,
      {
        container,
        closable: false,
        auth: {
          responseType: 'token id_token',
          redirectUrl:  'http://localhost:3333/callback',
          params: {
            scope: 'openid profile email'
          }
        }
      })

      lock.show()
  }

  getQueryParams(){
    return queryString.parse(location.hash)
  }

  setToken({access_token, id_token, expires_in}) {
    const localStorage = window.localStorage
    localStorage.setItem('idToken', id_token)
    localStorage.setItem('expiresAt',expires_in * 1000 + new Date().getTime())
    localStorage.setItem('user',JSON.stringify(jwtDecode(id_token)))
  }

  setTokenByQuery() {
    this.setToken(this.getQueryParams());
  }

  setTokenByQueryCognito() {
    const code = this.$route.query.code
    const localStorage = window.localStorage
    if (!code || localStorage.getItem("loginStatus") == "logined") { return }

    const paramas = {
      "grant_type": "authorization_code",
      "redirect_uri": ""
    }
  }

  isAuthenticated() {
    const expiresAt = window.localStorage.getItem('expiresAt')
      return new Date().getTime() < expiresAt
  }

  unsetToken() {
    const localStorage = window.localStorage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('idToken')
    localStorage.removeItem('expiresAt')
    localStorage.removeItem('user')
  }

  getIdToken() {
    return this.isAuthenticated() ? localStorage.getItem('idToken') : null
  }

  // getBaseUrl(){
  //   return
  //   `${window.location.href}//${window.location.host}`
  // }
}

export default (context, inject) => {
  inject('auth0', new Auth0Util)
}
