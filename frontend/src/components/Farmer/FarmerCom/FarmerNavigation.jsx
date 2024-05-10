import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sample from "../FarmerNavCom/Sample";
import UpdateFarmer from "../FarmerNavCom/UpdateFarmer";
import AddProduct from "../../../pages/addProduct/AddProduct";
import EditProduct from "../../../pages/editProduct/EditProduct";
import AppointmentFormPage from "../../appointmentForm/AppointmentFormPage";
import ExpertDetails from "../../expertList/expertList";

const NavPage = () => {

  
    
    return (
        <React.Fragment>
        <section>
          <Routes>
            <Route path="/updatefarmer" element={<UpdateFarmer />} />
            <Route path="/add_product" element={<AddProduct />} />
            <Route path="/edit_product" element={<EditProduct />} />
            <Route path="/updatefarmer" element={<UpdateFarmer />} />
            <Route path="/addappoi" element={<AppointmentFormPage />} />
            <Route path="/expert_details" element={<ExpertDetails />} />
            <Route path="/sample" element={<Sample />} />
          
          </Routes>
        </section>
      </React.Fragment>
    );
  };
  
  export default NavPage;