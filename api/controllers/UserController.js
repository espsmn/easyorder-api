const utils = require('../lib/utils')

const service = sails.services['user-service']

module.exports = {
  async userLogin (req, res) {
    const username = req.param('username')
    const email = req.param('email')
    const cypherOrError = await service.userLogin(email, username, req.param('password'))
    res.json(200, cypherOrError)
  },
  async decryptRestaurant (req, res) {
    const cypher = req.param('cypher')
    const restaurantId = await service.decryptRestaurant(cypher)
    res.json(200, restaurantId)
  },
  check (req, res) {
    utils.promiseResponder(res, service.check())
  }
}
