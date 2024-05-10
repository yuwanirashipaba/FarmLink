import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';
import { useCategory } from '../../customHook/CategoryProvider';
import axios from 'axios'; 

function MarketplaceNavbar({ children, showCategories = true }) {
    const { setCategory } = useCategory();
    const [totalCost, setTotalCost] = useState(0); 

    useEffect(() => {
        const fetchTotalCost = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/cart/total/${localStorage.getItem('userId')}`);
                setTotalCost(response.data.totalCost);
            } catch (error) {
                console.error('Error fetching total cost:', error);
            }
        };

        // Fetch total cost initially
        fetchTotalCost();

        // Refresh total cost every 5 seconds
        const intervalId = setInterval(fetchTotalCost, 5000);

        // Cleanup function to clear interval
        return () => clearInterval(intervalId);
    }, []); 

    const handleCategorySelect = (category) => {
        setCategory(category);
    };

    const handleLogout = () => {
        if (localStorage.getItem("token")) {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location = "/login";
        } else {
            console.warn("Token not found in localStorage");
        }
    };

    return (
        <>
            <Navbar bg="light" expand="lg" className="shadow-sm">
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/*" style={{ marginLeft: "2rem" }} >Home</Nav.Link>
                            <Nav.Link href="/market" style={{ marginLeft: "2rem" }} >Shop</Nav.Link>
                            
                            {showCategories && (
                                <NavDropdown title="Categories" id="basic-nav-dropdown" style={{ marginLeft: "2rem" }} >
                                    <NavDropdown.Item onClick={() => handleCategorySelect('Vegetable')}>Vegetables</NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => handleCategorySelect('Fruit')}>Fruits</NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => handleCategorySelect('all')}>All Categories</NavDropdown.Item>
                                </NavDropdown>
                            )}
                            <Nav.Link href="/bidding" style={{ marginLeft: "2rem" }} >Biddings</Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav.Link href="/updateBuyer" style={{ marginLeft: "52rem" }}>
                                <FaUserCircle /> Account
                            </Nav.Link>
                                <Nav.Link href="/cart" style={{ marginLeft: "2rem" }} >
                                Cart (${totalCost}) 
                            </Nav.Link>
                            <button className='pl-5 pr-5 ml-5 border rounded-lg' onClick={handleLogout}>
                                Logout
                            </button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {children}
        </>
    );
}
export default MarketplaceNavbar;
