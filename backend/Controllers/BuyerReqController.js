const asyncHandler = require("express-async-handler");
const { fileSizeFormatter } = require("../Utills/fileupload");
const buyerReqService = require("../Services/BuyerReqService");
const cloudinary = require("cloudinary").v2;
const demo = "65f7f55b48d15913a43fedda"

//get All Data

const getAllPosts = asyncHandler(async (req, res) => {
    try {
        const biddings = await buyerReqService.getAllPosts();
        if (!biddings || biddings.length === 0) {
            return res.status(404).json({ message: "Request not found" });
        }

        res.status(200).json({ response: biddings });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});


//create Post

const addPost = asyncHandler(async (req, res) => {
    const { description, location, category,title, startingPrice } = req.body;
    // Validation
    if (!location || !category || !description ||!title ||!startingPrice) {
        res.status(400);
        throw new Error("Please fill in all fields");
    }
    // Handle Image upload
    let fileData = {};
    if (req.file) {
        // Save Image to cloudinary
        let uploadedFile;
        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path, {
                folder: "FarmLink",
                resource_type: "image",
            });
        } catch (error) {
            res.status(500);
            throw new Error("Image could not be uploaded");
        }

        fileData = {
            fileName: req.file.originalname,
            filePath: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2),
        };
    }

    // Create post
    const post = await buyerReqService.addPost(description, location, category,fileData, demo,title, startingPrice);
    res.status(201).json(post);
});


//get Data by Id

const getPostDetails = asyncHandler(async (req, res) => {
    const bidding = await buyerReqService.getPostDetailsById(req.params.id);
    if (!bidding) {
        return res.status(404).json({ message: "Bidding not found" });
    }
    res.status(200).json({ bidding });
});


//get biddings by category
const getBiddingDetailsByCategory = asyncHandler(async (req, res) => {

    try {
        const biddings = await buyerReqService.getBiddingsByCategory(req.params.category);
        if (!biddings || biddings.length === 0) {
            return res.status(200).json({ error: true, message: "No biddings found for the given category", response: [] });
        }

        res.status(200).json({ response: biddings });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }

});


// Get products by user ID
const getBiddingsById = asyncHandler(async (req, res) => {
    const biddings = await buyerReqService.getBiddingsByUser(req.params.id);
    
    if (!biddings) {
        res.status(404);
        throw new Error("Products not found");
    }else{
        res.status(200).json(biddings);
    
    }
    
    
});


module.exports  = {
    getAllPosts,
    addPost,
    getPostDetails,
    getBiddingDetailsByCategory,
    getBiddingsById
};