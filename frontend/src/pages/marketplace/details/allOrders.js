import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './allOrders.css'; // Import your CSS file

function AllOrders() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/order/');
            setOrders(response.data);
            setFilteredOrders(response.data); // Initially set filtered orders to all orders
        } catch (err) {
            setError(err.message || 'Failed to fetch orders');
        } finally {
            setIsLoading(false);
        }
    };

    const generateCustomOrderId = (order) => {
        // Ensure order._id exists and is a string
        if (order && typeof order._id === 'string' && order._id.length >= 4) {
            return `ORD-${order._id.substr(order._id.length - 4)}`;
        } else {
            return 'Invalid Order ID';
        }
    };
    
    const handleRefresh = () => {
        fetchOrders();
    };

    const handleChangeStatus = async () => {
        try {
            await axios.put(`http://localhost:5000/api/order/updateStatus/${selectedOrderId}`, { status: selectedStatus });
            // If the status update is successful, refresh the orders
            fetchOrders();
            // Reset the selected status and order ID
            setSelectedStatus('');
            setSelectedOrderId('');
            setShowUpdatePopup(false);
        } catch (err) {
            console.error('Failed to update order status:', err);
        }
    };

    const handleStatusChange = (e, orderId) => {
        setSelectedStatus(e.target.value);
        setSelectedOrderId(orderId);
        setShowUpdatePopup(true);
    };

    const handleSearch = () => {
        const filtered = orders.filter(order => generateCustomOrderId(order) === searchQuery);
        setFilteredOrders(filtered);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container-xl">
            <div className="table-responsive">
                <div className="table-wrapper">
                    <div className="table-title">
                        <div className="row">
                            <div className="col-sm-8">						
                                <button className="btn btn-primary" onClick={handleRefresh}><i className="material-icons">&#xE863;</i> <span>Refresh List</span></button>
                                <button className="btn btn-secondary"><i className="material-icons">&#xE24D;</i> <span>Export to Excel</span></button>
                            </div>
                        </div>
                        <div className="search-container">
                            <input type="text" placeholder="Search by Order ID" value={searchQuery} onChange={handleSearchChange} />
                            <button onClick={handleSearch}>Search</button>
                        </div>
                    </div>
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Order Date</th>						
                                <th>Status</th>						
                                <th>Net Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                           
                                {filteredOrders.map((order, index) => (
                                    <tr key={order._id}>
                                        <td>{index + 1}</td>
                                        <td>{generateCustomOrderId(order)}</td> {/* Display custom order ID */}
                                        <td>{order.customer}</td>
                                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                        <td>{order.orderStatus}</td>
                                        <td>${order.totalCost.toFixed(2)}</td>
                                        <td>
                                            <div className="select-wrapper">
                                                <select value={selectedStatus} onChange={(e) => handleStatusChange(e, order._id)}>
                                                    <option value=""></option>
                                                    <option value="Pending">Pending</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Checking">Checking</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                
                        </tbody>
                    </table>
                </div>
            </div>
            {showUpdatePopup && (
                <div className="popup">
                    <div className="popup-content" style={{ width: "400px" }}>
                        <h2>Update Order Status</h2>
                        <div className="button-container">
                            <button onClick={handleChangeStatus}>Update</button>
                            <button onClick={() => setShowUpdatePopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AllOrders;
