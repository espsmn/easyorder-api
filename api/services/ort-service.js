const request = require('request-promise')
const endpoint = require('../lib/geoCoder').endpoint

module.exports = {
  getLocations: () => {
    return sails.models.ort.getLocations()
  },
  getLocationForPLZ: (plz) => {
    return sails.models.ort.getLocationForPLZ(plz)
  },
  geoCoder: async (adresse, plz, location) => {
    const query = adresse.replace(/ /g, '+') + ',+' + plz + '+' + location + '?json=1'
    return new Promise((resolve) => {
      request(endpoint + query)
        .then((result) => {
          const coordinates = JSON.parse(result)
          resolve({
            long: coordinates.longt,
            lat: coordinates.latt
          })
        }).catch(() => {
          resolve(0)
        })
    })
  },
  getRestaurantsForMap: () => {
    const date = new Date()
    const weekDay = date.getDay()
    return sails.models.ort.getRestaurantsForMap(weekDay)
  }
}
