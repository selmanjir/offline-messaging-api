const bcrypt = require('bcrypt');
const mysql = require("mysql");
const config = require("../config/db");
const user = require("../models/user");


const {validationResult} = require('express-validator');

const passport = require("passport");
require('../config/passport_local')(passport);

const login = async (req, res, next) => {
    
    res.status(200).json({'Login' : 'Login Page'})
    
}
const loginPost = async (req ,res, next) => {
    // const err = res.locals.error;
    // if(err.length > 0) {
    //     res.json("başarısız" + " " + err)
    // }else{
    //     res.json("başarılı")
    // }
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureMessage : true,
        successMessage : true
    })(req, res, next)
};
const register = async (req, res, next) => 	{
    
    res.status(200).json({'Register' : 'Register Page'})
}
const registerPost = async (req, res, next) => 	{
    const errors  = validationResult(req);
    if (!errors.isEmpty()) {
        res.json(errors.array())
    }else {
        try {   
            const newUser = new user({
                email : req.body.email,
                username : req.body.username,
                full_name : req.body.full_name,
                isActive : false,
                isDeleted : false,
                // yeni bir kullanıcı kaydederken şifresini hashliyoruz
                password : await bcrypt.hash(req.body.password, 10),
            });
            //veri tabanına kaydolması için.
            await newUser.save();
            res.status(200).json(newUser)
            console.log("Kullanıcı kaydedildi");
            
             
            
        
    } catch (err) {
        console.log("kayıt hata çalıştı"+ err);
    }

    }
    

}
const logout = (req, res, next) => {
    // sessiondaki id bilgisi siler
    req.logout();
    // drekt session siler
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        console.log(req.session);
        res.json('Çıkış yapıldı');
    })
}
module.exports = {
    login,
    loginPost,
    register,
    registerPost,
    logout
}