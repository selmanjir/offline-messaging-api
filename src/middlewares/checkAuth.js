Authenticated = (req, res, next) => {
    if(!req.isAuthenticated()){
        res.status(401).send("Lütfen giriş yapınız.")
    }else{
        next()
    }
}

UnAuthenticated = (req, res, next) => {
    if(!req.isAuthenticated()){
        next()
    }else{
        res.status(403).send("Lütfen çıkış yapınız.")
    }
}
module.exports = {
    Authenticated,
    UnAuthenticated
}