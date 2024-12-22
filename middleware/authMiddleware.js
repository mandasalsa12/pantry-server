const jwt = require ('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    const token = req.headers ['authorization']?.split('')[1];

    if(!token) {
        return res.status(401).json({
            error : 'Token tidak ada'
        })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Token verifikasi error', err)
            return res.status(403).json({
                error : 'token invalid'
            })
        }
        req.user = decoded;
        req.userId = decoded.id;
        next();
    })
}

module.exports = authMiddleware