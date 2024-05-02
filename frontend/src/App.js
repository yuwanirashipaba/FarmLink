import axios from 'axios';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import AddProduct from './pages/addProduct/AddProduct';
import { useDispatch } from "react-redux";
import { useEffect } from 'react';
import { getLoginStatus } from './services/authService';
import { SET_LOGIN } from './redux/features/auth/authSlice';
import { ToastContainer } from 'react-toastify';
import Dashboard from './pages/dashboard/Dashboard';
import Layout from './components/layout/Layout';
import Sidebar from './components/sidebar/Sidebar';
import 'react-toastify/dist/ReactToastify.css';
import EditProduct from './pages/editProduct/EditProduct';
import Categories from './pages/marketplace/categories/Categories';
import MarketplaceNavbar from './components/marketplaceNav/MarketplaceNavbar';
import { CategoryProvider } from './customHook/CategoryProvider';
import ProductDetailsfarmer from '../src/components/product/productDetails/ProductDetails';
import ProductDetails from './pages/marketplace//details/ProductDetails';
import MarketHome from './pages/marketplace/home/marketHomePage';
import ProductAdminReport from './components/productAdminReport/productAdminReport';
import AssignDelivery from "./components/AssignDelivery"; 
import AllDeliveries from "./components/AllDeliveries";
import AllBuddies from "./components/AllBuddies";
import ListBuddy from "./components/ListBuddy";
import AppointmentListPage from './components/appointmentList/AppointmentListPage';
import AppointmentFormPage from './components/appointmentForm/AppointmentFormPage';
import ExpertForm from './components/expertListingForm/expertListingForm';
import ExpertDetails from './components/expertList/expertList';
import ExpertAppointmentsPage from './components/expertAppointment/expertAppointmentPage';
import AdminMain from "./components/Admin/AdminMain"
import Signup from "./components/Singup";
import Login from "./components/Login";
import BuyerMain from "./components/Buyer/BuyerMain"
import DeliveryMain from "./components/Delivery/DeliveryMain";
import ExpertMain from "./components/Expert/ExpertMain";
import FarmerMain from "./components/Farmer/FarmerMain";



axios.defaults.withCredentials = true
let user;

function App() {

  try {
      user = JSON.parse(localStorage.getItem("role"));

  } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return <Navigate to="/login" />;
  }



  return (
    <div className="App">
      
      <CategoryProvider>
        <BrowserRouter>
          <ToastContainer />
          <Routes>
          {user && user.role === "admin" && <Route path="/*" element={<AdminMain />} />}
            {user && user.role === "buyer" && <Route path="/*" element={<BuyerMain />} />}
            {user && user.role === "farmer" && <Route path="/*" element={<FarmerMain />} />}
            {user && user.role === "delivery" && <Route path="/*" element={<DeliveryMain />} />}
            {user && user.role === "expert" && <Route path="/*" element={<ExpertMain />} />}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate replace to="/login" />} />


            <Route path="/market" element={
              <MarketplaceNavbar showCategories={true}>
                <Categories />
              </MarketplaceNavbar>
            } />

            <Route path="/product/:productId" element={
              <MarketplaceNavbar showCategories={false}>
                <ProductDetails />
              </MarketplaceNavbar>
            } />

            <Route path="/home" element={
              <MarketplaceNavbar showCategories={false}>
                <MarketHome/>
              </MarketplaceNavbar>
            } />


            <Route path="/dashboard" element={


              <Sidebar>
                <Layout>
                  <Dashboard />

                </Layout>
              </Sidebar>


            } />

            <Route path="/add-product" element={
              <Sidebar>
                <Layout>
                  <AddProduct />
                </Layout>
              </Sidebar>
            } />


            <Route path="/product-detail/:id" element={
              <Sidebar>
                <Layout>
                  <ProductDetailsfarmer />

                </Layout>
              </Sidebar>


            } />

            <Route path="/edit-product/:id" element={
              <Sidebar>
                <Layout>
                  <EditProduct />
                </Layout>
              </Sidebar>
            } />

            <Route path="/product-admin" element={
              <Sidebar>
                <Layout>
                  <ProductAdminReport />
                </Layout>
              </Sidebar>
            } />

            <Route path="/assign" element={
              <Sidebar>
                <Layout>
                  <AssignDelivery />
                </Layout>
              </Sidebar>
            } />

            <Route path="/view" element={
              <Sidebar>
                <Layout>
                <AllDeliveries />
                </Layout>
              </Sidebar>
            } />

            <Route path="/list-buddy" element={
              <Sidebar>
                <Layout>
                <ListBuddy />
                </Layout>
              </Sidebar>
            } />

            <Route path="/all-buddies" element={
              <Sidebar>
                <Layout>
                <AllBuddies />
                </Layout>
              </Sidebar>
            } />
            
            <Route path="/appointment-list" element={
              <Sidebar>
                <Layout>
                  <AppointmentListPage />
                </Layout>
              </Sidebar>
            } />
            <Route path="/appointment-form" element={
              <Sidebar>
                <Layout>
                  <AppointmentFormPage />
                </Layout>
              </Sidebar>
            } />
            <Route path="/expertForm" element={
              <Sidebar>
                <Layout>
                  <ExpertForm/>
                </Layout>
              </Sidebar>
            } />
            <Route path="/expertlist" element={
              <Sidebar>
                <Layout>
                  <ExpertDetails  />
                </Layout>
              </Sidebar>
            } />
            <Route path="/expertAppointment" element={
              <Sidebar>
                <Layout>
                  <ExpertAppointmentsPage />
                </Layout>
              </Sidebar>
            } />

            

          </Routes>
        </BrowserRouter>
      </CategoryProvider>
    </div>
  );
}

export default App;
