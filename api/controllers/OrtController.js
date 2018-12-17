const utils = require('../lib/utils')

const service = sails.services['ort-service']

module.exports = {
  /**
   * getLocations
   *
   * @api {get} /locations getLocations
   * @apiName getLocation
   * @apiDescription Gibt alle unterstützten Orte zurück
   * @apiGroup Location
   *
   * @apiSuccess {Array} locations Location
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     [{"plz":97070,"name":"Würzburg"},
   *     {"plz":97084,"name":"Heidingsfeld"},
   *     {"plz":97318,"name":"Kitzingen"}]
   */
  getLocations (req, res) {
    utils.promiseResponder(res, service.getLocations())
  },
  /**
   * getRestaurantsForMap
   *
   * @api {get} /locations/map getRestaurantsForMap
   * @apiName getRestaurantsForMap
   * @apiDescription Gibt alle Restaurants für die Map zurück
   * @apiGroup Location
   *
   * @apiSuccess {Array} restaurants Restaurant
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     [
   *         {
   *            "r_id": 1,
   *            "restaurant_name": "Lulus Restaurant",
   *            "geolong": 94265953774912,
   *            "geolat": 94265954194256,
   *            "geschlossen": 1
   *         },
   *         {
   *             "r_id": 2,
   *             "restaurant_name": "Simons Restaurant",
   *             "geolong": 10.20555,
   *             "geolat": 49.72897,
   *             "geschlossen": 0
   *         }
   *     ]
   */
  getRestaurantsForMap (req, res) {
    utils.promiseResponder(res, service.getRestaurantsForMap())
  }
}
