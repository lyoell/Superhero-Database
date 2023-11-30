import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';

const Container = styled.div`
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80%;
    max-width: 600px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    margin-bottom: 16px;
`;

const ColumnContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 16px;
`;

const Label = styled.label`
    margin-right: 16px;
    font-weight: bold;
    font-size: 16px;
    color: white;
`;

const TextArea = styled.textarea`
    margin-right: 16px;
    padding: 8px;
    width: 100%;
    box-sizing: border-box;
    resize: none
`;

const Select = styled.select`
    margin-right: 16px;
    padding: 8px;
    width: 100%;
    box-sizing: border-box;
`;

const Button = styled.button`
    width: 50%;
    padding: 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-family: 'Garamond, serif';
    &:hover {
        background-color: #45a049;
    }
`;

const CreateList = () => {
    const [listName, setListName] = useState('');
    const [listDescription, setListDescription] = useState('');
    const [listVisibility, setListVisibility] = useState('private');
    const [heroNames, setHeroNames] = useState('');
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
  
        const createList = async () => {
            const heroes = heroNames.split(',').map(hero => hero.trim());
        
            // Validate the number of heroes (up to 20)
            if (heroes.length > 20) {
                alert('Please provide up to 20 hero names.');
                return;
            }
        
            // Wait for onAuthStateChanged to update authUser
            await new Promise(resolve => setTimeout(resolve, 1000));
        
            // Check if authUser is not null
            if (!authUser) {
                alert('User not authenticated. Please log in.');
                return;
            }
        
            // Create the list object
            const newList = {
                username: authUser.displayName,
                name: listName,
                description: listDescription,
                visibility: listVisibility,
                heroes: heroes
            };
        
            if (listName && heroNames) {
                const response = await fetch('http://localhost:8080/listAddition', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newList),
                });
                alert("Added List!");
            }
        
            console.log(newList);
        };
        
    return (
        <Container>
            <Form>
                <RowContainer>
                    <ColumnContainer>
                        <Label htmlFor="listName">List Name:</Label>
                        <TextArea
                            type="text"
                            id="listName"
                            name="listName"
                            placeholder="enter list name"
                            value={listName}
                            onChange={(e) => setListName(e.target.value)}
                            required
                        />
                    </ColumnContainer>
                    <ColumnContainer>
                        <Label htmlFor="listDescription">Description:</Label>
                        <TextArea
                            id="listDescription"
                            name="listDescription"
                            placeholder="enter description (optional)"
                            value={listDescription}
                            onChange={(e) => setListDescription(e.target.value)}
                        ></TextArea>
                    </ColumnContainer>
                </RowContainer>

                <RowContainer>
                    <ColumnContainer>
                        <Label htmlFor="listVisibility">Visibility:</Label>
                        <Select
                            id="listVisibility"
                            name="listVisibility"
                            value={listVisibility}
                            onChange={(e) => setListVisibility(e.target.value)}
                        >
                            <option value="private">Private</option>
                            <option value="public">Public</option>
                        </Select>
                    </ColumnContainer>
                    <ColumnContainer>
                        <Label htmlFor="heroNames">Hero Names (comma-separated):</Label>
                        <TextArea
                            type="text"
                            id="heroNames"
                            name="heroNames"
                            placeholder="enter hero names"
                            value={heroNames}
                            onChange={(e) => setHeroNames(e.target.value)}
                            required
                        />
                    </ColumnContainer>
                </RowContainer>

                <Button type="button" onClick={createList}>
                    Create List
                </Button>
            </Form>
        </Container>
    );
};

export default CreateList;
