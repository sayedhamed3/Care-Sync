const mongoose = require('mongoose')

const recordSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    diagnosis: {
        type: String,
        required: true,
    },
    prescription: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
    },
})


const Record = mongoose.model('Record',recordSchema)

module.exports = Record