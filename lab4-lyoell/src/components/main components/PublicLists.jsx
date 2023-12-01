import React, { useState, useEffect } from 'react';
import SuperheroExpandableBox from './ExpandableBox';
import styled from 'styled-components';

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
        const response = await fetch('http://localhost:8080/allpubliclists');
        const data = await response.json();
        setLists(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); 

  return (
    <Container>
      <Header>All Lists</Header>
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
          </ListContainer>
        ))}
      </ScrollableContainer>
    </Container>
  );
};

export default PublicList;
