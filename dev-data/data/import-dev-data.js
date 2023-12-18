const mongoose  = require("mongoose")
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require("../../models/tourModel");
const { dirname } = require("path");
dotenv.config({ path: './config.env' });

try {
  mongoose.set('strictQuery', false)
  mongoose.connect("mongodb+srv://rohitk79739:XHUN7kpxSGJBV8J2@cluster0.hycefun.mongodb.net/?retryWrites=true&w=majority") 
  console.log('Mongo connected')
}
catch(error)  {
  console.log(error)
  process.exit() 
}

//Read jason file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

//Import data into database
const importData = async ()=>{
    try{
        //the create method can also accept array of objects, it simply creat each document for each object in the array
        await Tour.create(tours)
        console.log("Data Succefully Loaded");
        process.exit();
    }catch(err){
        console.log(err)
    }
}

const deleteData = async()=>{
    try{
        //the create method can also accept array of objects, it simply creat each document for each object in the array
        await Tour.deleteMany()
        process.exit()
    }catch(err){
        console.log(err)
    }
}
if(process.argv[2]==='--import'){
    importData()
}else if(process.argv[2]==='--delete'){
    deleteData()
}
// console.log(process.argv);