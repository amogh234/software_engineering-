const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Expect: Bearer <token>

  if (!token) return res.status(401).json("Access denied: No token");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json("Invalid token");
  }
}

module.exports = authenticate;
