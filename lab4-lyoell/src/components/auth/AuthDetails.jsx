import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import styled from 'styled-components';
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom';

const AuthDetails = () => {
  const history = useHistory();
  const [admins, setAdmins] = useState(null);
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/admin');
        const jsonData = await response.json();
        setAdmins(jsonData);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    // Fetch admin data when the component mounts
    fetchData();

    return () => {
      listen();
    };
  }, []);

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out successful");
        history.push("/DefaultPage");
      })
      .catch((error) => console.log(error));
  };

  const UserInfoContainer = styled.div`
    position: absolute;
    top: 20px;
    right: 20px;
    text-align: right;
    color: black;
    z-index: 1;
    font-family: 'Garamond, serif';

    button {
      background-color: #4caf50;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      cursor: pointer;
      font-family: 'Garamond, serif';
      &:hover {
        background-color: #45a049;
      }
    }
  `;

  const AdminButton = styled(Link)`
    text-decoration: none;
    color: white;
    font-weight: bold;
    cursor: pointer;
    display: ${(authUser && admins && admins.some(admin => admin.email.toLowerCase() === authUser.email.toLowerCase())) ? "inline-block" : "none"};
  `;

  return (
    <UserInfoContainer>
      {authUser ? (
        <>
          <p>{`Signed In as ${authUser.email}`}</p>
          <button onClick={userSignOut}>Sign Out</button>
          <AdminButton to="/AdminPage">
            Go to Admin Page
          </AdminButton>
        </>
      ) : (
        <p>Signed Out</p>
      )}
    </UserInfoContainer>
  );
};

export default AuthDetails;
