const mongoose = require("mongoose")

const tourSchema = new mongoose.Schema({
    name:{
        //schema options
        type:String,
        required:[true,'a tour must have a price'],
        unique:true,
        trim:true

    },

    duration:{

    type:Number,
    required:[,'A tour must have a duration']
    },

    maxGroupSize:{
        type:Number,
        required:[true,'a Tour must have a group size']
    },

    difficulty:{
        type:String,
        required:[true, 'A tour must have a difficulty']
    },
    ratingAverage:{
        type:Number,
        default:4.5
    },
    
    ratingQuantity:{
        type:Number,
        default:0
    },

    price:{
        type:Number,
        require:true
    },

    priceDiscount:Number,
    summary:{
        type:String,
        required:[true, "A tour must have a description"],
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    imageCover:{
        type:String,
        // required:[true,"A tour must have a cover image"]
    },

    images:[String],
    createdAt:{
        type:Date,
        default:Date.now(),
        select:false
    },
    startDates:[Date]


})

 const Tour = mongoose.model('Tour',tourSchema)
 module.exports =Tour;