const mongoose=require('mongoose');

mongoose.connect('mongodb://prat123:prat123@ds345597.mlab.com:45597/carter',{useNewUrlParser:true});
const Schema=mongoose.Schema;

var CommentSchema=new Schema({
    from_user:String,
    comment:String,
    time:{type:Date,default:Date.now()}
});
var schema =new Schema({
    imagePath:{type:String,required:true},
    title:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    categories:[],
    rating:{type:Number},
    comments:[CommentSchema]
});
schema.index({title:"text",description:"text"});

var Products=mongoose.model('Products',schema);
module.exports=Products;