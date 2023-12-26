class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

// //we will always use this apperror class here that were creating right now,
// //in order to create all the errors in our application
// class AppError extends Error{
//     constructor(message, statusCode){
//          //right here we call parent class is error and whatever we pass into it
//          //is gonna be the meassage property. so by doing the parent call we already
//          //set the message properyy to our incoming message
//         super(message);
//         this.statusCode = statusCode
//         this.status = `${statusCode}`.startsWith('4')?'fail':'error';
// //so all of our errors will get this property set to true,
// //so we are doing these that so that later we can then test for this property
// //only send error messages back to the client for the message for these operational errors
// //that we created using this class
//         this.isOperational = true; 
//         Error.captureStackTrace(this,this.constructor)
//     }
// }
// module.exports = AppError