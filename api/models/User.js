const db = require('../lib/connectMySQL')

const _User = {
  register: function (nachname, vorname, username, email, password) {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query(`
            INSERT INTO 
            gastronom(nachname, vorname, username, email, password)
            VALUES("${nachname}", "${vorname}", "${username}", "${email}", "${password}")
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
            resolve({gastronomId: results.insertId})
          })
        })
    })
  },
  userLogin: function (email = null, username = null) {
    return new Promise((resolve, reject) => {
      const connection = db()
      const check = email ? `gastronom.email = "${email}"` : `gastronom.username = "${username}"`
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query(`
            SELECT 
            restaurant.r_id,
            gastronom.password
            FROM restaurant
            JOIN gastronom ON restaurant.gastronom_id = gastronom.gastronom_id
            WHERE ` + check, function (err, results) {
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
  },
  check: function () {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query(`
            SELECT 
            email, username
            FROM gastronom`, function (err, results) {
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

module.exports = { ..._User }
