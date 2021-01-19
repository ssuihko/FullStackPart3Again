// const { allowedNodeEnvironmentFlags } = require('process')
const express = require('express')
const { response } = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan('tiny'))
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [  
    {   id: 1,    
        name: "Arto Hellas",    
        number: "040-123456" 
    }, 
    {    
        id: 2,    
        name: "Ada Lovelace",    
        number: "777777777777777", 
    },  
    {           
        id: 3,    
        name: "Dan Abramov",    
        date: "20233333333333",    
    },
    {    
        id: 4,    
        name: "Mary Poppendick",    
        number: "39-088774444", 
    }, ]

//const app = http.createServer((request, response) => { 
//    response.writeHead(200, { 'Content-Type': 'application/json' })  
//    response.end(JSON.stringify(notes))})

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  app.get('/info', (req, res) => {
    res.send('<p>Phonebook has info for ' + persons.length + ' people ' + '<br>' + new Date() + ' </p>')
 })

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {

    let nameArray = persons.map(({name}) => name)
 
    const body = request.body
 
    if (!body.name || !body.number ) {
        return response.status(400).json({ 
          error: 'content missing' 
        })
      }
 
    const person = {
      id: Math.floor(Math.random() * Math.floor(1000)),
      name: body.name,
      number: body.number,
 
    }
 
    if(nameArray.indexOf(person.name) > -1) {
       return response.status(400).json({ 
          error: 'name must be unique' 
        })
    } 
 
    app.use(morgan(function ( tokens, req, res) {
      return
    }))
 
    persons = persons.concat(person)
    nameArray = nameArray.concat(person.name)
 
    length = persons.length.toString()
 
    response.json(person)
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    person = persons.filter(p => p.id !== id)
  
    response.status(204).end()
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
