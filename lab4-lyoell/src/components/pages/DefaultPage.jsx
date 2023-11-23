import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import video from '../media/worldSpinning.mp4';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const VideoBackground = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
`;

const SignInContainer = styled.div`
  position: relative;
  z-index: 1; /* Ensure the container is above the video */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 75vh;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  color: white;
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

  &:hover {
    background-color: #45a049;
  }
`;

export default function DefaultPage() {
  return (
    <Container>
      <VideoBackground src={video} autoPlay loop muted />
      <SignInContainer>
        <Title>SuperHero Database</Title>
        <SubmitButton to="/SignupPage">Sign Up</SubmitButton>
        <SubmitButton to="/LoginPage">Log In</SubmitButton>
        <SubmitButton to="/NoAuthorization">Continue Without Account</SubmitButton>
      </SignInContainer>
    </Container>
  );
}
