var jwt = require('jsonwebtoken');
const secret = 'jwt_wind';

module.exports = {

    getToken(value, expires){
        return jwt.sign(value, secret, { expiresIn: expires });
    },
    verifyToken(token){
        try {
            return jwt.verify(token, secret);
        } catch (err) {
            console.log(err)
            return undefined;
        }
    },
}