const  mongoose=require('mongoose');
var passport=require('passport');
const express=require('express');
const router=express.Router();
const Products=require('../model/database');
const stripe=require('stripe')('sk_test_wajSIhyerCtZf0sqbfVHBzW400lVxypPSJ');
const Order=require('../model/order');
var Cart=require('../model/cart');

mongoose.connect('mongodb://prat123:prat123@ds345597.mlab.com:45597/carter',{useNewUrlParser:true});
    Products.find({}).sort({"name":1}).limit(25).then(function(data){
        console.log(data.length)
    })
    
  
   Products.find({}).limit(25).then((data)=>{
       
    router.get('/',(req,res)=>{
        res.render('frontpage',{products:data}); 
        
    })
   })
   router.post('/product/navbar',(req,res)=>{
        console.log(req.body.search);
        var search_value=req.body.search;
        Products.find({$text:{$search:search_value}}).then(result=>{
            if(result.length>0){
               
                res.render('frontpage',{products:result});
            }
            else{
                
                res.render('frontpage',{products:null});
            }
        })
   })
   router.get('/add-to-cart/:id',function(req,res,next){
        var productId=req.params.id;
        //create a new  cart in the sesion. If an old cart exists in the session, pass that one
        //else pass an empty json
        var cart=new Cart(req.session.cart?req.session.cart:{});
        Products.findById(productId,function(err,product){
            if(err){
                return res.redirect('/');
            }
            cart.add(product,product.id);
            //store that cart object in the session, the express session will aotomatically save that thing as soon as the response is sent back

            req.session.cart=cart;
          //  console.log(req.session.cart);
            res.redirect('/');
        })
   });

   router.get('/reduce/:id',(req,res)=>{
    var productId=req.params.id;
    var cart=new Cart(req.session.cart?req.session.cart:{});
    cart.reduceByOne(productId);
    req.session.cart=cart;
    res.redirect('/shoppingcart');

   })

   router.get('/remove/:id',(req,res)=>{
    var productId=req.params.id;
    var cart=new Cart(req.session.cart?req.session.cart:{});
    cart.remove(productId);
    req.session.cart=cart;
    res.redirect('/shoppingcart');

   })

   router.get('/shoppingcart',(req,res)=>{
       if(!req.session.cart){
           res.render('cart',{products:null});
           
       }
       else{
       var cart=new Cart(req.session.cart);
       res.render('cart',{products:cart.generateArray(),totalPrice:cart.totalPrice});
       var genar=cart.generateArray();
     }
   });

   router.get('/checkout',isLoggedIn,(req,res)=>{
       
       if(!req.session.cart){
          return res.redirect('/shoppingcart',{products:null})
       }
       else{
        var cart=req.session.cart;
        res.render('checkout',{totalPrice:cart.totalPrice});
       }
   })

   //making charges from the customer ie taking money 
   router.post('/checkout',isLoggedIn,(req,res)=>{
    if(!req.session.cart){
        return res.redirect('/shoppingcart',{products:null})
     }
       const amount=req.session.cart.totalPrice*100;
       console.log(req.body)
       
    stripe.customers.create({
        email: req.body.stripeEmail,
       source: req.body.stripeToken
     })
     .then(customer =>
       stripe.charges.create({
         amount,
         description: "Sample Charge",
            currency: "usd",
            customer: customer.id
       }))
     .then(charge =>{ 
         var order=new Order({
             user:req.user,
             cart:req.session.cart,
             paymentId:charge.id
         })
         order.save(function(err,data){
            req.session.cart=null; 
            res.render("success")});
         })
        
   });
   
   
module.exports=router;

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
       return next();
    }
    
        req.session.oldurl=req.url;
        res.redirect('/user/signin');
    
}