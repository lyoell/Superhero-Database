import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import styled from 'styled-components';
import UserListsViewingMode from './UserListsViewingMode';

const ListsContainer = styled.div`
  max-width: 1200px; /* Adjust the width as needed */
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  font-family: 'Garamond, serif';
`;

const ListSection = styled.div`
  width: 48%; /* Adjust the width as needed */
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
  z-index:3;
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
  width: 100%;
  height: 15vh;
  overflow: auto;
  border: 1px solid #fff;
  padding: 5px;
  background: black;
`;

const UserLists = ({ authenticatedUserEmail }) => {
    const [userLists, setUserLists] = useState([]);
    const [changedListDescription, setChangedListDescription] = useState('');
    const [changedListHeroes, setChangedListHeroes] = useState('');
    const [changedListPrivacy, setChangedListPrivacy] = useState('');
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
                const response = await fetch(`http://${window.location.hostname}:8080/userlistsEditable/${authUser.displayName}`);
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
    }, [authUser, authUser?.displayName]);

    const handleDescriptionChange = (event) => {
        setChangedListDescription(event.target.value);
    };
    const handleHeroesChange = (event) => {
        setChangedListHeroes(event.target.value);
    };
    const handlePrivacyChange = (event) => {
        setChangedListPrivacy('public');
    };

    const handleEditList = (listName) => {
        try {
            const response = fetch(`http://${window.location.hostname}:8080/updateList/${listName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: changedListDescription,
                    heroes: changedListHeroes.split(',').map(hero => hero.trim()),
                    visibility: changedListPrivacy.toString(),
                }),
            });

            if (response.ok) {
                console.log('List updated successfully');
                // Update the user lists after the update
                fetchUserLists();
            } else {
                console.error('Failed to update list:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating list:', error.message);
        }
        alert("Updated List");
    };

    const handleDeleteList = async (listName) => {
        try {
            const response = await fetch(`http://${window.location.hostname}:8080/deletelist/${listName}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log('List deleted successfully');
                // Update the user lists after deletion
                fetchUserLists();
            } else {
                console.error('Failed to delete list:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting list:', error.message);
        }
    };

    const handleSelectList = (listId, description, heroes, privacy) => {
        let privacyText = (privacy === true ? 'private' : 'public');
        setSelectedListId(listId);
        setChangedListDescription(description);
        setChangedListHeroes(heroes.join(', '));
        setChangedListPrivacy(privacyText);
    };
        
    return (
        <ListsContainer>
            <ListSection>
                <Header>Edit</Header>
                <ScrollableContainer>
                    <ul>
                        {userLists.map((list) => (
                            <ListItem key={list._id}>
                                {list.name}
                                <EditButton onClick={() => handleSelectList(list._id, list.notes, list.superheroes, list.listPrivacy)}>Edit / View Items</EditButton>
                                <DeleteButton onClick={() => handleDeleteList(list.name)}>Delete</DeleteButton>
                                {selectedListId === list._id && (
                                    <EditContainer>
                                        <label htmlFor="listDescription">Description:</label>
                                        <EditInput type="text" id="listDescription" value={changedListDescription} onChange={handleDescriptionChange} />

                                        <label htmlFor="listHeroes">Heroes:</label>
                                        <EditInput type="text" id="listHeroes" value={changedListHeroes} onChange={handleHeroesChange} />

                                        <label htmlFor="listPrivacy">Privacy:</label>
                                        <select id="listPrivacy" value={changedListPrivacy ? 'private' : 'public'} onChange={handlePrivacyChange}>
                                            <option value="public">Public</option>
                                            <option value="private">Private</option>
                                        </select>

                                        <SaveChangesButton onClick={() => handleEditList(list.name)}>Save Changes</SaveChangesButton>
                                    </EditContainer>
                                )}
                            </ListItem>
                        ))}
                    </ul>
                </ScrollableContainer>
            </ListSection>

            <ListSection>
                <UserListsViewingMode />
            </ListSection>
        </ListsContainer>
    );
};

export default UserLists;
