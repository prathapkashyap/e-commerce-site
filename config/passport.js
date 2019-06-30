var passport =require('passport')
var User=require('../model/user');
var LocalStrategy=require('passport-local').Strategy;

//tells the passport how to store the user in the session
//serializeUser determines which data of the user object should be stored in the session. 
//The result of the serializeUser method is attached to the session as req.session.passport.user = {}. 
//Here for instance, it would be 
//(as we provide the user id as the key) req.session.passport.user = {id: 'xyz'}
//done is a callback function here which passport will execute once it is done withe the serialization

passport.serializeUser(function(user,done){ 
    done(null,user.id)
    //whenever a user needs to be stored in a session serialze it by id
})
// id is passed here bcause we know that the  user is serialized by using th id property of the user
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        done(err,user);
    });
});
//local.signup used when we want to create a new user
//the local strategy takes two objects the 
//first one is a configuration which is a javascript object and the 
//second one is a callback function

// this part is used for creating new users
passport.use('local.signup',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
    //this means that the next callback function can get the request  that has been passed through here
},function(req,email,password,done){
    req.checkBody('email','not a valid email').notEmpty().isEmail();
    req.checkBody('password',"not an acceptable password").notEmpty().isLength({min:5});
    var errors=req.validationErrors();
    if(errors){
        var messages=[]
        errors.forEach((error)=>{
            messages.push(error.msg)
        });
        return done(null,false,req.flash('error',messages))
    }
    User.findOne({'email':email},function(err,user){
        if(err){
            return done(err);
        }
        if(user){
            return done(null,false,{message:'Email already in use'});
        }
        var newUser= new User();
        newUser.email=email;
        //necwr save the passwprd as it is. we wnat the password to be encrypted to another form so that 
        //it can be hidden even from the database admin. In case of breach of the database, password sshould not be compromised

        newUser.password=newUser.encryptPassword(password);
        newUser.save(function(err,result){
            if(err) {done(err)}
            else{
                done(null,newUser);
            }
        });

    })
}));


// this part is used for creating new users
passport.use('local.signin',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
    //this means that the next callback function can get the request  that has been passed through here
},function(req,email,password,done){
    req.checkBody('email','not a valid email').notEmpty().isEmail();
    req.checkBody('password',"not an acceptable password").notEmpty();
    var errors=req.validationErrors();
    if(errors){
        var messages=[]
        errors.forEach((error)=>{
            messages.push(error.msg)
        });
        return done(null,false,req.flash('error',messages))
    }
    User.findOne({'email':email},function(err,user){
        console.log(user);
        if(err){
            return done(err);
        }
        if(!user){
            console.log('user does not exist');
            return done(null,false,{message:'user does not exist'});
        }
        if(!user.validPassword(password)){
            return done(null,false,{message:'password incorrect'}); 
        }
        return done(null,user);
      

        
    
       });

    }));