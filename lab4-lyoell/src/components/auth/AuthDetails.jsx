import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import styled from 'styled-components';
import { useHistory } from "react-router-dom";

const AuthDetails = () => {
  const [authUser, setAuthUser] = useState(null);
  const history = useHistory();

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

  return (
    <UserInfoContainer>
      {authUser ? (
        <>
          <p>{`Signed In as ${authUser.email}`}</p>
          <p>{`Welcome, ${authUser.nickname}`}</p>
          <button onClick={userSignOut}>Sign Out</button>
        </>
      ) : (
        <p>Signed Out</p>
      )}
    </UserInfoContainer>
  );
};

export default AuthDetails;