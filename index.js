const express = require('express')
var morgan = require('morgan')
const cors = require('cors')


const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))
require('dotenv').config()

const Person = require('./models/person')

morgan.token('data', function (req, res) { 
  if (req.method === "POST") {
    return JSON.stringify(req.body)
 } else {
  return null
 }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

const generateId = () => {
  const id = Math.floor(Math.random() * (1000)) + 1
  if(persons.find(p => p.id !== id)){
    return id
  } else {
    generateId()
  }
  console.log(id);

  return id;
}

app.get('/', (request, response) => {
  response.send('<h1>Phonebook 2</h1>')
})

app.get('/info', (request, response, next) => {
  Person
    .countDocuments({})
    .then(count => {
      response.send(`<div>Phonebook has info for ${count} people.</div><br><div>${new Date()}</div>`)
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons)
      //response.json(persons.map(person => person.toJSON()))
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error)) 
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log("body: ", body)

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    //id: generateId(),
  })

  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson)
    // response.json(savedPerson.toJSON())
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  console.log("body: ", body)

  const person = {
    name: body.name,
    number: body.number,
  }

  Person
    .findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error)) 
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

/*
let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Maria Mat",
      "number": "111- 232 33 44",
      "id": 9
    },
    {
      "name": "Julia Bor",
      "number": "111 333 44 55",
      "id": 10
    }
] 
*/