const  mongoose=require('mongoose');
const csrf=require('csurf');
const passport=require('passport');
const express=require('express');
const router=express.Router();
const Products=require('../model/database');
var User=require('../model/user');
var Cart =require('../model/cart');
var Order=require('../model/order');
mongoose.connect('mongodb://prat123:prat123@ds345597.mlab.com:45597/carter',{useNewUrlParser:true});
var csrfProtection=csrf();
router.use(csrfProtection);

router.get('/logout',isLoggedIn,(req,res,next)=>{
    req.logout();
    req.session.cart=null;
    res.redirect('/');
})
router.get('/profile',isLoggedIn,(req,res)=>{
    var user=req.user;
    
    Order.find({user:req.user},function(err,orders){
        if(err){
            return res.write('some error');
        }
        var cart;
     // console.log('orders',orders[0])
        orders.forEach(order=>{
            cart =new Cart(order.cart);
            //console.log('carter',cart)
            //store the retutned elements in a new field in the items of the order object
            order.items=cart.generateArray();
           console.log(Object.keys(order))
                });
        res.render('profile',{orders:orders})
    });
  
});

router.use('/',notLoggedIn,(req,res,next)=>{
    next();
})

router.get('/signup',(req,res)=>{
    var messages=req.flash('error');
    res.render('signup',{csrfToken:req.csrfToken(),messages:messages, hasMessages:messages.length>0});
})
router.post('/signup',passport.authenticate('local.signup',{
  
   failureRedirect:'/user/signup',
   failureFlash:true
}),function(req,res,next){
    if(req.session.oldurl){
        var oldurl=req.session.oldurl;
        req.session.oldurl=null;
       return res.redirect(oldurl);
    }
    
        res.redirect('/user/profile');
    });



router.get('/signin',(req,res)=>{
    var messages=req.flash('error');

    res.render('signin',{csrfToken:req.csrfToken(),messages:messages, hasMessages:messages.length>0});
})
router.post('/signin',passport.authenticate('local.signin',{
failureRedirect:'/user/signin',
failureFlash:true,
}),function(req,res,next){
    if(req.session.oldurl){
        var oldurl=req.session.oldurl;
        req.session.oldurl=null;
        res.redirect(oldurl);
    }
    else{
        res.redirect('/user/profile');
    }

});


module.exports=router;

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/user/signin');
}

function notLoggedIn(req,res,next){
    if(!req.isAuthenticated()){
        return next()
    }
    res.redirect('/');
}