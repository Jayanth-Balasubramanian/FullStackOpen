const mongoose = require('mongoose')

const url = process.env.MONGODB_URL
const uniqueValidator = require('mongoose-unique-validator')

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name must be at least 3 characters long'],
    required: [true, 'Name not provided'],
    unique: true
  },
  number: {
    type: String,
    minLength: [8, 'Number must be at least 8 characters long'],
    required: [true, 'Number not provided'],
    validate: [function (v) {
      return /\d{2,3}-\d+/.test(v)
    }, 'Invalid Number']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

personSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Person', personSchema)
