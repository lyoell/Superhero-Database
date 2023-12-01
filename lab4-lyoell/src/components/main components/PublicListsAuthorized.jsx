import React, { useState, useEffect } from 'react';
import SuperheroExpandableBox from './ExpandableBox';
import styled from 'styled-components';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';


const Container = styled.div`
  font-family: 'Garamond, serif';
  color: white;
`;

const Header = styled.h2`
  color: white;
`;

const ScrollableContainer = styled.div`
  width: 500px;
  height: 15vh;
  overflow: auto;
  border: 1px solid #fff;
  padding: 5px;
  background: black;
`;

const ListContainer = styled.div`
  margin-bottom: 20px;
`;

const ListName = styled.h2`
  color: white;
`;

const ListDescription = styled.p`
  color: white;
`;

const UserInfo = styled.p`
  color: white;
`;

const ListPrivacy = styled.p`
  color: white;
`;

const SuperheroesHeader = styled.h3`
  color: white;
`;

const ReviewContainer = styled.div`
  margin-top: 10px;
`;

const ReviewHeader = styled.h3`
  color: white;
`;

const ReviewItem = styled.div`
  color: white;
`;

const PublicListAuthorized = () => {
  const [lists, setLists] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {  
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });
  
    return () => {
      listen();
    };
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/allpubliclists`);
        const data = await response.json();
        setLists(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); 

  const handleReviewSubmit = async (listId) => {
    try {
      const response = await fetch(`http://localhost:8080/addreview/${listId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "rating":rating,
          "comment":comment,
          "name":authUser.email
        }),
      });

      if (response.ok) {
        console.log('Review submitted successfully');
        // Refresh the list data after submitting the review
        const updatedLists = lists.map(list => (list._id === listId ? { ...list, reviews: [...list.reviews, { rating, comment }] } : list));
        setLists(updatedLists);
        // Reset the form values
        setRating(0);
        setComment('');
      } else {
        console.error('Failed to submit review:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting review:', error.message);
    }
  };

  return (
    <Container>
      <Header>Public Lists</Header>
      <ScrollableContainer>
        {lists.map((list) => (
          <ListContainer key={list._id}>
            <ListName>List Name: {list.name}</ListName>
            <ListDescription>Description: {list.notes}</ListDescription>
            <UserInfo>Made By: {list.username}</UserInfo>
            <ListPrivacy>List Privacy: {list.listPrivacy ? 'Private' : 'Public'}</ListPrivacy>
            <SuperheroesHeader>Superheroes:</SuperheroesHeader>
            {list.superheroes.map((superhero, index) => (
              <SuperheroExpandableBox key={index} superhero={superhero} />
            ))}
            <ReviewContainer>
              <ReviewHeader>Reviews:</ReviewHeader>
              {list.reviews && list.reviews.length > 0 ? (
                list.reviews.map((review, index) => (
                  <ReviewItem key={index}>
                    Rating: Name:{review.name} - Rating:{review.rating} - Comment:{review.comment}
                  </ReviewItem>
                ))
              ) : (
                <p>No reviews available.</p>
              )}
            </ReviewContainer>
            {/* Review Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleReviewSubmit(list._id); }}>
              <label htmlFor="rating">Rating (1-5):</label>
              <input type="number" id="rating" min="1" max="5" value={rating} onChange={(e) => setRating(Number(e.target.value))} required />
              <br />
              <label htmlFor="comment">Comment:</label>
              <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} required />
              <br />
              <button type="submit">Submit Review</button>
            </form>
          </ListContainer>
        ))}
      </ScrollableContainer>
    </Container>
  );
};

export default PublicListAuthorized;
