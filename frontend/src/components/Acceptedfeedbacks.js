import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faThumbsUp, faThumbsDown, faReply } from '@fortawesome/free-solid-svg-icons';

export default function AcceptedFeedbacks() {
    const [acceptedFeedbacks, setAcceptedFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);

    useEffect(() => {
        fetchAcceptedFeedbacks();
    }, []);

    const fetchAcceptedFeedbacks = async () => {
        try {
            const response = await axios.get("http://localhost:5000/feedback/accepted");
            setAcceptedFeedbacks(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching accepted feedbacks:', error);
            setLoading(false);
        }
    };

    const handleLike = async (id) => {
        try {
            await axios.put(`http://localhost:5000/feedback/like/${id}`);
            fetchAcceptedFeedbacks();
        } catch (error) {
            console.error('Error liking feedback:', error);
        }
    };

    const handleDislike = async (id) => {
        try {
            await axios.put(`http://localhost:5000/feedback/dislike/${id}`);
            fetchAcceptedFeedbacks();
        } catch (error) {
            console.error('Error disliking feedback:', error);
        }
    };

    const handleReply = async (id) => {
        try {
            // Here you would send the reply text to the backend along with the feedback id
            console.log('Replying to feedback with ID:', id, 'Reply text:', replyText);
            // Clear the reply text after replying
            setReplyText('');
            // Optionally, you can also fetch the feedbacks again after replying
            fetchAcceptedFeedbacks();
        } catch (error) {
            console.error('Error replying to feedback:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="accepted-feedbacks-container" style={{ margin: '20px' }}>
            <h1>Service Feedbacks </h1>
            <ul className="feedbacks-list" style={{ listStyle: 'none', padding: 0 }}>
                {acceptedFeedbacks.map(feedback => (
                    <li key={feedback._id} className="feedback-item" style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '10px', marginBottom: '10px', backgroundColor: '#F0FFFF' }}>
                        <div>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ffc107', display: 'flex', justifyContent: 'center', alignItems: 'center', float: 'left', marginRight: '10px' }}>
                                <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>{feedback.name.charAt(0)}</span>
                            </div>
                            <p style={{ margin: '5px 0' }}><strong></strong> {feedback.name}</p>
                            <p style={{ margin: '5px 0' }}><strong></strong> {feedback.email}</p>
                            <p style={{ margin: '5px 0' }}><strong></strong> 
                                <span className="star-rating">
                                    {[...Array(feedback.starRating)].map((star, index) => (
                                        <FontAwesomeIcon key={index} icon={faStar} style={{ color: '#ffc107' }} />
                                    ))}
                                </span>
                            </p>
                            <p style={{ margin: '5px 0' }}><strong></strong> {feedback.message}</p>
                            <div style={{ marginTop: '10px' }}>
                                <button onClick={() => handleLike(feedback._id)} style={{ marginRight: '5px' }}>
                                    <FontAwesomeIcon icon={faThumbsUp} style={{ color: 'green' }} /> Like
                                </button>
                                <button onClick={() => handleDislike(feedback._id)} style={{ marginRight: '5px' }}>
                                    <FontAwesomeIcon icon={faThumbsDown} style={{ color: 'red' }} /> Dislike
                                </button>
                                <button onClick={() => setReplyingTo(feedback._id)}>
                                    <FontAwesomeIcon icon={faReply} /> Reply
                                </button>
                            </div>
                            {replyingTo === feedback._id && (
                                <div style={{ marginTop: '10px' }}>
                                    <input
                                        type="text"
                                        placeholder="Type your reply..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                    />
                                    <button onClick={() => handleReply(feedback._id)}>Send</button>
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
