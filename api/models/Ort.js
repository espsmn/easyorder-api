const db = require('../lib/connectMySQL')

const _Ort = {
  getLocations: function () {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query('SELECT * FROM ort', function (err, results) {
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
  getLocationForPLZ: function (plz) {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query(`SELECT name FROM ort WHERE plz = ${plz}`, function (err, results) {
            if (err) {
              err.devMessage = 'Datenbankfehler'
              reject(err)
            }
            if (connection.client) {
              connection.client.close()
            } else {
              client.end()
            }
            resolve(results[0].name)
          })
        })
    })
  },
  getRestaurantsForMap: function (weekDay) {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query(`
          SELECT
          restaurant.r_id,
          restaurant.name AS restaurant_name,
          restaurant.geolong,
          restaurant.geolat,
          öffnungszeiten.geschlossen
          FROM restaurant
          INNER JOIN öffnungszeiten ON restaurant.r_id = öffnungszeiten.r_id
          WHERE öffnungszeiten.tag = ${weekDay}`, function (err, results) {
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

module.exports = { ..._Ort }
