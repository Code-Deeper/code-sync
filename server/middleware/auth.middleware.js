const jwt = require('jsonwebtoken') 

const authMiddleware = async (req, res, next) => {

    try {
        const token = req?.header?.get('Authorization')?.split(' ')?.[1]
        if (!token) {
            res.status(401)
            throw new Error('Not authorized , Token Miss found')
        }
        const isCustomAuth = token.length < 500;
        let decodedData;

        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY)
            req.userId = decodedData?.id;
        } else {
            decodedData = jwt.verify(token)
            req.userId = decodedData?.sub;
        }
        next();
    } catch (err) {
        res.status(401)
        throw new Error('Not authorized , Token Miss found')
    }
    if (!token) {
        res.status(401)
        throw new Error('Not authorized , Token Miss found')
    }

}
module.exports = authMiddleware