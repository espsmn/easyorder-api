const service = sails.services['order-service']

module.exports = {
  sendOrder (req, res) {
    const restaurantId = req.param('restaurantid')
    const mealArray = req.param('mealarray')
    const options = req.param('options')
    res.json(service.sendOrder(restaurantId, mealArray, options))
  }
}
