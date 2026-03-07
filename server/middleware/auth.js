const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check for token in headers or cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Add user to request
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
       // Token provided but invalid
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else if (req.cookies && req.cookies.token) {
    try {
      // Decode token from cookie
      token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    // If no token, but endpoint isn't strict (like public uploads), we just don't set req.user
    next();
  }
};

const requireAuth = (req, res, next) => {
    if(!req.user) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
    next();
}

module.exports = { protect, requireAuth };
