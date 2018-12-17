const db = require('../lib/connectMySQL')

const _Speisekarte = {
  getMenus: function (restaurantId) {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query(`
          SELECT 
          speisekarte.sk_id,
          speisekartentyp.name AS typ
          FROM speisekarte
          JOIN speisekartentyp ON speisekartentyp.sktyp_id = speisekarte.sktyp_id
          WHERE r_id = ${restaurantId}
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
  },
  deleteMenu: function (speisekartenId) {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query(`
            DELETE
            FROM speise
            WHERE sk_id = ${speisekartenId}
            `, function (err) {
            if (err) {
              err.devMessage = 'Datenbankfehler'
              reject(err)
            }
            client.query(`
            DELETE 
            FROM speisekarte
            WHERE sk_id = ${speisekartenId}
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
    })
  },
  setMenu: function (restaurantId, speisekartenTypId) {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query(`
            INSERT INTO 
            speisekarte(r_id, sktyp_id) 
            VALUES (${restaurantId}, ${speisekartenTypId})
            `, function (err) {
            if (err) {
              err.devMessage = 'Datenbankfehler'
              reject(err)
            }
            client.query(`
            SELECT
            sk_id 
            FROM speisekarte
            ORDER BY sk_id DESC
            LIMIT 1`, function (err, results) {
              if (err) {
                err.devMessage = 'Datenbankfehler'
                reject(err)
              }
              if (connection.client) {
                connection.client.close()
              } else {
                client.end()
              }
              resolve(results[0])
            })
          })
        })
    })
  }
}

module.exports = { ..._Speisekarte }
