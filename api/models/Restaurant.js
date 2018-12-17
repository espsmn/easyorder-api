const db = require('../lib/connectMySQL')

const _Restaurant = {
  getRestaurants: function (weekDay) {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query(`
          SELECT 
          restaurant.r_id, 
          restaurant.name AS restaurant_name,
          bilder.name AS bild_name,
          ort.name AS ort_name,
          ort.plz,
          restaurant.adresse,
          öffnungszeiten.von,
          öffnungszeiten.bis,
          öffnungszeiten.geschlossen
          FROM restaurant 
          INNER JOIN ort ON restaurant.plz = ort.plz
          INNER JOIN öffnungszeiten ON restaurant.r_id = öffnungszeiten.r_id
          LEFT JOIN bilder ON restaurant.r_id = bilder.r_id
          WHERE öffnungszeiten.tag = ${weekDay} AND bilder.logo = 1
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
  getRestaurant: function (restaurantID, weekDay) {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query(`
          SELECT 
          restaurant.r_id, 
          restaurant.name AS restaurant_name,
          ort.name AS ort_name,
          ort.plz,
          restaurant.adresse,
          öffnungszeiten.von,
          öffnungszeiten.bis,
          öffnungszeiten.geschlossen,
          restaurant.geolong,
          restaurant.geolat
          FROM restaurant
          INNER JOIN ort ON restaurant.plz = ort.plz
          INNER JOIN öffnungszeiten ON restaurant.r_id = öffnungszeiten.r_id
          WHERE restaurant.r_id = ${restaurantID} AND öffnungszeiten.r_id = ${restaurantID} AND öffnungszeiten.tag = ${weekDay}
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
  getTimes: function (restaurantID) {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query(`
          SELECT 
          tag,
          von,
          bis,
          geschlossen
          FROM öffnungszeiten
          WHERE r_id = ${restaurantID}
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
  setRestaurant: function (name, plz, type, times, adresse, gastronomId, coordinates) {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          if (!times) {
            client.query(`
            INSERT INTO  
            restaurant(name, plz, rtyp_id, gastronom_id, adresse, geolat, geolong)
            VALUES ('${name}', ${plz}, ${type}, ${gastronomId}, '${adresse}', ${parseFloat(coordinates.lat)}, ${parseFloat(coordinates.long)})
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
              resolve({restaurantId: results.insertId})
            })
          } else {
            client.query(`
            INSERT INTO  
            restaurant(name, plz, rtyp_id, gastronom_id, adresse, geolat, geolong)
            VALUES ('${name}', ${plz}, ${type}, ${gastronomId}, '${adresse}', ${parseFloat(coordinates.lat)}, ${parseFloat(coordinates.long)})
            `, function (err, results) {
              if (err) {
                err.devMessage = 'Datenbankfehler'
                reject(err)
              }
              client.query(`
              INSERT INTO 
              öffnungszeiten(r_id, tag, von, bis, geschlossen)
              VALUES
              (${results.insertId}, 1, ${times.monday.from}, ${times.monday.to}, ${times.monday.closed}),
              (${results.insertId}, 2, ${times.tuesday.from}, ${times.tuesday.to}, ${times.tuesday.closed}),
              (${results.insertId}, 3, ${times.wednesday.from}, ${times.wednesday.to}, ${times.wednesday.closed}),
              (${results.insertId}, 4, ${times.thursday.from}, ${times.thursday.to}, ${times.thursday.closed}),
              (${results.insertId}, 5, ${times.friday.from}, ${times.friday.to}, ${times.friday.closed}),
              (${results.insertId}, 6, ${times.saturday.from}, ${times.saturday.to}, ${times.saturday.closed}),
              (${results.insertId}, 0, ${times.sunday.from}, ${times.sunday.to}, ${times.sunday.closed})
              `, (error) => {
                if (error) {
                  error.devMessage = 'Datenbankfehler'
                  reject(error)
                }
                if (connection.client) {
                  connection.client.close()
                } else {
                  client.end()
                }
                resolve({restaurantId: results.insertId})
              })
            })
          }
        })
    })
  },
  deleteRestaurant: function (restaurantId) {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query(`
          DELETE 
          FROM restaurant 
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
  getFilteredRestaurants: function (filterID, weekDay) {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query(`
          SELECT 
          restaurant.r_id, 
          restaurant.name AS restaurant_name,
          bilder.name AS bild_name,
          ort.name AS ort_name,
          ort.plz,
          restaurant.adresse,
          öffnungszeiten.von,
          öffnungszeiten.bis,
          öffnungszeiten.geschlossen
          FROM restaurant 
          INNER JOIN ort ON restaurant.plz = ort.plz
          LEFT JOIN bilder ON restaurant.r_id = bilder.r_id
          INNER JOIN öffnungszeiten ON restaurant.r_id = öffnungszeiten.r_id
          WHERE restaurant.rtyp_id = ${filterID} AND öffnungszeiten.tag = ${weekDay} AND bilder.logo = 1
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
  getLastRestaurantID: function () {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query(`
            SELECT 
            r_id 
            FROM restaurant 
            ORDER BY r_id DESC 
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
  },
  newTitlePicture: function (restaurantId, fileName) {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query(`
          INSERT INTO 
          bilder(name, r_id, logo) 
          VALUES('${fileName}',${restaurantId}, 1)
            `, function (err) {
            if (err) {
              err.devMessage = 'Datenbankfehler'
              reject(err)
            }
            if (connection.client) {
              connection.client.close()
            } else {
              client.end()
            }
            resolve('OK')
          })
        })
    })
  },
  setPicture: function (restaurantId, fileName) {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query(`
          INSERT INTO 
          bilder(name, r_id) 
          VALUES('${fileName}',${restaurantId})
            `, function (err) {
            if (err) {
              err.devMessage = 'Datenbankfehler'
              reject(err)
            }
            if (connection.client) {
              connection.client.close()
            } else {
              client.end()
            }
            resolve('OK')
          })
        })
    })
  },
  getTitlePicture: function (restaurantId) {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query(`
          SELECT 
          name
          FROM bilder 
          WHERE r_id = ${restaurantId} AND logo = 1
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
            resolve(results[0])
          })
        })
    })
  },
  getPictures: function (restaurantId) {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query(`
          SELECT 
          name
          FROM bilder 
          WHERE r_id = ${restaurantId} AND logo = 0
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
  deleteTitlePicture: function (restaurantId) {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query(`
          DELETE 
          FROM bilder 
          WHERE r_id = ${restaurantId} AND logo = 1
            `, function (err) {
            if (err) {
              err.devMessage = 'Datenbankfehler'
              reject(err)
            }
            if (connection.client) {
              connection.client.close()
            } else {
              client.end()
            }
            resolve('Successfully deleted')
          })
        })
    })
  },
  deletePicture: function (restaurantId, fileName) {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query(`
          DELETE 
          FROM bilder 
          WHERE r_id = ${restaurantId} AND name = '${fileName}'
            `, function (err) {
            if (err) {
              err.devMessage = 'Datenbankfehler'
              reject(err)
            }
            if (connection.client) {
              connection.client.close()
            } else {
              client.end()
            }
            resolve('Successfully deleted')
          })
        })
    })
  },
  search: function (input, weekDay) {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query(`
            SELECT 
            restaurant.r_id, 
            restaurant.name AS restaurant_name,
            bilder.name AS bild_name,
            ort.name AS ort_name,
            ort.plz,
            restaurant.adresse,
            öffnungszeiten.von,
            öffnungszeiten.bis,
            öffnungszeiten.geschlossen
            FROM restaurant 
            INNER JOIN ort ON restaurant.plz = ort.plz
            LEFT JOIN bilder ON restaurant.r_id = bilder.r_id
            INNER JOIN öffnungszeiten ON restaurant.r_id = öffnungszeiten.r_id
            WHERE restaurant.name = "${input}" AND öffnungszeiten.tag = ${weekDay} AND bilder.logo = 1
            `, function (err, results) {
            if (err) {
              err.devMessage = 'Datenbankfehler'
              reject(err)
            }
            if (results[0]) {
              if (connection.client) {
                connection.client.close()
              } else {
                client.end()
              }
              resolve(results)
            } else {
              client.query(`
              SELECT 
              restaurant.r_id,
              restaurant.name AS restaurant_name,
              bilder.name AS bild_name,
              ort.name AS ort_name,
              ort.plz,
              restaurant.adresse,
              öffnungszeiten.von,
              öffnungszeiten.bis,
              öffnungszeiten.geschlossen
              FROM restaurant 
              INNER JOIN ort ON restaurant.plz = ort.plz
              LEFT JOIN bilder ON restaurant.r_id = bilder.r_id
              INNER JOIN öffnungszeiten ON restaurant.r_id = öffnungszeiten.r_id
              WHERE ort.name = "${input}" AND öffnungszeiten.tag = ${weekDay} AND bilder.logo = 1`, function (err, results) {
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
            }
          })
        })
    })
  }
}

module.exports = { ..._Restaurant }
