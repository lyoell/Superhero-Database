import React from 'react';
import styled from 'styled-components';

const ExpandableBoxContainer = styled.div`
  border: 1px solid #ccc;
  background-color: #36454F;
  padding: 10px;
  margin-bottom: 10px;
  z-index:5;
`;

const ExpandableBoxHeader = styled.div`
  font-weight: bold;
  cursor: pointer;
`;

const ExpandableBoxContent = styled.div`
  margin-top: 10px;
  display: none; /* Set the initial display to 'none' */
`;

const Paragraph = styled.p`
  font-family: 'Garamond';
`;

const SuperheroExpandableBox = ({ superhero }) => {
  if(!superhero){
    return null;
  }
  const toggleExpand = () => {
    const content = document.getElementById(`expandable-box-content-${superhero.id}`);
    content.style.display = content.style.display === 'none' ? 'block' : 'none';
  };

  return (
    <ExpandableBoxContainer>
      <ExpandableBoxHeader onClick={toggleExpand}>
        Name: {superhero.name}, Publisher: {superhero.Publisher}
      </ExpandableBoxHeader>
      <ExpandableBoxContent id={`expandable-box-content-${superhero.id}`}>
        <Paragraph>ID: {superhero.id}</Paragraph>
        <Paragraph>Gender: {superhero.Gender}</Paragraph>
        <Paragraph>Eye Color: {superhero['Eye color']}</Paragraph>
        <Paragraph>Race: {superhero.Race}</Paragraph>
        <Paragraph>Hair Color: {superhero['Hair color']}</Paragraph>
        <Paragraph>Height: {superhero.Height}</Paragraph>
        <Paragraph>Skin Color: {superhero['Skin color']}</Paragraph>
        <Paragraph>Alignment: {superhero.Alignment}</Paragraph>
        <Paragraph>Weight: {superhero.Weight}</Paragraph>
        
        {/* Display powers that are true */}
        <Paragraph>Powers: {Object.entries(superhero.powers || {})
          .filter(([key, value]) => value === "True")
          .map(([key]) => key)
          .join(', ')}</Paragraph>

        <a href={`https://duckduckgo.com/${superhero.name}`} target="_blank" rel="noopener noreferrer">
          Search on DDG
        </a>
      </ExpandableBoxContent>
    </ExpandableBoxContainer>
  );
};

export default SuperheroExpandableBox;
