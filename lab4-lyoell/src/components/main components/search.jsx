import React, { useState } from 'react';
import styled from 'styled-components';
import SuperheroExpandableBox from './ExpandableBox';

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

const Container = styled.div`
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Header = styled.h2`
font-family: 'Garamond, serif';
color: white;
`;

const ScrollableBox = styled.div`
  width: 500px;
  height: 15vh;
  overflow: auto;
  border: 1px solid #fff;
  padding: 5px;

`;

const Search = () => {
  const [superheroes, setSuperheroes] = useState([]);
  const [selectedSuperhero, setSelectedSuperhero] = useState(null);
  const [searchParams, setSearchParams] = useState({
    name: '',
    race: '',
    power: '',
    publisher: '',
  });

  const handleSearch = async () => {
    try {
      setSuperheroes([]);

      const response = await fetch('http://localhost:8080/superheroinfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });

      const data = await response.json();

      setSuperheroes(data);
      setSelectedSuperhero(data.length > 0 ? data[0] : null);
    } catch (error) {
      console.error('Error fetching superhero data:', error);
    }
  };

  return (
    <Container>
      <Header>Superhero Search</Header>
      <InputContainer>
        <TextInput
          type="text"
          placeholder="enter name"
          value={searchParams.name}
          onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
        />
        <TextInput
          type="text"
          placeholder="enter race"
          value={searchParams.race}
          onChange={(e) => setSearchParams({ ...searchParams, race: e.target.value })}
        />
        <TextInput
          type="text"
          placeholder="enter power"
          value={searchParams.power}
          onChange={(e) => setSearchParams({ ...searchParams, power: e.target.value })}
        />
        <TextInput
          type="text"
          placeholder="enter publisher"
          value={searchParams.publisher}
          onChange={(e) => setSearchParams({ ...searchParams, publisher: e.target.value })}
        />
      </InputContainer>
      <SearchButton onClick={handleSearch}>Search</SearchButton>
      <ScrollableBox>
      {superheroes.map(superhero => (
        <SuperheroExpandableBox key={superhero.id} superhero={superhero} />
      ))}
      </ScrollableBox>
    </Container>
  );
};

export default Search;
