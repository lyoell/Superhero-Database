import React from 'react'
import styled from 'styled-components';
import { Link } from 'react-router-dom';

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

export default function NoAuthPage() {
  return (
    <div>
    <h2>Beta Version</h2>
    <p>This is a database containing superheroes! It
       offers the ability to search for any Superhero,
        and create lists of superheroes. Stay for a while!</p>
        <SubmitButton to="/SignupPage">Sign Up for Account for Full Functionality</SubmitButton>
    </div>
  )
}
