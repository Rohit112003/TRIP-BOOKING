const {promisify} = require('util')
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync.js');
const jwt = require('jsonwebtoken')
const AppError = require('./../utils/appError.js')


const signToken = id=>{
   return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
   })
}
exports.signup= catchAsync(async (req,res,next)=>{
    const newuser = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm
    });

    const token = signToken(newuser._id)
    res.status(201).json({
        status:'success',
        token,
        data:{
            user:newuser
        }
    });
});

exports.login = catchAsync(async (req,res,next)=>{
    const {email,password} = req.body
    //check if email and password exist
    if(!email || !password){
        return next(new AppError('please provide email and password',400));
    }

    //check if user exists && password is correct
    const user = await User.findOne({email}).select('+password');
    if(!user || !await user.correctPassword(password,user.password)){
        return next(new AppError('incorrect email or password',401 ))
    }
   
    //if everything ok , send token to client
    const token = signToken(user._id)
    res.status(200).json({
        status:'succes',
        token
    })
})

exports.protect = catchAsync(async(req,res,next)=>{
    let token 
    //1) Getting token and check if its there
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    // console.log(token);

    if(!token){
        return next(new AppError('YOU ARE NOT LOGGED IN! PLEASE LOG IN TO GET ACCESS',401));
    }
    //2 verification token(jwt algorithm verifies if the signature is valide or if its not)
   const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET)
//    console.log(decoded)

    //3)check if user still exists
    const currentUser =  await User.findById(decoded.id);
    if(!currentUser){
        return next(new AppError('the user belonging to this token is no longer exist. ',401))
    }

    //4 check if user changed password after the token was issued
    if (currentUser.changePasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed password! please log in again',401))
    };
    req.user = currentUser;


    next();
})