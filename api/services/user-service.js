const cryptoJS = require('crypto-js')

module.exports = {
  register: async (nachname, vorname, username, email, password) => {
    const hashedPassword = cryptoJS.SHA1(password, 'ordereasywithasalt')
    return sails.models.user.register(nachname, vorname, username, email, hashedPassword)
  },
  userLogin: async (email, user, password) => {
    const loginTry = await sails.models.user.userLogin(email, user)
    const hashedPassword = cryptoJS.SHA1(password, 'ordereasywithasalt')
    if (loginTry[0] && hashedPassword.toString() === loginTry[0].password) {
      const restaurantId = loginTry[0].r_id.toString()
      let cypher = cryptoJS.AES.encrypt(restaurantId.toString(), 'ordersafe')
      cypher = await cypher.toString().replace('+', 'xMl3Jk').replace('/', 'Por21Ld').replace('=', 'Ml32')
      return { cypher: cypher.toString() }
    } else {
      return 'Passwort, Username oder email sind nicht korrekt!'
    }
  },
  decryptRestaurant: async (cypher) => {
    cypher = await cypher.toString().replace('xMl3Jk', '+').replace('Por21Ld', '/').replace('Ml32', '=')
    const decrypted = cryptoJS.AES.decrypt(cypher, 'ordersafe')
    const restaurantId = decrypted.toString(cryptoJS.enc.Utf8)
    return { restaurantId: restaurantId }
  },
  check: () => {
    return sails.models.user.check()
  }
}
