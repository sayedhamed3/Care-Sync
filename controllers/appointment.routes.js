
const router = require('express').Router()

const Appointment = require('../models/appointment')
const Doctor = require('../models/doctor')
const Patient = require('../models/patient')
const Record = require('../models/record')

// Appointment Index
router.get('/', async (req, res) => {
    try {
        const allAppointments = await Appointment.find().populate('patient')
        

        const myAppointments = allAppointments.filter(appointment => {
            return appointment.doctor.toString() === req.session.user._id.toString()
        })

        console.log(req.session.user.doctor)
        res.render('appointments/index.ejs',{
            doctor: req.session.user.doctor,
            appointments: myAppointments,
        })
    } catch (error) {
        res.redirect('/error')
    }
})

// Create Appointment
router.get('/new', async (req, res) => {
    try {
        const currentDoc = await Doctor.findById(req.session.user._id).populate('patients')

        const patients = currentDoc.patients

        res.render('appointments/new.ejs',{
            patients: patients,
        })
    } catch (error) {
        res.redirect('/error')
    }
})

router.post('/', async (req, res) => {
    try {
        req.body.doctor = req.session.user.doctor._id
        req.body.status = "Scheduled"
        const createAppointment = await Appointment.create(req.body)
        res.redirect('/appointments')
    } catch (error) {
        res.redirect('/error')
    }
})

// Show Appointment
router.get('/:appointmentId', async (req, res) => {
    try {
        const appointmentDetails = await Appointment.findById(req.params.appointmentId)

        console.log(appointmentDetails.patient)

        const patientDetails = await Patient.findById(appointmentDetails.patient)

        const records = await Promise.all(
            patientDetails.records.map( (recordId) => Record.findById(recordId).populate('doctor'))
           );

        res.render('appointments/show.ejs', {
            appointment: appointmentDetails, patient: patientDetails,records: records,
        })
    } catch (error) {
        res.redirect('/error')
    }
})

// Edit Appointment
router.get('/:appointmentId/edit', async (req, res) => {
    try {
        const appointmentDetails = await Appointment.findById(req.params.appointmentId)

        const currentDoc =  await Doctor.findById(req.session.user._id).populate('patients')

        const myPatients = currentDoc.patients

        res.render('appointments/edit.ejs', {
            appointment: appointmentDetails,
            patients: myPatients
        })
    } catch (error) {
        res.redirect('/error')
    }
})

router.put('/:appointmentId', async (req, res) => {
    try {
        await Appointment.findByIdAndUpdate(req.params.appointmentId, req.body, { new: true });
        res.redirect('/appointments')
    } catch (error) {
        res.redirect('/error')
    }
})

// Delete Appointment
router.delete('/:appointmentId', async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.appointmentId)
        res.redirect('/appointments')
    } catch (error) {
        res.redirect('/error')
    }
})

module.exports = router