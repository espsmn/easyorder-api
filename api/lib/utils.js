module.exports = {
  promiseResponder: (res, promise) => {
    promise.then(result => res.json(200, result))
      .catch(err => {
        console.log(err)
        res.json(500, err)
      })
  }
}
