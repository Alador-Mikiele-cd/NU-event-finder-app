const jwt = require('jsonwebtoken')

function valiedUser(req, res, next) {
  console.log(req.headers.authorization) // add this line
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) return res.status(401).json({ message: 'Not authorized' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch(err) {
    return res.status(401).json({ message: 'Not authorized' })
  }
}

module.exports = valiedUser