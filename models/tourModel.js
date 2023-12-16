const mongoose = require("mongoose")

const tourSchema = new mongoose.Schema({
    name:{
        //schema options
        type:String,
        require:[true,'a tour must have a price'],
        unique:true

    },
    rating:{
        type:Number,
        default:4.5
    },
    price:{
        type:Number,
        require:true
    }

})

 const Tour = mongoose.model('Tour',tourSchema)
 module.exports =Tour;