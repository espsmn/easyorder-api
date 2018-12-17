const jwt = require('../../api/services/jwt-service')

const tokens = [
  {
    name: 'Developer token',
    options: {audience: 'dev'},
    payload: {}
  },
  {
    name: 'EasyOrder GUI token (for the website)',
    options: {
      audience: 'EasyOrder-GUI',
      expiresIn: 30 * 60 * 60 * 24 // 30d
    },
    payload: {}
  },
  {
    name: 'EasyOrder App token (for the mobile app)',
    options: {
      audience: 'EasyOrder-APP',
      expiresIn: 30 * 60 * 60 * 24 // 30d
    },
    payload: {}
  },
  {
    name: 'Admin token',
    options: {
      audience: 'admin',
      expiresIn: 60 * 30 * 3 // 30m
    },
    payload: {}
  }
].map(t => ({
  name: t.name,
  serialized: jwt.issue(t.payload, t.options)
}))

tokens.forEach(token => {
  jwt.verify(token.serialized, (err, options) => {
    if (err) {
      return console.error('token generation failed!')
    }
    console.log('--- ' + token.name + ' ---')
    console.log('token:', JSON.stringify(token.serialized, null, 4))
    console.log('payload:', JSON.stringify(options, null, 4))
  })
})
