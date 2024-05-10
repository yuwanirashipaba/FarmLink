const BuyerReq = require("../Models/BuyerReqModel");


const getAllPosts = async () => {
    return await BuyerReq.find();
};

const addPost = async (description, location, category, fileData, demo, title, startingPrice) => {
    console.log(demo)
    return await BuyerReq.create({
        title,
        location,
        category,
        description,
        startingPrice,
        image: fileData,
        user: demo
    });
};

const getPostDetailsById = async (id) => {
    return await BuyerReq.findById(id).select('description location category title user image.filePath startingPrice');
};

const getBiddingsByCategory = async (category) => {
    return await BuyerReq.find({ category: category });      
};

const getBiddingsByUser = async (userId) => {
    return await BuyerReq.find({ user: userId });      
};


module.exports = {
    getAllPosts,
    addPost,
    getPostDetailsById,
    getBiddingsByCategory,
    getBiddingsByUser
};