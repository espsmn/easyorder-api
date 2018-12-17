const Buffer = require('safe-buffer').Buffer

const fs = require('fs')

module.exports = {
  getMeals: async (speisekartenId) => {
    const meals = await sails.models.speise.getMeals(speisekartenId)
    return meals.map((meal) => {
      if (meal.bild) {
        const bild = fs.readFileSync('assets/images/' + meal.bild)
        meal.bild = Buffer.from(bild, 'binary').toString('base64')
      }
      return meal
    })
  },
  editMeal: (name, beschreibung, preis, stypid, sid) => {
    return sails.models.speise.editMeal(name, beschreibung, preis, stypid, sid)
  },
  deleteMeal: (sid) => {
    return sails.models.speise.deleteMeal(sid)
  },
  setMeal: (mealArray) => {
    return sails.models.speise.setMeal(mealArray)
  },
  getTypes: () => {
    return sails.models.speise.getTypes()
  },
  getMealPicture: (speisenId) => {
    return sails.models.speise.getMealPicture(speisenId)
  },
  setMealPicture: (speisenId, fileName) => {
    return sails.models.speise.setMealPicture(speisenId, fileName)
  },
  getSpecials: async () => {
    let meals = await sails.models.speise.getSpecials()
    return meals.map((meal) => {
      if (meal.bild) {
        const bild = fs.readFileSync('assets/images/' + meal.bild)
        meal.bild = Buffer.from(bild, 'binary').toString('base64')
      }
      if (meal.restaurantbild) {
        const bild = fs.readFileSync('assets/images/' + meal.restaurantbild)
        meal.restaurantbild = Buffer.from(bild, 'binary').toString('base64')
      }
      return meal
    })
  }
}
