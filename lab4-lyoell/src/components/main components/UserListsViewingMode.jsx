import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import SuperheroExpandableBox from './ExpandableBox';

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

const UserLists = ({ userEmail }) => {
  const [lists, setLists] = useState([]);
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
        const response = await fetch(`http://localhost:8080/userlistsHeroes/${authUser.displayName}`);
        const data = await response.json();
        setLists(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchData(); // Fetch data every few seconds
    }, 5000);

    return () => {
      clearInterval(intervalId); // Cleanup the interval on component unmount
    };
  }, [authUser]);

  return (
    <Container>
      <Header>Your Lists</Header>
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

export default UserLists;
