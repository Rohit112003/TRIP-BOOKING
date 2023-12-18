const fs = require('fs');
const Tour = require('../models/tourModel');
const { stringify } = require('querystring');

exports.aliasTopTours = (req,res,next)=>{
  req.query.limit ='5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields='name,price,ratingsAverage,summary,difficulty';
  next();
}


exports.getAllTours = async (req, res) => {

//ther are two ways of writing database queries first one is to use filter object
    //the second waiy is to use special mongoose method
    // const tours = await Tour.find()
    // .where('ratingAverage').equals(4.5)
    // .where('difficulty').equals('easy');

  try{
    // console.log(req.query);



    //build the query
    //1a) Filtering

    const queryObj = {...req.query};
    const excludedFields = ['page', 'sort','limit','fields'];
    excludedFields.forEach(el=> delete queryObj[el]);
    // console.log(queryObj)
    
    //1b)Advance filterin


    console.log(queryObj)
    let querystr = JSON.stringify(queryObj);
    querystr = querystr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    // Log the modified query string
    console.log('Modified Query String:', querystr);

    let query = Tour.find(JSON.parse(querystr));

    // 2) Sorting 
    if(req.query.sort){
      console.log(req.query)
      const sortBy = req.query.sort.split(',').join(' ');
      //for multiple data in query
      // we are gettiing this 
      // { sort: 'price,ratingAverage' }
      // and we want this 
      //sort('price ratingAverage ....)
      console.log(sortBy)
      query = query.sort(sortBy);

    }else{
      query=query.sort('-createdAt');
    }

    // 3) Fields Limiting 

      if(req.query.fields){
        const fields =req.query.fields.split(',').join(' ');
        query = query.select(fields)


      }else{
        // if we write - in forward then it will exclude the data we mentioned
        query = query.select('-__v')
      }

      //4 ) pagination
      //page=2&limit=10 1-10 page 1, 11-20 page2, 21-30 page3
       const page = req.query.page*1 || 1;
       const limit = req.query.limit*1||100;
       const skip = (page-1)* limit;

       query = query.skip(skip).limit(limit);

       if(req.query.page){
        const numTours = await Tour.countDocuments();
        if(skip>=numTours) throw new Error("THis page doesnot exist")

       }



    //excuute the query
    const tours = await query;

    //send response
    res.status(200).json({
      status: 'success',
      results:tours.length,
      data:{
        tours
      }
      
    });
  }catch(err){
    res.status(404).json({
      status:'fail',
      message:err
    })
  }
};




exports.getTour = async (req, res) => {
  //params = all the parameters of the variables that we define here are stored for example :id
  // console.log(req.params);
  // const id = req.params.id * 1;
  try{
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data:{
        tour
      }
      
    });
  }catch(err){
    res.status(404).json({
      status:'fail',
      message:err
    })
  }

  
};




exports.createTour = async  (req, res) => {
  // const newTour = new Tour({});
  // newTour.save()
  try{
    const newTour = await Tour.create(req.body);
  res.status(201).json({
    status:'success',
    data:{
      tour:newTour
    }
  })
  }catch(err){
    res.status(400).json({
      statuss:'fail',
      message:err
    })
  }
  
};




exports.updateTour = async (req, res) => {


  try{

    const tour = await Tour.findByIdAndUpdate(req.params.id,req.body, 
    {new : true,
      runValidators:true
    })
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
    
  }catch(err){
    res.status(400).json({
      statuss:'fail',
      message:err
    })
  }
  
};
exports.deleteTour = async (req, res) => {
  try{
    await Tour.findByIdAndDelete(req.params.id)

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }catch(err){
    res.status(400).json({
      statuss:'fail',
      message:err
    })
  }
};
