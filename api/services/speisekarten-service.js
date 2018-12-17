module.exports = {
  getRestaurantOverview: async (restaurantID) => {
    const menu = await sails.models.speisekarten.getMenus(restaurantID)
    const date = new Date()
    const weekDay = date.getDay()
    const hours = date.getHours()
    let restaurant = await sails.models.restaurant.getRestaurant(restaurantID, weekDay)
    let öffnungszeiten = await sails.models.restaurant.getTimes(restaurantID)
    restaurant[0].öffnungszeiten = öffnungszeiten
    if (!restaurant[0].geschlossen) {
      if ((restaurant[0].von > hours || hours > restaurant[0].bis) && restaurant[0].von !== restaurant[0].bis) {
        restaurant[0].geschlossen = 1
        return {
          restaurant,
          menu
        }
      } else {
        return {
          restaurant,
          menu
        }
      }
    } else {
      return {
        restaurant,
        menu
      }
    }
  },
  deleteMenu: (speisekartenId) => {
    return sails.models.speisekarten.deleteMenu(speisekartenId)
  },
  setMenu: (restaurantId, speisekartenTypId) => {
    return sails.models.speisekarten.setMenu(restaurantId, speisekartenTypId)
  }

}
