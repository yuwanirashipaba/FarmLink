import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sample from "../AdminNavCom/Sample";
import UpdateAdmin from "../AdminNavCom/UpdateAdmin"
import SearchUsers from "../AdminNavCom/SearchUser"
import DeleteUser from "../AdminNavCom/DeleteUser"
import ProductAdminReport from "../../productAdminReport/productAdminReport";
import AssignDelivery from '../../AssignDelivery'
import AllBuddies from "../../AllBuddies";
import ViewBiddings from "../AdminNavCom/ViewBiddings";

const NavPage = () => {

    
    return (
        <React.Fragment>
        <section>
          <Routes>
            <Route path="/viewBiddings" element={<ViewBiddings />} />
            <Route path="/updateadmin" element={<UpdateAdmin />} />
            <Route path="/search" element={<SearchUsers />} />
            <Route path="/deleteuser" element={<DeleteUser />} />
            <Route path="/product_report" element={<ProductAdminReport />} />
            <Route path="/delivery_delivery" element={<AssignDelivery />} />
            <Route path="/allbuddies" element={<AllBuddies />} />
            <Route path="/*" element={<Sample />} />
            
          
          </Routes>
        </section>
      </React.Fragment>
    );
  };
  
  export default NavPage;