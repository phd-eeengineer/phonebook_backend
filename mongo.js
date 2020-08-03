const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
//console.log(password)

const inputName = process.argv[3]
//console.log("inputName",inputName)

const inputNumber = process.argv[4]
//console.log("inputNumber",inputNumber)


const url =
  `mongodb+srv://fullstack:${password}@cluster0.ov0sg.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', phonebookSchema)

if(inputName !== undefined){
  // veri tabanına yazılacak veri
  const person = new Person({
    name: inputName,
    number: inputNumber,
  })

  // // veri tabanına veri yazma
  person.save().then(result => {
    //console.log('note saved!')
    mongoose.connection.close()
  })
}

// veritabanından veri almak
// Note.find({ important: true }).then(result => { // sadece important olanları olmak
if(process.argv.length <= 3){
  console.log('phonebook:')
  Person
    .find({})
    .then(persons => {
      persons.forEach(note => {
        console.log(note.name, note.number)
      })
      mongoose.connection.close()
    })
}