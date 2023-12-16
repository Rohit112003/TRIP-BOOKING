const mongoose  = require("mongoose")
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

try {
  mongoose.set('strictQuery', false)
  mongoose.connect("mongodb+srv://rohitk79739:XHUN7kpxSGJBV8J2@cluster0.hycefun.mongodb.net/?retryWrites=true&w=majority") 
  console.log('Mongo connected')
}
catch(error) {
  console.log(error)
  process.exit()
}

const app = require('./app');
const port = 3000 || process.env.PORT;
// console.log(process.env)
app.listen(port, () => {
  console.log(`Server is running on ${port}....`);
});