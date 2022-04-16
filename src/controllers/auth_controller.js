
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const mysql = require("mysql");
const config = require("../config/db");
const user = require("../models/user");


const {validationResult} = require('express-validator');

const passport = require("passport");
require('../config/passport_local')(passport);


const loginPost = async (req ,res, next) => {
    
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureMessage : true,
        successMessage : true
    })(req, res, next)
};

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
                isActive : true,
                isDeleted : false,
                // yeni bir kullanıcı kaydederken şifresini hashliyoruz
                password : await bcrypt.hash(req.body.password, 10),
            });
            await newUser.save();
            res.status(201).json(newUser)
            
        } catch (err) {
            console.log(err);
        }
        
    }
    
    
}

const forget_password = async (req, res, next) => 	{
    
    const _findUser = await user.findOne({
        where: {
            email : req.params.email
        }
    });
    console.log(_findUser);
    
    try {
        if (!_findUser || _findUser.email_active == false) {
            res.json({
                message : 'Mail adresi bulunamadı veya aktif değil' 
            })
        }
        // Kullanıcının düzgün mail girdiği durumda =>
        else {
            
            const jwtInfo = {
                id : _findUser.id,
                email : _findUser.email
            }
            const secret = process.env.RESET_PASSWORD_JWT_SECRET+ '-' + _findUser.password;
            
            // jwt oluşturn
            // expiresIn:'1d'  = bu token 1 gün boyunca geçerli
            const jwtToken = jwt.sign(jwtInfo,secret, {expiresIn:'1d'})
            
            // SEND MAİL
            const url = process.env.WEB_SITE_URL + "new_password/" + _findUser.id + "/" + jwtToken;
            
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth : {
                    user : process.env.GMAIL_USER,
                    pass : process.env.GMAIL_PASS
                }
            });
            
            
            await transporter.sendMail({
                
                from : 'Offline-Message-Project <info@nodejstestmail85.com',
                to : _findUser.email,
                subject : 'Şifre güncelleme ',
                text : 'Şifrenizi güncellemek için lütfen bu linke tıklayınız.' + url,
                
            }, (err, info) => {
                if (err) {
                    console.log('kayıt hata çalıştı ' + err);   
                }
                console.log('Mail gönderildi');
                transporter.close();
            });   
            
            
            
            res.json({msg : 'Lütfen mail kutunuzu kontrol ediniz.'});
        }
        
        
        
    } catch (err) {
        console.log("error " + err);
    }
    
    
}
const new_password = async (req, res, next) => {
    
    const idInUrl = req.params.id;
    const tokenInUrl = req.params.token;
    
    if (idInUrl && tokenInUrl) {
        
        const _findUser= await user.findOne({where : {id : idInUrl}})
        
        const secret = process.env.RESET_PASSWORD_JWT_SECRET + '-' + _findUser.password;
        
        try {
            jwt.verify(tokenInUrl,secret, async (err, decoded) => {
                
                if (err) {
                    res.json({ message : 'Link hatalı yada süresi geçmiş'})
                    
                } else {
                    res.json({
                        message : 'Şifre sıfırlama sayfası'
                    })
                    
                    
                }
                
            } )
        } catch (err) {
            
        }
        
    } else {
        
        res.json({msg : 'Erişim sağlanmadı lütfen maildeki linke tıklayın.'})
        
        
    }
    
}
const new_password_post = async (req, res, next) => {
    const idInUrl = req.params.id;
    const tokenInUrl = req.params.token;
    
    if (idInUrl && tokenInUrl) {
        
        const _findUser= await user.findOne({where : {id : idInUrl}})
        
        const secret = process.env.RESET_PASSWORD_JWT_SECRET + '-' + _findUser.password;
        
        try {
            jwt.verify(tokenInUrl,secret, async (err, decoded) => {
                
                if (err) {
                    res.json({ message : 'Link hatalı yada süresi geçmiş'})
                    
                } else {
                    const errors  = validationResult(req);
                    if (!errors.isEmpty()) {
                        res.json(errors.array())
                    }else {
                        const result = await user.update(
                            { password : await bcrypt.hash(req.body.password, 10)},
                            { where : {id : req.params.id}}
                            
                            )
                            if (result) {
                                res.json({msg :'Şifre başarılı bir şekilde değiştirildi Giriş yapabilirsiniz.'})
                            } else {
                                res.json({msg :'Lütfen şifre sıfırlama işlemlerini tekrarlayınız'})
                            }     
                            
                        }
                        
                        
                    }
                    
                } )
            } catch (err) {
                
            }
            
        } else {
            
            res.json({msg : 'Erişim sağlanmadı lütfen maildeki linke tıklayın.'})
            
            
        }
        
        
        
    }
    
    const logout = (req, res, next) => {
        // sessiondaki id bilgisi siler
        req.logout();
        // drekt session siler
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            console.log(req.session);
            res.status(200).send('Çıkış yapıldı');
        })
    }
    const checkAuth = (req, res, next) => {
        if(req.isAuthenticated()){
            res.json({
                "is_authenticated": true,
                "user": req.user
            });
        }else{
            res.json({
                "is_authenticated": false,
                "user": null
            });
        }
    }
    module.exports = {
        loginPost,
        registerPost,
        forget_password,
        new_password,
        new_password_post,
        logout,
        checkAuth
    }