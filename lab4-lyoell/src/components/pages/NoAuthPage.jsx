import React from 'react'
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Search from '../main components/search.jsx'

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

export default function NoAuthPage() {
  return (
    <div>
          <BackButton to="/DefaultPage">
          &larr; Back
        </BackButton>
    <h2>Beta Version</h2>
    <p>This is a database containing superheroes! My name is Liam, and I'm a fourth year student 
      pursuing a dual degree in SWE @ Western and Business @ Ivey. This Web-App
       offers the ability to search for any Superhero,
        and create lists of superheroes. Stay for a while!</p>
        <SubmitButton to="/SignupPage">Sign Up for Account for Full Functionality</SubmitButton>
        <Search/>
    </div>
  )
}
