import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  font-family: 'Garamond, serif';
  color: black;
`;

const Header = styled.h2`
  color: black;
`;

const ReviewContainer = styled.div`
  margin-top: 10px;
`;

const ReviewHeader = styled.h3`
  color: black;
`;

const ReviewItem = styled.div`
  color: black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ReviewOptions = styled.div`
  display: flex;
  gap: 8px;
`;

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Fetch data from the server
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/allreviews');
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchData();
  }, []);

  const handleHideReview = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:8080/updatereview/${reviewId}`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        console.log('Review visibility changed successfully');
  
        const updatedReviews = reviews.map(review =>
          (review._id === reviewId ? { ...review, hidden: !review.hidden } : review)
        );
  
        setReviews(updatedReviews);
  
        console.log('Review Visibility Changed!');
      } else {
        console.error('Failed to change review visibility:', response.statusText);
      }
    } catch (error) {
      console.error('Error changing review visibility:', error.message);
    }
  };
    
  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:8080/deletereview/${reviewId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Review deleted successfully');
        // Update the reviews after deletion
        const updatedReviews = reviews.filter(review => review._id !== reviewId);
        setReviews(updatedReviews);
      } else {
        console.error('Failed to delete review:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting review:', error.message);
    }
  };

  return (
    <Container>
      <Header>All Reviews</Header>
      <ReviewContainer>
        {reviews.map((review) => (
          <ReviewItem key={review._id}>
            <div>
              <strong>By:</strong> {review.name} | <strong>Rating:</strong> {review.rating} | <strong>Comment:</strong> {review.comment} <strong>Privacy:</strong> {review.hidden.toString()}
            </div>
            <ReviewOptions>
              {!review.hidden && (
                <>
                  <button onClick={() => handleHideReview(review.id)}>Hide</button>
                  <button onClick={() => handleDeleteReview(review.id)}>Delete</button>
                </>
              )}
            </ReviewOptions>
          </ReviewItem>
        ))}
      </ReviewContainer>
    </Container>
  );
};
export default AdminReviews;
