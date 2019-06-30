const express=require('express');
const body=require('body-parser');
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser')
const session=require('express-session');
const passport=require('passport');
const flash=require('connect-flash');
const validator=require('express-validator');
const MongoStore=require('connect-mongo')(session);

const stripe=require('stripe')('sk_test_wajSIhyerCtZf0sqbfVHBzW400lVxypPSJ');

require('./config/passport');
mongoose.connect('mongodb://localhost/shopping',{useNewUrlParser:true});

const frontcontroller=require('./controller/frontcontroller');
app=express();
app.use(body.urlencoded({extended:false}));

app.set('view engine','ejs');
app.use('/public',express.static('public'));
app.use(cookieParser());
app.use(session({secret:"my secret alien friend",
resave:false,
saveUnitialized:false,
//this part is for setting up a session store to hold the information of that one session
//the mongostore uses the existing connectoin with the mongodb database
store:new MongoStore({mongooseConnection:mongoose.connection}),
cookie:{maxAge:180*60*1000}
}));
//flash needs teh session to be initialized first exactly like that for csrf protection to be used
app.use(flash());
//flash holds onto the messages of a session if any errors of succes exists
app.use(passport.initialize());
//to store the user in the session after the initialization of the session
//use any strategies to store teh data of the users in tha database
//passport.session() also used afeter session initialization


app.use(passport.session());
app.use(function(req,res,next){
    res.locals.login=req.isAuthenticated();
    res.locals.session=req.session;
    next();
})
app.use(body.json());
app.use(validator());
//setting up a global property which is available in all the views  done by using 
//the locals object of the  res property
app.get('/charge',(req,res)=>{

})
const port=process.env.PORT|| 8000
app.use('/user',require('./controller/user'));
app.use('/',require('./controller/frontcontroller'));
app.use('/product',require('./controller/products'));
app.listen(port,console.log('listening to port 8000'));





