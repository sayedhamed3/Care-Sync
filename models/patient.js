const mongoose = require('mongoose')

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
        min:0,
        max:99,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        length: 8,
    },
    records: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Record',
    }],

})


const Patient = mongoose.model('Patient',patientSchema)

module.exports = Patient