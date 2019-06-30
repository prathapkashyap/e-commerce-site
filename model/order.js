const mongoose=require('mongoose');

const Schema=mongoose.Schema;
const orderSchema=new Schema({
    user:{type:Schema.Types.ObjectId,ref:'User'},
    cart:{type:Object,required:true},
   
    paymentId:{type:String,require:true}
});


const Order=mongoose.model('Order',orderSchema)
module.exports=Order;