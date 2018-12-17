const Buffer = require('safe-buffer').Buffer

const fs = require('fs')

module.exports = {
  getRestaurants: async () => {
    const date = new Date()
    const weekDay = date.getDay()
    const hours = date.getHours()
    let restaurants = await sails.models.restaurant.getRestaurants(weekDay)
    return restaurants.map((restaurant) => {
      if (restaurant.bild_name) {
        const bild = fs.readFileSync('assets/images/' + restaurant.bild_name)
        restaurant.bild = Buffer.from(bild, 'binary').toString('base64')
      }
      if (!restaurant.geschlossen) {
        if ((restaurant.von > hours || hours > restaurant.bis) && restaurant.von !== restaurant.bis) {
          restaurant.geschlossen = 1
          return restaurant
        } else {
          return restaurant
        }
      } else {
        return restaurant
      }
    })
  },
  getRestaurant: async (restaurantId) => {
    const date = new Date()
    const weekDay = date.getDay()
    const hours = date.getHours()
    let restaurant = await sails.models.restaurant.getRestaurant(restaurantId, weekDay)
    let öffnungszeiten = await sails.models.restaurant.getTimes(restaurantId)
    restaurant[0].öffnungszeiten = öffnungszeiten
    if (!restaurant[0].geschlossen) {
      if ((restaurant[0].von > hours || hours > restaurant[0].bis) && restaurant[0].von !== restaurant[0].bis) {
        restaurant[0].geschlossen = 1
        return restaurant
      } else {
        return restaurant
      }
    } else {
      return restaurant
    }
  },
  setRestaurant: (name, plz, types, times, adresse, gastronomId, coordinates) => {
    return sails.models.restaurant.setRestaurant(name, plz, types, times, adresse, gastronomId, coordinates)
  },
  editRestaurant: (restaurantId) => {
    return sails.models.restaurant.editRestaurant(restaurantId)
  },
  deleteRestaurant: (restaurantId) => {
    return sails.models.restaurant.deleteRestaurant(restaurantId)
  },
  lastRestaurantID: () => {
    return sails.models.restaurant.getLastRestaurantID()
  },
  filter: async (filterID) => {
    const date = new Date()
    const weekDay = date.getDay()
    const hours = date.getHours()
    let restaurants = await sails.models.restaurant.getFilteredRestaurants(filterID, weekDay)
    return restaurants.map((restaurant) => {
      if (restaurant.bild_name) {
        const bild = fs.readFileSync('assets/images/' + restaurant.bild_name)
        restaurant.bild = Buffer.from(bild, 'binary').toString('base64')
      }
      if (!restaurant.geschlossen) {
        if ((restaurant.von > hours || hours > restaurant.bis) && restaurant.von !== restaurant.bis) {
          restaurant.geschlossen = 1
          return restaurant
        } else {
          return restaurant
        }
      } else {
        return restaurant
      }
    })
  },
  addTitlePicture: (restaurantId, fileName) => {
    return sails.models.restaurant.newTitlePicture(restaurantId, fileName)
  },
  deleteTitlePicture: (restaurantId) => {
    return sails.models.restaurant.deleteTitlePicture(restaurantId)
  },
  addPicture: (restaurantId, fileName) => {
    return sails.models.restaurant.setPicture(restaurantId, fileName)
  },
  deletePicture: (restaurantId, fileName) => {
    return sails.models.restaurant.deletePicture(restaurantId, fileName)
  },
  titlePicture: (restaurantId) => {
    return sails.models.restaurant.getTitlePicture(restaurantId)
  },
  pictures: (restaurantId) => {
    return sails.models.restaurant.getPictures(restaurantId)
  },
  searchFor: async (input) => {
    const date = new Date()
    const weekDay = date.getDay()
    const hours = date.getHours()
    let restaurants = await sails.models.restaurant.search(input, weekDay)
    return restaurants.map((restaurant) => {
      if (restaurant.bild_name) {
        const bild = fs.readFileSync('assets/images/' + restaurant.bild_name)
        restaurant.bild = Buffer.from(bild, 'binary').toString('base64')
      }
      if (!restaurant.geschlossen) {
        if ((restaurant.von > hours || hours > restaurant.bis) && restaurant.von !== restaurant.bis) {
          restaurant.geschlossen = 1
          return restaurant
        } else {
          return restaurant
        }
      } else {
        return restaurant
      }
    })
  }
}
