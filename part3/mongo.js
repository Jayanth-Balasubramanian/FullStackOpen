const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://Jayanth:${password}@cluster0.hrtbsv5.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv[3] && process.argv[4]) {
  const personName = process.argv[3]
  const personNum = process.argv[4]
  const newPerson = new Person({
    name: personName,
    number: personNum
  })
  newPerson.save().then(() => {
    console.log(`added ${personName} number ${personNum} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Person.find({}).then((result) => {
    console.log('Phonebook')
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}
