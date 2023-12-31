import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SuperheroExpandableResults from './ExpandableResults';

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

const PublicList = () => {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    // Fetch data from MongoDB here
    const fetchData = async () => {
      try {
        const response = await fetch(`http://${window.location.hostname}:8080/allpubliclists`);
        const data = await response.json();
        setLists(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); 
  //Making sure only 10 are shown.
  const sortedLists = [...lists].sort((a, b) => b.lastEdited - a.lastEdited);
  const displayedLists = sortedLists.slice(0, 10);

  return (
    <Container>
      <Header>All Lists</Header>
      <ScrollableContainer>
        {displayedLists.map((list) => (
          <ListContainer key={list._id}>
            <ListName>List Name: {list.name}</ListName>
            <ListDescription>Description: {list.notes}</ListDescription>
            <UserInfo>Made By: {list.username}</UserInfo>
            <ListPrivacy>List Privacy: {list.listPrivacy ? 'Private' : 'Public'}</ListPrivacy>
            <SuperheroesHeader>Superheroes:</SuperheroesHeader>
            {list.superheroes.map((superhero, index) => (
              <SuperheroExpandableResults key={index} superhero={superhero} />
            ))}
            <ReviewContainer>
            <ReviewHeader>Reviews:</ReviewHeader>
              {list.reviews && list.reviews.length > 0 ? (
                list.reviews
                  .filter((review) => !review.hidden) // Filter out reviews with hidden set to true
                  .map((review, index) => (
                    <ReviewItem key={index}>
                      Rating: Name:{review.name} - Rating:{review.rating} - Comment:{review.comment}
                    </ReviewItem>
                  ))
              ) : (
                <p>No reviews available.</p>
              )}
            </ReviewContainer>
          </ListContainer>
        ))}
      </ScrollableContainer>
    </Container>
  );
};

export default PublicList;
