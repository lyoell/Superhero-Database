import React from 'react'
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import AuthDetails from '../auth/AuthDetails';
import Search from '../main components/search.jsx'


export default function AuthorizedPage() {
  return (
    <div>
      <AuthDetails/>
      <Search/>
    </div>
  )
}
