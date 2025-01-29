const mongoose = require('mongoose')

const doctorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        length: 8,
    },
    specialization: {
        type: String,
        require: true,
        enum: [
            'general-practitioner',
            'cardiologist',
            'dermatologist',
            'pediatrician',
            'neurologist',
            'orthopedic-surgeon',
            'psychiatrist',
            'endocrinologist',
            'oncologist',
            'radiologist',
            'ophthalmologist',
            'ent-specialist',
            'gastroenterologist',
            'urologist',
            'nephrologist',
            'pulmonologist',
            'rheumatologist',
        ],
    },
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
    }],
    patients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient"
    }],
    password: {
        type: String,
        require: true,
    },
    account_status: {
        type: Boolean,
        default: true,
    },
})

const Doctor = mongoose.model('Doctor', doctorSchema)

module.exports = Doctor