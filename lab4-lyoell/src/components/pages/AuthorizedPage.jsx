import React from 'react'
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import AuthDetails from '../auth/AuthDetails';
import Search from '../main components/search.jsx'
import VideoBackgroundWorld from '../media/VideoBackgroundNYC.jsx';
import CreateList from '../main components/ListCreation.jsx';
import UserLists from '../main components/UsersList.jsx';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90vh;
  width:90%;
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
export default function AuthorizedPage() {
  return (
    <div>
      <VideoBackgroundWorld/>
      <AuthDetails/>
      <InfoButton to='/InfoPage'>Security & Copyright Policy</InfoButton>
      <Container>
        <Search/>
        <CreateList/>
        <UserLists/>
      </Container>
    </div>
  )
}
