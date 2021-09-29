const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const authMiddleware = async (req, res, next) => {

    try {
        const token = req.headers.authorization?.split(' ')?.[1]
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
            decodedData = jwt.decode(token)
            req.userId = decodedData?.sub;
        }
        next();
    } catch (err) {
        // res.status(401)
        res.status(401).send(err);
        throw new Error(err)
    }
}
module.exports = authMiddleware