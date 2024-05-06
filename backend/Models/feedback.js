const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const feedbackSchema=new Schema({
     name:{
        type:String,
        required:true
     },
     email:{
        type:String,
        required:true
     },
     message:{
        type:String,
        required:true
     },
     starRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5 // Assuming a 5-star rating system
  },

  status:{
   type:String,
   enum:['Pending', 'Accepted','Rejected'],
   default: 'Pending'
  }


})

const Feedback=mongoose.model("Feedback",feedbackSchema);

module.exports=Feedback;