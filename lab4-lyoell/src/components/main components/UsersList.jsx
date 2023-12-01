import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import styled from 'styled-components';

const ListsContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const ListItem = styled.li`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
`;

const EditButton = styled.button`
  margin-left: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
`;

const EditContainer = styled.div`
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ccc;
`;

const EditInput = styled.input`
  margin-right: 10px;
`;

const SaveChangesButton = styled.button`
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
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

const UserLists = ({ authenticatedUserEmail }) => {
    const [userLists, setUserLists] = useState([]);
    const [changedListName, setChangedListName] = useState('');
    const [changedListDescription, setChangedListDescription] = useState('');
    const [changedListHeroes, setChangedListHeroes] = useState('');
    const [changedListPrivacy, setChangedListPrivacy] = useState(false); // Default to false (public)
    const [selectedListId, setSelectedListId] = useState(null);
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
  
    const fetchUserLists = async () => {
      try {
        if (authUser) {
          const response = await fetch(`http://localhost:8080/userlists/${authUser.email}`);
          const data = await response.json();
          setUserLists(data);
        }
      } catch (error) {
        console.error('Error fetching user lists:', error);
      }
    };
  
    useEffect(() => {
      if (authUser) {
        fetchUserLists();
  
        const intervalId = setInterval(() => {
          fetchUserLists();
        }, 5000);
  
        return () => clearInterval(intervalId);
      }
    }, [authUser, authUser?.email]);
  
    const handleListNameChange = (event) => {
      setChangedListName(event.target.value);
    };
    const handleDescriptionChange = (event) => {
      setChangedListDescription(event.target.value);
    };
    const handleHeroesChange = (event) => {
      setChangedListHeroes(event.target.value);
    };
    const handlePrivacyChange = (event) => {
      setChangedListPrivacy(event.target.value === 'private');
    };
  
    const handleEditList = (listId) => {

    };
  
    const handleDeleteList = (listId) => {

    };
  
    const handleSelectList = (listId, name, description, heroes, privacy) => {
      setSelectedListId(listId);
      setChangedListName(name);
      setChangedListDescription(description);
      setChangedListHeroes(heroes.join(', ')); // Join the array to display as a comma-separated string
      setChangedListPrivacy(privacy);
    };
  
    return (
      <ListsContainer>
        <Header>Your Lists</Header>
        <ScrollableContainer>
        <ul>
          {userLists.map((list) => (
            <ListItem key={list._id}>
              {list.name}
              <EditButton onClick={() => handleSelectList(list._id, list.name, list.notes, list.superheroes, list.listPrivacy)}>Edit</EditButton>
              <DeleteButton onClick={() => handleDeleteList(list._id)}>Delete</DeleteButton>
              {selectedListId === list._id && (
                <EditContainer>
                  <label htmlFor="listName">Name:</label>
                  <EditInput type="text" id="listName" value={changedListName} onChange={handleListNameChange} />
  
                  <label htmlFor="listDescription">Description:</label>
                  <EditInput type="text" id="listDescription" value={changedListDescription} onChange={handleDescriptionChange} />
  
                  <label htmlFor="listHeroes">Heroes:</label>
                  <EditInput type="text" id="listHeroes" value={changedListHeroes} onChange={handleHeroesChange} />
  
                  <label htmlFor="listPrivacy">Privacy:</label>
                  <select id="listPrivacy" value={changedListPrivacy ? 'private' : 'public'} onChange={handlePrivacyChange}>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
  
                  <SaveChangesButton onClick={() => handleEditList(list._id)}>Save Changes</SaveChangesButton>
                </EditContainer>
              )}
            </ListItem>
          ))}
        </ul>
        </ScrollableContainer>
      </ListsContainer>
    );
  };
  
  export default UserLists;
  