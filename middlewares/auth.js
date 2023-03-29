const jwt = require('jsonwebtoken')


const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('No token provided')
  }

  const token = authHeader.split(' ')[1]
  console.log(token);

  try {
    const decoded =  jwt.verify(token, process.env.jwtSecurityKey)
    const { id, userName } = decoded
    req.user = { id, userName }
    console.log(decoded);
    next()
  } catch (error) {
    throw new UnauthenticatedError('Not authorized to access this route')
  }
}

module.exports = authenticationMiddleware