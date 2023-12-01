import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import AuthDetails from '../auth/AuthDetails';
import Search from '../main components/search.jsx';
import VideoBackgroundWorld from '../media/VideoBackgroundNYC.jsx';
import CreateList from '../main components/ListCreation.jsx';
import UserLists from '../main components/UsersList.jsx';
import PublicListAuthorized from '../main components/PublicListsAuthorized.jsx';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90vh;
  width: 90%;
  margin: 0 auto;
`;

const InfoButton = styled(Link)`
  position: absolute;
  top: 20px;
  left: 20px;
  text-decoration: none;
  color: white;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  z-index: 1;
`;

const ListsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;
  margin-top: 20px;
`;

const ListColumn = styled.div`
  flex: 1;
  max-width: 400px;
  margin: 0 20px;
`;

export default function AuthorizedPage() {
  return (
    <div>
      <VideoBackgroundWorld />
      <AuthDetails />
      <InfoButton to='/InfoPage'>Security & Copyright Policy</InfoButton>
      <Container>
        <Search />
        <ListsContainer>
          <ListColumn>
            <PublicListAuthorized />
          </ListColumn>
          <ListColumn>
            <CreateList />
          </ListColumn>
        </ListsContainer>
        <UserLists />
      </Container>
    </div>
  );
}
