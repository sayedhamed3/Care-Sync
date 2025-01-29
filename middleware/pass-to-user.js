// Used to pass the user session everyware
const passUserToView = (req, res, next) => {
    res.locals.user = req.session.user ? req.session.user : null
    next()
}
  
  module.exports = passUserToView;
  