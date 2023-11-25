import React from 'react'
import styled from 'styled-components';

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 80%;
  margin: 0 auto;
`;

const TextInput = styled.input`
  width: 20%; 
  padding: 10px;
  margin: 8px 0;
  box-sizing: border-box;
`;

const SearchButton = styled.button`
  width: 50%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  justify-content: center;
  font-family: 'Garamond, serif';
  &:hover {
    background-color: #45a049;
  }
`;

const search = () => {
    const handleSearch = () => {
      console.log('Search button clicked!');
    };
  
    return (
      <div>
        <h2>Superhero Search Functionality!</h2>
        <InputContainer>
          <TextInput type="text" placeholder="enter name" />
          <TextInput type="text" placeholder="enter race" />
          <TextInput type="text" placeholder="enter power" />
          <TextInput type="text" placeholder="enter publisher" />
        </InputContainer>
        <SearchButton onClick={handleSearch}>Search</SearchButton>
      </div>
    );
  };
  
  export default search;
