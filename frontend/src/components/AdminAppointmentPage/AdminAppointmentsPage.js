import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './AdminAppointmentsPage.scss';

const AdminAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [monthlyAppointmentsData, setMonthlyAppointmentsData] = useState([]);
  const chartRef = useRef(null); // Reference to the Chart instance

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    generateMonthlyAppointmentsData();
  }, [appointments]); // Update monthly appointments data whenever appointments change

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/appointments');
      if (response.status === 200) {
        const acceptedAppointments = response.data.filter(appointment => appointment.status === 'Accepted');
        setAppointments(acceptedAppointments);
      } else {
        console.error('Failed to fetch appointments:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const generateMonthlyAppointmentsData = () => {
    const monthlyAppointments = new Array(12).fill(0); // Initialize array to hold monthly appointments count

    // Count appointments for each month
    appointments.forEach(appointment => {
      const month = new Date(appointment.date).getMonth();
      monthlyAppointments[month]++;
    });

    setMonthlyAppointmentsData(monthlyAppointments);
  };

  // Chart.js code to create the line chart
  useEffect(() => {
    const ctx = document.getElementById('monthlyAppointmentsChart');

    if (ctx) {
      if (chartRef.current) {
        chartRef.current.destroy(); // Destroy previous chart if it exists
      }

      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Monthly Appointments',
            data: monthlyAppointmentsData,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }, [monthlyAppointmentsData]);

  
  const generatePDF = () => {
    // Get the HTML element containing the chart and table
    const chartTableContainer = document.querySelector('.admin-appointments-page');
  
    // Use html2canvas to capture the chart container as an image
    html2canvas(chartTableContainer).then(canvas => {
      // Convert the canvas image to a data URL
      const imgData = canvas.toDataURL('image/png');
  
      // Initialize jsPDF document
      const pdf = new jsPDF();
  
      // Add title to the PDF
      pdf.text('Monthly Appointments', 10, 10);
  
      // Add the chart image to the PDF
      pdf.addImage(imgData, 'PNG', 10, 20, 180, 100); // Adjust the position and dimensions as needed
  
      // Save the PDF
      pdf.save('monthly-appointments.pdf');
    });
  };
  
  
  return (
    <div className="admin-appointments-page">
      <h2>All Appointments</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment, index) => (
            <tr key={index}>
              <td>{appointment.firstName} {appointment.lastName}</td>
              <td>{appointment.email}</td>
              <td>{appointment.message}</td>
              <td>{new Date(appointment.date).toLocaleDateString()}</td>
              <td>{appointment.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
  
      <h2>Monthly Accepted Appointments</h2>

      <div className="line-chart-container">
        <canvas id="monthlyAppointmentsChart"></canvas>
      </div>
  
      <div className="download-pdf-container">
        <button onClick={generatePDF}>Download PDF</button>
      </div>
    </div>
  );
};

export default AdminAppointmentsPage;