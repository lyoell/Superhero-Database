import React from 'react'
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import AuthDetails from '../auth/AuthDetails';
import Search from '../main components/search.jsx'
import VideoBackgroundWorld from '../media/VideoBackgroundNYC.jsx';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
`;
export default function AuthorizedPage() {
  return (
    <div>
      <VideoBackgroundWorld/>
      <AuthDetails/>
      <Container>
        <Search/>
      </Container>
    </div>
  )
}
