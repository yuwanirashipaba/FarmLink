import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { useParams } from 'react-router-dom';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import biddingService from '../../../services/biddingService';
import authService from '../../../services/authService';
import './BiddingDetails.css';
import BiddingCard from '../../../components/bidding/BiddingCard/BiddingCard';
import Footer from '../../../components/footer/Footer';
import GlobalStyles from '../../../GlobalStyles';





function BiddingDetails() {
    const { biddingId } = useParams();
    const [otherBiddings, setOtherBiddings] = useState([]);
    const [bidding, setBidding] = useState(null);
    const [biddingOwner, setBiddingOwner] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [count, setCount] = useState();
  

  
    useEffect(() => {
        const fetchBiddingDetails = async () => {
            setIsLoading(true);
            try {
                const fetchedBidding = await biddingService.getBidding(biddingId);
                setBidding(fetchedBidding);
                setCount(fetchedBidding.bidding.startingPrice)
                
                if (fetchedBidding.bidding.user) {
                    const owner = await authService.getUserById(fetchedBidding.bidding.user);
                    setBiddingOwner(owner);
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch product');
            } finally {
                setIsLoading(false);
            }
        };

        if (biddingId) {
            fetchBiddingDetails();
        }
    }, [biddingId]);
 

    useEffect(() => {
        const getBiddingDataByUser = async () => {
            
        if (biddingOwner) {
            const UserBiddings =  await biddingService.getBiddingsByUser(biddingOwner._id)
            console.log(UserBiddings)
            setOtherBiddings(UserBiddings);        
        }
    }
        getBiddingDataByUser();
    }, [biddingOwner]);
    
   
    const incrementCount = () => {
            setCount(count + 5);
    };

    const decrementCount = () => {
        setCount(count - 5);
    };


    if (isLoading) {
        return <div>Loading bidding details...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!bidding) {
        return <div>Bidding not found.</div>;
    }

    
     


    return (
        <> 
        <Container>
            <GlobalStyles/>
            <Row className="justify-content-center my-3">
                <Col xs={12} md={5}>
                    {/* Display a single static image */}
                    <Card>
                        <Card.Img
                            src={bidding.bidding.image.filePath}
                            alt={bidding.bidding.title}
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} md={7}>
                    <Card className="p-3">
                        <Card.Body>
                            <Card.Title as="h3">{bidding.bidding.title}</Card.Title>
                            <Card.Text as="p" className="text-left">{bidding.bidding.location}</Card.Text>
                            <div className="counter">
                                <input type="number" style={{ marginLeft: '10px 50px' }} value={count} readOnly className="counter-input" onChange={(e) =>  setCount(e.target.value)}/>
                                <button onClick={incrementCount} style={{ marginLeft: '10px' }} className="count-button">+ $5</button>
                                <button onClick={decrementCount} style={{ marginLeft: '10px' }} className="count-button2">- $5</button>

                                <Button type='submit'style={{ marginLeft: '10px' }}>Place bid</Button>
                                
                                

                            </div>
                            {/* Seller contact information */}
                            {biddingOwner && (
                                <>
                                    <div className="my-3">
                                        <strong>Sold by:</strong> <span style={{ fontSize: '13px' }}>{biddingOwner.firstName} {biddingOwner.lastName}</span>
                                    </div>
                                    <div className="my-3">
                                        <strong>Contact:</strong><span style={{ fontSize: '13px' }}> {biddingOwner.email}</span>
                                    </div>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* Product description */}
            <h3>Description</h3>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(bidding.bidding.description) }}></div>

               {/* Additional section for other products by the same owner */}
               <Row className="justify-content-center my-3" >
               <h2 style={{marginTop:'10rem'}}>Other Products by {biddingOwner?.firstName}</h2>
                  <div className="overflow-scroll">
                
                <Row className="justify-content-start my-4 flex-nowrap">
                    {otherBiddings.map((otherBidding) => (
                        <Col xs={12} md={6} lg={4} key={otherBidding._id.toString()}>
                            <BiddingCard key={otherBidding._id} bidding={otherBidding} />
                        </Col>
                    ))}
                </Row>
            </div>
            </Row>
           
        </Container>
        <div className='Footer'>  <Footer/></div>
       
         </>

    );
    
    };


export default BiddingDetails;

