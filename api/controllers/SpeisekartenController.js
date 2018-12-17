const utils = require('../lib/utils')

const service = sails.services['speisekarten-service']

module.exports = {
  /**
   * getRestaurantOverview
   *
   * @api {get} /restaurant/overview/:restaurantid getRestaurantOverview
   * @apiName getRestaurantOverview
   * @apiDescription Gibt eine Übersicht des Restaurants zurück
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
  getRestaurantOverview (req, res) {
    const restaurantID = req.param('restaurantid')
    utils.promiseResponder(res, service.getRestaurantOverview(restaurantID))
  },
  setMenu (req, res) {
    const restaurantID = req.param('restaurantid')
    const speisekartenTypID = req.param('speisekartentypid')
    utils.promiseResponder(res, service.setMenu(restaurantID, speisekartenTypID))
  },
  deleteMenu (req, res) {
    const speisekartenId = req.param('skid')
    utils.promiseResponder(res, service.deleteMenu(speisekartenId))
  }
}
