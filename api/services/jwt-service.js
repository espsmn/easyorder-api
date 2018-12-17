/**
 * jwToken
 * @description :: JSON Webtoken Service for sails
 * @see: https://jwt.io/introduction/
 */

const jwt = require('jsonwebtoken')
const tokenSecret = 'x22espsqqMq2o3UZ'

// Generates a token from supplied payload
/**
 *
 * @param payload any JSON payload, default: {}
 * @param opts JWT options like
 *        audience
 *        issuer
 *        jwtid
 *        subject
 *        noTimestamp
 *        header
 *        keyid
 * @returns {*}
 */
module.exports.issue = function (payload = {}, opts) {
  const options = {
    expiresIn: 14 * 24 * 60 * 60, // seconds = 14 days
    ...opts
  }
  return jwt.sign(payload, tokenSecret, options)
}

// Verifies token on a request
module.exports.verify = function (token, callback) {
  return jwt.verify(token, tokenSecret, callback)
}
