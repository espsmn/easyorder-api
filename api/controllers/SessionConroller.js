const jwt = require('../services/jwt-service')

module.exports = {
  createSession (req, res) {
    const token = jwt.issue({ip: req.ip}, {audience: 'EasyOrder-GUI'})
    console.log('[SessionController] set auth cookie:', token)
    res.cookie('auth', token)
    res.status(200).json('ok')
  }
}
