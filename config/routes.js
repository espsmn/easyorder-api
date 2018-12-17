/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
   ***************************************************************************/

  // LOCATION
  'GET /api/locations': 'OrtController.getLocations',
  'GET /api/locations/map': 'OrtController.getRestaurantsForMap',
  // RESTAURANT
  'GET /api/restaurant': 'RestaurantController.getRestaurants',
  'GET /api/restaurant/:restaurantid': 'RestaurantController.getRestaurant',
  'GET /api/restaurant/filter/:filterid': 'RestaurantController.filter',
  'GET /api/restaurants/lastID': 'RestaurantController.getLastRestaurantID',
  'GET /api/restaurant/search/:searchinput': 'RestaurantController.search',
  'POST /api/restaurant': 'RestaurantController.setRestaurant',
  'PUT /api/restaurant': 'RestaurantController.editRestaurant',
  'DELETE /api/restaurant': 'RestaurantController.deleteRestaurant',
  // SPEISEKARTE
  'GET /api/restaurant/overview/:restaurantid': 'SpeisekartenController.getRestaurantOverview',
  'POST /api/restaurant/speisekarte': 'SpeisekartenController.setMenu',
  'DELETE /api/restaurant/speisekarte': 'SpeisekartenController.deleteMenu',
  // SPEISE
  'GET /api/restaurant/speisekarte/speise/:speisekartenid': 'SpeiseController.getMeals',
  'GET /api/restaurant/speisekarte/speise/bild/:speisenid': 'SpeiseController.getMealPicture',
  'GET /api/restaurant/speisekarte/specials': 'SpeiseController.getSpecials',
  'POST /api/restaurant/speisekarte/speise': 'SpeiseController.setMeal',
  'POST /api/restaurant/speisekarte/speise/bild/:speisenid': 'SpeiseController.setMealPicture',
  'PUT /api/restaurant/speisekarte/speise': 'SpeiseController.editMeal',
  'GET /api/restaurant/speisekarte/speise/types': 'SpeiseController.getTypes',
  'DELETE /api/restaurant/speisekarte/speise': 'SpeiseController.deleteMeal',
  // BILD
  'POST /api/restaurant/logo/:restaurantid': 'RestaurantController.title',
  'GET /api/restaurant/logo/:restaurantid': 'RestaurantController.getTitlePicture',
  'DELETE /api/restaurant/logo/:restaurantid': 'RestaurantController.deleteTitlePicture',
  'GET /api/restaurant/bilder/:restaurantid': 'RestaurantController.getPictures',
  'POST /api/restaurant/bilder/:restaurantid': 'RestaurantController.setPicture',
  'DELETE /api/restaurant/bilder/:restaurantid': 'RestaurantController.deletePicture',
  // USER
  'POST /api/login': 'UserController.userLogin',
  'POST /api/id': 'UserController.decryptRestaurant',
  'GET /api/check': 'UserController.check',
  // ORDER
  'POST /api/order': 'OrderController.sendOrder',
  // SESSION
  'GET /api/v1/session': 'SessionController.createSession',
  '/': {
    view: 'homepage'
  }

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

}
