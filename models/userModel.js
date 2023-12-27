const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'A tour must have a name']
    },
    email:{
        type:String,
        required:[true,'please provide your email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail, 'please provide a valid email']
    },
    photo:String,
    password:{
        type:String,
        required:[true,'please provide a password'],
        minlength:8,
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,'please confirm your password'],
        validate:{
            //this will only work for CREATE AND SAVE
            validator: function(el){
                return el==this.password
            }
        },
        message:"Passwords are not the same"
    },
    //this property will always be changed, when someone change the password
    passwordChangedAt:Date
});
//middleware function that we're gonna specify here, so the encryption
//is then gonna be happende between the moment that we recieve the data and 
//the moment where it's actually persisted to the database 
//"Between getting the data and saving it to the database"
//And so the higher this cost here,

//bcrypt.hash(this.password,12)
//12 is for cost parameter
// basically the more CPU intensive the process will be
// and the better the password will be encrypted, okay?
// And of course we could go even higher,
// but then it would take way too long
userSchema.pre('save', async function(next){
    //Only run this function if password was actually modified
    if(!this.isModified('password')) return next();
    this.password =  await bcrypt.hash(this.password,12);
    this.passwordConfirm = undefined
    /* 
because we actually set password(passwordConfirm) confirm to a required, right?
But that simply means that it's a required input, not that it's required to actually be persisted
to the database*/
next()
})
// so instance method is basically a method that is gonna be availabe on all documents of a certain collection
userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
    return  await bcrypt.compare(candidatePassword,userPassword);
}
userSchema.methods.changePasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimeStamp =parseInt( this.passwordChangedAt.getTime()/1000,10 );

        console.log(changedTimeStamp,JWTTimestamp)
        return JWTTimestamp<changedTimeStamp;
    }
    return false;
}


const User = mongoose.model('User', userSchema);
module.exports = User