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

app.get('/', (request, response) => {
  response.send('<h1>Phonebook 2</h1>')
})

app.get('/info', (request, response) => {
  Person.countDocuments({})
  .then(count => {
    response.send(`<div>Phonebook has info for ${count} people.</div><br><div>${new Date()}</div>`)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
    //response.json(persons.map(person => person.toJSON()))
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(response.status(204).end())  
})

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

app.post('/api/persons', (request, response) => {
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
  
  if(persons.find(p => p.name === body.name)){
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    //id: generateId(),
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
    // response.json(savedPerson.toJSON())
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})