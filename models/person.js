const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        console.log('connected to MongoDB')
    })  
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const phonebookSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        minlength: 3
    },
    number: {
        type: String,
        required: true,
        validate: {
            validator: (v) => /^\d(\s{0,1}-{0,1}\d{1,2}){6}\d$/.test(v),
            message: props => 'Phone number must have at least 8 digits'
        },
    },
})

phonebookSchema.plugin(uniqueValidator);
phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', phonebookSchema)