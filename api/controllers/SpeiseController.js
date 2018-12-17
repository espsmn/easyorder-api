const utils = require('../lib/utils')
const fs = require('fs')

const service = sails.services['speise-service']

module.exports = {
  /**
   * getMeals
   *
   * @api {get} /restaurant/speisekarte/speise/:speisekartenid getMeals
   * @apiName getMeals
   * @apiDescription Gibt eine Speisekarte für die angegeben Id zurück
   * @apiGroup Speise
   *
   * @apiParam {Number} speisekartenid Id eines Restaurants
   *
   * @apiParamExample {Number} Example: speisekartenid
   *    3
   *
   * @apiSuccess {Array} restaurant Restaurant
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     [
   *        {
   *           "s_id": 6,
   *           "name": "Salat mit Meeresfrüchten",
   *           "beschreibung": "Grüner Salat, Tomaten, Zwiebeln und Meeresfrüchte",
   *           "preis": 9,
   *           "sk_id": 8,
   *           "styp_id": 1,
   *           "bild": null
   *        }
   *     ]
   */
  getMeals (req, res) {
    const speisekartenId = req.param('speisekartenid')
    utils.promiseResponder(res, service.getMeals(speisekartenId))
  },
  setMeal (req, res) {
    const mealArray = req.param('mealarray')
    utils.promiseResponder(res, service.setMeal(mealArray))
  },
  async getMealPicture (req, res) {
    const speisenId = req.param('speisenid')
    const file = await service.getMealPicture(speisenId)
    console.log(file)
    if (file.bild) {
      const fileName = JSON.parse(JSON.stringify(file.bild))
      fs.readFile('assets/images/' + fileName, function (err, content) {
        if (err) {
          res.writeHead(400, {'Content-type': 'text/html'})
          res.end('No such image')
        } else {
          res.writeHead(200, {'Content-type': 'image/gif'})
          res.end(content)
        }
      })
    } else {
      res.end('No picture')
    }
  },
  setMealPicture (req, res) {
    const speisenId = req.param('speisenid')
    req.file('image').upload({
      dirname: require('path').resolve(sails.config.appPath, 'assets/images')
    }, function (err, uploadedFiles) {
      if (err) {
        err.devMessage = 'Fehler beim Upload'
        return res.serverError(err)
      }
      const imagesAt = uploadedFiles[0].fd.search('images/')
      const fileName = uploadedFiles[0].fd.slice(imagesAt + 7)
      utils.promiseResponder(res, service.setMealPicture(speisenId, fileName))
    })
  },
  editMeal (req, res) {
    const name = req.param('name')
    const beschreibung = req.param('beschreibung')
    const preis = req.param('preis')
    const sid = req.param('sid')
    const stypid = req.param('stypid')
    utils.promiseResponder(res, service.editMeal(name, beschreibung, preis, stypid, sid))
  },
  getTypes (req, res) {
    utils.promiseResponder(res, service.getTypes())
  },
  deleteMeal (req, res) {
    const sid = req.param('sid')
    utils.promiseResponder(res, service.deleteMeal(sid))
  },
  getSpecials (req, res) {
    utils.promiseResponder(res, service.getSpecials())
  }
}
