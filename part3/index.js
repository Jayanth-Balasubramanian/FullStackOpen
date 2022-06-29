require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(express.static('build'))
app.use(express.json())
app.use(cors())

morgan.token('postContent', (request) => (request.method === 'POST'
  ? JSON.stringify(request.body)
  : null))
morgan.format('PhonebookLog', ':method :url :status :res[content-length] - :response-time ms :postContent')
app.use(morgan('PhonebookLog'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then((people) => response.json(people))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.find({ _id: request.params.id }).then(
    (person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    }
  ).catch((error) => next(error))
})

app.get('/info', (request, response) => {
  const dateAndTime = new Date().toString()
  Person.find({}).then((res) => response.send(`<p> Phonebook has info for ${res.length} people <br> ${dateAndTime}</p>`))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const { id } = request.params
  Person.findByIdAndRemove(id).then(() => response.status(204).end()).catch((e) => {
    next(e)
  })
})

app.post('/api/persons', (request, response, next) => {
  const { body } = request
  if (!body.name || !body.number) {
    return response.status(400).json({ error: `${!body.name ? 'name' : 'number'} missing` })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save().then((savedPerson) => response.json(savedPerson)).catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndUpdate({ _id: request.params.id }, request.body, { new: true, runValidators: true, context: 'query' })
    .then((updatedPerson) => response.json(updatedPerson))
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const { PORT } = process.env
app.listen(PORT, () => console.log(`Server running on ${PORT}`))
