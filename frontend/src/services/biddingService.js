import axios from "axios";

const BACKEND_URL = 'http://localhost:5000';


/// Get All Products in the Database

const getAllBiddings = async () => {
  const response = await axios.get(`${BACKEND_URL}/api/buyer/getAllPosts`);
  return response.data;
  
};

// Get biddibgs by Category

const getBiddingsByCategory = async (category) => {
  const response = await axios.get(`${BACKEND_URL}/api/buyer/category/${category}`);
  return response.data;
  
};


// Get a biddibgs
const getBidding = async (id) => {
  const response = await axios.get(`${BACKEND_URL}/api/buyer/getPost/${id}`);
  return response.data;
};


// get biddibgs by User
const getBiddingsByUser = async (userId) => {
  const response = await axios.get(`${BACKEND_URL}/api/buyer/user-biddings/${userId}`);
  
  return response.data;
};


 const biddingService = {
    getAllBiddings,
    getBidding,
    getBiddingsByCategory,
    getBiddingsByUser
 }

 export default biddingService;