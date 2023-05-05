// Import mongoose in db.js
const mongoose = require('mongoose')

// define connection string
mongoose.connect('mongodb://localhost:27017/bank')

// create collection / model

const User = mongoose.model('User', {
    acno: Number,
    username: String,
    password: String,
    balance: Number,
    transactions: []
})

// export the model

module.exports = {
    User
}