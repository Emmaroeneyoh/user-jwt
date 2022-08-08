const jwt = require('jsonwebtoken')

const people  = require('../model/user')


const user_check = (req, res, next) => {
    
    const toke = req.cookies.usercookie;
    

    if(toke) {
        jwt.verify(toke,'userjwt', async (err, decodedToken) => {
            if(err) {
                console.log(err, 'error')
                res.locals.user = null
               next()
            } else {
                console.log(decodedToken)
                const peepo = await people.findById(decodedToken.id)
                res.locals.user = peepo
                req.user = peepo
                
                console.log(req.user)
                next()
            }
        } )
    } else {
        res.locals.user = null
        next()
    }
}

module.exports = {
    user_check
}


