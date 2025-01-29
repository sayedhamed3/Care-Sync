const mongoose = require('mongoose')

const appointmentSchema = mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: [
            'Scheduled',
            'Completed',
            'Canceled'
        ], 
    },
    notes: {
        type: String,
    },
})

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
