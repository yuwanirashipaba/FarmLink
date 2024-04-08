import { Route, Routes, Navigate } from "react-router-dom";
import AdminMain from "./components/Admin/AdminMain"
import Signup from "./components/Singup";
import Login from "./components/Login";
import BuyerMain from "./components/Buyer/BuyerMain"
import DeliveryMain from "./components/Delivery/DeliveryMain";
import ExpertMain from "./components/Expert/ExpertMain";
import FarmerMain from "./components/Farmer/FarmerMain";

function App() {
    let user;
    try {
        user = JSON.parse(localStorage.getItem("role"));
    } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        
        return <Navigate to="/login" />;
    }

    return (
        <Routes>
            {user && user.role === "admin" && <Route path="/*" element={<AdminMain />} />}
            {user && user.role === "buyer" && <Route path="/*" element={<BuyerMain />} />}
            {user && user.role === "farmer" && <Route path="/*" element={<FarmerMain />} />}
            {user && user.role === "delivery" && <Route path="/*" element={<DeliveryMain />} />}
            {user && user.role === "expert" && <Route path="/*" element={<ExpertMain />} />}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>
    );
}

export default App;
