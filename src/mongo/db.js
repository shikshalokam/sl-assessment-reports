var MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectId;
var config = require('../config/config')
var state = {
  db: null,
}

module.exports = {
  connect: function (url, done) {
    if (state.db) return done()

    MongoClient.connect(url, function (err, client) {
      if (err) return done(err)
      db = client.db(config.mongodb)
      state.db = db
      done()
    })
  },

  get: function () {
    return state.db
  },

  close: function (done) {
    if (state.db) {
      state.db.close(function (err, result) {
        state.db = null
        state.mode = null
      })
    }
  }
}