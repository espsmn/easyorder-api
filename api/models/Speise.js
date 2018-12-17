const db = require('../lib/connectMySQL')

const _Speise = {
  getMeals: function (speisekartenId) {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query(`
            SELECT * 
            FROM speise
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
  },
  getMealPicture: function (speisenId) {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query(`
            SELECT bild
            FROM speise 
            WHERE s_id = ${speisenId}
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
  setMealPicture: function (speisenId, fileName) {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query(`
            UPDATE speise
            SET bild = '${fileName}'
            WHERE s_id = ${speisenId}
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
  editMeal: function (name, beschreibung, preis, stypid, sid) {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query(`
            UPDATE speise
            SET name = '${name}', beschreibung = '${beschreibung}', preis = ${preis}, styp_id = ${stypid}
            WHERE s_id = ${sid}
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
  setMeal: function (mealArray) {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          const queryPromise = new Promise((resolve) => {
            let query = `
            INSERT INTO 
            speise(name, beschreibung, preis, sk_id, styp_id) 
            VALUES('${mealArray[0].name}', '${mealArray[0].beschreibung}', ${mealArray[0].preis},
                      ${mealArray[0].skid}, ${mealArray[0].stypid})
            `
            let counter = 0
            const maps = mealArray.map((meal) => {
              if (counter !== 0) {
                query += `, ('${meal.name}', '${meal.beschreibung}', ${meal.preis},
                      ${meal.skid}, ${meal.stypid})`
              }
              counter++
            })
            Promise.all(maps).then(() => {
              resolve(query)
            })
          })
          queryPromise.then((query) => {
            client.query(query, function (err, results) {
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
  getTypes: function () {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query(`
          SELECT 
          *
          FROM
          speisentyp
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
  deleteMeal: function (sid) {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query(`
            DELETE FROM speise
            WHERE s_id = ${sid}
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
  getSpecials: function () {
    return new Promise((resolve, reject) => {
      const connection = db()
      const connectionAsPromise = connection.promise ? connection.promise : connection
      connectionAsPromise
        .then(client => {
          client.query(`
            SELECT 
            speisekarte.sk_id, 
            restaurant.name AS restaurantname, 
            speise.name AS speisenname, 
            speise.bild,
            speise.preis,
            bilder.name AS restaurantbild
            FROM speisekarte 
            JOIN restaurant ON restaurant.r_id = speisekarte.r_id 
            JOIN bilder ON bilder.r_id = restaurant.r_id
            JOIN speise ON speise.sk_id = speisekarte.sk_id 
            WHERE sktyp_id = 2 AND bilder.logo = 1
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

module.exports = { ..._Speise }
