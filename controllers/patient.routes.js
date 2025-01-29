
const router = require('express').Router()

const Patient = require('../models/patient')
const Record = require('../models/record')
const Doctor = require('../models/doctor')
const Appointment = require('../models/appointment')

// All patients:

router.get('/', async (req, res) => {
    try {
        const search = req.query.search || '';
        const tab = req.query.tab || 'myPatients';
        let allPatients = [];
        let myPatients = [];

        const currentDoc = await Doctor.findById(req.session.user._id).populate('patients');
        if (currentDoc) {
            myPatients = currentDoc.patients;
        }

        if (search !== '') {
            const searchRegex = { $regex: search, $options: 'i' };

            allPatients = await Patient.find({
                $or: [
                    { name: searchRegex },
                    { email: searchRegex },
                ],
            });

            myPatients = myPatients.filter(patient =>
                patient.name.match(new RegExp(search, 'i')) || patient.email.match(new RegExp(search, 'i'))
            );
        } else {
            allPatients = await Patient.find();
        }
       

        res.render('patients/index.ejs',{ allPatients: allPatients,
            myPatients: myPatients, search: search, tab:tab
        })
    } catch (error) {
        res.redirect('/error')
    }
})

// Create Patient

router.get('/new',async (req, res) => {
    try {
        res.render('patients/new.ejs')
    } catch (error) {
        res.redirect('/error')
    }
})

router.post('/',async (req, res) => {
    try {
        req.body.email = req.body.email.toLowerCase()

        const newPatient = await Patient.create(req.body)

        if(req.body.isMyPatient === "on"){
            try {
                const updateDoc = await Doctor.findByIdAndUpdate(req.session.user._id, {$push: {patients: newPatient._id}})

                
            } catch (error) {
                res.redirect('/error')
            }
        }

        res.redirect('/patients')
    } catch (error) {
        res.redirect('/error')
    }
})

// Show one patient:

router.get('/:patientId',async (req, res) => {

    try {
       const onePatient = await Patient.findById(req.params.patientId)

       const records = await Promise.all(
        onePatient.records.map( (recordId) => Record.findById(recordId).populate('doctor'))
       );
       
       const currentDoc =  await Doctor.findById(req.session.user._id)

       const myPatients = currentDoc.patients

        let isMyPatient = false

        if (myPatients.includes(onePatient._id.toString())){
            isMyPatient = true
        }


       res.render('patients/show.ejs',{patient: onePatient,records: records, isMyPatient: isMyPatient})
    } catch (error) {
        res.redirect('/error')
    }
})


// Delete patient

router.delete('/:patientId', async (req, res) => {

    try {
        await Patient.findByIdAndDelete(req.params.patientId)

        res.redirect('/patients')
        
    } catch (error) {
        res.redirect('/error')
    }
})

// Edit patient

router.get('/:patientId/edit', async (req, res) => {

   try {
    const patient = await Patient.findById(req.params.patientId)

    res.render('patients/edit.ejs',{patient:  patient})
   } catch (error) {
    res.redirect('/error')
   }
})

router.put('/:patientId', async (req, res) => {
    try {
        req.body.email = req.body.email.toLowerCase()

        const updatedPatient = await Patient.findByIdAndUpdate(req.params.patientId,req.body)
        
        res.redirect('/patients')
    } catch (error) {
        res.redirect('/error')
    }
})


// Add patient to doctor

router.get('/:patientId/pushToDoctor', async (req, res) => {
    try {
        const updateDoc = await Doctor.findByIdAndUpdate(req.session.user._id, {$push: {patients:req.params.patientId}})

        res.redirect(`/patients/${req.params.patientId}`)
        
    } catch (error) {
        res.redirect('/error')
    }
})

// Remove patient from doctor

router.get('/:patientId/pullFromDoctor', async (req, res) => {
    try {
        await Doctor.findByIdAndUpdate(
            req.session.user._id,
            { $pull: { patients: req.params.patientId } }
        );

        res.redirect(`/patients/${req.params.patientId}`);
    } catch (error) {
        console.log(error)
        res.redirect('/error');
    }
});


// show record

router.get('/:patientId/:recordId', async (req, res) => {
    try {
        const recordDetails = await Record.findById(req.params.recordId).populate('doctor patient')

        res.render('records/show.ejs',{
            record: recordDetails,
            doctor: recordDetails.doctor,
            patient: recordDetails.patient,
        })
    } catch (error) {
        res.redirect('/error')
    }
    
})


// create new record

router.post('/:patientId/newRecord', async (req, res) => {
    try {

        // update appointment status to completed
        const appointmentToUpdate = await Appointment.findByIdAndUpdate(req.body.appointmentId,{status: "Completed"},{new: true})

        // add record data to req.body for ease of creation
        req.body.doctor = appointmentToUpdate.doctor
        req.body.patient = appointmentToUpdate.patient
        req.body.date = appointmentToUpdate.date
        
        // create new record
        const newRecord = await Record.create(req.body)

        // append record to patient 
        const patientToUpdate = await Patient.findByIdAndUpdate(
            appointmentToUpdate.patient,
            { $push: { records: newRecord } }
          );

        res.redirect('/appointments')

    } catch (error) {
        res.redirect('/error')
    }
})

module.exports = router