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

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8080/allreviews');
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleHideReview = async (reviewId, listID) => {
    const response = await fetch(`http://localhost:8080/updatereview/${listID}/${reviewId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      fetchData();
      alert("Hidden/Unhidden!");
    } else {
      alert("Failed to hide/unhide review");
    }
  };

  const handleDeleteReview = async (reviewId, listID) => {
    const response = await fetch(`http://localhost:8080/deletereview/${listID}/${reviewId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      fetchData();
      alert("Deleted!");
    } else {
      alert("Failed to hide/unhide review");
    }
  };

  return (
    <Container>
      <Header>All Reviews</Header>
      <ReviewContainer>
        {reviews.map((review) => (
          <ReviewItem key={review.id}>
            <div>
              <strong>By:</strong> {review.name} | 
              <strong>Rating:</strong> {review.rating} | 
              <strong>Comment:</strong> {review.comment} | 
              <strong>Is Hidden:</strong> {review.hidden.toString()} | 
              <strong>List ID:</strong> {review.listID}
            </div>
            <ReviewOptions>
              {(
                <>
                  <button onClick={() => handleHideReview(review.id, review.listID)}>Hide/Unhide</button>
                  <button onClick={() => handleDeleteReview(review.id, review.listID)}>Delete</button>
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
