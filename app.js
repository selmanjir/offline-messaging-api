const express = require('express');
const app = express();

const flash = require('connect-flash');

const dotenv = require('dotenv').config();
const path = require('path');

const db_connect = require('./src/config/db');

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('passport');


const myStore = new SequelizeStore({
	db: db_connect,
});

app.use(session( {
	secret : process.env.SESSION_SECRET,
	resave : false,
	saveUninitialized : false,
	store: myStore,
	cookie : {
	checkExpirationInterval: 15 * 60 * 1000, // Milisaniye cinsinden süresi dolmuş oturumları temizleme aralığı.
	expiration :1000*60*60 //  Geçerli bir oturumun maksimum yaşı (milisaniye cinsinden)
	} 	
}));


myStore.sync();

app.use(flash());





app.use(passport.initialize());

app.use(passport.session());

app.use((req, res, next ) => {

	res.locals.error = req.flash('error');
	next();
})

app.use(express.json());

app.use(express.urlencoded({extended : true }));

app.use('/', require('./src/routes/routes'));





app.get('/', (req, res) => {
    res.status(200).json({'mesaj' : 'hoşgeldiniz'});
})




const PORT = process.env.PORT || 4112;
app.listen(PORT, console.log("Server has started at port " + PORT));