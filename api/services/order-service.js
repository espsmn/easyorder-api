const nodemailer = require('nodemailer')

module.exports = {
  sendOrder: async (restaurantId, mealArray, options) => {
    const restaurant = await sails.models.order.sendOrder(restaurantId)

    const aufnahme = options.besteller + ' hat bei Ihnen eine Bestellung aufgegeben.'
    const telefon = 'Telefonnummer von ' + options.besteller + ': ' + options.telefonnummer
    const bestellkopf = options.tischnummer ? 'Bestellung: (Tischnummer: ' + options.tischnummer + ')' : 'Bestellung: '
    const bestellung = mealArray.map((meal) => {
      return '\n' + meal.name + ' (' + meal.preis + '€)'
    })
    const gesamtpreis = 'Gesamtpreis: ' + options.gesamtpreis + '€'
    const abholung = options.abholzeit ? 'Die Bestellung wird um ' + options.abholzeit + ' Uhr abgeholt.' : ''
    const ankunft = options.ankunftszeit ? 'Die Bestellung wird um ' + options.ankunftszeit + ' Uhr im Restaurant entgegen genommen.' : ''
    const abrede = 'Ihr EasyOrder Team.'

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'easyorder18',
        pass: 'EasyOrderWithThisMail'
      }
    })

    const mailOptions = {
      from: 'easyorder18@gmail.com',
      to: restaurant[0].email,
      subject: 'Bestellung EasyOrder (Restaurant: ' + restaurant[0].name + ')',
      text: aufnahme + '\n' + telefon + '\n\n' + bestellkopf + bestellung + '\n' + gesamtpreis + '\n\n' + abholung + ankunft + '\n\n' + abrede
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        return ('Email sent: ' + info.response)
      }
    })
  }
}
