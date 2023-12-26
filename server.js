const mongoose  = require("mongoose")
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
process.on('uncaughtException',err=>{
  console.log("UNCAUGHT EXCAPTION")
  console.log(err.name, err.message);
  process.exit(1); 

})

try {
  mongoose.set('strictQuery', false)
  mongoose.connect("mongodb+srv://rohitk79739:XHUN7kpxSGJBV8J2@cluster0.hycefun.mongodb.net/?retryWrites=true&w=majority") 
  console.log('Mongo connected')
}
catch(error)  {
  console.log(error)
  process.exit()
}

const app = require('./app');
const port = 3000 || process.env.PORT;
// console.log(process.env)
const server = app.listen(port, () => {
  console.log(`Server is running on ${port}....`);
});
// this how we handled unhandled rejection promises , so basically we  are listening to unhandled rejectio event
//which then allows us to handle all the errors that occur in asynchronous code which are not prevoisly handled
process.on('unhandledRejection', err=>{
  console.log("UnHANDLED REJECTION")
  console.log(err.name, err.message);
  //1 stand for uncaught exception
  //process.exit will just immmediately abort all the request that are currently still running or pending 
  server.close(()=>{
//by doing server.close we give server basically time to finish all the request that are still pendding or being handled at the time
    process.exit(1); 
  })
})
//uncaught exception are thos bug or error that occur in snchronous code but are not handled anywhere are called uncaught exception
