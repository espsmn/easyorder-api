const utils = require('../lib/utils')
const fs = require('fs')

const service = sails.services['restaurant-service']
const userService = sails.services['user-service']
const locationService = sails.services['ort-service']

module.exports = {
  /**
   * getRestaurants
   *
   * @api {get} /restaurant getRestaurants
   * @apiName getRestaurants
   * @apiDescription Gibt alle Restaurants zurück
   * @apiGroup Restaurant
   *
   * @apiSuccess {Array} restaurants Restaurant
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     [
   *         {
   *            "r_id": 3,
   *            "restaurant_name": "Ristorante Pizza",
   *            "bild_name": null,
   *            "ort_name": "Würzburg",
   *            "plz": 97070,
   *            "adresse": "Höchberger Str. 4A",
   *            "von": 0,
   *            "bis": 0,
   *            "geschlossen": 1
   *         },
   *         {
   *            "r_id": 4,
   *            "restaurant_name": "Hallo Restaurant",
   *            "bild_name": null,
   *            "ort_name": "Würzburg",
   *            "plz": 97070,
   *            "adresse": "Höchberger Str. 4A",
   *            "von": 0,
   *            "bis": 0,
   *            "geschlossen": 0
   *         }
   *     ]
   */
  getRestaurants (req, res) {
    utils.promiseResponder(res, service.getRestaurants())
  },
  /**
   * getRestaurant
   *
   * @api {get} /restaurant/:restaurantid getRestaurant
   * @apiName getRestaurant
   * @apiDescription Gibt ein Restaurant zurück
   * @apiGroup Restaurant
   *
   * @apiParam {Number} restaurantid Id eines Restaurants
   *
   * @apiParamExample {Number} Example: restaurantid
   *    4
   *
   * @apiSuccess {Array} restaurant Restaurant
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     [
   *         {
   *            "r_id": 4,
   *            "restaurant_name": "Hallo Restaurant",
   *            "bild_name": null,
   *            "ort_name": "Würzburg",
   *            "plz": 97070,
   *            "adresse": "Höchberger Str. 4A",
   *            "von": 0,
   *            "bis": 0,
   *            "geschlossen": 0
   *         }
   *     ]
   */
  getRestaurant (req, res) {
    const restaurantId = req.param('restaurantid')
    utils.promiseResponder(res, service.getRestaurant(restaurantId))
  },
  async setRestaurant (req, res) {
    const nachname = req.param('nachname')
    const vorname = req.param('vorname')
    const username = req.param('username')
    const email = req.param('email')
    const name = req.param('name')
    const plz = req.param('plz')
    const type = req.param('type')
    const times = req.param('times')
    const adresse = req.param('adresse')
    const location = await locationService.getLocationForPLZ(plz)
    const coordinates = await locationService.geoCoder(adresse, plz, location)
    utils.promiseResponder(res, new Promise(async (resolve, reject) => {
      try {
        const register = await userService.register(nachname, vorname, username, email, req.param('password'))
        resolve(await service.setRestaurant(name, plz, type, times, adresse, register.gastronomId, coordinates))
      } catch (e) {
        reject(e)
      }
    }))
  },
  editRestaurant (req, res) {
    const restaurantId = req.param('restaurantid')
    utils.promiseResponder(res, service.editRestaurant(restaurantId))
  },
  deleteRestaurant (req, res) {
    const restaurantId = req.param('restaurantid')
    utils.promiseResponder(res, service.deleteRestaurant(restaurantId))
  },
  title (req, res) {
    const restaurantId = req.param('restaurantid')
    req.file('image').upload({
      dirname: require('path').resolve(sails.config.appPath, 'assets/images')
    }, function (err, uploadedFiles) {
      if (err) {
        err.devMessage = 'Fehler beim Upload'
        return res.serverError(err)
      }
      const imagesAt = uploadedFiles[0].fd.search('images/')
      const fileName = uploadedFiles[0].fd.slice(imagesAt + 7)
      utils.promiseResponder(res, service.addTitlePicture(restaurantId, fileName))
    })
  },
  async getTitlePicture (req, res) {
    const restaurantId = req.param('restaurantid')
    const file = await service.titlePicture(restaurantId)
    const fileName = JSON.parse(JSON.stringify(file.name))
    fs.readFile('assets/images/' + fileName, function (err, content) {
      if (err) {
        res.writeHead(400, {'Content-type': 'text/html'})
        res.end('No such image')
      } else {
        res.writeHead(200, {'Content-type': 'image/gif'})
        res.end(content)
      }
    })
  },
  deleteTitlePicture (req, res) {
    const restaurantId = req.param('restaurantid')
    utils.promiseResponder(res, service.deleteTitlePicture(restaurantId))
  },
  async getPictures (req, res) {
    const restaurantId = req.param('restaurantid')
    const files = await service.pictures(restaurantId)
    let pictures = []
    const fileIterator = files.map((file) => {
      return new Promise((resolve) => {
        fs.readFile('assets/images/' + file.name, function (err, content) {
          if (err) {
            throw err
          }
          pictures.push({name: file.name, file: content})
          resolve()
        })
      })
    })
    Promise.all(fileIterator).then(() => {
      res.send(pictures)
    })
  },
  setPicture (req, res) {
    const restaurantId = req.param('restaurantid')
    req.file('image').upload({
      dirname: require('path').resolve(sails.config.appPath, 'assets/images')
    }, function (err, uploadedFiles) {
      if (err) {
        err.devMessage = 'Fehler beim Upload'
        return res.serverError(err)
      }
      const imagesAt = uploadedFiles[0].fd.search('images/')
      const fileName = uploadedFiles[0].fd.slice(imagesAt + 7)
      utils.promiseResponder(res, service.addPicture(restaurantId, fileName))
    })
  },
  deletePicture (req, res) {
    const restaurantId = req.param('restaurantid')
    const fileName = req.param('filename')
    fs.unlink('assets/images/' + fileName, function (err) {
      if (err) {
        res.end('File was not deleted: ' + err)
      }
    })
    utils.promiseResponder(res, service.deletePicture(restaurantId, fileName))
  },
  /**
   * filter
   *
   * @api {get} /restaurant/filter/:filterid filter
   * @apiName filter
   * @apiDescription Gibt alle Restaurants zurück, welche auf den Filter zutreffen
   * @apiGroup Restaurant
   *
   * @apiParam {Number} [typ] Optional Restauranttyp
   * @apiParam {Number} [ort] Optional Postleitzahl
   *
   * @apiParamExample {Number} Example: typ
   *    2
   * @apiParamExample {Number} Example: ort
   *    97318
   *
   * @apiSuccess {Array} restaurants Restaurant
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     [
   *         {
   *            "r_id": 3,
   *            "restaurant_name": "Ristorante Pizza",
   *            "bild_name": null,
   *            "ort_name": "Würzburg",
   *            "plz": 97070,
   *            "adresse": "Höchberger Str. 4A",
   *            "von": 0,
   *            "bis": 0,
   *            "geschlossen": 1
   *         },
   *         {
   *            "r_id": 4,
   *            "restaurant_name": "Hallo Restaurant",
   *            "bild_name": null,
   *            "ort_name": "Würzburg",
   *            "plz": 97070,
   *            "adresse": "Höchberger Str. 4A",
   *            "von": 0,
   *            "bis": 0,
   *            "geschlossen": 0
   *         }
   *     ]
   */
  filter (req, res) {
    const filterID = req.param('filterid')
    utils.promiseResponder(res, service.filter(filterID))
  },
  getLastRestaurantID (req, res) {
    utils.promiseResponder(res, service.lastRestaurantID())
  },
  /**
   * search
   *
   * @api {get} /restaurant/search/:searchinput search
   * @apiName search
   * @apiDescription Gibt alle Restaurants zurück, welche auf die Suche zutreffen
   * @apiGroup Restaurant
   *
   * @apiParam {Number} searchinput Restaurantname
   *
   * @apiParamExample {String} Example: searchinput
   *    Ristorante Pizza
   *
   * @apiSuccess {Array} restaurant Restaurant
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     [
   *         {
   *            "r_id": 3,
   *            "restaurant_name": "Ristorante Pizza",
   *            "bild_name": null,
   *            "ort_name": "Würzburg",
   *            "plz": 97070,
   *            "adresse": "Höchberger Str. 4A",
   *            "von": 0,
   *            "bis": 0,
   *            "geschlossen": 1
   *         }
   *     ]
   */
  search (req, res) {
    const input = req.param('searchinput')
    utils.promiseResponder(res, service.searchFor(input))
  }
}
