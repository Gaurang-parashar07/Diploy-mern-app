const jwt = require('jsonwebtoken');
const ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(403).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error('Auth middleware token error:', error.message);
        return res.status(403).json({ message: 'Invalid token or expired' });
    }

}

module.exports = ensureAuthenticated;