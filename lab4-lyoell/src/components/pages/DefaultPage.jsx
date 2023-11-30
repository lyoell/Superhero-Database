import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import VideoBackgroundWorld from "../media/VideoBackgroundWorld";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const SignInContainer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 75vh;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  color: white;
  font-family: 'Garamond, serif';
`;

const SubmitButton = styled(Link)`
  display: inline-block;
  width: 50%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  text-decoration: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  margin-bottom: 10px;
  font-family: 'Garamond, serif';

  &:hover {
    background-color: #45a049;
  }
`;

const InfoButton = styled(Link)`
  position: absolute;
  top: 20px;
  left: 20px;
  text-decoration: none;
  color: white;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
`;

const DefaultPage = () => {
  const history = useHistory();

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      history.push('/AuthorizedPage');
    }
  });

  return (
    <Container>
      <VideoBackgroundWorld/>
      <SignInContainer>
        <InfoButton to='/InfoPage'>Security & Copyright Policy</InfoButton>
        <Title>SuperHero Database</Title>
        <SubmitButton to="/SignupPage">Sign Up</SubmitButton>
        <SubmitButton to="/LoginPage">Log In</SubmitButton>
        <SubmitButton to="/NoAuthorization">Continue Without Account</SubmitButton>
      </SignInContainer>
    </Container>
  );
}

export default DefaultPage;
