const mongoose=require('mongoose');
const bcrypt=require('bcrypt-nodejs');
//use this bcrypt to encrypt the password
//create helper methods which helps in easy encryption of hte password
var Schema=mongoose.Schema;
var schema=new Schema({
    email:{type:String,required:true},
    name:{type:String},
    password:{type:String,required:true},
    address:{type:String},
    phone:{type:String}
})
schema.methods.encryptPassword=function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null);
    //synchronous hashing 
}
schema.methods.validPassword=function(password){
    //compareSynchronously
    return bcrypt.compareSync(password,this.password);
    //we cannot send a passwprd and try to comapare the hashes because each time a different hash
    //is generated hence, we use another method where bcrypt can compare the password as they are 
    //even if they have different hashes
    //password =the passwprd that was typed in
    //this.password=this user's original password
}
var User=mongoose.model('User',schema);
module.exports=User;


//CSRF protection tells the server whether the client who sent the request proviosly is the same browser who is still sending hte requests
//it protects the user sessions from being stolen