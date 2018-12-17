const db = require('../lib/connectMySQL')

const _Order = {
  sendOrder: function (restaurantId) {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query(`
          SELECT 
          restaurant.name,
          gastronom.nachname,
          gastronom.vorname,
          gastronom.email
          FROM restaurant
          JOIN gastronom ON gastronom.gastronom_id = restaurant.gastronom_id
          WHERE restaurant.r_id = ${restaurantId}
          `, function (err, results) {
            if (err) {
              err.devMessage = 'Datenbankfehler'
              reject(err)
            }
            if (connection.client) {
              connection.client.close()
            } else {
              client.end()
            }
            resolve(results)
          })
        })
    })
  }
}

module.exports = { ..._Order }
