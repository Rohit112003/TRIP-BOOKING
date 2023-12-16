const express = require('express');
const app = express();
const mongoose = require('mongoose')
const morgan = require('morgan');

//XHUN7kpxSGJBV8J2
//rohitk79739
//mongodb+srv://rohitk79739:<XHUN7kpxSGJBV8J2@cluster0.hycefun.mongodb.net/?retryWrites=true&w=majority

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
//a middleware is a basically a function that can modify the incoming request data
//it's called middleware because it stands between, so in the middle of the request and the response

//Middlewares
if(process.env.NODE_ENV === 'development'){

  app.use(morgan('dev'));
}





//It parses incoming requests with JSON payloads and is based on body-parser 
app.use(express.json());
app.use(express.static(`${__dirname}/public`))


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
//Start the server
module.exports  = app;
