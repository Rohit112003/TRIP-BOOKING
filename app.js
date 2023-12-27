const express = require('express');
const app = express();

const morgan = require('morgan');
const globalErrorHandler = require('./controllers/errorController.js')
//XHUN7kpxSGJBV8J2
//rohitk79739
//mongodb+srv://rohitk79739:<XHUN7kpxSGJBV8J2@cluster0.hycefun.mongodb.net/?retryWrites=true&w=majority

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
//a middleware is a basically a function that can modify the incoming request data
//it's called middleware because it stands between, so in the middle of the request and the response

//Middlewares
// if(process.env.NODE_ENV === 'development'){

//   app.use(morgan('dev'));
// }





//It parses incoming requests with JSON payloads and is based on body-parser 
app.use(express.json());
app.use(express.static(`${__dirname}/public`))
// app.use((req,res,next)=>{
//   console.log(req.headers)
//   next()
// })


//Route handlers




// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id',getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id',deleteTour)

//here we specify the route that we want

//Routes





app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// app.all('*',(req,res,next)=>{
//   // res.status(404).json({
//   //   status:'fail',
//   //   message:`Can't find ${req.originalUrl}`
//   // })
//   // next()
//   // const err = new Error(`Can't find ${req.originalUrl} on the server `)
//   // err.status = 'fail';
//   // err.statusCode=404
//   //because now we need to actually pass that error into next , so if the
//   //next function recieves an argumnet , no matter waht it is xpress will
//   //automaticalyy know that there was an error , so it will assume that 
//   //whatever we pass into next its gonna be an error
//   //it will skip all the middileware in between and directaly call the error
//   //middleware
//   next(new appError(`Can't find ${req.originalUrl} on the server `));
// });
// //error handling middleware
// //if we have four arguments in the middleware express will automatically know 
// //this is a error handling middleware and this will call when there is an error
// app.use(globalErrorHandler)
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports  = app;
