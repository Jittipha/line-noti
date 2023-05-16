const jwt = require('jsonwebtoken');
const auth = require('../Middleware/auth')


exports.verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send("A token is required");
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        req.user = decoded;

    } catch (error) {
        return res.status(401).send('Invalid Token')
    }
    return next();



}

exports.RefreshToken = (req, res) => {
    const refreshtoken = req.body.token;
    console.log('refresh token working')

    if (!refreshtoken) {
        return res.status(403).send("A token is required");
    }
    console.log()
    jwt.verify(refreshtoken, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) return res.status(401).send('Invalid Token');
        const accesstoken = auth.generateAccessToken(user.user_id);
        return res.send({ token: accesstoken });
    })
 



}
let refreshTokens = []


exports.logout = (req,res) =>{
    console.log(refreshTokens)
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.status(204)
}

exports.generateAccessToken = function (user) {
    return jwt.sign({ user_id: user }, process.env.ACCESS_TOKEN, {
        expiresIn: "15d"
    })
}

exports.generateRefreshToken = function (user) {
    return jwt.sign({ user_id: user }, process.env.REFRESH_TOKEN, {
        expiresIn: "30d"
    })
}

