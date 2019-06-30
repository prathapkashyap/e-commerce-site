const express=require('express');
const router=express.Router();
const passport =require('passport')
const Products=require('../model/database')
router.get('/:category',(req,res)=>{
    var category=req.params.category;
    
    
    Products.find({categories:category}).then(function(data){
        console.log(data)
        res.render('category',{products:data})
    })
   
    
});
router.get('/moreinfo/:id',(req,res)=>{
    var item=req.params.id
    Products.findById(item).then(function(data){
        console.log(data);
        res.render('product',{product:data});
    })
});

router.post('/moreinfo/:id',isLoggedIn,(req,res)=>{
    var item=req.params.id;
    var date=new Date();
    var product_comment=req.body.product_comment;
    var comment={
        from_user:req.user.email,
        comment:product_comment,
        time:date.toISOString()
    }

    console.log(req.user.email);
   // console.log(item,comment);
    Products.findByIdAndUpdate({_id:item},{$push:{comments:comment}},{new:true}).then(function(data){
        console.log(data)
    });
    res.redirect(item);

})

module.exports=router;

function isLoggedIn(req,res,next){
if(req.isAuthenticated()){
    next();
}
else{
    res.redirect('/user/signin');
}
}