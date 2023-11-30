import React from 'react'
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Search from '../main components/search.jsx'
import VideoBackgroundSkyline from '../media/VideoBackGroundSkyline';


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

const BackButton = styled(Link)`
  position: absolute;
  top: 20px;
  left: 20px;
  text-decoration: none;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
`;

const Paragraph = styled.p`
font-family: 'Garamond, serif';
color : white;
text-align: center
`;

const Header = styled.h2`
font-family: 'Garamond, serif';
color: white;
text-align: center;
`;

const Container = styled.div`
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
`;

const InfoButton = styled(Link)`
  position: absolute;
  top: 50px;
  left: 20px;
  text-decoration: none;
  color: white;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
`;

export default function NoAuthPage() {
  return (
    <Container>
      <VideoBackgroundSkyline/>
          <BackButton to="/DefaultPage">
          &larr; Back
        </BackButton>
        <InfoButton to='/InfoPage'>Security & Copyright Policy</InfoButton>
    <Header>Beta Version</Header>
    <Paragraph>This is a database containing superheroes! My name is Liam, and I'm a fourth year student 
      pursuing a dual degree in SWE @ Western and Business @ Ivey. This Web-App
       offers the ability to search for any Superhero,
        and create lists of superheroes. To create public and priavate lists,
         rate lists and save changes, sign up for an account! Stay for a while, and enjoy the website!</Paragraph>
        <SubmitButton to="/SignupPage">Sign Up for Account for Full Functionality</SubmitButton>
        <Search/>
    </Container>
  )
}
