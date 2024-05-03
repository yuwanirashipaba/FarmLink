import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import productService from '../../redux/features/product/ProductService';
import logo from '../../assets/logo.png';
import { Card } from 'react-bootstrap';
import ProductsTable from './ProductTable';

import PieChart from '../charts/PieChart';

const ProductAdminReport = () => {
  const [loading, setLoading] = useState(true);
  const [outOfStock, setOutOfStock] = useState([]);
  const [inventoryValue, setInventoryValue] = useState(0);
  const [vegiQuantity, setVegiQuantity] = useState(0);
  const [fruitQuantity, setFruitQuantity] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {

        const res = await productService.getAllProducts();
        const parsedProducts = res.map(product => ({
          ...product,
          quantity: parseInt(product.quantity, 10)
        }));
  
      
        const vegiProducts = parsedProducts.filter(product => product.category === "Vegetable");
        const fruitProducts = parsedProducts.filter(product => product.category === "Fruit");
  
        const totalVegiQuantity = vegiProducts.reduce((acc, product) => acc + product.quantity, 0);
        const totalFruitQuantity = fruitProducts.reduce((acc, product) => acc + product.quantity, 0);
  
        setOutOfStock(parsedProducts.filter(product => product.quantity < 1));
        setInventoryValue(parsedProducts.reduce((acc, product) => acc + (product.quantity * product.price), 0));
        setVegiQuantity(totalVegiQuantity);
        setFruitQuantity(totalFruitQuantity);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);
  

  const downloadPdf = () => {
    const doc = new jsPDF();
    // Add the company logo
    doc.addImage(logo, 'JPEG', 160, 10, 30, 30);

    // Header information (Company Contact)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(60, 80, 60); // Dark green color
    doc.text('FarmLink.Org', 10, 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Email: FarmLink.Org@outlook.com', 10, 20);
    doc.text('Phone: 0761827545', 10, 30);

    // Report Title
    doc.setFontSize(14);
    doc.setTextColor(100, 150, 100); // Theme color
    doc.text('Product Admin Report', 10, 45);

    let y = 55; // Start content below the header
    doc.setFontSize(12);
    doc.setTextColor(0);

    // Section for vegetable quantity
    doc.text(`Total Vegetable Quantity: ${vegiQuantity}`, 10, y);
    y += 10;

    // Section for fruit quantity
    doc.text(`Total Fruit Quantity: ${fruitQuantity}`, 10, y);
    y += 10;

    // Section for inventory value
    doc.text(`Inventory Value: $${inventoryValue.toFixed(2)}`, 10, y);
    y += 10;

    // Adding a section header for out of stock products
    doc.setFillColor(232, 232, 232); // Grey background for section header
    doc.setTextColor(200, 0, 0); // Red color for text
    doc.rect(10, y, 190, 8, 'F'); // Draw rectangle with fill
    y += 6;
    doc.text('Out of Stock Products:', 12, y);

    // List out of stock products
    outOfStock.forEach(product => {
        y += 10;
        doc.setTextColor(0);
        doc.text(`- ${product.name}`, 15, y);
    });

    // Final call to download the PDF
    doc.save('ProductAdminReport.pdf');
};



return (
  <div>
    
    {loading ? (
      <p>Loading...</p>
    ) : (
      <>
        <Card>
          <h2>Product Admin Report</h2>
          <p>Total Vegetable Quantity : {vegiQuantity}</p>
          <p>Total Fruit Quantity : {fruitQuantity}</p>
          <p>Inventory Value : ${inventoryValue.toFixed(2)}</p>
          {outOfStock.length > 0 && (
            <div>
              <label htmlFor="outOfStock" style={{fontSize:'1.4rem', color:'#333', marginRight:'2rem'}}>Out of Stock Products :</label>
              <select id="outOfStock" style={{ width: '300px', height: '35px', fontSize: '16px' }}>
                {outOfStock.map((product, index) => (
                  <option key={index} value={product.name}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button onClick={downloadPdf} style={{ background:'green', marginTop:'3rem', padding: '.5rem', marginLeft:'50rem', marginRight:'50rem' }}>Download PDF</button>
        </Card>

        <PieChart vegiQuantity={vegiQuantity} fruitQuantity={fruitQuantity} /> {/* Add the PieChart component */}
        
        <ProductsTable/>
      </>
    )}
  </div>
);
};

export default ProductAdminReport;