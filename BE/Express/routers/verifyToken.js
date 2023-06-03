const jwt = require('jsonwebtoken')
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) res.status(403).json({message:"Token is not valid!"});
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({message:"You are not authenticated!"});
    }
};
const verifyTokenAndAuthorization = async (req, res, next)=>{
    await verifyToken(req, res, () =>{
        if(req.user.id === parseInt( req.params.id)|| req.user.isAdmin){
            next()
        }
        else{
            return res.status(403).json('You are not allowed!')
        }
    }) 
}
module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
};