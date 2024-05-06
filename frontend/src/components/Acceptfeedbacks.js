import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import StarRating from './StarRating'; // Assuming StarRating component is in the same directory

export default function AcceptFeedbacks() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [highlightedRow, setHighlightedRow] = useState(null); // Changed initial state to null

    useEffect(() => {
        function getFeedbacks() {
            axios.get("http://localhost:5000/feedback")
                .then((res) => {
                    setFeedbacks(res.data);
                })
                .catch((err) => {
                    alert(err.message);
                });
        }
        getFeedbacks();
    }, []);

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/feedback/delete/${id}`)
            .then((res) => {
                setFeedbacks(feedbacks.filter(feedback => feedback._id !== id));
                alert("Feedback deleted successfully");
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const handleAccept = async (id) => {
        try {
            await axios.put(`http://localhost:5000/feedback/accept/${id}`);
            alert("Feedback accepted successfully");
        } catch (error) {
            console.error('Error accepting feedback:', error);
            alert("Feedback acception failed");
        }
    };
    

    const handleReject = (id) => {
        axios.delete(`http://localhost:5000/feedback/delete/${id}`)
            .then((res) => {
                setFeedbacks(feedbacks.filter(feedback => feedback._id !== id));
                alert("Feedback rejected successfully");
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase(); // Convert query to lowercase for case-insensitive search
        setSearchQuery(query);
        setHighlightedRow(null); // Reset highlighted row

        const index = feedbacks.findIndex(feedback => feedback.name.toLowerCase().includes(query));
        if (index !== -1) {
            setHighlightedRow(index);
        }
    };

    const MyDocument = () => (
        <Document>
            <Page size="A4">
                <View style={styles.page}>
                    <Text style={styles.title}>Customer Feedbacks</Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.headerCell}>Name</Text>
                            <Text style={styles.headerCell}>Email</Text>
                            <Text style={styles.headerCell}>Message</Text>
                            <Text style={styles.headerCell}>Star Rating</Text>
                            <Text style={styles.headerCell}>Action</Text> {/* New column for Action */}
                        </View>
                        {feedbacks.map((feedback, index) => (
                            <View key={feedback._id} style={[styles.tableRow, highlightedRow === index && styles.highlightedRow]}>
                                <Text style={styles.cell}>{feedback.name}</Text>
                                <Text style={styles.cell}>{feedback.email}</Text>
                                <Text style={styles.cell}>{feedback.message}</Text>
                                <View style={styles.cell}>
                                    <StarRating value={feedback.starRating} readOnly />
                                </View>
                                <View style={styles.cell}>
                                    {feedback.status !== 'Accepted' ? (
                                        <>
                                           <button onClick={() => handleAccept(feedback._id)} style={{ backgroundColor: 'green', color: 'white', marginRight: '5px' }}>Accept</button>
<button onClick={() => handleReject(feedback._id)} style={{ backgroundColor: 'red', color: 'white' }}>Reject</button>

                                           
                                            
                                        </>
                                    ) : (
                                            <span>Accepted</span>
                                        )}
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </Page>
        </Document>
    );

    const styles = StyleSheet.create({
        // Styles for PDF document
    });

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div style={{ width: '80%' }}>
                <h1>Customer pending Feedbacks</h1>
                <PDFDownloadLink document={<MyDocument />} fileName="feedbacks.pdf">
                    {({ blob, url, loading, error }) =>
                        loading ? 'Loading document...' : 'Download PDF'
                    }
                </PDFDownloadLink>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={handleSearch}
                    style={{ marginBottom: '10px', padding: '8px' }}
                />
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #dddddd', padding: '8px', background: '#f2f2f2' }}>Name</th>
                            <th style={{ border: '1px solid #dddddd', padding: '8px', background: '#f2f2f2' }}>Email</th>
                            <th style={{ border: '1px solid #dddddd', padding: '8px', background: '#f2f2f2' }}>Message</th>
                            <th style={{ border: '1px solid #dddddd', padding: '8px', background: '#f2f2f2' }}>Star Rating</th>
                            <th style={{ border: '1px solid #dddddd', padding: '8px', background: '#f2f2f2' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.map((feedback, index) => (
                            <tr key={feedback._id} style={highlightedRow === index ? { backgroundColor: 'yellow' } : null}>
                                <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{feedback.name}</td>
                                <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{feedback.email}</td>
                                <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{feedback.message}</td>
                                <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{feedback.starRating}</td>
                                <td style={{ border: '1px solid #dddddd', padding: '8px' }}>
                                    {feedback.status !== 'Accepted' ? (
                                        <>
                                            <button onClick={() => handleAccept(feedback._id)}>Accept</button>
                                            <button onClick={() => handleReject(feedback._id)}>Reject</button>
                                        </>
                                    ) : (
                                            <span>Accepted</span>
                                        )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
