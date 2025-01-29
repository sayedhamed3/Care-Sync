const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const Doctor = require('../models/doctor');

router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs');
});

router.post('/sign-up', async (req, res) => {
    try {
        req.body.email = req.body.email.toLowerCase()

        const doctorIsInDatabase = await Doctor.findOne({ email: req.body.email });
        if (doctorIsInDatabase) {
          return res.render('auth/sign-up.ejs',{error: "Error signing up, try again later"});
        }

        if (req.body.password !== req.body.confirmPassword) {
          return res.render('auth/sign-up.ejs',{error: "Please ensure that both passwords match"});
        }

        const hashedPassword = bcrypt.hashSync(req.body.password, 10);

        
        req.body.password = hashedPassword;

        await Doctor.create(req.body);
        res.redirect('/auth/sign-in');
    } catch (error) {
        res.redirect('/error');
    }
});

router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs');
});

router.post('/sign-in', async (req, res) => {
    try {
      const doctorIsInDatabase = await Doctor.findOne({ email: req.body.email.toLowerCase() });
      if (!doctorIsInDatabase) {
        return res.render('auth/sign-in.ejs',{error: "Login failed please try again"});
      }
    
      const validPassword = bcrypt.compareSync(
        req.body.password,
        doctorIsInDatabase.password
      );
      if (!validPassword) {
        return res.render('auth/sign-in.ejs',{error: "Login failed please try again"});
      }

      if (!doctorIsInDatabase.account_status) {
        return res.render('auth/sign-in.ejs',{error: "Login failed please try again"});
      }
      
      doctorIsInDatabase.password = ""

      req.session.user = {
        doctor: doctorIsInDatabase,
        _id: doctorIsInDatabase._id
      };
    
      res.redirect('/appointments');
    } catch (error) {
      return res.render('auth/sign-in.ejs',{error: "Couldn't log in right now please try again later"});
    }
});

router.get('/sign-out', (req, res) => {
 try {
   req.session.destroy();
   res.render('/');
 } catch (error) {
  console.log(error)
  res.redirect('/')
 }
});

router.get('/profile', async (req, res) => {
  try {
    res.render('doctor/index.ejs', {
      doctor: req.session.user.doctor,
    })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.get('/profile/edit', async (req, res) => {
  try {
    res.render('doctor/edit.ejs', {
      doctor: req.session.user.doctor,
    })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.put('/:doctorId', async (req, res) => {
  try {
      req.body.email = req.body.email.toLowerCase()
      await Doctor.findByIdAndUpdate(req.params.doctorId, req.body, { new: true });
      const doctorIsInDatabase = await Doctor.findOne({ email: req.body.email.toLowerCase() });
      req.session.user = {
        doctor: doctorIsInDatabase,
        _id: doctorIsInDatabase._id
      };
      res.redirect('/appointments')
  } catch (error) {
      console.log(error)
      res.redirect('/')
  }
})

router.put('/:doctorId/delete', async (req, res) => {
  try {
    req.body.account_status = false
    await Doctor.findByIdAndUpdate(req.params.doctorId, req.body, { new: true });
      res.redirect('/')
  } catch (error) {
      console.log(error)
      res.redirect('/')
  }
})

module.exports = router;
