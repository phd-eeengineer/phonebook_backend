const express = require('express')
var morgan = require('morgan')

const app = express()
app.use(express.json())

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
  
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  app.get('/info', (request, response) => {
    const arrLen = persons.length
    const date = new Date()
    response.send("<div>Phonebook has info for " + arrLen + " people</div>"
     +"<br>"+"<div>" + date + "</div>")
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
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
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })


  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })