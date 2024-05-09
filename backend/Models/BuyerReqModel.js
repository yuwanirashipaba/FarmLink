const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BiddingPostSchema = new Schema({
    description:{
        //dataType
        type:String,
        //validation
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    image:{
        type : Object,
        //required : [true,"Please add an image"],
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required : true,
        ref: "profilemanagement",
    },
    title:{
        type:String,
        required:true,
    },
    startingPrice:{
        type:Number,
        required:true,
    },
});

const BiddingData = mongoose.model('Bidding', BiddingPostSchema);

module.exports=BiddingData;