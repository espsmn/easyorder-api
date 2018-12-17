const jwt = require('../services/jwt-service')

/**
 * isAuthorized
 *
 * @description Uses JWT to check if user is authorized
 *              Responds with 401 on authorization error
 *
 * @param req
 * @param res
 * @param next
 */

module.exports = function (req, res, next) {
  // Authorization requires a valid JSON web token in the Authorization header of the API request

  // find authorization token in either request header or query
  let auth
  if (req.cookies && req.cookies.auth) {
    auth = req.cookies.auth
  } else if (req.headers && req.headers.authorization) {
    auth = req.headers.authorization
  } else if (req.param('auth')) {
    auth = req.param('auth')
    delete req.query.auth
  } else {
    return res.forbidden('missing authorization token!')
  }

  // validate token
  return jwt.verify(auth, (err, token) => {
    if (err) {
      return res.forbidden('invalid token!')
    }
    // console.log('[isAuthorized] token', JSON.stringify(token, null, 4))
    req.auth = token
    return next()
  })
}
